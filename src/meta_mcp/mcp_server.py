#!/usr/bin/env python3
"""
MetaMCP - The Ultimate "Argh-Coding" Bloat-Buster.

Refactored Service-Oriented Architecture (Phase 4).
SOTA FastMCP 2.14.1+ compliant with decentralized tool registration.
"""

import sys
import os
import logging
import msvcrt
import structlog
from fastmcp import FastMCP

# Core Infrastructure
from meta_mcp.registry import MetaMCPRegistry

# Tool Registries
from meta_mcp.tools.registries.diagnostics import register_diagnostics_tools
from meta_mcp.tools.registries.analysis import register_analysis_tools
from meta_mcp.tools.registries.discovery import register_discovery_tools
from meta_mcp.tools.registries.scaffolding import register_scaffolding_tools
from meta_mcp.tools.registries.server_management import register_server_management_tools
from meta_mcp.tools.registries.tool_execution import register_tool_execution_tools
from meta_mcp.tools.registries.repository_analysis import register_repository_analysis_tools
from meta_mcp.tools.registries.client_management import register_client_management_tools

# 1. Force Binary Mode (Prevent CRLF corruption on Windows)
if os.name == "nt":
    try:
        msvcrt.setmode(sys.stdin.fileno(), os.O_BINARY)
        msvcrt.setmode(sys.stdout.fileno(), os.O_BINARY)
    except (ImportError, OSError, AttributeError):
        pass


# 2. dev-null noise cancellation (Stderr redirection only)
# FastMCP handles stdout for transport; we ensure logs go to stderr.
# We no longer redirect sys.stdout globally as it breaks binary transport.

# 3. Nuclear Logging (Stderr Only)
root = logging.getLogger()
if root.handlers:
    for handler in root.handlers:
        root.removeHandler(handler)
logging.basicConfig(level=logging.INFO, stream=sys.stderr, force=True)

# Suppress noisy loggers
for logger_name in [
    "mcp.server.lowlevel.server",
    "fastmcp",
    "uvicorn",
    "watchfiles",
    "docket",
]:
    logging.getLogger(logger_name).setLevel(logging.WARNING)

logger = structlog.get_logger(__name__)

# Initialize FastMCP with Multi-Suite Instructions
app = FastMCP(
    "MetaMCP",
    instructions="""
# MetaMCP - Complete MCP Ecosystem Orchestrator

MetaMCP provides comprehensive MCP server lifecycle management, client integration,
tool execution, and ecosystem analysis - turning MCP development into a streamlined workflow.

## Core Tool Suites

### 🔧 Server Management
- **Start/Stop Servers**: Launch and manage MCP server processes
- **Server Monitoring**: Real-time status and health monitoring
- **Process Management**: PID tracking and graceful shutdown

### ⚡ Tool Execution
- **Remote Tool Execution**: Execute tools on running MCP servers
- **Parameter Validation**: Validate tool parameters before execution
- **Execution History**: Track tool usage and performance
- **Tool Discovery**: List available tools on servers

### 🔍 Repository Analysis
- **Deep Code Analysis**: Structure, dependencies, compliance checking
- **MCP Standards Audit**: FastMCP version and best practices validation
- **Code Quality Metrics**: Complexity, documentation, testing coverage
- **Health Scoring**: Overall repository health assessment

### 🖥️ Client Management
- **Configuration Management**: Read/update MCP client configurations
- **Multi-Client Support**: Claude, Cursor, Windsurf, Zed, Antigravity
- **Server Registration**: Add/remove servers from client configs
- **Integration Validation**: Verify client-server connections

### 🏗️ Scaffolding & Generation
- **Project Templates**: Fullstack, Landing Page, MCP Server, Webshop, Game
- **Rapid Prototyping**: Generate complete projects with best practices
- **CI/CD Integration**: Automated testing and deployment setup

### 🔬 Diagnostics & Analysis
- **EmojiBuster**: Unicode safety scanning and fixing
- **PowerShell Validation**: Script analysis and compliance checking
- **Runt Analyzer**: SOTA compliance auditing and recommendations

### 🕵️ Discovery Services
- **Server Discovery**: Scan filesystem for MCP servers
- **Client Integration**: Check IDE MCP configurations
- **Health Monitoring**: Real-time system status tracking

## Advanced Features

### 🌐 Web Dashboard
- Complete web interface for all MCP operations
- Real-time monitoring and management
- Visual analytics and reporting

### 🔄 CI/CD Integration
- Automated testing pipelines
- Deployment orchestration
- Quality gate enforcement

### 📊 Analytics & Reporting
- Performance monitoring
- Usage analytics
- Compliance reporting

## Standards Compliance

- **FastMCP 2.14.1+**: Latest protocol support
- **Cross-Platform**: Windows, macOS, Linux compatibility
- **Security First**: Safe configuration management
- **Performance Optimized**: Efficient resource usage

Version: 2.0.0 (Enterprise)
    """,
    version="1.3.0",
)


def initialize_tools(mcp: FastMCP):
    """Dynamically load and register all tool suites."""
    registry = MetaMCPRegistry(mcp)

    registry.register_suite("diagnostics", register_diagnostics_tools)
    registry.register_suite("analysis", register_analysis_tools)
    registry.register_suite("discovery", register_discovery_tools)
    registry.register_suite("scaffolding", register_scaffolding_tools)
    registry.register_suite("server_management", register_server_management_tools)
    registry.register_suite("tool_execution", register_tool_execution_tools)
    registry.register_suite("repository_analysis", register_repository_analysis_tools)
    registry.register_suite("client_management", register_client_management_tools)

    logger.info(
        "MetaMCP Modular Suites Loaded Successfully",
        suites=registry.get_registered_suites(),
    )


# Register tools on startup
initialize_tools(app)


def main():
    """Main entry point for the MetaMCP server."""
    app.run()


if __name__ == "__main__":
    main()
