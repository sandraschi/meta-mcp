#!/usr/bin/env python3
"""
MetaMCP - The Ultimate "Argh-Coding" Bloat-Buster

MetaMCP is the industrial-strength solution that turns developer "argh" moments 
into productive development through enhanced response patterns.

This is the main MCP server for MetaMCP, providing comprehensive tool suites
for PowerShell validation, Unicode safety, and developer productivity.
"""

import asyncio
import logging
from pathlib import Path

import structlog
from fastmcp import FastMCP

# Configure logging with Unicode safety (CRITICAL - no Unicode in logger calls!)
logging.basicConfig(level=logging.INFO)
logger = structlog.get_logger(__name__)

# Initialize FastMCP with comprehensive description
app = FastMCP(
    "MetaMCP",
    instructions="""
# MetaMCP - The Ultimate "Argh-Coding" Bloat-Buster

MetaMCP is the industrial-strength solution that turns developer "argh" moments 
into productive development through enhanced response patterns.

## Available Tool Suites:

### EmojiBuster Suite (Unicode Crash Prevention)
- emojibuster_scan: Scan repos for Unicode logging crashes
- emojibuster_fix: Auto-fix Unicode issues with ASCII replacements  
- emojibuster_success_stories: Track stability improvements

### PowerShell Syntax Tools
- validate_powershell_syntax: Comprehensive PowerShell validation
- powershell_best_practices: Get PowerShell best practices guide
- fix_powershell_syntax: Auto-fix common PowerShell issues

### PowerShell Profile Manager
- create_powershell_profile: Create optimized PowerShell profile
- update_powershell_profile: Update existing profile with best practices

### Discovery & Analysis Tools
- discover_mcp_servers: Find MCP servers across your system
- get_server_info: Detailed server analysis and status
- analyze_runts: Identify repositories needing SOTA upgrades
- validate_sota_compliance: FastMCP 2.14.1+ standards validation

### Generation & Scaffolding Tools
- create_mcp_server: Generate new SOTA-compliant MCP servers
- scaffold_tool_suite: Create comprehensive tool suites
- generate_documentation: Auto-generate MCP documentation

### File Management Tools
- organize_project_structure: Optimize project organization
- cleanup_temp_files: Safe temporary file cleanup
- validate_file_structure: Ensure SOTA compliance

## Why MetaMCP?

MetaMCP addresses the most common developer frustrations:
- Unicode crashes in production (EmojiBuster)
- PowerShell syntax errors on Windows
- MCP server development complexity
- Project organization issues
- Documentation generation overhead

## Getting Started:

1. Use validate_powershell_syntax to check your PowerShell scripts
2. Use emojibuster_scan to prevent Unicode crashes
3. Use create_mcp_server to generate new MCP projects
4. Use discover_mcp_servers to find existing MCP servers

MetaMCP follows SOTA (State-of-the-Art) standards and provides comprehensive
error handling, logging, and documentation for all operations.
""",
    version="1.0.0",
    website_url="https://github.com/sandraschi/meta_mcp",
    icons=["🚀", "🛡️", "🔧", "📝"]
)

