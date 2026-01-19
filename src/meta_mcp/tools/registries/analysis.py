from typing import Any, Dict, List, Optional, Union
from fastmcp import FastMCP
from meta_mcp.services.analysis_service import AnalysisService
from meta_mcp.tools.repomix_analyzer import RepomixAnalysisService
# Import the renamed MCP repo analyzer


def register_analysis_tools(mcp: FastMCP):
    """Register analysis tool suite with FastMCP."""

    service = AnalysisService()
    repomix_service = RepomixAnalysisService()

    @mcp.tool(name="analyze_runts")
    async def analyze_runts_tool(
        scan_path: Optional[str] = None, format: str = "json"
    ) -> Union[Dict[str, Any], str]:
        """Analyze path for MCP repositories and identify runts needing upgrades."""
        return await service.analyze_repositories(scan_path=scan_path, format=format)

    @mcp.tool(name="get_repo_status")
    async def get_repo_status_tool(
        repo_path: str, format: str = "json"
    ) -> Union[Dict[str, Any], str]:
        """Get detailed SOTA status for a specific MCP repository."""
        return await service.analyze_single_repo(repo_path, format=format)

    @mcp.tool(name="analyze_with_repomix")
    async def analyze_with_repomix_tool(
        repo_path: str,
        analysis_type: str = "overview",
        include_patterns: Optional[List[str]] = None,
        exclude_patterns: Optional[List[str]] = None,
        compression_enabled: bool = True,
    ) -> Dict[str, Any]:
        """
        Analyze a repository using Repomix capabilities for comprehensive codebase insights.

        This tool leverages Repomix to pack and analyze entire repositories, providing
        deep insights into code structure, dependencies, and potential issues.

        Args:
            repo_path: Path to the repository to analyze
            analysis_type: Type of analysis - "overview", "structure", "dependencies", "security"
            include_patterns: File patterns to include (e.g., ["*.py", "*.js"])
            exclude_patterns: File patterns to exclude (e.g., ["node_modules/**"])
            compression_enabled: Use Tree-sitter compression for ~70% token reduction

        Returns:
            Comprehensive analysis results with repository insights and recommendations
        """
        return await repomix_service.analyze_with_repomix(
            repo_path=repo_path,
            analysis_type=analysis_type,
            include_patterns=include_patterns,
            exclude_patterns=exclude_patterns,
            compression_enabled=compression_enabled,
        )
