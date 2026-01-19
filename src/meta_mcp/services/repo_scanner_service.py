from typing import Any, Dict, List, Optional
import os
import json
import toml
from pathlib import Path

from meta_mcp.services.base import MetaMCPService


class RepoScannerService(MetaMCPService):
    """
    Service for deep analysis of MCP server repositories.

    Provides comprehensive scanning and analysis of MCP server codebases
    including structure analysis, dependency checking, and compliance verification.
    """

    async def scan_repository(self, repo_path: str, deep_analysis: bool = False) -> Dict[str, Any]:
        """Perform comprehensive repository analysis."""
        try:
            path = Path(repo_path).resolve()

            if not path.exists():
                return self.create_response(False, f"Repository path not found: {repo_path}")

            # Safety check: prevent scanning root directories or drives
            dangerous_paths = ['/', '\\', 'C:', 'C:\\', 'D:', 'D:\\', '/root', '/home', '/usr', '/opt']
            if any(str(path).startswith(dangerous) and len(str(path)) <= len(dangerous) + 10 for dangerous in dangerous_paths):
                return self.create_response(False, "Cannot scan root directories or system paths for safety reasons")

            # Safety check: limit directory depth and file count
            total_files = sum(1 for _ in path.rglob('*') if _.is_file())
            if total_files > 10000:  # Arbitrary limit to prevent hangs
                return self.create_response(False, f"Repository too large ({total_files} files). Maximum 10,000 files allowed.")

            analysis = {
                "structure": await self._analyze_structure(path),
                "dependencies": await self._analyze_dependencies(path),
                "mcp_compliance": await self._check_mcp_compliance(path),
                "code_quality": await self._analyze_code_quality(path) if deep_analysis else None,
                "documentation": await self._analyze_documentation(path),
                "testing": await self._analyze_testing(path)
            }

            # Calculate overall health score
            health_score = self._calculate_health_score(analysis)

            return self.create_response(True, f"Repository analysis completed for {path.name}", {
                "repo_path": str(path),
                "repo_name": path.name,
                "analysis": analysis,
                "health_score": health_score,
                "recommendations": self._generate_recommendations(analysis)
            })

        except Exception as e:
            return self.create_response(False, f"Repository scan failed: {str(e)}")

    async def _analyze_structure(self, path: Path) -> Dict[str, Any]:
        """Analyze repository structure."""
        structure = {
            "has_src": False,
            "has_tests": False,
            "has_docs": False,
            "has_ci": False,
            "main_package": None,
            "entry_points": []
        }

        # Check for common directory structures
        if (path / "src").exists():
            structure["has_src"] = True
            # Find main package
            for item in (path / "src").iterdir():
                if item.is_dir() and (item / "__init__.py").exists():
                    structure["main_package"] = item.name
                    break

        try:
            has_test_files = (path / "tests").exists() or any(path.glob("test_*.py"))
        except:
            has_test_files = (path / "tests").exists()
        if has_test_files:
            structure["has_tests"] = True

        if (path / "docs").exists() or (path / "README.md").exists():
            structure["has_docs"] = True

        if (path / ".github" / "workflows").exists() or (path / ".gitlab-ci.yml").exists():
            structure["has_ci"] = True

        # Find Python entry points (limit to prevent hangs)
        try:
            for py_file in path.glob("*.py"):
                if len(structure["entry_points"]) >= 20:  # Limit entry points
                    break
                if py_file.name != "__init__.py":
                    structure["entry_points"].append(py_file.name)
        except:
            # Ignore glob errors
            pass

        return structure

    async def _analyze_dependencies(self, path: Path) -> Dict[str, Any]:
        """Analyze project dependencies."""
        deps = {
            "python_version": None,
            "fastmcp_version": None,
            "requirements": [],
            "has_pyproject": False,
            "has_requirements": False
        }

        # Check pyproject.toml
        pyproject_file = path / "pyproject.toml"
        if pyproject_file.exists():
            deps["has_pyproject"] = True
            try:
                with open(pyproject_file, 'r', encoding='utf-8') as f:
                    pyproject_data = toml.load(f)

                project = pyproject_data.get("project", {})
                deps["python_version"] = project.get("requires-python")

                # Check dependencies for FastMCP
                for dep_list in ["dependencies", "dev-dependencies"]:
                    deps_list = project.get(dep_list, [])
                    for dep in deps_list:
                        if "fastmcp" in dep.lower():
                            deps["fastmcp_version"] = dep
                            break

            except Exception:
                pass

        # Check requirements.txt
        req_file = path / "requirements.txt"
        if req_file.exists():
            deps["has_requirements"] = True
            try:
                with open(req_file, 'r', encoding='utf-8') as f:
                    deps["requirements"] = [line.strip() for line in f if line.strip() and not line.startswith('#')]
            except Exception:
                pass

        return deps

    async def _check_mcp_compliance(self, path: Path) -> Dict[str, Any]:
        """Check MCP compliance and best practices."""
        compliance = {
            "has_fastmcp": False,
            "has_mcp_server": False,
            "has_tools": False,
            "has_manifest": False,
            "version": None,
            "issues": []
        }

        # Check for FastMCP usage
        for py_file in path.glob("**/*.py"):
            try:
                with open(py_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                    if "from fastmcp import" in content or "import fastmcp" in content:
                        compliance["has_fastmcp"] = True

                    if "@app.tool" in content or "@mcp.tool" in content:
                        compliance["has_tools"] = True

                    if "FastMCP(" in content:
                        compliance["has_mcp_server"] = True

            except Exception:
                continue

        # Check for manifest.json
        if (path / "manifest.json").exists():
            compliance["has_manifest"] = True
            try:
                with open(path / "manifest.json", 'r', encoding='utf-8') as f:
                    manifest = json.load(f)
                    compliance["version"] = manifest.get("version")
            except Exception:
                pass

        # Check for common issues
        if not compliance["has_fastmcp"]:
            compliance["issues"].append("No FastMCP import found")

        if not compliance["has_mcp_server"]:
            compliance["issues"].append("No FastMCP server initialization found")

        if not compliance["has_tools"]:
            compliance["issues"].append("No MCP tools defined")

        return compliance

    async def _analyze_code_quality(self, path: Path) -> Dict[str, Any]:
        """Perform code quality analysis."""
        quality = {
            "total_lines": 0,
            "python_files": 0,
            "functions": 0,
            "classes": 0,
            "complexity_score": 0
        }

        for py_file in path.glob("**/*.py"):
            try:
                with open(py_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                quality["python_files"] += 1
                quality["total_lines"] += len(content.split('\n'))

                # Count functions and classes
                quality["functions"] += content.count("def ")
                quality["classes"] += content.count("class ")

            except Exception:
                continue

        # Simple complexity score based on file count and size
        quality["complexity_score"] = min(100, quality["python_files"] * 10 + quality["total_lines"] // 100)

        return quality

    async def _analyze_documentation(self, path: Path) -> Dict[str, Any]:
        """Analyze documentation completeness."""
        docs = {
            "has_readme": False,
            "has_docs_dir": False,
            "readme_lines": 0,
            "doc_files": 0
        }

        readme_files = ["README.md", "README.rst", "README.txt"]
        for readme in readme_files:
            if (path / readme).exists():
                docs["has_readme"] = True
                try:
                    with open(path / readme, 'r', encoding='utf-8') as f:
                        docs["readme_lines"] = len(f.readlines())
                except Exception:
                    pass
                break

        if (path / "docs").exists():
            docs["has_docs_dir"] = True
            docs["doc_files"] = len(list((path / "docs").glob("**/*.md")))

        return docs

    async def _analyze_testing(self, path: Path) -> Dict[str, Any]:
        """Analyze testing setup."""
        testing = {
            "has_tests": False,
            "test_files": 0,
            "has_pytest": False,
            "has_unittest": False
        }

        # Count test files
        test_files = list(path.glob("test_*.py")) + list(path.glob("**/*test*.py")) + list(path.glob("tests/**/*.py"))
        testing["test_files"] = len(test_files)
        testing["has_tests"] = testing["test_files"] > 0

        # Check for testing frameworks
        for test_file in test_files[:5]:  # Check first 5 files
            try:
                with open(test_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if "pytest" in content or "import pytest" in content:
                        testing["has_pytest"] = True
                    if "unittest" in content or "import unittest" in content:
                        testing["has_unittest"] = True
            except Exception:
                continue

        return testing

    def _calculate_health_score(self, analysis: Dict[str, Any]) -> int:
        """Calculate overall health score."""
        score = 0

        # Structure (20 points)
        structure = analysis.get("structure", {})
        if structure.get("has_src"): score += 5
        if structure.get("has_tests"): score += 5
        if structure.get("has_docs"): score += 5
        if structure.get("has_ci"): score += 5

        # Dependencies (15 points)
        deps = analysis.get("dependencies", {})
        if deps.get("has_pyproject"): score += 5
        if deps.get("fastmcp_version"): score += 10

        # MCP Compliance (30 points)
        compliance = analysis.get("mcp_compliance", {})
        if compliance.get("has_fastmcp"): score += 10
        if compliance.get("has_mcp_server"): score += 10
        if compliance.get("has_tools"): score += 10

        # Documentation (15 points)
        docs = analysis.get("documentation", {})
        if docs.get("has_readme"): score += 5
        if docs.get("has_docs_dir"): score += 5
        if docs.get("readme_lines", 0) > 50: score += 5

        # Testing (10 points)
        testing = analysis.get("testing", {})
        if testing.get("has_tests"): score += 5
        if testing.get("has_pytest"): score += 5

        # Quality (10 points)
        quality = analysis.get("code_quality")
        if quality:
            score += min(10, quality.get("complexity_score", 0) // 10)

        return min(100, score)

    def _generate_recommendations(self, analysis: Dict[str, Any]) -> List[str]:
        """Generate improvement recommendations."""
        recommendations = []

        structure = analysis.get("structure", {})
        if not structure.get("has_src"):
            recommendations.append("Consider organizing code in a 'src' directory")
        if not structure.get("has_tests"):
            recommendations.append("Add comprehensive test suite")
        if not structure.get("has_ci"):
            recommendations.append("Set up CI/CD pipeline")

        compliance = analysis.get("mcp_compliance", {})
        if not compliance.get("has_fastmcp"):
            recommendations.append("Upgrade to FastMCP 2.13.1+")
        if not compliance.get("has_tools"):
            recommendations.append("Add MCP tools to your server")

        deps = analysis.get("dependencies", {})
        if not deps.get("has_pyproject"):
            recommendations.append("Create pyproject.toml for modern Python packaging")

        docs = analysis.get("documentation", {})
        if not docs.get("has_readme"):
            recommendations.append("Add comprehensive README.md")

        return recommendations