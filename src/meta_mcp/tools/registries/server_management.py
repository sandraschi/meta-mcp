from typing import Any, Dict, List, Optional
from fastmcp import FastMCP
from meta_mcp.services.server_service import ServerService


def register_server_management_tools(mcp: FastMCP):
    """Register server management tool suite with FastMCP."""

    service = ServerService()

    @mcp.tool(name="start_mcp_server")
    async def start_mcp_server(server_path: str, server_type: str = "python") -> Dict[str, Any]:
        """Start an MCP server process.

        Args:
            server_path: Path to the MCP server file
            server_type: Type of server (python, node, etc.)

        Returns:
            Server startup status and information
        """
        return await service.start_server(server_path, server_type)

    @mcp.tool(name="stop_mcp_server")
    async def stop_mcp_server(server_id: str) -> Dict[str, Any]:
        """Stop a running MCP server.

        Args:
            server_id: Unique identifier of the server to stop

        Returns:
            Server shutdown status
        """
        return await service.stop_server(server_id)

    @mcp.tool(name="list_running_servers")
    async def list_running_servers() -> Dict[str, Any]:
        """List all currently running MCP servers.

        Returns:
            List of running servers with their status
        """
        return await service.list_running_servers()

    @mcp.tool(name="get_server_status")
    async def get_server_status(server_id: str) -> Dict[str, Any]:
        """Get detailed status of a specific MCP server.

        Args:
            server_id: Unique identifier of the server

        Returns:
            Detailed server status information
        """
        return await service.get_server_status(server_id)