#!/usr/bin/env python3
"""
MetaMCP REST API Router - Exposes MCP tools via HTTP endpoints.

Provides webapp-accessible REST API for all MCP tool operations.
"""

from typing import Any, Dict, Optional
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field

# Import service classes
from meta_mcp.services.diagnostics_service import DiagnosticsService
from meta_mcp.services.analysis_service import AnalysisService
from meta_mcp.services.discovery_service import DiscoveryService
from meta_mcp.services.scaffolding_service import ScaffoldingService
from meta_mcp.services.server_service import ServerService
from meta_mcp.services.tool_service import ToolService
from meta_mcp.services.repo_scanner_service import RepoScannerService
from meta_mcp.services.client_settings_manager import ClientSettingsManager

# Create router
router = APIRouter(prefix="/api/v1", tags=["mcp-tools"])

# Initialize services
diagnostics = DiagnosticsService()
analysis = AnalysisService()
discovery = DiscoveryService()
scaffolding = ScaffoldingService()
server_service = ServerService()
tool_service = ToolService()
repo_scanner = RepoScannerService()
client_manager = ClientSettingsManager()


# Request/Response Models
class ToolRequest(BaseModel):
    """Base model for tool requests."""

    operation: str = Field(..., description="Tool operation to perform")
    repo_path: Optional[str] = Field(None, description="Repository path for operations")


class EmojiBusterRequest(ToolRequest):
    """Request model for EmojiBuster operations."""

    scan_mode: str = Field(
        "comprehensive", description="Scan mode: basic, comprehensive, or thorough"
    )
    auto_fix: bool = Field(False, description="Whether to automatically fix issues")
    backup: bool = Field(True, description="Whether to create backups before fixing")


class PowerShellRequest(ToolRequest):
    """Request model for PowerShell operations."""

    scan_mode: str = Field("comprehensive", description="Scan mode")
    include_aliases: bool = Field(True, description="Include alias validation")


class RuntAnalyzerRequest(ToolRequest):
    """Request model for Runt Analyzer operations."""

    scan_mode: str = Field("comprehensive", description="Analysis depth")
    include_dependencies: bool = Field(True, description="Include dependency analysis")


class DiscoveryRequest(BaseModel):
    """Request model for Discovery operations."""

    operation: str = Field(..., description="Discovery operation")
    client_type: Optional[str] = Field(None, description="Client type filter")


class ScaffoldingRequest(BaseModel):
    """Request model for Scaffolding operations."""

    template_type: str = Field(
        ..., description="Template type: mcp_server, landing_page, fullstack, etc."
    )
    project_name: str = Field(..., description="Name of the project to create")
    output_path: str = Field(..., description="Output directory path")
    features: Optional[Dict[str, Any]] = Field(
        None, description="Additional features/configuration"
    )


# API Endpoints


@router.post(
    "/diagnostics/emojibuster", summary="Run EmojiBuster Unicode Safety Scanner"
)
async def run_emojibuster(
    request: EmojiBusterRequest, background_tasks: BackgroundTasks
):
    """Execute EmojiBuster operations for Unicode crash prevention."""
    try:
        result = await diagnostics.run_emojibuster(
            operation=request.operation,
            repo_path=request.repo_path or "*",
            scan_mode=request.scan_mode,
            auto_fix=request.auto_fix,
            backup=request.backup,
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"EmojiBuster operation failed: {str(e)}"
        )


@router.post("/diagnostics/powershell", summary="Run PowerShell Validation Tools")
async def run_powershell_tools(request: PowerShellRequest):
    """Execute PowerShell validation and management operations."""
    try:
        result = await diagnostics.run_powershell_tools(
            operation=request.operation,
            repo_path=request.repo_path,
            scan_mode=request.scan_mode,
            include_aliases=request.include_aliases,
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"PowerShell operation failed: {str(e)}"
        )


