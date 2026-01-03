#!/usr/bin/env python3
"""
Minimal MetaMCP server with working imports only.
"""

import asyncio
import logging
from pathlib import Path

import structlog
from fastmcp import FastMCP

# Configure logging with Unicode safety
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

### PowerShell Syntax Tools
- validate_powershell_syntax: Comprehensive PowerShell validation
- powershell_best_practices: Get PowerShell best practices guide
- fix_powershell_syntax: Auto-fix common PowerShell issues

### PowerShell Profile Manager
- create_powershell_profile: Create optimized PowerShell profile
- update_powershell_profile: Update existing profile with best practices

## Why MetaMCP?

MetaMCP addresses the most common developer frustrations:
- PowerShell syntax errors on Windows
- MCP server development complexity
- Project organization issues
- Documentation generation overhead

## Getting Started:

1. Use validate_powershell_syntax to check your PowerShell scripts
2. Use create_powershell_profile to optimize your PowerShell setup
3. Use powershell_best_practices to learn best practices

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

## PowerShell Syntax Tools
- validate_powershell_syntax: Comprehensive PowerShell validation
- powershell_best_practices: Get PowerShell best practices guide
- fix_powershell_syntax: Auto-fix common PowerShell issues

## PowerShell Profile Manager
- create_powershell_profile: Create optimized PowerShell profile
- update_powershell_profile: Update existing profile with best practices

## Why MetaMCP?

### Before MetaMCP:
- [X] PowerShell syntax errors on Windows
- [X] MCP server development complexity
- [X] Project organization chaos
- [X] Documentation generation overhead

### After MetaMCP:
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
2. **Profile Setup**: Use create_powershell_profile for PowerShell optimization
3. **Best Practices**: Use powershell_best_practices to learn standards

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

# Import working tool registration functions only
from meta_mcp.tools.powershell_validator import register_powershell_tools
from meta_mcp.tools.powershell_profile_manager import register_powershell_profile_tools

async def initialize():
    """Initialize MetaMCP with working tool suites only."""
    logger.info("Initializing MetaMCP server")
    
    # Register PowerShell syntax validation tools
    powershell_tools_count = register_powershell_tools(app)
    logger.info("Registered PowerShell tools", count=powershell_tools_count)
    
    # Register PowerShell profile manager tools
    profile_tools_count = register_powershell_profile_tools(app)
    logger.info("Registered PowerShell profile tools", count=profile_tools_count)
    
    total_tools = powershell_tools_count + profile_tools_count
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
