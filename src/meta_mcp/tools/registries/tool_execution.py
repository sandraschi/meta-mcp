from typing import Any, Dict, List, Optional
from fastmcp import FastMCP
from meta_mcp.services.tool_service import ToolService


def register_tool_execution_tools(mcp: FastMCP):
    """Register tool execution tool suite with FastMCP."""

    service = ToolService()

    @mcp.tool(name="execute_server_tool")
    async def execute_server_tool(server_id: str, tool_name: str, parameters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Execute a tool on a running MCP server.

        Args:
            server_id: Unique identifier of the MCP server
            tool_name: Name of the tool to execute
            parameters: Parameters to pass to the tool

        Returns:
            Tool execution result
        """
        return await service.execute_tool(server_id, tool_name, parameters or {})

    @mcp.tool(name="list_server_tools")
    async def list_server_tools(server_id: str) -> Dict[str, Any]:
        """List all tools available on a specific MCP server.

        Args:
            server_id: Unique identifier of the MCP server

        Returns:
            List of available tools with their descriptions
        """
        return await service.list_server_tools(server_id)

    @mcp.tool(name="validate_tool_parameters")
    async def validate_tool_parameters(server_id: str, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Validate parameters for a tool execution.

        Args:
            server_id: Unique identifier of the MCP server
            tool_name: Name of the tool to validate
            parameters: Parameters to validate

        Returns:
            Validation result with any errors
        """
        return await service.validate_tool_parameters(server_id, tool_name, parameters)

    @mcp.tool(name="get_tool_execution_history")
    async def get_tool_execution_history(server_id: str, tool_name: Optional[str] = None, limit: int = 10) -> Dict[str, Any]:
        """Get execution history for tools on a server.

        Args:
            server_id: Unique identifier of the MCP server
            tool_name: Optional tool name to filter by
            limit: Maximum number of history entries to return

        Returns:
            Tool execution history
        """
        return await service.get_tool_history(server_id, tool_name, limit)