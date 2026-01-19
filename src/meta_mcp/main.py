#!/usr/bin/env python3
"""
MetaMCP Web UI/API Server - Main entry point.

Starts the FastAPI web server with MCP integration.
"""

import uvicorn
import logging
import os
import sys
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# Import MCP server components
from meta_mcp.mcp_server import app as mcp_app
from meta_mcp.api_router import router as api_router

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_fastapi_app():
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="MetaMCP",
        description="Meta MCP - The Ultimate 'Argh-Coding' Bloat-Buster",
        version="0.2.1-beta",
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include API routes
    app.include_router(api_router)

    # Mount MCP routes
    app.mount("/mcp", mcp_app)

    # Mount static files if frontend exists
    import os

    # Get the project root directory
    # Script is now at src/meta_mcp/main.py, so we need to go up 2 levels
    script_dir = os.path.dirname(__file__)  # meta_mcp
    src_dir = os.path.dirname(script_dir)  # src
    project_root = os.path.dirname(src_dir)  # project root
    web_path = os.path.join(project_root, "web", "dist")

    if os.path.exists(web_path):
        logger.info(f"Mounting webapp static files from: {web_path}")
        app.mount("/", StaticFiles(directory=web_path, html=True), name="webapp")
    else:
        logger.warning(f"Webapp dist directory not found at: {web_path}")

    @app.get("/health")
    async def health_check():
        """Health check endpoint."""
        return {"status": "healthy", "service": "MetaMCP"}

    return app


def main():
    """Main entry point for the web server."""
    # Default configuration
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", "8000"))

    # Allow command line override
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            logger.error(f"Invalid port number: {sys.argv[1]}")
            sys.exit(1)

    logger.info(f"Starting MetaMCP Web Server on {host}:{port}")

    app = create_fastapi_app()

    uvicorn.run(app, host=host, port=port, log_level="info")


if __name__ == "__main__":
    main()
