"""
MCP Repository Analyzer Tool for MetaMCP.

Comprehensive repository analysis tool with FastMCP 2.13.3 validation,
sampling support detection, conversational returns validation, and SOTA compliance checking.

Scans MCP repositories and identifies "runts" - repos that need SOTA upgrades.
"""

import re
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

import structlog
import tomli

from .decorators import ToolCategory, tool
from .runt_analyzer_rules import (
    evaluate_rules,
    calculate_sota_score,
)

# from .repo_detail_collector import collect_repo_details  # Module doesn't exist - using basic repo info instead
from .scan_cache import (
    get_cached_scan,
    cache_scan_result,
    get_cached_repo_status,
    cache_repo_status,
)
from .scan_formatter import format_scan_result_markdown, format_repo_status_markdown

logger = structlog.get_logger(__name__)

# SOTA thresholds (updated for FastMCP 2.13.3)
FASTMCP_LATEST = "2.13.3"
FASTMCP_RUNT_THRESHOLD = "2.12.0"
FASTMCP_SAMPLING_VERSION = "2.13.3"  # Sampling support added in 2.13.3
TOOL_PORTMANTEAU_THRESHOLD = 15  # Repos with >15 tools should have portmanteau

# Required SOTA features
REQUIRED_TOOLS = ["help", "status"]  # Every MCP server should have these
MCPB_FILES = ["manifest.json", "mcpb.json"]  # Desktop extension packaging

# SOTA Mandatory Files (Section 8 Safety)
SOTA_CRITICAL_FILES = [
    "glama.json",  # Glama.ai integration
    "manifest.json",  # MCP Packaging
    "requirements.txt",  # Dependency management (fallback/legacy)
]

# Quality tooling
RUFF_CONFIG_FILES = ["ruff.toml", ".ruff.toml"]  # Or [tool.ruff] in pyproject.toml
TEST_DIRS = ["tests", "test"]  # Standard test directories
PYTEST_MARKERS = ["pytest", "test_", "_test.py"]  # Evidence of pytest usage

# Logging patterns (good)
LOGGING_PATTERNS = [
    r"import\s+logging",
    r"import\s+structlog",
    r"from\s+logging\s+import",
    r"from\s+structlog\s+import",
    r"logger\s*=\s*logging\.getLogger",
    r"logger\s*=\s*structlog\.get_logger",
]

# Bad patterns (print/console in non-test code)
BAD_STDOUT_PATTERNS = [
    r"^\s*print\s*\(",  # print() calls
    r"console\.log\s*\(",  # JS-style logging
    r"sys\.stdout\.write\s*\(",  # Direct stdout writes
]

# Error handling patterns (bad)
BAD_ERROR_PATTERNS = [
    r"except\s*:",  # Bare except (catches everything including KeyboardInterrupt)
    r"except\s+Exception\s*:",  # Broad exception without handling
]

# Good error handling patterns
GOOD_ERROR_PATTERNS = [
    r"except\s+\w+Error",  # Specific exception types
    r"logger\.\w+\(.*error",  # Logging errors
    r"raise\s+\w+Error",  # Re-raising specific errors
]

# Non-informative error messages (lazy/useless)
LAZY_ERROR_MESSAGES = [
    r'["\']error["\']',  # Just "error"
    r'["\']an?\s+error\s+(occurred|happened)["\']',  # "an error occurred"
    r'["\']something\s+went\s+wrong["\']',  # "something went wrong"
    r'["\']failed["\']',  # Just "failed"
    r'["\']unknown\s+error["\']',  # "unknown error"
    r'["\']error:\s*["\']',  # "error: " with nothing after
    r'["\']exception["\']',  # Just "exception"
    r'["\']oops["\']',  # "oops"
    r'["\']uh\s*oh["\']',  # "uh oh"
    r'["\']something\s+broke["\']',  # "something broke"
    r'["\']it\s+failed["\']',  # "it failed"
    r'["\']error\s+in\s+\w+["\']',  # "error in X" without details
    r'raise\s+Exception\s*\(\s*["\'][^"\']{0,15}["\']\s*\)',  # raise Exception("short msg")
]

# ============================================================================
# MCP ZOO CLASSIFICATION
# Not a flea circus - these are proper beasts!
# ============================================================================

# Keywords indicating heavy/jumbo MCPs (database, virtualization, etc.)
JUMBO_INDICATORS = [
    "database",
    "postgres",
    "mysql",
    "sqlite",
    "mongo",
    "redis",  # Databases
    "docker",
    "kubernetes",
    "k8s",
    "container",
    "virtualization",  # Virtualization
    "virtualbox",
    "vmware",
    "qemu",
    "hyperv",  # VMs
    "davinci",
    "resolve",
    "premiere",
    "video",
    "render",  # Heavy video
    "blender",
    "3d",
    "modeling",  # 3D software
    "ai-",
    "llm-",
    "ml-",
    "machine-learning",  # AI/ML heavy
    "obs",
    "stream",
    "broadcast",  # Streaming
]

# Keywords indicating mini/chipmunk MCPs (simple, single-purpose)
CHIPMUNK_INDICATORS = [
    "txt",
    "text",
    "generator",
    "simple",
    "mini",
    "tiny",
    "lite",
    "basic",
    "hello",
    "echo",
    "demo",
    "example",
    "starter",
    "template",
    "clipboard",
    "timer",
    "counter",
    "converter",
    "calculator",
]

