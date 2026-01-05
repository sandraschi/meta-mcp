"""
Client Integration Diagnostics for MCP Servers.

This module provides tools to verify if an MCP server is correctly configured
and starting up in various IDE clients (Antigravity, Claude, Windsurf, etc.).
"""

import json
import re
import time
from pathlib import Path
from typing import Any, Dict

import structlog
from meta_mcp.tools import tool

logger = structlog.get_logger(__name__)


def load_json_with_comments(file_path: Path) -> Dict[str, Any]:
    """Load JSON file, stripping single-line comments."""
    if not file_path.exists():
        return {}

    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    # Strip // style comments
    clean_lines = []
    for line in lines:
        # Simple comment stripping
        comment_index = line.find("//")
        if comment_index != -1:
            line = line[:comment_index]
        clean_lines.append(line)

    content = "".join(clean_lines).strip()
    if not content:
        return {}

    return json.loads(content)


# IDE Client Configurations
CLIENT_CONFIGS = {
    "antigravity": {
        "name": "Antigravity",
        "config_path": Path.home() / ".gemini" / "antigravity" / "mcp_config.json",
        "log_dir": Path.home() / ".gemini" / "antigravity" / "logs",
        "log_pattern": "mcp-server-{name}.log",
    },
    "claude": {
        "name": "Claude Desktop",
        "config_path": Path.home()
        / "AppData"
        / "Roaming"
        / "Claude"
        / "claude_desktop_config.json",
        "log_dir": Path.home() / "AppData" / "Roaming" / "Claude" / "logs",
        "log_pattern": "mcp-server-{name}.log",
    },
    "windsurf": {
        "name": "Windsurf",
        "config_path": Path.home()
        / "AppData"
        / "Roaming"
        / "Windsurf"
        / "mcp_config.json",
        "log_dir": Path.home() / "AppData" / "Roaming" / "Windsurf" / "logs",
        "log_pattern": "mcp-server-{name}.log",
    },
    "cursor": {
        "name": "Cursor",
        "config_path": Path.home()
        / "AppData"
        / "Roaming"
        / "Cursor"
        / "User"
        / "globalStorage"
        / "cursor-storage"
        / "mcp_config.json",
        "log_dir": Path.home() / "AppData" / "Roaming" / "Cursor" / "logs",
        "log_pattern": "mcp-server-{name}.log",
    },
    "zed": {
        "name": "Zed",
        "config_path": Path.home() / "AppData" / "Roaming" / "Zed" / "settings.json",
        "log_dir": Path.home() / "AppData" / "Local" / "Zed" / "logs",
        "log_pattern": "mcp-server-{name}.log",
    },
}

# Startup Success Signatures
SUCCESS_SIGNATURES = [
    r"Message from server:",
    r"Tool Registration Success",
    r"JSON-RPC server listening",
    r"Initialized MCP server",
    r"Registering tools",
    r"Registering tool",
    r"server_started",
]


@tool(
    name="check_client_integration",
    description="Check if an MCP server is configured and starting in IDE clients.",
    tags=["diagnostics", "client", "integration"],
)
async def check_client_integration(server_name: str) -> Dict[str, Any]:
    """
    Check if a specific MCP server is integrated with known IDE clients.

    Checks:
    1. 'Config in Antigravity': Is it in mcp_config.json?
    2. 'Starts in Antigravity': Are there successful startup logs?
    (And analogous checks for Claude, Windsurf, etc.)

    Args:
        server_name: The name of the server to check (e.g., 'meta-mcp')

    Returns:
        Structured report of client integration status
    """
    report = {
        "server_name": server_name,
        "clients": {},
        "timestamp": time.time(),
        "summary": "",
    }

    configured_clients = []
    starting_clients = []

    for clientid, clientinfo in CLIENT_CONFIGS.items():
        client_name = clientinfo["name"]
        status = {
            "is_configured": False,
            "is_starting": False,
            "config_file": str(clientinfo["config_path"]),
            "log_file": None,
            "errors": [],
        }

        # 1. Check Configuration
        try:
            if clientinfo["config_path"].exists():
                config = load_json_with_comments(clientinfo["config_path"])

                # Check for server in config (handle different structures for Zed vs others)
                is_configured = False
                if clientid == "zed":
                    # Zed's settings.json uses 'context_servers'
                    if "context_servers" in config:
                        is_configured = server_name in config["context_servers"]
                else:
                    if "mcpServers" in config:
                        is_configured = server_name in config["mcpServers"]

                status["is_configured"] = is_configured
                if is_configured:
                    configured_clients.append(client_name)
        except Exception as e:
            status["errors"].append(f"Config check failed: {str(e)}")

        # 2. Check Startup (Logs)
        if status["is_configured"]:
            try:
                log_dir = clientinfo["log_dir"]
                if log_dir.exists():
                    # Handle Zed's centralized log vs others' per-server logs
                    if clientid == "zed":
                        log_path = log_dir / "Zed.log"
                        if log_path.exists():
                            status["log_file"] = str(log_path)
                            with open(
                                log_path, "r", encoding="utf-8", errors="replace"
                            ) as f:
                                f.seek(0, 2)
                                pos = max(0, f.tell() - 20000)  # Zed log can be large
                                f.seek(pos)
                                recent_logs = f.read()

                                # Zed success pattern: "Started {server_name} context server"
                                success_pattern = (
                                    f"Started {server_name} context server"
                                )
                                if success_pattern.lower() in recent_logs.lower():
                                    status["is_starting"] = True
                                    starting_clients.append(client_name)
                    else:
                        # Look for server-specific log file
                        log_file_name = clientinfo["log_pattern"].format(
                            name=server_name
                        )
                        log_path = log_dir / log_file_name

                        if not log_path.exists():
                            # Try case-insensitive or partial match
                            for entry in log_dir.iterdir():
                                if (
                                    server_name.lower() in entry.name.lower()
                                    and entry.suffix == ".log"
                                ):
                                    log_path = entry
                                    break

                        if log_path.exists():
                            status["log_file"] = str(log_path)
                            # Read recent log lines
                            with open(
                                log_path, "r", encoding="utf-8", errors="replace"
                            ) as f:
                                # Read last 10000 chars for efficiency
                                f.seek(0, 2)
                                pos = max(0, f.tell() - 10000)
                                f.seek(pos)
                                recent_logs = f.read()

                                # Check for success signatures
                                for signature in SUCCESS_SIGNATURES:
                                    if re.search(signature, recent_logs, re.IGNORECASE):
                                        status["is_starting"] = True
                                        starting_clients.append(client_name)
                                        break
            except Exception as e:
                status["errors"].append(f"Startup check failed: {str(e)}")

        report["clients"][clientid] = status

    # Generate summary
    if not configured_clients:
        report["summary"] = (
            f"Server '{server_name}' is not configured in any detected client."
        )
    else:
        conf_str = ", ".join(configured_clients)
        if not starting_clients:
            report["summary"] = (
                f"Server '{server_name}' is configured in {conf_str} but no successful startup was detected in logs."
            )
        else:
            start_str = ", ".join(starting_clients)
            report["summary"] = (
                f"Server '{server_name}' is configured in {conf_str} and successfully started in {start_str}."
            )

    return report
