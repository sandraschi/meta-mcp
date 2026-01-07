from typing import Any, Dict, Optional, Union
from fastmcp import FastMCP
from meta_mcp.services.analysis_service import AnalysisService


def register_analysis_tools(mcp: FastMCP):
    """Register analysis tool suite with FastMCP."""

    service = AnalysisService()

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
