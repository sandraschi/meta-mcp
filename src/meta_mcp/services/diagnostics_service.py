from typing import Any, Dict, Optional
from meta_mcp.services.base import MetaMCPService
from meta_mcp.services.emoji_buster import EmojiBuster
from meta_mcp.services.powershell_validator import PowerShellSyntaxValidator
from meta_mcp.services.powershell_profile_manager import PowerShellProfileManager


class DiagnosticsService(MetaMCPService):
    """
    Unified diagnostics orchestrator for Meta MCP.
    Consolidates Unicode safety, PowerShell validation, and project health.
    """

    def __init__(self):
        super().__init__()
        self.emoji_buster = EmojiBuster()
        self.ps_validator = PowerShellSyntaxValidator()
        self.ps_profile_manager = PowerShellProfileManager()

    async def run_emojibuster(
        self, operation: str, repo_path: str, **kwargs
    ) -> Dict[str, Any]:
        """Orchestrate EmojiBuster operations."""
        if operation == "scan":
            return await self.emoji_buster.scan_repository(
                repo_path, kwargs.get("scan_mode", "comprehensive")
            )
        elif operation == "fix":
            return await self.emoji_buster.fix_unicode_logging(
                repo_path, kwargs.get("backup", True)
            )
        return self.create_response(False, f"Unsupported operation: {operation}")

    async def run_powershell_tools(
        self, operation: str, repo_path: Optional[str] = None, **kwargs
    ) -> Dict[str, Any]:
        """Orchestrate PowerShell diagnostic tools."""
        if operation == "validate" and repo_path:
            return await self.ps_validator.scan_repository(
                repo_path, kwargs.get("scan_mode", "comprehensive")
            )
        elif operation == "profile":
            return await self.ps_profile_manager.create_profile(
                enable_aliases=kwargs.get("include_aliases", True),
                enable_error_handling=True,
                obscure_location=True,
            )
        return self.create_response(False, f"Unsupported operation: {operation}")
