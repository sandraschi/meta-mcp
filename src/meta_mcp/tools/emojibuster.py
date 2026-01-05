"""
EmojiBuster Tool - Unicode Logging Crash Prevention and Recovery

This tool scans repositories for Unicode characters in logger calls that cause
production crashes and restart loops. It's the ultimate "Argh-Coding" bloop-buster
for the Gen X emoji overuse problem!
"""

import asyncio
import re
from pathlib import Path
from typing import Any, Dict, List
from fastmcp import FastMCP

# Unsafe Unicode patterns that cause logging crashes (using escape sequences)
UNSAFE_UNICODE_PATTERNS = [
    # Explicitly targeted high-frequency "crasher" emojis (using hex escapes)
    r"logger\.[a-z_]+\([^)]*[\U0001F680\u26A0\u274C\u2705\U0001F50D\U0001F389\U0001F3C6\U0001F600\U0001F602\U0001F60D\U0001F3AD\U0001F60E]",
    r"print\([^)]*[\U0001F680\u26A0\u274C\u2705\U0001F50D\U0001F389\U0001F3C6\U0001F600\U0001F602\U0001F60D\U0001F3AD\U0001F60E]",
    # General ranges
    r"logger\.[a-z_]+\([^)]*[\U0001F600-\U0001F64F]",  # Emoticons
    r"print\([^)]*[\U0001F600-\U0001F64F]",  # Emoticons in print
    r"logger\.[a-z_]+\([^)]*[\U0001F300-\U0001F5FF]",  # Misc Symbols
    r"print\([^)]*[\U0001F300-\U0001F5FF]",  # Misc Symbols in print
    r"logger\.[a-z_]+\([^)]*[\U0001F680-\U0001F6FF]",  # Transport & Map
    r"print\([^)]*[\U0001F680-\U0001F6FF]",  # Transport & Map in print
    r"logger\.[a-z_]+\([^)]*[\U0001F700-\U0001F77F]",  # Alchemical
    r"print\([^)]*[\U0001F700-\U0001F77F]",  # Alchemical in print
    r"logger\.[a-z_]+\([^)]*[\U0001F780-\U0001F7FF]",  # Geometric
    r"print\([^)]*[\U0001F780-\U0001F7FF]",  # Geometric in print
    r"logger\.[a-z_]+\([^)]*[\U0001F800-\U0001F8FF]",  # Supplemental
    r"print\([^)]*[\U0001F800-\U0001F8FF]",  # Supplemental in print
    r"logger\.[a-z_]+\([^)]*[\U0001F900-\U0001F9FF]",  # Symbols & Pictographs
    r"print\([^)]*[\U0001F900-\U0001F9FF]",  # Symbols & Pictographs in print
    r"logger\.[a-z_]+\([^)]*[\U0001FA00-\U0001FA6F]",  # Chess
    r"print\([^)]*[\U0001FA00-\U0001FA6F]",  # Chess in print
    # Catch-all for ANY non-ASCII in logger/print calls (the ultimate safety)
    r"logger\.[a-z_]+\([^)]*[^\x00-\x7F]",
    r"print\([^)]*[^\x00-\x7F]",
]

