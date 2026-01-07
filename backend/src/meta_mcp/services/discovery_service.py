from typing import Any, Dict, List, Optional
from meta_mcp.services.base import MetaMCPService
from meta_mcp.tools.discovery import discover_servers
from meta_mcp.tools.client_integration import check_client_integration


class DiscoveryService(MetaMCPService):
    """
    Service for discovering MCP servers and auditing client integrations.
    """

    async def discover_servers(
        self, discovery_paths: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """Discover MCP servers on the system."""
        return await discover_servers(discovery_paths)

    async def check_integration(self, ide_name: str) -> Dict[str, Any]:
        """Audit client integration status for a specific IDE."""
        # Note: check_client_integration in tools/client_integration.py does the heavy lifting
        return await check_client_integration(ide_name)
