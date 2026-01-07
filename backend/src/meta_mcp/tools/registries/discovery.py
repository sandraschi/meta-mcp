from typing import Any, Dict, List, Optional
from fastmcp import FastMCP
from meta_mcp.services.discovery_service import DiscoveryService


def register_discovery_tools(mcp: FastMCP):
    """Register discovery tool suite with FastMCP."""

    service = DiscoveryService()

    @mcp.tool(name="discover_servers")
    async def discover_servers_tool(
        discovery_paths: Optional[List[str]] = None,
    ) -> List[Dict[str, Any]]:
        """Discover MCP servers installed on the system."""
        return await service.discover_servers(discovery_paths)

    @mcp.tool(name="check_client_integration")
    async def check_client_integration_tool(ide_name: str) -> Dict[str, Any]:
        """Audit configuration and startup status for specific IDEs."""
        return await service.check_integration(ide_name)
