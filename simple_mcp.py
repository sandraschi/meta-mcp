#!/usr/bin/env python3
"""
Simplified Meta MCP server to test timeout issues.
"""

import asyncio
import logging
from fastmcp import FastMCP

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastMCP with minimal configuration
app = FastMCP("MetaMCP-Simple")

@app.tool()
async def validate_powershell() -> str:
    """Simple PowerShell validation tool."""
    return "PowerShell validation tool working!"

@app.tool()
async def best_practices() -> str:
    """PowerShell best practices tool."""
    return "Use Get-ChildItem instead of ls, Select-String instead of grep!"

async def main():
    """Simplified main function."""
    logger.info("Starting simplified Meta MCP server")
    app.run()

if __name__ == "__main__":
    main()