# Zoo animal classification based on tool count and complexity
ZOO_ANIMALS = {
    # Jumbos - Heavy/Complex MCPs ( Elephant,  Hippo,  Rhino)
    "jumbo": {
        "emoji": "",
        "label": "Jumbo",
        "description": "Heavy MCP - DB, virtualization, video processing",
        "min_tools": 20,
    },
    # Large - Substantial MCPs ( Lion,  Bear,  Giraffe)
    "large": {
        "emoji": "",
        "label": "Large",
        "description": "Substantial MCP with many features",
        "min_tools": 10,
    },
    # Medium - Standard MCPs ( Fox,  Wolf,  Deer)
    "medium": {
        "emoji": "",
        "label": "Medium",
        "description": "Standard MCP with moderate complexity",
        "min_tools": 5,
    },
    # Small - Lightweight MCPs ( Rabbit,  Raccoon,  Badger)
    "small": {
        "emoji": "",
        "label": "Small",
        "description": "Lightweight MCP with focused purpose",
        "min_tools": 2,
    },
    # Chipmunk - Mini MCPs ( Chipmunk,  Hamster,  Mouse)
    "chipmunk": {
        "emoji": "",
        "label": "Chipmunk",
        "description": "Mini MCP - simple, single-purpose tool",
        "min_tools": 0,
    },
}


@tool(
    name="analyze_runts",
    description="""Analyze MCP repositories to identify "runts" needing SOTA upgrades.

    Scans a directory for MCP repositories and evaluates each against SOTA criteria:
    - FastMCP version (< 2.12 = runt)
    - Tool count (> 15 without portmanteau = runt)
    - CI workflow count (> 3 = bloated)
    - Missing CI = runt

    Returns categorized list of repos with specific upgrade recommendations.
    Results are cached to avoid re-scanning on every request.""",
    category=ToolCategory.DISCOVERY,
    tags=["runt", "analyzer", "sota", "upgrade"],
    estimated_runtime="2-10s",
)
def analyze_runts_sync(
    scan_path: Optional[str] = None,
    max_depth: int = 1,
    include_sota: bool = True,
    format: str = "json",
    use_cache: bool = True,
    deep_scan: bool = False,
):
    """Synchronous wrapper for analyze_runts."""
    import asyncio

    return asyncio.run(
        analyze_runts(
            scan_path, max_depth, include_sota, format, use_cache, deep_scan=deep_scan
        )
    )


async def analyze_runts(
    scan_path: Optional[str] = None,
    max_depth: int = 1,
    include_sota: bool = True,
    format: str = "json",
    use_cache: bool = True,
    cache_ttl: int = 3600,
    deep_scan: bool = False,
) -> Union[Dict[str, Any], str]:
    """
    Analyze MCP repositories to identify runts needing upgrades.

    Args:
        scan_path: Directory containing MCP repositories (default: from REPOS_DIR env var or platform default)
        max_depth: How deep to scan for repos (default: 1 = direct children only)
        include_sota: Whether to include SOTA repos in results (default: True)
        format: Output format - "json" or "markdown" (default: "json")
        use_cache: Whether to use cached results (default: True)
        cache_ttl: Cache time-to-live in seconds (default: 3600 = 1 hour)

    Returns:
        Dictionary with runts, sota repos, and summary statistics, or markdown string if format="markdown"
    """
    # Use default scan_path if not provided
    if scan_path is None:
        from meta_mcp.app.core.config import DEFAULT_REPOS_PATH

        scan_path = DEFAULT_REPOS_PATH

    # Check cache first
    if use_cache:
        cached = get_cached_scan(scan_path, max_depth, cache_ttl)
        if cached:
            if format == "markdown":
                return format_scan_result_markdown(cached)
            return cached

    runts: List[Dict[str, Any]] = []
    sota_repos: List[Dict[str, Any]] = []

    path = Path(scan_path).expanduser().resolve()
    if not path.exists():
        error_result = {
            "success": False,
            "error": f"Path does not exist: {scan_path}",
            "timestamp": time.time(),
        }
        if format == "markdown":
            return f"# Scan Failed\n\n**Error:** {error_result['error']}\n"
        return error_result

    import asyncio

    for item in path.iterdir():
        if not item.is_dir() or item.name.startswith("."):
            continue

        # Small delay to reduce terminal spam and CPU usage
        await asyncio.sleep(0.1)  # 100ms delay between repos

        repo_info = _analyze_repo(item, deep_scan=deep_scan)
        if repo_info:
            if repo_info.get("is_runt"):
                runts.append(repo_info)
            elif include_sota:
                sota_repos.append(repo_info)

    # Sort runts by severity (most issues first)
    runts.sort(key=lambda x: len(x.get("runt_reasons", [])), reverse=True)
    sota_repos.sort(key=lambda x: x.get("name", ""))

    result = {
        "success": True,
        "summary": {
            "total_mcp_repos": len(runts) + len(sota_repos),
            "runts": len(runts),
            "sota": len(sota_repos),
            "runt_threshold": f"FastMCP < {FASTMCP_RUNT_THRESHOLD}",
            "portmanteau_threshold": f"> {TOOL_PORTMANTEAU_THRESHOLD} tools",
            "sota_version": FASTMCP_LATEST,
        },
        "runts": runts,
        "sota_repos": sota_repos if include_sota else [],
        "scan_path": scan_path,
        "timestamp": time.time(),
    }

    # Cache the result
    if use_cache:
        cache_scan_result(scan_path, max_depth, result)

    # Return in requested format
    if format == "markdown":
        return format_scan_result_markdown(result)

    return result