@app.tool()
async def help() -> str:
    """Get help information about MetaMCP.
    
    Returns:
        Formatted help documentation with enhanced response patterns
    """
    return """# MetaMCP Help - The Ultimate "Argh-Coding" Bloat-Buster

MetaMCP is the industrial-strength solution that turns developer "argh" moments 
into productive development through enhanced response patterns.

## Critical Tools (Unicode Crash Prevention)

### EmojiBuster Tool Suite
- emojibuster_scan(): Scan repos for Unicode logging crashes
- emojibuster_fix(): Auto-fix Unicode issues with ASCII replacements  
- emojibuster_success_stories(): Track stability improvements

**Why Critical**: Unicode emojis in logger calls AND print statements cause production crashes and restart loops.
Gen X emoji overuse has cost developers 3+ days of cumulative delay!

**Scope**: Targets ALL output streams (logger, print) that go to logs/files.
**Safe**: Triple-quoted comments, content body, user-facing content, safe emojis.

## Discovery & Analysis Tools
- discover_mcp_servers: Find MCP servers across your system
- get_server_info: Detailed server analysis and status
- analyze_runts: Identify repositories needing SOTA upgrades
- validate_sota_compliance: FastMCP 2.14.1+ standards validation

## Generation & Scaffolding Tools
- create_mcp_server: Generate new SOTA-compliant MCP servers
- scaffold_tool_suite: Create comprehensive tool suites
- generate_documentation: Auto-generate MCP documentation

## File Management Tools
- organize_project_structure: Optimize project organization
- cleanup_temp_files: Safe temporary file cleanup
- validate_file_structure: Ensure SOTA compliance

## PowerShell Syntax Tools
- validate_powershell_syntax: Comprehensive PowerShell validation
- powershell_best_practices: Get PowerShell best practices guide
- fix_powershell_syntax: Auto-fix common PowerShell issues

## PowerShell Profile Manager
- create_powershell_profile: Create optimized PowerShell profile
- update_powershell_profile: Update existing profile with best practices

## Utility Tools
- system_health_check: Comprehensive system analysis
- performance_monitor: Real-time performance tracking
- error_analyzer: Advanced error pattern analysis

## Why MetaMCP?

### Before MetaMCP:
- [X] Unicode crashes in production (3+ days lost)
- [X] PowerShell syntax errors on Windows
- [X] MCP server development complexity
- [X] Project organization chaos
- [X] Documentation generation overhead

### After MetaMCP:
- [✓] Unicode-safe logging (EmojiBuster)
- [✓] PowerShell best practices enforced
- [✓] SOTA-compliant MCP servers
- [✓] Organized project structures
- [✓] Auto-generated documentation

## Enhanced Response Patterns

MetaMCP provides structured, actionable responses that save time:

### Error Responses:
```json
{
  "success": false,
  "error": "Specific error message",
  "suggestion": "Actionable fix",
  "code_example": "Working solution"
}
```

### Success Responses:
```json
{
  "success": true,
  "message": "Operation completed",
  "details": "Additional context",
  "next_steps": ["Recommended actions"]
}
```

## Getting Started

1. **Quick Start**: Use validate_powershell_syntax to check your scripts
2. **Unicode Safety**: Run emojibuster_scan on your repositories
3. **MCP Development**: Use create_mcp_server for new projects
4. **Discovery**: Use discover_mcp_servers to find existing servers

## SOTA Compliance

MetaMCP follows State-of-the-Art standards:
- FastMCP 2.14.1+ compatibility
- Unicode-safe logging practices
- Comprehensive error handling
- Structured response patterns
- Professional documentation

## Support

For issues and feature requests:
- GitHub: https://github.com/sandraschi/meta_mcp
- Documentation: Available in docs/ directory
- Examples: Check examples/ directory

MetaMCP - Turning "Argh!" moments into productive development! 🚀
"""

# Import tool registration functions
from meta_mcp.tools.emojibuster import register_emojibuster_tools
from meta_mcp.tools.mcp_tools import register_all_meta_tools
from meta_mcp.tools.powershell_validator import register_powershell_tools
from meta_mcp.tools.powershell_profile_manager import register_powershell_profile_tools

async def initialize():
    """Initialize MetaMCP with all tool suites."""
    logger.info("Initializing MetaMCP server")
    
    # Register all tool suites
    tools_count = register_all_meta_tools(app)
    logger.info("Registered MetaMCP tools", count=tools_count)
    
    emojibuster_count = register_emojibuster_tools(app)
    logger.info("Registered EmojiBuster tools", count=emojibuster_count)
    
    # Register all MetaMCP tools with SOTA compliance
    meta_tools_count = register_all_meta_tools(app)
    logger.info("Registered MetaMCP tools", count=meta_tools_count)
    
    # Register PowerShell syntax validation tools
    powershell_tools_count = register_powershell_tools(app)
    logger.info("Registered PowerShell tools", count=powershell_tools_count)
    
    # Register PowerShell profile manager tools
    profile_tools_count = register_powershell_profile_tools(app)
    logger.info("Registered PowerShell profile tools", count=profile_tools_count)
    
    total_tools = emojibuster_count + meta_tools_count + powershell_tools_count + profile_tools_count
    logger.info("Total tools registered", total_tools=total_tools)
    
    logger.info("MetaMCP initialization complete - Unicode safe logging enabled")

def main():
    """Main entry point for the MCP server."""
    # Run async initialization before blocking app.run()
    loop = asyncio.get_event_loop()
    loop.run_until_complete(initialize())
    
    logger.info("Starting MetaMCP server - SOTA FastMCP 2.14.1+ ready")
    app.run()

if __name__ == "__main__":
    main()
