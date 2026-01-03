#!/usr/bin/env python3
"""
Windsurf-aware Meta MCP server with forced logging to Windsurf directory.
"""

import asyncio
import logging
import sys
import traceback
from pathlib import Path
from datetime import datetime
from fastmcp import FastMCP

# Force logging to Windsurf directory - CRITICAL for debugging
WINDSURF_LOGS_DIR = Path.home() / "AppData" / "Roaming" / "Windsurf" / "logs"
SESSION_ID = datetime.now().strftime('%Y%m%d%H%M%S')
SESSION_LOG_DIR = WINDSURF_LOGS_DIR / SESSION_ID

# Create session directory
SESSION_LOG_DIR.mkdir(parents=True, exist_ok=True)

# Configure forced logging to Windsurf directory
startup_log = SESSION_LOG_DIR / "startup.log"
error_log = SESSION_LOG_DIR / "errors.log"
mcp_log = SESSION_LOG_DIR / "mcp_server.log"

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(startup_log),
        logging.FileHandler(error_log),
        logging.FileHandler(mcp_log),
        logging.StreamHandler(sys.stdout)  # Also show in console
    ]
)

logger = logging.getLogger(__name__)

# Initialize FastMCP with minimal configuration
app = FastMCP("MetaMCP-Windsurf")

@app.tool()
async def test_tool() -> str:
    """Test tool."""
    logger.info("TEST_TOOL: Called successfully")
    return "Test tool working!"

async def main():
    """Windsurf-aware main function with forced logging."""
    logger.info("=" * 60)
    logger.info("WINDSURF META MCP STARTUP - Forced Logging Enabled")
    logger.info(f"Session ID: {SESSION_ID}")
    logger.info(f"Log Directory: {SESSION_LOG_DIR}")
    logger.info("=" * 60)
    
    try:
        logger.info("STEP 1: Testing basic imports...")
        # Test basic imports that might be causing hangs
        import structlog
        from pathlib import Path
        logger.info("STEP 1: SUCCESS - Basic imports work")
        
        logger.info("STEP 2: Testing FastMCP initialization...")
        # Test FastMCP without tool registration
        test_app = FastMCP("Test-App")
        logger.info("STEP 2: SUCCESS - FastMCP initialization works")
        
        logger.info("STEP 3: Testing tool registration...")
        # Test tool registration
        @test_app.tool()
        async def test_func() -> str:
            return "Test function works!"
        
        logger.info("STEP 3: SUCCESS - Tool registration works")
        
        logger.info("STEP 4: Starting main app...")
        logger.info("STEP 5: Meta MCP Windsurf server ready!")
        
        # Write completion marker
        startup_log.write_text(f"\n=== META MCP STARTUP COMPLETE ===\nSession: {SESSION_ID}\nTimestamp: {datetime.now()}\n")
        
    except Exception as e:
        logger.error(f"FATAL ERROR: {e}")
        logger.error(f"TRACEBACK: {traceback.format_exc()}")
        # Write error marker
        error_log.write_text(f"\n=== META MCP FATAL ERROR ===\nError: {e}\nTraceback: {traceback.format_exc()}\nTimestamp: {datetime.now()}\n")
        sys.exit(1)
    
    logger.info("STEP 6: Starting FastMCP app.run()...")
    try:
        app.run()
    except Exception as e:
        logger.error(f"FATAL ERROR in app.run(): {e}")
        logger.error(f"TRACEBACK: {traceback.format_exc()}")
        error_log.write_text(f"\n=== META MCP RUNTIME ERROR ===\nError: {e}\nTraceback: {traceback.format_exc()}\nTimestamp: {datetime.now()}\n")
        sys.exit(1)

if __name__ == "__main__":
    main()
