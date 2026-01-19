from typing import Any, Dict
from fastmcp import FastMCP
from meta_mcp.services.repo_scanner_service import RepoScannerService


def register_repository_analysis_tools(mcp: FastMCP):
    """Register repository analysis tool suite with FastMCP."""

    service = RepoScannerService()

    @mcp.tool(name="scan_repository_deep")
    async def scan_repository_deep(repo_path: str, deep_analysis: bool = False) -> Dict[str, Any]:
        """Perform comprehensive repository analysis.

        Analyzes repository structure, dependencies, MCP compliance,
        code quality, documentation, and testing setup.

        Args:
            repo_path: Path to the repository to analyze
            deep_analysis: Whether to perform detailed code quality analysis

        Returns:
            Comprehensive repository analysis report
        """
        return await service.scan_repository(repo_path, deep_analysis)