@tool(
    name="get_repo_status",
    description="""Get detailed SOTA status for a specific MCP repository.

    Analyzes a single repo and returns comprehensive status including:
    - FastMCP version and upgrade path
    - Tool count and portmanteau status
    - CI/CD quality assessment
    - Specific upgrade recommendations
    - Detailed repository structure, dependencies, tools, and configuration
    - All information needed for AI to answer questions about the repo without re-analysis
    
    Results are cached to avoid re-scanning on every request.""",
    category=ToolCategory.DISCOVERY,
    tags=["repo", "status", "sota"],
    estimated_runtime="2-5s",
)
async def get_repo_status(
    repo_path: str,
    format: str = "json",
    use_cache: bool = True,
    cache_ttl: int = 3600,
    deep_scan: bool = False,
) -> Union[Dict[str, Any], str]:
    """
    Get detailed SOTA status for a specific repository.

    Args:
        repo_path: Path to the repository
        format: Output format - "json" or "markdown" (default: "json")
        use_cache: Whether to use cached results (default: True)
        cache_ttl: Cache time-to-live in seconds (default: 3600 = 1 hour)

    Returns:
        Detailed repository status and recommendations, or markdown string if format="markdown"
    """
    # Check cache first
    if use_cache:
        cached = get_cached_repo_status(repo_path, cache_ttl)
        if cached:
            if format == "markdown":
                return format_repo_status_markdown(cached)
            return cached

    path = Path(repo_path).expanduser().resolve()
    if not path.exists():
        error_result = {
            "success": False,
            "error": f"Repository not found: {repo_path}",
            "timestamp": time.time(),
        }
        if format == "markdown":
            return f"# Repository Status Failed\n\n**Error:** {error_result['error']}\n"
        return error_result

    repo_info = _analyze_repo(path, deep_scan=deep_scan)
    if not repo_info:
        error_result = {
            "success": False,
            "error": f"Not an MCP repository: {repo_path}",
            "timestamp": time.time(),
        }
        if format == "markdown":
            return f"# Repository Status Failed\n\n**Error:** {error_result['error']}\n"
        return error_result

    # Add more detailed analysis
    repo_info["success"] = True
    repo_info["sota_score"] = _calculate_sota_score(repo_info)
    repo_info["upgrade_priority"] = _determine_priority(repo_info)
    repo_info["timestamp"] = time.time()

    # Add basic repository information
    try:
        repo_info["details"] = {
            "name": path.name,
            "path": str(path),
            "exists": path.exists(),
            "is_directory": path.is_dir() if path.exists() else False,
        }
    except Exception as e:
        logger.warning(f"Failed to collect basic repo info: {e}")
        repo_info["details"] = None

    # Cache the result
    if use_cache:
        cache_repo_status(repo_path, repo_info)

    # Return in requested format
    if format == "markdown":
        return format_repo_status_markdown(repo_info)

    return repo_info