@router.post("/analysis/runt-analyzer", summary="Run Repository Health Analysis")
async def run_runt_analyzer(request: RuntAnalyzerRequest):
    """Execute repository health and SOTA compliance analysis."""
    try:
        result = await analysis.run_runt_analyzer(
            operation=request.operation,
            repo_path=request.repo_path or ".",
            scan_mode=request.scan_mode,
            include_dependencies=request.include_dependencies,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Runt analyzer failed: {str(e)}")


@router.post("/analysis/repo-status", summary="Get Detailed Repository Status")
async def get_repo_status(request: ToolRequest):
    """Get comprehensive repository health and status information."""
    try:
        result = await analysis.get_repo_status(
            repo_path=request.repo_path or ".", operation=request.operation
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Repository status check failed: {str(e)}"
        )


@router.post("/discovery/servers", summary="Discover MCP Servers")
async def discover_servers(request: DiscoveryRequest):
    """Discover and analyze MCP servers across the system."""
    try:
        result = await discovery.discover_servers_api(
            operation=request.operation, client_type=request.client_type
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Server discovery failed: {str(e)}"
        )


@router.post("/discovery/client-integration", summary="Check Client Integration Status")
async def check_client_integration(request: DiscoveryRequest):
    """Check MCP client integration health across IDEs."""
    try:
        result = await discovery.check_client_integration(
            operation=request.operation, client_type=request.client_type
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Client integration check failed: {str(e)}"
        )


@router.post("/scaffolding/create", summary="Create Project Scaffolding")
async def create_scaffolding(
    request: ScaffoldingRequest, background_tasks: BackgroundTasks
):
    """Generate project scaffolding based on templates."""
    try:
        result = await scaffolding.create_project(
            template_type=request.template_type,
            project_name=request.project_name,
            output_path=request.output_path,
            features=request.features or {},
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Scaffolding creation failed: {str(e)}"
        )


@router.get("/health/detailed", summary="Get Detailed System Health")
async def get_detailed_health():
    """Get comprehensive system health information."""
    try:
        # Get health from all services
        health_data = {
            "diagnostics": await diagnostics.get_health_status(),
            "analysis": await analysis.get_health_status(),
            "discovery": await discovery.get_health_status(),
            "scaffolding": await scaffolding.get_health_status(),
            "server_management": await server_service.get_health_status(),
            "tool_execution": await tool_service.get_health_status(),
            "repository_analysis": await repo_scanner.get_health_status(),
            "client_management": await client_manager.get_health_status(),
        }

        # Determine overall status
        all_healthy = all(
            service.get("healthy", False) for service in health_data.values()
        )

        return {
            "success": all_healthy,
            "message": "System health check completed",
            "data": health_data,
            "timestamp": "2026-01-19T03:00:00Z",
            "services_count": len(health_data),
            "healthy_services": sum(1 for s in health_data.values() if s.get("healthy", False)),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")


@router.get("/tools/list", summary="List Available MCP Tools")
async def list_available_tools():
    """Get a comprehensive list of all available MCP tools."""
    try:
        tools = {
            "diagnostics": {
                "emojibuster": {
                    "description": "Unicode safety scanner and fixer",
                    "operations": ["scan", "fix"],
                    "parameters": ["repo_path", "scan_mode", "auto_fix", "backup"],
                },
                "powershell_tools": {
                    "description": "PowerShell validation and management",
                    "operations": ["validate", "profile"],
                    "parameters": ["repo_path", "scan_mode", "include_aliases"],
                },
            },
            "analysis": {
                "runt_analyzer": {
                    "description": "Repository health and SOTA compliance",
                    "operations": ["analyze", "status"],
                    "parameters": ["repo_path", "scan_mode", "include_dependencies"],
                },
                "repo_status": {
                    "description": "Detailed repository status",
                    "operations": ["status", "health"],
                    "parameters": ["repo_path"],
                },
            },
            "discovery": {
                "servers": {
                    "description": "MCP server discovery",
                    "operations": ["scan", "list"],
                    "parameters": ["client_type"],
                },
                "client_integration": {
                    "description": "Client integration health",
                    "operations": ["check", "diagnose"],
                    "parameters": ["client_type"],
                },
            },
            "scaffolding": {
                "create": {
                    "description": "Project scaffolding generation",
                    "operations": [
                        "mcp_server",
                        "landing_page",
                        "fullstack",
                        "webshop",
                        "game",
                        "wisdom_tree",
                    ],
                    "parameters": [
                        "template_type",
                        "project_name",
                        "output_path",
                        "features",
                    ],
                }
            },
            "server_management": {
                "start_server": {
                    "description": "Start MCP server processes",
                    "operations": ["start"],
                    "parameters": ["server_path", "server_type"],
                },
                "stop_server": {
                    "description": "Stop running MCP servers",
                    "operations": ["stop"],
                    "parameters": ["server_id"],
                },
                "list_servers": {
                    "description": "List running MCP servers",
                    "operations": ["list"],
                    "parameters": [],
                },
                "server_status": {
                    "description": "Get server status and health",
                    "operations": ["status"],
                    "parameters": ["server_id"],
                },
            },
            "tool_execution": {
                "execute_tool": {
                    "description": "Execute tools on MCP servers",
                    "operations": ["execute"],
                    "parameters": ["server_id", "tool_name", "parameters"],
                },
                "list_server_tools": {
                    "description": "List tools available on servers",
                    "operations": ["list"],
                    "parameters": ["server_id"],
                },
                "validate_parameters": {
                    "description": "Validate tool parameters",
                    "operations": ["validate"],
                    "parameters": ["server_id", "tool_name", "parameters"],
                },
                "tool_history": {
                    "description": "Get tool execution history",
                    "operations": ["history"],
                    "parameters": ["server_id", "tool_name", "limit"],
                },
            },
            "repository_analysis": {
                "scan_repository": {
                    "description": "Deep repository analysis",
                    "operations": ["scan"],
                    "parameters": ["repo_path", "deep_analysis"],
                },
            },
            "client_management": {
                "read_config": {
                    "description": "Read client MCP configuration",
                    "operations": ["read"],
                    "parameters": ["client_name"],
                },
                "update_config": {
                    "description": "Update client MCP configuration",
                    "operations": ["update"],
                    "parameters": ["client_name", "updates", "backup"],
                },
                "add_server": {
                    "description": "Add server to client config",
                    "operations": ["add"],
                    "parameters": ["client_name", "server_name", "server_config"],
                },
                "remove_server": {
                    "description": "Remove server from client config",
                    "operations": ["remove"],
                    "parameters": ["client_name", "server_name"],
                },
                "validate_config": {
                    "description": "Validate client configuration",
                    "operations": ["validate"],
                    "parameters": ["client_name"],
                },
                "list_configs": {
                    "description": "List all client configurations",
                    "operations": ["list"],
                    "parameters": [],
                },
            },
        }

        return {
            "success": True,
            "message": "Available tools retrieved successfully",
            "data": tools,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tool listing failed: {str(e)}")


# Server Management Endpoints
@router.post("/servers/start", summary="Start MCP Server")
async def start_server(server_path: str, server_type: str = "python"):
    """Start an MCP server process."""
    result = await server_service.start_server(server_path, server_type)
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("message"))
    return result


@router.post("/servers/stop", summary="Stop MCP Server")
async def stop_server(server_id: str):
    """Stop a running MCP server."""
    result = await server_service.stop_server(server_id)
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("message"))
    return result


@router.get("/servers/list", summary="List Running Servers")
async def list_running_servers():
    """List all currently running MCP servers."""
    return await server_service.list_running_servers()


@router.get("/servers/{server_id}/status", summary="Get Server Status")
async def get_server_status(server_id: str):
    """Get detailed status of a specific server."""
    result = await server_service.get_server_status(server_id)
    if not result.get("success"):
        raise HTTPException(status_code=404, detail=result.get("message"))
    return result


# Tool Execution Endpoints
@router.post("/tools/execute", summary="Execute Tool on Server")
async def execute_tool(server_id: str, tool_name: str, parameters: Optional[Dict[str, Any]] = None):
    """Execute a tool on a specific MCP server."""
    result = await tool_service.execute_tool(server_id, tool_name, parameters or {})
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("message"))
    return result