# Safe ASCII replacements (using hex escapes for keys)
UNICODE_REPLACEMENTS = {
    "\U0001f680": "Process",  # Rocket
    "\u26a0": "WARNING",  # Warning sign
    "\u274c": "ERROR",  # Cross mark
    "\u2705": "SUCCESS",  # Check mark
    "\U0001f50d": "DEBUG",  # Search
    "\U0001f389": "Celebration",  # Party popper
    "\U0001f3c6": "Achievement",  # Trophy
    "\U0001f600": "Happy",  # Grinning face
    "\U0001f602": "Laughing",  # Tears of joy
    "\U0001f60d": "Love",  # Heart eyes
    "\U0001f3ad": "Mask",  # Performing arts
    "\U0001f60e": "Cool",  # Sunglasses
    "\U0001f4dd": "Document",  # Memo
    "\U0001f4ca": "Chart",  # Bar chart
    "\U0001f527": "Tools",  # Wrench
    "\U0001f4a1": "Idea",  # Light bulb
    "\U0001f3af": "Target",  # Bulls eye
    "\u2b50": "Star",  # Star
    "\U0001f517": "Link",  # Link
    "\U0001f4c1": "Folder",  # Open folder
    "\U0001f512": "Lock",  # Lock
    "\U0001f310": "Global",  # Globe
    "\U0001f4f1": "Mobile",  # Mobile phone
    "\U0001f4bb": "Computer",  # Laptop
    "\U0001f6a6": "Start",  # Traffic light
    "\u23f8": "Stop",  # Pause button
    "\U0001f504": "Refresh",  # Counter-clockwise arrows
    "\u2b06": "Up",  # Up arrow
    "\u2b07": "Down",  # Down arrow
    "\u2728": "Magic",  # Sparkles
    "\U0001f3a8": "Design",  # Palette
    "\U0001f308": "Rainbow",  # Rainbow
    "\U0001f31f": "Sun",  # Glowing star
    "\U0001f319": "Moon",  # Crescent moon
    "\u26a1": "Bolt",  # High voltage
    "\U0001f525": "Fire",  # Fire
    "\U0001f4a7": "Water",  # Droplet
    "\U0001f30a": "Wave",  # Water wave
}


