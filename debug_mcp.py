#!/usr/bin/env python3
"""
Ultra-minimal FastMCP test - no tools, just basic server startup.
"""

import asyncio
import logging
from fastmcp import FastMCP

# Configure basic logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialize FastMCP with absolutely minimal configuration
app = FastMCP("MetaMCP-Debug")

# NO tools registered - just basic server

async def main():
    """Ultra-minimal main function."""
    logger.info("Starting ultra-minimal Meta MCP server")
    logger.info("Server initialized successfully")
    logger.info("Ready to accept connections")
    app.run()

if __name__ == "__main__":
    main()
