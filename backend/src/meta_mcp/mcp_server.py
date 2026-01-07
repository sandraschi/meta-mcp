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
# MetaMCP - Industrial-Strength Development Orchestrator

MetaMCP turns "argh-coding" moments into productive development through 
modular, service-oriented tool suites.

## core Domains
1. **Diagnostics**: Unicode safety (EmojiBuster) and PowerShell validation.
2. **Analysis**: SOTA compliance auditing (Runt Analyzer) and status tracking.
3. **Discovery**: Client integration diagnostics across multiple IDEs.
4. **Scaffolding**: Rapid project generation (Fullstack, Landing Page, MCP Server).

## New Features
- **Landing Page Preview**: Use `show_locally: True` to spin up a developer server 
  accessible on your local network/fixed IP.

## SOTA Standards
- FastMCP 2.14.1+ compliant.
- Intelligent error recovery and clarification patterns.
- Proper Pydantic model elicitation for interactive scaffolding.

Version: 1.3.0 (Modular)
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
