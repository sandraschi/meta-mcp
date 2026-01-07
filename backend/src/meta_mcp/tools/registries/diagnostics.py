from typing import Any, Dict, Optional
from fastmcp import FastMCP, Context
from meta_mcp.services.diagnostics_service import DiagnosticsService


def register_diagnostics_tools(mcp: FastMCP):
    """Register diagnostic tool suite with FastMCP."""

    service = DiagnosticsService()

    @mcp.tool(name="emojibuster")
    async def emojibuster(
        operation: str,
        repo_path: str = "*",
        scan_mode: str = "comprehensive",
        auto_fix: bool = False,
        backup: bool = True,
        ctx: Optional[Context] = None,
    ) -> Dict[str, Any]:
        """SOTA EmojiBuster for Unicode crash prevention."""
        if operation == "fix" and not auto_fix:
            return service.create_response(
                False, "Auto-fix requires confirmation. Set auto_fix=True."
            )

        return await service.run_emojibuster(
            operation, repo_path, scan_mode=scan_mode, backup=backup
        )

    @mcp.tool(name="powershell_tools")
    async def powershell_tools(
        operation: str,
        repo_path: Optional[str] = None,
        scan_mode: str = "comprehensive",
        include_aliases: bool = True,
    ) -> Dict[str, Any]:
        """PowerShell management and validation tool."""
        return await service.run_powershell_tools(
            operation, repo_path, scan_mode=scan_mode, include_aliases=include_aliases
        )