def _analyze_repo(repo_path: Path, deep_scan: bool = False) -> Optional[Dict[str, Any]]:
    """Analyze a repository for MCP status."""
    info = {
        "name": repo_path.name,
        "path": str(repo_path),
        "fastmcp_version": None,
        "tool_count": 0,
        "has_portmanteau": False,
        "has_ci": False,
        "ci_workflows": 0,
        "has_mcpb": False,
        "has_help_tool": False,
        "has_status_tool": False,
        "has_proper_docstrings": False,
        "has_ruff": False,
        "has_tests": False,
        "has_unit_tests": False,
        "has_integration_tests": False,
        "has_pytest_config": False,
        "has_coverage_config": False,
        "test_file_count": 0,
        "has_proper_logging": False,
        "has_good_error_handling": True,  # Assume good until proven bad
        "print_statement_count": 0,
        "bare_except_count": 0,
        "lazy_error_msg_count": 0,
        "is_runt": False,
        "runt_reasons": [],
        "recommendations": [],
        "status_emoji": "SUCCESS",
        "status_color": "green",
        "status_label": "SOTA",
        "zoo_class": "unknown",
        "zoo_animal": "",  # Default: hedgehog (unknown size)
        "loc": {
            "total": 0,
            "python": 0,
            "typescript": 0,
            "powershell": 0,
            "markdown": 0,
        },
        "dependencies": [],
        "tools_metadata": [],
        "entry_points": {},
        "missing_critical_files": [],
        "has_toml_lint": False,
        "has_yaml_lint": False,
        "deep_scan_results": None,
    }

    # SOTA Section 8: Critical File Checks
    for crit_file in SOTA_CRITICAL_FILES:
        if not (repo_path / crit_file).exists():
            info["missing_critical_files"].append(crit_file)
            info["is_runt"] = True
            info["runt_reasons"].append(f"Missing critical file: {crit_file}")
            info["recommendations"].append(f"Restore missing SOTA file: {crit_file}")

    # Configuration Linting Presence
    # (Checking for config or evidence in CI/toml)
    if (repo_path / "ruff.toml").exists() or (repo_path / ".ruff.toml").exists():
        info["has_toml_lint"] = True

    # Check for yaml-lint or similar in CI
    github_workflows = repo_path / ".github" / "workflows"
    if github_workflows.exists():
        for wf in github_workflows.glob("*.y*ml"):
            try:
                wf_content = wf.read_text(encoding="utf-8").lower()
                if "yamllint" in wf_content or "action-yamllint" in wf_content:
                    info["has_yaml_lint"] = True
                    break
            except Exception:
                pass

    # Check for requirements.txt or pyproject.toml
    req_file = repo_path / "requirements.txt"
    pyproject_file = repo_path / "pyproject.toml"

    fastmcp_version = None

    # Extract FastMCP version and other config
    for config_file in [req_file, pyproject_file]:
        if config_file.exists():
            try:
                content = config_file.read_text(encoding="utf-8")

                # FastMCP version check
                match = re.search(r"fastmcp.*?(\d+\.\d+\.?\d*)", content, re.IGNORECASE)
                if match and not fastmcp_version:
                    fastmcp_version = match.group(1)

                # Dependency extraction
                if config_file.name == "requirements.txt":
                    # Simple requirements.txt parsing
                    for line in content.splitlines():
                        line = line.strip()
                        if line and not line.startswith("#"):
                            info["dependencies"].append(line)
                elif config_file.name == "pyproject.toml":
                    # Proper TOML parsing
                    config_data = tomli.loads(content)

                    # Project dependencies
                    project = config_data.get("project", {})
                    deps = project.get("dependencies", [])
                    if isinstance(deps, list):
                        info["dependencies"].extend(deps)

                    # Optional dependencies (dev, etc)
                    opt_deps = project.get("optional-dependencies", {})
                    for group, group_deps in opt_deps.items():
                        if isinstance(group_deps, list):
                            info["dependencies"].extend(group_deps)

                    # Entry points
                    scripts = project.get("scripts", {})
                    if scripts:
                        info["entry_points"].update(scripts)

                    # Build system requirements
                    build_system = config_data.get("build-system", {})
                    build_reqs = build_system.get("requires", [])
                    if build_reqs:
                        info["dependencies"].extend(build_reqs)

            except Exception as e:
                logger.debug(f"Failed to parse {config_file}: {e}")
                pass

    if not fastmcp_version:
        return None  # Not an MCP repo

    info["fastmcp_version"] = fastmcp_version

    # Check for portmanteau tools
    portmanteau_paths = [
        repo_path
        / "src"
        / f"{repo_path.name.replace('-', '_')}"
        / "tools"
        / "portmanteau",
        repo_path / "src" / f"{repo_path.name.replace('-', '_')}" / "portmanteau",
        repo_path / f"{repo_path.name.replace('-', '_')}" / "portmanteau",
        repo_path / "portmanteau",
    ]

    for p in portmanteau_paths:
        if p.exists() and any(p.glob("*.py")):
            info["has_portmanteau"] = True
            break

    # Check for DXT packaging
    for mcpb_file in MCPB_FILES:
        if (repo_path / mcpb_file).exists():
            info["has_mcpb"] = True
            break

    # Count tools, LoC and check for help/status + docstrings
    tool_patterns = [
        (r"@app\.tool\(", "app"),
        (r"@mcp\.tool\(", "mcp"),
        (r"@tool\(", "generic"),
    ]
    tool_count = 0
    proper_docstrings = 0
    print_count = 0
    bare_except_count = 0
    lazy_error_count = 0
    has_logging = False

    # We'll scan the whole repo for LoC, but only src_dirs for tools
    ignore_dirs = {
        "node_modules",
        ".git",
        "__pycache__",
        ".venv",
        "venv",
        ".pytest_cache",
        ".ruff_cache",
        ".mypy_cache",
        "build",
        "dist",
    }

    extensions_map = {
        ".py": "python",
        ".ts": "typescript",
        ".js": "typescript",
        ".ps1": "powershell",
        ".md": "markdown",
    }

    # Recursive scan for everything
    for item in repo_path.rglob("*"):
        if any(part in ignore_dirs for part in item.parts):
            continue

        if item.is_file():
            ext = item.suffix.lower()
            if ext in extensions_map:
                try:
                    content = item.read_text(encoding="utf-8")
                    lines = content.splitlines()
                    line_count = len(lines)

                    category = extensions_map[ext]
                    info["loc"][category] += line_count
                    info["loc"]["total"] += line_count

                    # Only look for tools and specific metadata in source files
                    if ext == ".py":
                        is_test = "test" in str(item).lower()

                        # Tool metadata discovery (only in non-test files)
                        if not is_test:
                            # Search for tools
                            # Simple approach: find the pattern and the function name right after
                            for pattern, _ in tool_patterns:
                                # Look for @tool() followed by def name()
                                matches = re.finditer(
                                    pattern + r".*?\n\s*(?:async\s+)?def\s+(\w+)",
                                    content,
                                    re.DOTALL,
                                )
                                for match in matches:
                                    tool_name = match.group(1)
                                    tool_count += 1

                                    # Check for docstring for THIS specific tool
                                    # We look at the body of the function right after the match
                                    start_pos = match.end()
                                    # Find the end of the def line
                                    def_end = content.find(":", start_pos)
                                    if def_end != -1:
                                        # Check if next non-empty line starts with triple quotes
                                        after_def = content[def_end + 1 :].strip()
                                        has_docstring = after_def.startswith(
                                            '"""'
                                        ) or after_def.startswith("'''")

                                        # Deep check for SOTA docstring (Args/Returns)
                                        is_sota_doc = False
                                        if has_docstring:
                                            # Find the end of docstring
                                            quote_type = after_def[:3]
                                            doc_end = after_def.find(quote_type, 3)
                                            if doc_end != -1:
                                                doc_text = after_def[3:doc_end]
                                                if any(
                                                    kw in doc_text
                                                    for kw in [
                                                        "Args:",
                                                        "Returns:",
                                                        "Example:",
                                                        "PORTMANTEAU",
                                                    ]
                                                ):
                                                    is_sota_doc = True

                                        info["tools_metadata"].append(
                                            {
                                                "name": tool_name,
                                                "file": str(
                                                    item.relative_to(repo_path)
                                                ),
                                                "has_docstring": has_docstring,
                                                "is_sota_doc": is_sota_doc,
                                            }
                                        )
                                        if is_sota_doc:
                                            proper_docstrings += 1

                            # Check for help tool
                            if not info["has_help_tool"]:
                                if re.search(
                                    r'(def\s+help|def\s+get_help|"help"|\'help\')\s*\(',
                                    content,
                                    re.IGNORECASE,
                                ):
                                    info["has_help_tool"] = True

                            # Check for status tool
                            if not info["has_status_tool"]:
                                if re.search(
                                    r'(def\s+status|def\s+get_status|"status"|\'status\')\s*\(',
                                    content,
                                    re.IGNORECASE,
                                ):
                                    info["has_status_tool"] = True

                            # --- Logging, Print and Error Handling Checks ---
                            content_lower = content.lower()

                            # Check for logging setup (only need to find it once)
                            if not has_logging:
                                for pattern in LOGGING_PATTERNS:
                                    if re.search(pattern, content):
                                        has_logging = True
                                        break

                            # Check for print statements in non-test files
                            if not is_test:
                                for pattern in BAD_STDOUT_PATTERNS:
                                    matches = re.findall(pattern, content, re.MULTILINE)
                                    print_count += len(matches)

                            # Check for bare except clauses
                            for pattern in BAD_ERROR_PATTERNS:
                                matches = re.findall(pattern, content)
                                bare_except_count += len(matches)

                            # Check for lazy/non-informative error messages
                            if not is_test:
                                for pattern in LAZY_ERROR_MESSAGES:
                                    matches = re.findall(
                                        pattern, content_lower, re.IGNORECASE
                                    )
                                    lazy_error_count += len(matches)
                except Exception as e:
                    logger.debug(f"Failed to scan {item}: {e}")
                    pass

    info["has_proper_logging"] = has_logging
    info["print_statement_count"] = print_count
    info["bare_except_count"] = bare_except_count
    info["lazy_error_msg_count"] = lazy_error_count
    info["has_good_error_handling"] = bare_except_count < 3 and lazy_error_count < 5

    info["tool_count"] = tool_count
    # Consider proper docstrings if >50% of tools have them
    info["has_proper_docstrings"] = proper_docstrings > 0 and (
        tool_count == 0 or proper_docstrings / max(tool_count, 1) > 0.5
    )

    # Check CI
    ci_dir = repo_path / ".github" / "workflows"
    if ci_dir.exists():
        info["has_ci"] = True
        info["ci_workflows"] = len(list(ci_dir.glob("*.yml")))

        # Check for ruff in CI
        for workflow in ci_dir.glob("*.yml"):
            try:
                ci_content = workflow.read_text(encoding="utf-8").lower()
                if "ruff" in ci_content:
                    info["has_ruff"] = True
                    break
            except Exception:
                pass

    # Check for ruff config files
    if not info["has_ruff"]:
        for ruff_file in RUFF_CONFIG_FILES:
            if (repo_path / ruff_file).exists():
                info["has_ruff"] = True
                break

        # Check pyproject.toml for [tool.ruff]
        if not info["has_ruff"] and pyproject_file.exists():
            try:
                pyproject_content = pyproject_file.read_text(encoding="utf-8")
                if "[tool.ruff]" in pyproject_content:
                    info["has_ruff"] = True
            except Exception:
                pass

    # Check test harness
    test_file_count = 0
    for test_dir_name in TEST_DIRS:
        test_dir = repo_path / test_dir_name
        if test_dir.exists():
            info["has_tests"] = True

            # Check for unit tests
            unit_dir = test_dir / "unit"
            if unit_dir.exists() and any(unit_dir.glob("test_*.py")):
                info["has_unit_tests"] = True

            # Check for integration tests
            integration_dir = test_dir / "integration"
            if integration_dir.exists() and any(integration_dir.glob("test_*.py")):
                info["has_integration_tests"] = True

            # Count test files
            test_file_count += len(list(test_dir.rglob("test_*.py")))
            test_file_count += len(list(test_dir.rglob("*_test.py")))

    info["test_file_count"] = test_file_count

    # Check for pytest configuration
    pytest_ini = repo_path / "pytest.ini"
    pyproject_pytest = False
    if pyproject_file.exists():
        try:
            pyproject_content = pyproject_file.read_text(encoding="utf-8")
            if "[tool.pytest" in pyproject_content:
                pyproject_pytest = True
        except Exception:
            pass

    if pytest_ini.exists() or pyproject_pytest:
        info["has_pytest_config"] = True

    # Check for coverage configuration
    coveragerc = repo_path / ".coveragerc"
    pyproject_coverage = False
    if pyproject_file.exists():
        try:
            pyproject_content = pyproject_file.read_text(encoding="utf-8")
            if "[tool.coverage" in pyproject_content:
                pyproject_coverage = True
        except Exception:
            pass

    if coveragerc.exists() or pyproject_coverage:
        info["has_coverage_config"] = True

    # NEW: FastMCP 2.13.3 Feature Validation
    pyproject_content = ""
    if pyproject_file.exists():
        try:
            pyproject_content = pyproject_file.read_text(encoding="utf-8")
        except Exception:
            pyproject_content = ""

    # Check for FastMCP 2.13.3 specific features
    fastmcp_features = _check_fastmcp_2133_features(repo_path, pyproject_content)
    info.update(fastmcp_features)

    # Check docstring standards
    docstring_analysis = _check_docstring_standards(repo_path)
    info.update(docstring_analysis)

    # Check testing scaffold
    testing_analysis = _check_testing_scaffold(repo_path)
    info.update(testing_analysis)

    # Check CI/CD implementation
    cicd_analysis = _check_cicd_implementation(repo_path)
    info.update(cicd_analysis)

    # Check Zed extension support
    zed_analysis = _check_zed_extension_support(repo_path)
    info.update(zed_analysis)

    # Evaluate using rule-based system
    _evaluate_runt_status(info, fastmcp_version)

    # NEW: Actively run tools if deep_scan is requested
    if deep_scan:
        info["deep_scan_results"] = _run_active_tools(repo_path)
        if not info["deep_scan_results"]["ruff_pass"]:
            info["is_runt"] = True
            info["runt_reasons"].append(
                f"Fails active Ruff linting ({info['deep_scan_results']['ruff_errors']} errors)"
            )
            info["recommendations"].append(
                "Fix all Ruff errors (0 errors mandatory for CI/CD and Release)"
            )
            info["status_color"] = "red"
        if not info["deep_scan_results"]["tests_pass"]:
            info["is_runt"] = True
            info["runt_reasons"].append("Fails active test execution")
            info["status_color"] = "red"

    return info


