"""
Service for handling MCP server configuration.
"""

import json
from pathlib import Path
from typing import Dict, List, Optional, TypedDict


class MCPServerConfig(TypedDict):
    """TypedDict for MCP server configuration."""

    command: str
    args: List[str]
    cwd: Optional[str]
    env: Optional[Dict[str, str]]


class ConfigService:
    """Service for managing MCP server configurations."""

    def __init__(self, config_path: Optional[str] = None):
        if config_path:
            self.config_path = Path(config_path)
        else:
            self.config_path = (
                Path.home()
                / "AppData"
                / "Roaming"
                / "Claude"
                / "claude_desktop_config.json"
            )

        self._config: Dict[str, MCPServerConfig] = {}
        self.refresh()

    def refresh(self) -> None:
        """Load the MCP server configuration from the config file."""
        try:
            if not self.config_path.exists():
                return

            with open(self.config_path, "r", encoding="utf-8") as f:
                config_data = json.load(f)

            self._config = config_data.get("mcpServers", {})
        except Exception:
            self._config = {}

    def get_server_config(self, server_id: str) -> Optional[MCPServerConfig]:
        return self._config.get(server_id)

    def get_all_servers(self) -> Dict[str, MCPServerConfig]:
        return self._config.copy()
