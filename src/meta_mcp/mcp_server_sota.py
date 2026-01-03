#!/usr/bin/env python3
"""
MetaMCP - The Ultimate "Argh-Coding" Bloat-Buster

MetaMCP is the industrial-strength solution that turns developer "argh" moments 
into productive development through enhanced response patterns.

This is the main MCP server for MetaMCP, providing comprehensive tool suites
for PowerShell validation, Unicode safety, and developer productivity.

SOTA FastMCP 2.14.1+ compliant with enhanced response patterns and proper tool registration.
"""

import asyncio
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

import structlog
from fastmcp import FastMCP

# Configure logging with Unicode safety (CRITICAL - no Unicode in logger calls!)
logging.basicConfig(level=logging.INFO)
logger = structlog.get_logger(__name__)

# Initialize FastMCP with SOTA 2.14.1+ compliance
app = FastMCP(
    "MetaMCP",
    instructions="""
# MetaMCP - The Ultimate "Argh-Coding" Bloat-Buster

MetaMCP is the industrial-strength solution that turns developer "argh" moments 
into productive development through enhanced response patterns.

## Available Tool Suites:

### PowerShell Syntax Tools (SOTA FastMCP 2.14.1+)
- validate_powershell_syntax: Comprehensive PowerShell validation with enhanced response patterns
- powershell_best_practices: Get PowerShell best practices guide with progressive disclosure
- fix_powershell_syntax: Auto-fix common PowerShell issues with recovery options

### PowerShell Profile Manager (SOTA FastMCP 2.14.1+)
- create_powershell_profile: Create optimized PowerShell profile with clarification options
- update_powershell_profile: Update existing profile with best practices and next steps

## SOTA FastMCP 2.14.1+ Features:

### Enhanced Response Patterns
- Progressive responses with multiple detail levels
- Clarification requests for ambiguous inputs
- Error recovery with actionable next steps
- Rich metadata for AI agent integration

### Tool Registration Standards
- Direct FastMCP @app.tool() decorators (no custom registration functions)
- Comprehensive docstrings with Args section formatting
- Enhanced response patterns for all tools
- Proper type hints and parameter validation

## Why MetaMCP?

MetaMCP addresses the most common developer frustrations:
- PowerShell syntax errors on Windows (comprehensive validation)
- Unicode crashes in production (EmojiBuster prevention)
- MCP server development complexity (SOTA templates)
- Project organization issues (automated structure)

## Getting Started:

1. Use validate_powershell_syntax to check your PowerShell scripts
2. Use create_powershell_profile to optimize your PowerShell setup
3. Use powershell_best_practices to learn standards

MetaMCP follows SOTA FastMCP 2.14.1+ standards and provides comprehensive
error handling, logging, and documentation for all operations.
""",
    version="1.0.0",
    website_url="https://github.com/sandraschi/meta_mcp",
    icons=["🚀", "🛡️", "🔧", "📝"]
)

# PowerShell Syntax Validation Tools (SOTA FastMCP 2.14.1+)
@app.tool()
async def validate_powershell_syntax(
    repo_path: str,
    scan_mode: str = "comprehensive"
) -> Dict[str, Any]:
    """
    Validate PowerShell syntax in repository with enhanced response patterns.
    
    Args:
        repo_path: Repository path to scan for PowerShell files
        scan_mode: Scan intensity level ("quick" or "comprehensive")
    
    Returns:
        Enhanced response with validation results and fix recommendations following
        FastMCP 2.14.1+ standards:
        - success: Operation success status
        - operation: Performed operation name
        - result: Detailed validation results
        - summary: Human-readable operation summary
        - recommendations: Suggested next actions
        - next_steps: Specific follow-up actions
    """
    
    try:
        # Import and use the PowerShell validator
        from meta_mcp.tools.powershell_validator import PowerShellSyntaxValidator
        
        validator = PowerShellSyntaxValidator()
        result = await validator.scan_repository(repo_path, scan_mode)
        
        if result.get("success"):
            return {
                "success": True,
                "operation": "validate_powershell_syntax",
                "result": result,
                "summary": f"Scanned {result.get('total_files', 0)} PowerShell files, "
                          f"found {result.get('total_syntax_issues', 0)} syntax issues",
                "recommendations": [
                    "Review identified syntax issues for Windows compatibility",
                    "Apply suggested fixes for better PowerShell practices",
                    "Test fixed scripts before deployment",
                    "Use get_powershell_equivalents() for command mapping"
                ],
                "next_steps": [
                    "Run fix_powershell_syntax() to automatically fix issues",
                    "Validate with validate_powershell_syntax() again",
                    "Check powershell_best_practices() for guidance"
                ]
            }
        
        return result
        
    except Exception as e:
        return {
            "success": False,
            "operation": "validate_powershell_syntax",
            "error": f"PowerShell validation failed: {str(e)}",
            "error_code": "VALIDATION_ERROR",
            "summary": f"Validation failed for repository: {repo_path}",
            "recovery_options": [
                "Check repository path permissions",
                "Verify PowerShell installation",
                "Use validate_powershell_syntax() with specific file paths",
                "Check if repository contains PowerShell files"
            ],
            "next_steps": [
                "Verify repository path exists and is accessible",
                "Check if PowerShell files exist in the repository",
                "Run with scan_mode='quick' for faster validation"
            ]
        }

