#!/usr/bin/env python3
"""
Ultra-minimal Meta MCP server to isolate timeout issue.
No complex imports, just basic FastMCP setup.
"""

import asyncio
import logging
from pathlib import Path

from fastmcp import FastMCP

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastMCP with minimal configuration
app = FastMCP("MetaMCP-Minimal")

@app.tool()
async def test_tool() -> str:
    """Simple test tool."""
    logger.info("TEST_TOOL: Called successfully")
    return "Meta MCP minimal test tool working!"

@app.tool()
async def help() -> str:
    """Get help information about MetaMCP."""
    return """
# MetaMCP - Minimal Test Version

This is a minimal test version to isolate timeout issues.

Available Tools:
- test_tool: Simple test tool
- help: This help message

If you can see this, Meta MCP is working!
"""

async def main():
    """Ultra-minimal main function."""
    logger.info("Starting ultra-minimal Meta MCP server")
    logger.info("FastMCP app initialized")
    logger.info("Tools registered: test_tool, help")
    logger.info("Ready to start app.run()")
    app.run()

if __name__ == "__main__":
    main()
