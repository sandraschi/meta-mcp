from typing import Any, Dict, Optional, Union
from meta_mcp.services.base import MetaMCPService
from meta_mcp.tools.runt_analyzer import analyze_runts, get_repo_status


class AnalysisService(MetaMCPService):
    """
    Service for analyzing repositories and identifying SOTA "runts".
    """

    async def analyze_repositories(
        self, scan_path: Optional[str] = None, format: str = "json"
    ) -> Union[Dict[str, Any], str]:
        """Analyze broad paths for MCP repositories."""
        return await analyze_runts(scan_path=scan_path, format=format)

    async def analyze_single_repo(
        self, repo_path: str, format: str = "json"
    ) -> Union[Dict[str, Any], str]:
        """Analyze a specific repository for SOTA compliance."""
        return await get_repo_status(repo_path, format=format)