@router.get("/servers/{server_id}/tools", summary="List Server Tools")
async def list_server_tools(server_id: str):
    """List all tools available on a specific server."""
    result = await tool_service.list_server_tools(server_id)
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("message"))
    return result


@router.post("/tools/validate", summary="Validate Tool Parameters")
async def validate_tool_parameters(server_id: str, tool_name: str, parameters: Dict[str, Any]):
    """Validate parameters for a tool execution."""
    result = await tool_service.validate_tool_parameters(server_id, tool_name, parameters)
    return result


@router.get("/tools/history", summary="Get Tool Execution History")
async def get_tool_history(server_id: str, tool_name: Optional[str] = None, limit: int = 10):
    """Get execution history for tools on a server."""
    result = await tool_service.get_tool_history(server_id, tool_name, limit)
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("message"))
    return result


# Repository Analysis Endpoints
@router.post("/repos/scan", summary="Scan Repository")
async def scan_repository(repo_path: str, deep_analysis: bool = False):
    """Perform comprehensive repository analysis."""
    result = await repo_scanner.scan_repository(repo_path, deep_analysis)
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("message"))
    return result


# Client Management Endpoints
@router.get("/clients/{client_name}/config", summary="Read Client Config")
async def read_client_config(client_name: str):
    """Read MCP configuration for a specific client."""
    result = await client_manager.read_client_config(client_name)
    if not result.get("success"):
        raise HTTPException(status_code=404, detail=result.get("message"))
    return result


@router.post("/clients/{client_name}/config", summary="Update Client Config")
async def update_client_config(client_name: str, updates: Dict[str, Any], backup: bool = True):
    """Update MCP configuration for a specific client."""
    result = await client_manager.update_client_config(client_name, updates, backup)
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("message"))
    return result


@router.post("/clients/{client_name}/servers", summary="Add Server to Client")
async def add_server_to_client(client_name: str, server_name: str, server_config: Dict[str, Any]):
    """Add an MCP server to a client's configuration."""
    result = await client_manager.add_server_to_client(client_name, server_name, server_config)
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("message"))
    return result


@router.delete("/clients/{client_name}/servers/{server_name}", summary="Remove Server from Client")
async def remove_server_from_client(client_name: str, server_name: str):
    """Remove an MCP server from a client's configuration."""
    result = await client_manager.remove_server_from_client(client_name, server_name)
    if not result.get("success"):
        raise HTTPException(status_code=404, detail=result.get("message"))
    return result


@router.post("/clients/{client_name}/validate", summary="Validate Client Config")
async def validate_client_config(client_name: str):
    """Validate a client's MCP configuration."""
    result = await client_manager.validate_client_config(client_name)
    return result


@router.get("/clients/configs", summary="List Client Configurations")
async def list_client_configs():
    """List all available client configurations."""
    return await client_manager.list_client_configs()
