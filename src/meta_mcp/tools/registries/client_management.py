from typing import Any, Dict, List
from fastmcp import FastMCP
from meta_mcp.services.client_settings_manager import ClientSettingsManager


def register_client_management_tools(mcp: FastMCP):
    """Register client management tool suite with FastMCP."""

    service = ClientSettingsManager()

    @mcp.tool(name="read_client_config")
    async def read_client_config(client_name: str) -> Dict[str, Any]:
        """Read MCP configuration for a specific client.

        Args:
            client_name: Name of the client (claude, cursor, windsurf, zed, antigravity)

        Returns:
            Client configuration and MCP servers
        """
        return await service.read_client_config(client_name)

    @mcp.tool(name="update_client_config")
    async def update_client_config(client_name: str, updates: Dict[str, Any], backup: bool = True) -> Dict[str, Any]:
        """Update MCP configuration for a specific client.

        Args:
            client_name: Name of the client to update
            updates: Configuration updates to apply
            backup: Whether to create a backup before updating

        Returns:
            Update status and backup information
        """
        return await service.update_client_config(client_name, updates, backup)

    @mcp.tool(name="add_server_to_client")
    async def add_server_to_client(client_name: str, server_name: str, server_config: Dict[str, Any]) -> Dict[str, Any]:
        """Add an MCP server to a client's configuration.

        Args:
            client_name: Name of the client
            server_name: Name for the server entry
            server_config: Server configuration (command, args, env, etc.)

        Returns:
            Server addition status
        """
        return await service.add_server_to_client(client_name, server_name, server_config)

    @mcp.tool(name="remove_server_from_client")
    async def remove_server_from_client(client_name: str, server_name: str) -> Dict[str, Any]:
        """Remove an MCP server from a client's configuration.

        Args:
            client_name: Name of the client
            server_name: Name of the server to remove

        Returns:
            Server removal status
        """
        return await service.remove_server_from_client(client_name, server_name)

    @mcp.tool(name="validate_client_config")
    async def validate_client_config(client_name: str) -> Dict[str, Any]:
        """Validate a client's MCP configuration.

        Args:
            client_name: Name of the client to validate

        Returns:
            Validation results with errors and warnings
        """
        return await service.validate_client_config(client_name)

    @mcp.tool(name="list_client_configs")
    async def list_client_configs() -> Dict[str, Any]:
        """List all available MCP client configurations.

        Returns:
            List of client configurations with status
        """
        return await service.list_client_configs()