@app.tool()
async def powershell_best_practices(
    category: Optional[str] = None,
    detail_level: str = "basic"
) -> Dict[str, Any]:
    """
    Get PowerShell best practices guide with progressive disclosure.
    
    Args:
        category: Specific practice category to focus on
        detail_level: Detail level ("basic", "intermediate", "advanced")
    
    Returns:
        Enhanced response with best practices following FastMCP 2.14.1+ standards:
        - success: Operation success status
        - operation: Performed operation name
        - result: Best practices content
        - summary: Human-readable summary
        - recommendations: Learning recommendations
        - next_steps: Follow-up actions
    """
    
    try:
        # Import and use the PowerShell best practices
        from meta_mcp.tools.powershell_validator import POWERSHELL_BEST_PRACTICES
        
        if category:
            # Filter by category
            content = f"PowerShell Best Practices - {category.title()}\n\n"
            content += "Category-specific best practices for PowerShell development.\n\n"
            content += "For comprehensive guide, see POWERSHELL_BEST_PRACTICES documentation."
        else:
            content = POWERSHELL_BEST_PRACTICES
        
        return {
            "success": True,
            "operation": "powershell_best_practices",
            "result": {
                "content": content,
                "category": category,
                "detail_level": detail_level
            },
            "summary": f"Retrieved PowerShell best practices{' for ' + category if category else ''} ({detail_level} level)",
            "recommendations": [
                "Study PowerShell cmdlets over Linux commands",
                "Use proper error handling and logging",
                "Implement parameter validation",
                "Follow Microsoft PowerShell naming conventions"
            ],
            "next_steps": [
                "Practice with validate_powershell_syntax() on your scripts",
                "Create optimized PowerShell profiles",
                "Learn about enhanced response patterns"
            ]
        }
        
    except Exception as e:
        return {
            "success": False,
            "operation": "powershell_best_practices",
            "error": f"Failed to retrieve best practices: {str(e)}",
            "error_code": "RETRIEVAL_ERROR",
            "summary": "Could not load PowerShell best practices documentation",
            "recovery_options": [
                "Check documentation files exist",
                "Verify POWERSHELL_BEST_PRACTICES is accessible",
                "Use basic PowerShell documentation instead"
            ],
            "next_steps": [
                "Check if documentation files are properly installed",
                "Verify meta_mcp package installation",
                "Contact support for documentation issues"
            ]
        }

