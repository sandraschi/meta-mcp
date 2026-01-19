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

    async def discover_servers_api(
        self, operation: str, client_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """Discover MCP servers with operation-based interface."""
        try:
            if operation == "scan":
                result = await self.discover_servers()
                return self.create_response(
                    True, "Server discovery completed", {"servers": result}
                )
            elif operation == "list":
                result = await self.discover_servers()
                return self.create_response(
                    True, "Server list retrieved", {"servers": result}
                )
            else:
                return self.create_response(
                    False, f"Unsupported operation: {operation}"
                )
        except Exception as e:
            return self.create_response(False, f"Server discovery failed: {str(e)}")

    async def check_client_integration(
        self, operation: str, client_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """Check client integration status."""
        try:
            if operation == "check":
                # Check all clients or specific client
                clients_to_check = [
                    "claude",
                    "cursor",
                    "windsurf",
                    "zed",
                    "antigravity",
                ]
                if client_type:
                    clients_to_check = [client_type]

                results = {}
                for client in clients_to_check:
                    try:
                        result = await self.check_integration(client)
                        results[client] = result
                    except Exception as e:
                        results[client] = {"error": str(e)}

                return self.create_response(
                    True, "Client integration check completed", {"clients": results}
                )
            elif operation == "diagnose":
                # More detailed diagnosis
                if not client_type:
                    return self.create_response(
                        False, "diagnose operation requires client_type parameter"
                    )

                result = await self.check_integration(client_type)
                return self.create_response(
                    True,
                    f"Diagnosis completed for {client_type}",
                    {"diagnosis": result},
                )
            else:
                return self.create_response(
                    False, f"Unsupported operation: {operation}"
                )
        except Exception as e:
            return self.create_response(
                False, f"Client integration check failed: {str(e)}"
            )
