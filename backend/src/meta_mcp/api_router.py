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

# Create router
router = APIRouter(prefix="/api/v1", tags=["mcp-tools"])

# Initialize services
diagnostics = DiagnosticsService()
analysis = AnalysisService()
discovery = DiscoveryService()
scaffolding = ScaffoldingService()


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
        }

        # Determine overall status
        all_healthy = all(
            service.get("healthy", False) for service in health_data.values()
        )

        return {
            "success": all_healthy,
            "message": "System health check completed",
            "data": health_data,
            "timestamp": "2026-01-18T12:00:00Z",  # Should use datetime.now() in real implementation
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
        }

        return {
            "success": True,
            "message": "Available tools retrieved successfully",
            "data": tools,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tool listing failed: {str(e)}")