def _run_active_tools(repo_path: Path) -> Dict[str, Any]:
    """Actively execute Ruff and tests on the repository."""
    import subprocess

    results = {
        "ruff_pass": True,
        "ruff_errors": 0,
        "tests_pass": True,
        "test_summary": "",
    }

    # Run Ruff
    try:
        ruff_proc = subprocess.run(
            ["ruff", "check", "."],
            cwd=str(repo_path),
            capture_output=True,
            text=True,
            check=False,
        )
        if ruff_proc.returncode != 0:
            results["ruff_pass"] = False
            # Count errors (simplified count from output)
            results["ruff_errors"] = len(ruff_proc.stdout.splitlines())
    except Exception as e:
        results["ruff_pass"] = False
        results["ruff_error_msg"] = str(e)

    # Run Tests (Master script or pytest)
    test_commands = [
        ["powershell", "-ExecutionPolicy", "Bypass", "-File", "./run_tests.ps1"],
        ["pytest"],
        ["python", "-m", "pytest"],
    ]

    for cmd in test_commands:
        try:
            # Check if file exists for binary-based commands
            if cmd[0] == "powershell" and not (repo_path / "run_tests.ps1").exists():
                continue

            test_proc = subprocess.run(
                cmd, cwd=str(repo_path), capture_output=True, text=True, check=False
            )
            if test_proc.returncode == 0:
                results["tests_pass"] = True
                results["test_summary"] = "Tests passed successfully"
                break
            else:
                results["tests_pass"] = False
                results["test_summary"] = test_proc.stdout[-500:]  # Last 500 chars
        except Exception as e:
            results["tests_pass"] = False
            results["test_summary"] = f"Test execution failed: {str(e)}"

    return results