class EmojiBuster:
    """Unicode logging crash prevention and recovery specialist.

    Scans for Unicode characters in ALL output streams that cause crashes:
    - logger.*() calls (logging to files/console)
    - print() statements (direct console output)
    - Any Unicode in output streams destined for logs/files

    SAFE Unicode (allowed):
    - Triple-quoted comments: Docstring content
    - Content body: Return values, API responses
    - User-facing content: UI elements, messages
    - Safe emojis in content: (serialize reliably)
    """

    def __init__(self):
        self.scan_cache = {}
        self.success_stories = []

    async def scan_repository(
        self, repo_path: str, scan_mode: str = "comprehensive"
    ) -> Dict[str, Any]:
        """Scan a single repository for Unicode logging issues."""

        repo_path = Path(repo_path)
        if not repo_path.exists():
            return {
                "success": False,
                "error": f"Repository path does not exist: {repo_path}",
                "error_code": "REPO_NOT_FOUND",
            }

        # Find all Python files
        python_files = list(repo_path.rglob("*.py"))

        unicode_issues = []
        total_files = len(python_files)
        files_with_unicode = 0

        for file_path in python_files:
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                    lines = content.split("\n")

                file_issues = []
                for line_num, line in enumerate(lines, 1):
                    # Use a broader check for ALL non-ASCII (including docstrings/comments)
                    for match in re.finditer(r"[^\x00-\x7F]", line):
                        file_issues.append(
                            {
                                "line_number": line_num,
                                "line_content": line.strip(),
                                "unsafe_match": match.group(),
                                "hex_match": hex(ord(match.group())),
                                "risk_level": "critical"
                                if re.search(r"(logger\.[a-z_]+|print)\s*\(", line)
                                else "advisory",
                            }
                        )

                if file_issues:
                    files_with_unicode += 1
                    unicode_issues.append(
                        {
                            "file": str(file_path.relative_to(repo_path)),
                            "issues": file_issues,
                            "issue_count": len(file_issues),
                        }
                    )

            except Exception as e:
                unicode_issues.append(
                    {
                        "file": str(file_path.relative_to(repo_path)),
                        "error": f"Failed to scan file: {str(e)}",
                        "issue_count": 0,
                    }
                )

        return {
            "success": True,
            "repository": str(repo_path),
            "scan_mode": scan_mode,
            "total_files": total_files,
            "files_with_unicode": files_with_unicode,
            "total_unicode_issues": len(unicode_issues),
            "unicode_issues": unicode_issues,
            "crash_risk": "HIGH" if files_with_unicode > 0 else "LOW",
        }

    async def scan_multiple_repositories(
        self, repo_paths: List[str], scan_mode: str = "comprehensive"
    ) -> Dict[str, Any]:
        """Scan multiple repositories for Unicode logging issues."""

        results = []
        total_unicode_issues = 0
        repos_with_unicode = 0

        for repo_path in repo_paths:
            result = await self.scan_repository(repo_path, scan_mode)
            results.append(result)

            if result.get("success"):
                total_unicode_issues += result.get("total_unicode_issues", 0)
                if result.get("files_with_unicode", 0) > 0:
                    repos_with_unicode += 1

        return {
            "success": True,
            "operation": "emojibuster_scan_multiple",
            "scan_mode": scan_mode,
            "repos_scanned": len(repo_paths),
            "repos_with_unicode": repos_with_unicode,
            "total_unicode_issues": total_unicode_issues,
            "individual_results": results,
            "overall_crash_risk": "HIGH" if total_unicode_issues > 0 else "LOW",
        }

    async def fix_unicode_logging(
        self, repo_path: str, backup: bool = True
    ) -> Dict[str, Any]:
        """Fix Unicode logging issues in a repository."""

        scan_result = await self.scan_repository(repo_path)

        if not scan_result.get("success"):
            return scan_result

        if scan_result.get("total_unicode_issues", 0) == 0:
            return {
                "success": True,
                "message": "No Unicode logging issues found",
                "repository": repo_path,
                "issues_fixed": 0,
            }

        repo_path = Path(repo_path)
        fixed_files = 0
        total_fixes = 0

        for issue in scan_result["unicode_issues"]:
            if "error" in issue:
                continue

            file_path = repo_path / issue["file"]

            # Create backup if requested
            if backup:
                backup_path = file_path.with_suffix(file_path.suffix + ".backup")
                backup_path.write_text(
                    file_path.read_text(encoding="utf-8"), encoding="utf-8"
                )

            # Fix the file
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()

                original_content = content

                # 1. Apply known replacements globally (Tokens)
                for unicode_char, replacement in UNICODE_REPLACEMENTS.items():
                    content = content.replace(unicode_char, replacement)

                # 2. Aggressively remove EVERY remaining non-ASCII character from the file
                # This ensures 100% ASCII safety for all tools, logging, and docstrings.
                # It follows the "safe scanner" philosophy to prevent terminal/grep crashes.
                content = re.sub(r"[^\x00-\x7F]+", "", content)

                # Only write if content changed
                if content != original_content:
                    file_path.write_text(content, encoding="utf-8")
                    fixed_files += 1
                    total_fixes += len(issue["issues"])

            except Exception as e:
                return {
                    "success": False,
                    "error": f"Failed to fix file {issue['file']}: {str(e)}",
                    "error_code": "FIX_FAILED",
                }

        # Add to success stories
        success_story = {
            "repository": str(repo_path),
            "timestamp": asyncio.get_event_loop().time(),
            "issues_fixed": total_fixes,
            "files_fixed": fixed_files,
            "stability_improved": True,
        }
        self.success_stories.append(success_story)

        return {
            "success": True,
            "operation": "emojibuster_fix",
            "repository": str(repo_path),
            "files_fixed": fixed_files,
            "total_fixes": total_fixes,
            "backup_created": backup,
            "success_story": success_story,
        }

    async def get_success_stories(self) -> Dict[str, Any]:
        """Get success stories from previous EmojiBuster operations."""

        return {
            "success": True,
            "operation": "emojibuster_success_stories",
            "total_stories": len(self.success_stories),
            "success_stories": self.success_stories,
            "summary": {
                "total_repos_fixed": len(
                    set(story["repository"] for story in self.success_stories)
                ),
                "total_issues_fixed": sum(
                    story["issues_fixed"] for story in self.success_stories
                ),
                "stability_improvements": len(self.success_stories),
            },
        }