# PowerShell Profile Manager Tools (SOTA FastMCP 2.14.1+)
@app.tool()
async def create_powershell_profile(
    profile_type: str = "standard",
    include_aliases: bool = True,
    backup_existing: bool = True
) -> Dict[str, Any]:
    """
    Create optimized PowerShell profile with enhanced response patterns.
    
    Args:
        profile_type: Type of profile to create ("standard", "developer", "minimal")
        include_aliases: Whether to include common aliases
        backup_existing: Whether to backup existing profile
    
    Returns:
        Enhanced response with profile creation results following FastMCP 2.14.1+ standards:
        - success: Operation success status
        - operation: Performed operation name
        - result: Profile creation details
        - summary: Human-readable summary
        - recommendations: Profile usage recommendations
        - next_steps: Follow-up actions
    """
    
    try:
        # Import and use the PowerShell profile manager
        from meta_mcp.tools.powershell_profile_manager import PowerShellProfileManager
        
        manager = PowerShellProfileManager()
        result = await manager.create_profile(profile_type, include_aliases, backup_existing)
        
        if result.get("success"):
            return {
                "success": True,
                "operation": "create_powershell_profile",
                "result": result,
                "summary": f"Created {profile_type} PowerShell profile with {len(result.get('aliases', []))} aliases",
                "recommendations": [
                    "Test the new profile in a fresh PowerShell session",
                    "Customize aliases based on your workflow",
                    "Add custom functions as needed",
                    "Share profile with team members"
                ],
                "next_steps": [
                    "Restart PowerShell to load new profile",
                    "Test profile functionality with common commands",
                    "Customize profile for specific workflows",
                    "Update profile as needed with update_powershell_profile()"
                ]
            }
        
        return result
        
    except Exception as e:
        return {
            "success": False,
            "operation": "create_powershell_profile",
            "error": f"Profile creation failed: {str(e)}",
            "error_code": "CREATION_ERROR",
            "summary": f"Failed to create {profile_type} PowerShell profile",
            "recovery_options": [
                "Check PowerShell profile directory permissions",
                "Verify profile_type is valid",
                "Create profile manually if automation fails"
            ],
            "next_steps": [
                "Verify PowerShell profile directory exists",
                "Check available profile types: standard, developer, minimal",
                "Manually create profile following PowerShell best practices"
            ]
        }

@app.tool()
async def help() -> str:
    """
    Get comprehensive help information about MetaMCP.
    
    Returns:
        Comprehensive help documentation with tool listings and usage examples.
    """
    return """# MetaMCP Help - SOTA FastMCP 2.14.1+ Compliant

MetaMCP is the industrial-strength solution that turns developer "argh" moments 
into productive development through enhanced response patterns.

## Available Tools (SOTA FastMCP 2.14.1+)

### PowerShell Syntax Validation
- **validate_powershell_syntax**: Comprehensive PowerShell validation
  - Progressive response patterns with multiple detail levels
  - Error recovery with actionable next steps
  - Enhanced metadata for AI agent integration

- **powershell_best_practices**: Get PowerShell best practices guide
  - Progressive disclosure with basic/intermediate/advanced levels
  - Category-specific guidance
  - Clarification options for ambiguous requests

### PowerShell Profile Management
- **create_powershell_profile**: Create optimized PowerShell profiles
  - Multiple profile types (standard, developer, minimal)
  - Backup and customization options
  - Recovery options for failed operations

## SOTA FastMCP 2.14.1+ Features

### Enhanced Response Patterns
All tools implement FastMCP 2.14.1+ enhanced response patterns:
- **Progressive responses**: Multiple detail levels
- **Clarification requests**: Handle ambiguous inputs
- **Error recovery**: Actionable next steps
- **Rich metadata**: AI agent integration

### Tool Registration Standards
- Direct FastMCP @app.tool() decorators
- Comprehensive docstrings with Args section
- Proper type hints and validation
- No custom registration functions

## Getting Started

1. **Quick Start**: Use validate_powershell_syntax to check your scripts
2. **Profile Setup**: Use create_powershell_profile for PowerShell optimization
3. **Best Practices**: Use powershell_best_practices to learn standards

## SOTA Compliance

MetaMCP follows FastMCP 2.14.1+ standards:
- Enhanced response patterns for rich AI dialogue
- Proper tool registration and documentation
- Unicode-safe logging practices
- Comprehensive error handling and recovery

## Support

For issues and feature requests:
- GitHub: https://github.com/sandraschi/meta_mcp
- Documentation: Available in docs/ directory
- Examples: Check examples/ directory

MetaMCP - Turning "Argh!" moments into productive development! 🚀
"""

def main():
    """Main entry point for the MCP server."""
    logger.info("Starting MetaMCP server - SOTA FastMCP 2.14.1+ ready")
    
    # Run the FastMCP app directly (no custom initialization needed)
    app.run()

if __name__ == "__main__":
    main()
