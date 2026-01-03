#!/usr/bin/env python3
"""
Minimal Meta MCP test server to isolate timeout issues.
"""

import asyncio
import logging
from fastmcp import FastMCP

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastMCP with minimal configuration
app = FastMCP("MetaMCP-Test")

@app.tool()
async def test_tool() -> str:
    """Simple test tool."""
    return "Meta MCP test tool working!"

async def main():
    """Minimal main function."""
    logger.info("Starting minimal Meta MCP test server")
    app.run()

if __name__ == "__main__":
    main()