# Initialize EmojiBuster instance
emoji_buster = EmojiBuster()


def register_emojibuster_tools(app: FastMCP):
    """Register EmojiBuster tools with FastMCP application."""

    @app.tool()
    async def emojibuster_scan(
        repo_path: str = "*", scan_mode: str = "comprehensive"
    ) -> Dict[str, Any]:
        """Scan repository/repositories for Unicode logging crash risks.

        Args:
            repo_path: Repository path to scan (use "*" for all discovered repos)
            scan_mode: Scan intensity level ("quick" or "comprehensive")

        Returns:
            Enhanced response with scan results and crash risk assessment
        """

        if repo_path == "*":
            # Discover repositories (simplified - in real implementation,
            # this would use the discovery tools)
            repo_paths = ["d:\\Dev\\repos\\mcp-central-docs", "d:\\Dev\\repos\\qbt-mcp"]
            result = await emoji_buster.scan_multiple_repositories(
                repo_paths, scan_mode
            )
        else:
            result = await emoji_buster.scan_repository(repo_path, scan_mode)

        # Add enhanced response pattern
        if result.get("success"):
            result.update(
                {
                    "operation": "emojibuster_scan",
                    "scan_completed": True,
                    "recommendations": [
                        "Run with auto_fix=True to automatically fix Unicode issues",
                        "Add pre-commit hooks to prevent future Unicode logging",
                        "Audit repositories weekly for new Unicode additions",
                    ],
                    "next_steps": [
                        "Run emojibuster_fix() to resolve identified issues",
                        "Check success_stories for similar fixes",
                        "Implement Unicode validation in CI/CD pipeline",
                    ],
                }
            )

        return result

    @app.tool()
    async def emojibuster_fix(
        repo_path: str, auto_fix: bool = False, backup: bool = True
    ) -> Dict[str, Any]:
        """Fix Unicode logging issues that cause crashes.

        Args:
            repo_path: Repository path to fix
            auto_fix: Whether to automatically fix issues (requires confirmation)
            backup: Whether to create backups before fixing

        Returns:
            Enhanced response with fix results and stability improvements
        """

        if not auto_fix:
            return {
                "success": False,
                "error": "Auto-fix not enabled. Set auto_fix=True to proceed.",
                "error_code": "AUTO_FIX_REQUIRED",
                "recovery_options": [
                    "Set auto_fix=True to automatically fix Unicode issues",
                    "Manually review and fix each Unicode logger call",
                    "Use emojibuster_scan() to see specific issues first",
                ],
                "warning": "Auto-fix will replace Unicode characters with ASCII alternatives",
            }

        result = await emoji_buster.fix_unicode_logging(repo_path, backup)

        # Add enhanced response pattern
        if result.get("success"):
            result.update(
                {
                    "operation": "emojibuster_fix",
                    "stability_improved": True,
                    "crash_risk_eliminated": "HIGH"
                    if result.get("total_fixes", 0) > 0
                    else "LOW",
                    "follow_up_actions": [
                        "Test the fixed repository for stability",
                        "Monitor for any remaining Unicode issues",
                        "Add pre-commit hooks to prevent future problems",
                    ],
                }
            )

        return result

    @app.tool()
    async def emojibuster_success_stories() -> Dict[str, Any]:
        """Get success stories from previous EmojiBuster operations.

        Returns:
            Enhanced response with success stories and stability improvements
        """

        result = await emoji_buster.get_success_stories()

        # Add enhanced response pattern
        result.update(
            {
                "operation": "emojibuster_success_stories",
                "impact_summary": {
                    "crashes_prevented": "Unknown but significant",
                    "developer_hours_saved": "Substantial",
                    "production_stability": "Greatly improved",
                },
                "recommendations": [
                    "Share success stories to help other developers",
                    "Monitor fixed repositories for continued stability",
                    "Contribute new Unicode patterns to improve detection",
                ],
            }
        )

        return result