def _evaluate_runt_status(info: Dict[str, Any], fastmcp_version: str) -> None:
    """Evaluate if repo is a runt using rule-based system."""
    # Ensure fastmcp_version is in info for rule evaluation
    if fastmcp_version:
        info["fastmcp_version"] = fastmcp_version

    # Evaluate all rules
    rule_result = evaluate_rules(info)

    # Update info with rule evaluation results
    info["is_runt"] = rule_result["is_runt"]
    info["runt_reasons"] = rule_result["runt_reasons"]
    info["recommendations"] = rule_result["recommendations"]

    # Set status emoji, color, and label based on severity
    violation_count = rule_result["violation_count"]
    critical_count = rule_result["critical_count"]

    if info["is_runt"]:
        # RED - Real runts
        info["status_color"] = "red"
        if critical_count >= 5:
            info["status_emoji"] = ""
            info["status_label"] = "Critical Runt"
        elif critical_count >= 3:
            info["status_emoji"] = ""
            info["status_label"] = "Runt"
        else:
            info["status_emoji"] = ""
            info["status_label"] = "Minor Runt"
    else:
        if violation_count > 0:
            # ORANGE - Improvable (has warnings but not runt)
            info["status_emoji"] = "WARNING"
            info["status_color"] = "orange"
            info["status_label"] = "Needs Improvement"
        else:
            # GREEN - Perfect
            info["status_emoji"] = "SUCCESS"
            info["status_color"] = "green"
            info["status_label"] = "SOTA"

    # Store rule evaluation details for debugging
    info["_rule_evaluation"] = {
        "violations": rule_result["violations"],
        "critical_violations": rule_result["critical_violations"],
        "score_deduction": rule_result["score_deduction"],
    }

    # Add zoo classification
    _classify_zoo_animal(info)


