#!/usr/bin/env python3
"""
Diagnostic Meta MCP server to identify exact hang point.
"""

import asyncio
import logging
import sys
import traceback
from fastmcp import FastMCP

# Configure detailed logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastMCP with minimal configuration
app = FastMCP("MetaMCP-Diagnostic")

@app.tool()
async def test_tool() -> str:
    """Test tool."""
    logger.info("TEST_TOOL: Called successfully")
    return "Test tool working!"

async def main():
    """Diagnostic main function with detailed logging."""
    logger.info("=" * 50)
    logger.info("STARTING META MCP DIAGNOSTIC")
    logger.info("=" * 50)
    
    try:
        logger.info("STEP 1: Importing powershell_validator...")
        from meta_mcp.tools.powershell_validator import register_powershell_tools
        logger.info("STEP 1: SUCCESS - powershell_validator imported")
        
        logger.info("STEP 2: Importing other modules...")
        # These should work without issues
        from meta_mcp.tools.emojibuster import register_emojibuster_tools
        from meta_mcp.tools.mcp_tools import register_all_meta_tools
        from meta_mcp.tools.powershell_profile_manager import register_powershell_profile_tools
        
        logger.info("STEP 2: SUCCESS - All modules imported")
        
        logger.info("STEP 3: Starting tool registration...")
        emojibuster_count = register_emojibuster_tools(app)
        logger.info(f"STEP 3: Registered {emojibuster_count} EmojiBuster tools")
        
        meta_tools_count = register_all_meta_tools(app)
        logger.info(f"STEP 3: Registered {meta_tools_count} MetaMCP tools")
        
        powershell_tools_count = register_powershell_tools(app)
        logger.info(f"STEP 3: Registered {powershell_tools_count} PowerShell tools")
        
        profile_tools_count = register_powershell_profile_tools(app)
        logger.info(f"STEP 3: Registered {profile_tools_count} PowerShell profile tools")
        
        total_tools = emojibuster_count + meta_tools_count + powershell_tools_count + profile_tools_count
        logger.info(f"STEP 3: Total tools registered: {total_tools}")
        
        logger.info("STEP 4: Starting FastMCP app...")
        logger.info("STEP 5: Meta MCP diagnostic server ready!")
        
    except Exception as e:
        logger.error(f"FATAL ERROR during initialization: {e}")
        logger.error(f"TRACEBACK: {traceback.format_exc()}")
        sys.exit(1)
    
    logger.info("STEP 6: Starting FastMCP run...")
    try:
        app.run()
    except Exception as e:
        logger.error(f"FATAL ERROR during app.run(): {e}")
        logger.error(f"TRACEBACK: {traceback.format_exc()}")
        sys.exit(1)

if __name__ == "__main__":
    main()
