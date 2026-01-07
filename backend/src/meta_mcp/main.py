#!/usr/bin/env python3
"""
MetaMCP Web UI/API Server - Main entry point.

Starts the FastAPI web server with MCP integration.
"""

import uvicorn
import logging
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# Import MCP server components
from meta_mcp.mcp_server import app as mcp_app

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

    # Mount MCP routes
    app.mount("/mcp", mcp_app)

    # Mount static files if frontend exists
    import os

    frontend_path = os.path.join(
        os.path.dirname(__file__), "..", "..", "frontend", "dist"
    )
    if os.path.exists(frontend_path):
        app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

    @app.get("/health")
    async def health_check():
        """Health check endpoint."""
        return {"status": "healthy", "service": "MetaMCP"}

    return app


def main():
    """Main entry point for the web server."""
    # Default configuration - can be made configurable later
    host = "127.0.0.1"
    port = 8000

    logger.info(f"Starting MetaMCP Web Server on {host}:{port}")

    app = create_fastapi_app()

    uvicorn.run(app, host=host, port=port, log_level="info")


if __name__ == "__main__":
    main()