def _classify_zoo_animal(info: Dict[str, Any]) -> None:
    """Classify repo into MCP Zoo animal size category."""
    name_lower = info.get("name", "").lower()
    tool_count = info.get("tool_count", 0)

    # Check for jumbo indicators in name
    is_jumbo_type = any(ind in name_lower for ind in JUMBO_INDICATORS)

    # Check for chipmunk indicators in name
    is_chipmunk_type = any(ind in name_lower for ind in CHIPMUNK_INDICATORS)

    # Determine class based on indicators and tool count
    if is_jumbo_type or tool_count >= 20:
        info["zoo_class"] = "jumbo"
        info["zoo_animal"] = ""
    elif is_chipmunk_type and tool_count <= 3:
        info["zoo_class"] = "chipmunk"
        info["zoo_animal"] = ""
    elif tool_count >= 10:
        info["zoo_class"] = "large"
        info["zoo_animal"] = ""
    elif tool_count >= 5:
        info["zoo_class"] = "medium"
        info["zoo_animal"] = ""
    elif tool_count >= 2:
        info["zoo_class"] = "small"
        info["zoo_animal"] = ""
    else:
        info["zoo_class"] = "chipmunk"
        info["zoo_animal"] = ""


def _calculate_sota_score(info: Dict[str, Any]) -> int:
    """Calculate SOTA compliance score (0-100) using rule-based system."""
    return calculate_sota_score(info, base_score=100)


def _check_fastmcp_2133_features(
    repo_path: Path, pyproject_content: str
) -> Dict[str, Any]:
    """Check for FastMCP 2.13.3 specific features and compliance."""
    features = {
        "has_sampling_support": False,
        "has_conversational_returns": False,
        "sampling_version_compliant": False,
        "conversational_returns_compliant": False,
        "sampling_implementation": None,
        "conversational_implementation": None,
    }

    # Check for sampling support in dependencies
    if "fastmcp" in pyproject_content.lower():
        # Extract version to check if it supports sampling
        version_match = re.search(
            r"fastmcp[>=<>=!]*([0-9\.]+[0-9]*)", pyproject_content.lower()
        )
        if version_match:
            version = version_match.group(1)
            # Compare versions for sampling support (2.13.3+)
            if _version_ge(version, "2.13.3"):
                features["sampling_version_compliant"] = True
                features["has_sampling_support"] = True

    # Check source code for sampling implementation
    try:
        for py_file in repo_path.rglob("*.py"):
            if py_file.is_file():
                content = py_file.read_text(encoding="utf-8")

                # Look for sampling-related imports and usage
                if any(
                    pattern in content
                    for pattern in [
                        "from fastmcp.sampling",
                        "import fastmcp.sampling",
                        "@sampling_tool",
                        "SamplingConfig",
                        "sampling_enabled",
                    ]
                ):
                    features["has_sampling_support"] = True
                    features["sampling_implementation"] = str(
                        py_file.relative_to(repo_path)
                    )

                # Look for conversational return patterns
                if any(
                    pattern in content
                    for pattern in [
                        "conversational=True",
                        "ConversationalResponse",
                        "conversational_response",
                        "return_conversational",
                    ]
                ):
                    features["has_conversational_returns"] = True
                    features["conversational_implementation"] = str(
                        py_file.relative_to(repo_path)
                    )

    except Exception:
        pass  # File read errors shouldn't stop analysis

    return features


def _check_docstring_standards(repo_path: Path) -> Dict[str, Any]:
    """Check if docstrings meet current FastMCP standards."""
    docstring_info = {
        "has_proper_docstrings": False,
        "docstring_coverage": 0,
        "tools_with_args": 0,
        "tools_with_returns": 0,
        "tools_with_examples": 0,
        "ascii_only_docstrings": True,
        "unicode_issues_found": [],
    }

    tool_count = 0
    tools_with_proper_docs = 0

    try:
        for py_file in repo_path.rglob("*.py"):
            if py_file.is_file() and not any(
                part.startswith(".") for part in py_file.parts
            ):
                content = py_file.read_text(encoding="utf-8")

                # Check for Unicode characters in docstrings
                unicode_matches = re.findall(
                    r'["\'][\U0001F000-\U0001F999][^"\']*["\']', content
                )
                if unicode_matches:
                    docstring_info["unicode_issues_found"].extend(
                        [f"{py_file.name}: {match}" for match in unicode_matches]
                    )
                    docstring_info["ascii_only_docstrings"] = False

                # Find tool functions
                tool_matches = re.finditer(
                    r"@tool.*?\n\s*(?:async\s+)?def\s+(\w+)", content, re.DOTALL
                )

                for match in tool_matches:
                    tool_count += 1

                    # Extract docstring for this tool
                    start_pos = match.end()
                    def_end = content.find(":", start_pos)
                    if def_end != -1:
                        after_def = content[def_end + 1 :].strip()
                        if after_def.startswith('"""') or after_def.startswith("'''"):
                            quote_type = after_def[:3]
                            doc_end = after_def.find(quote_type, 3)
                            if doc_end != -1:
                                doc_text = after_def[3:doc_end]
                                tools_with_proper_docs += 1

                                # Check docstring components
                                if "Args:" in doc_text:
                                    docstring_info["tools_with_args"] += 1
                                if "Returns:" in doc_text:
                                    docstring_info["tools_with_returns"] += 1
                                if any(
                                    example in doc_text
                                    for example in ["Example:", "Examples:", ">>>"]
                                ):
                                    docstring_info["tools_with_examples"] += 1

        if tool_count > 0:
            docstring_info["docstring_coverage"] = (
                tools_with_proper_docs / tool_count
            ) * 100
            docstring_info["has_proper_docstrings"] = (
                docstring_info["docstring_coverage"] >= 80
            )

    except Exception:
        pass

    return docstring_info


def _check_testing_scaffold(repo_path: Path) -> Dict[str, Any]:
    """Check if proper testing scaffold is in place."""
    testing_info = {
        "has_test_directory": False,
        "has_pytest_config": False,
        "has_coverage_config": False,
        "has_unit_tests": False,
        "has_integration_tests": False,
        "test_file_count": 0,
        "has_ci_cd": False,
        "ci_cd_platform": None,
    }

    # Check for test directories
    for test_dir in ["tests", "test"]:
        test_path = repo_path / test_dir
        if test_path.exists() and test_path.is_dir():
            testing_info["has_test_directory"] = True

            # Check for specific test types
            unit_dir = test_path / "unit"
            integration_dir = test_path / "integration"

            if unit_dir.exists():
                testing_info["has_unit_tests"] = True
            if integration_dir.exists():
                testing_info["has_integration_tests"] = True

            # Count test files
            test_files = list(test_path.rglob("test_*.py")) + list(
                test_path.rglob("*_test.py")
            )
            testing_info["test_file_count"] = len(test_files)

    # Check for pytest configuration
    pytest_ini = repo_path / "pytest.ini"
    pyproject_file = repo_path / "pyproject.toml"

    if pytest_ini.exists():
        testing_info["has_pytest_config"] = True

    if pyproject_file.exists():
        try:
            pyproject_content = pyproject_file.read_text(encoding="utf-8")
            if "[tool.pytest" in pyproject_content or "[pytest" in pyproject_content:
                testing_info["has_pytest_config"] = True
        except Exception:
            pass

    # Check for coverage configuration
    coveragerc = repo_path / ".coveragerc"
    if pyproject_file.exists():
        try:
            pyproject_content = pyproject_file.read_text(encoding="utf-8")
            if "[tool.coverage" in pyproject_content:
                testing_info["has_coverage_config"] = True
        except Exception:
            pass

    if coveragerc.exists():
        testing_info["has_coverage_config"] = True

    return testing_info


def _check_cicd_implementation(repo_path: Path) -> Dict[str, Any]:
    """Check for CI/CD implementation."""
    cicd_info = {
        "has_ci_cd": False,
        "ci_cd_platform": None,
        "has_github_actions": False,
        "has_gitlab_ci": False,
        "has_azure_pipelines": False,
        "workflow_files": [],
    }

    # Check for GitHub Actions
    github_dir = repo_path / ".github" / "workflows"
    if github_dir.exists() and github_dir.is_dir():
        cicd_info["has_ci_cd"] = True
        cicd_info["ci_cd_platform"] = "github_actions"
        cicd_info["has_github_actions"] = True
        workflow_files = list(github_dir.glob("*.yml")) + list(
            github_dir.glob("*.yaml")
        )
        cicd_info["workflow_files"] = [f.name for f in workflow_files]

    # Check for GitLab CI
    gitlab_file = repo_path / ".gitlab-ci.yml"
    if gitlab_file.exists():
        cicd_info["has_ci_cd"] = True
        if not cicd_info["ci_cd_platform"]:
            cicd_info["ci_cd_platform"] = "gitlab_ci"
        cicd_info["has_gitlab_ci"] = True

    # Check for Azure Pipelines
    azure_file = repo_path / ".azure" / "pipelines"
    if azure_file.exists() and azure_file.is_dir():
        cicd_info["has_ci_cd"] = True
        if not cicd_info["ci_cd_platform"]:
            cicd_info["ci_cd_platform"] = "azure_pipelines"
        cicd_info["has_azure_pipelines"] = True

    return cicd_info


def _check_zed_extension_support(repo_path: Path) -> Dict[str, Any]:
    """Check for Zed extension implementation."""
    zed_info = {
        "has_zed_extension": False,
        "has_manifest": False,
        "has_main_script": False,
        "extension_files": [],
    }

    # Look for Zed extension files
    extension_patterns = [
        "extension.json",
        "manifest.json",
        "zed_extension.json",
        "package.json",  # Sometimes used for Zed extensions
    ]

    for pattern in extension_patterns:
        matches = list(repo_path.rglob(pattern))
        if matches:
            zed_info["has_zed_extension"] = True
            zed_info["has_manifest"] = True
            zed_info["extension_files"].extend(
                [str(m.relative_to(repo_path)) for m in matches]
            )

    # Look for main extension script
    script_patterns = ["main.py", "index.js", "extension.py", "zed.py"]
    for pattern in script_patterns:
        matches = list(repo_path.rglob(pattern))
        if matches:
            zed_info["has_main_script"] = True
            zed_info["extension_files"].extend(
                [str(m.relative_to(repo_path)) for m in matches]
            )

    return zed_info


def _version_ge(version1: str, version2: str) -> bool:
    """Compare two version strings (>=)."""

    def normalize(v):
        return [int(x) for x in v.split(".")]

    v1_parts = normalize(version1)
    v2_parts = normalize(version2)

    # Pad with zeros to same length
    max_len = max(len(v1_parts), len(v2_parts))
    v1_parts.extend([0] * (max_len - len(v1_parts)))
    v2_parts.extend([0] * (max_len - len(v2_parts)))

    return v1_parts >= v2_parts


def _determine_priority(info: Dict[str, Any]) -> str:
    """Determine upgrade priority based on runt reasons."""
    reasons = len(info.get("runt_reasons", []))
    if reasons == 0:
        return "none"
    elif reasons == 1:
        return "low"
    elif reasons == 2:
        return "medium"
    else:
        return "high"
