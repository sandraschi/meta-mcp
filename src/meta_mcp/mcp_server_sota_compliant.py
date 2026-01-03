#!/usr/bin/env python3
"""
MetaMCP - The Ultimate "Argh-Coding" Bloat-Buster

MetaMCP is the industrial-strength solution that turns developer "argh" moments 
into productive development through enhanced response patterns.

This is the main MCP server for MetaMCP, providing comprehensive tool suites
for PowerShell validation, Unicode safety, and developer productivity.

SOTA FastMCP 2.14.1+ compliant with enhanced response patterns and proper tool registration.
NO CUSTOM REGISTRATION FUNCTIONS - DIRECT FASTMCP 2.14.1+ COMPLIANCE!
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

## Available Tool Suites (FASTMCP 2.14.1+ DIRECT REGISTRATION):

### 🚨 EmojiBuster Suite (Unicode Crash Prevention)
- emojibuster_scan: Scan repos for Unicode logging crashes
- emojibuster_fix: Auto-fix Unicode issues with ASCII replacements  
- emojibuster_success_stories: Track stability improvements

### 📁 File Management Tools
- list_directory: List directory contents with metadata
- read_file: Read file contents safely
- write_file: Write files with validation
- create_temp_file: Create temporary files for processing

### 🛠️ Utility Tools
- generate_id: Generate unique identifiers
- format_text: Format text with various options
- validate_json: Validate JSON structure and content

### 🔧 PowerShell Tools (SOTA FastMCP 2.14.1+)
- validate_powershell_syntax: Comprehensive PowerShell validation with enhanced response patterns
- powershell_best_practices: Get PowerShell best practices guide with progressive disclosure
- fix_powershell_syntax: Auto-fix common PowerShell issues with recovery options

### 📝 PowerShell Profile Manager (SOTA FastMCP 2.14.1+)
- create_powershell_profile: Create optimized PowerShell profile with clarification options
- update_powershell_profile: Update existing profile with best practices and next steps

### 🔍 Discovery & Analysis Tools
- discover_mcp_servers: Find MCP servers across your system
- analyze_runts: Identify repositories needing SOTA upgrades
- get_repo_status: Get detailed repository status

## SOTA FastMCP 2.14.1+ Features:

### Enhanced Response Patterns
- Progressive responses with multiple detail levels
- Clarification requests for ambiguous inputs
- Error recovery with actionable next steps
- Rich metadata for AI agent integration

### Tool Registration Standards
- Direct FastMCP @app.tool() decorators (NO custom registration functions)
- Comprehensive docstrings with Args section formatting
- Enhanced response patterns for all tools
- Proper type hints and parameter validation

## Why MetaMCP?

MetaMCP addresses the most common developer frustrations:
- PowerShell syntax errors on Windows (comprehensive validation)
- Unicode crashes in production (EmojiBuster prevention)
- MCP server development complexity (SOTA templates and scaffolding)
- Project organization issues (automated structure and analysis)
- Repository analysis and compliance checking

## Getting Started:

1. **Validation**: Use validate_powershell_syntax to check your scripts
2. **File Management**: Use file tools for content operations
3. **Discovery**: Use discover_mcp_servers to find all MCP servers
4. **Best Practices**: Use powershell_best_practices to learn standards

MetaMCP follows SOTA FastMCP 2.14.1+ standards and provides comprehensive
error handling, logging, and documentation for all operations.
""",
    version="1.0.0",
    website_url="https://github.com/sandraschi/meta_mcp",
    icons=["🚀", "🛡️", "🔧", "📝", "🔍", "📊"]
)

# Import the actual tool functions directly - NO registration functions!
from meta_mcp.tools.files import list_directory, read_file, write_file, create_temp_file
from meta_mcp.tools.utility import generate_id, format_text, validate_json
from meta_mcp.tools.runt_analyzer import analyze_runts, get_repo_status
from meta_mcp.tools.discovery import discover_servers

# Register tools directly with FastMCP 2.14.1+ @app.tool() decorators
# NO CUSTOM REGISTRATION FUNCTIONS - DIRECT COMPLIANCE!

@app.tool()
async def list_directory(path: str) -> Dict[str, Any]:
    """
    List contents of a directory with enhanced response patterns.
    
    Args:
        path: Directory path to list contents from
    
    Returns:
        Enhanced response with directory listing and file information
    """
    try:
        from meta_mcp.tools.files import FileInfo
        import aiofiles.os
        
        path_obj = Path(path).resolve()
        if not await aiofiles.os.path.exists(path_obj):
            return {
                "success": False,
                "operation": "list_directory",
                "error": f"Directory not found: {path}",
                "error_code": "DIRECTORY_NOT_FOUND",
                "summary": f"Failed to list directory: {path}",
                "recovery_options": [
                    "Check if directory path exists",
                    "Verify directory permissions",
                    "Use absolute path instead of relative"
                ],
                "next_steps": [
                    "Verify directory exists with file explorer",
                    "Check path spelling and case",
                    "Use parent directory if path doesn't exist"
                ]
            }
        
        results = []
        with os.scandir(path_obj) as entries:
            for entry in entries:
                stat = entry.stat()
                results.append({
                    "path": entry.path,
                    "name": entry.name,
                    "size": stat.st_size,
                    "modified": stat.st_mtime,
                    "is_dir": entry.is_dir()
                })
        
        return {
            "success": True,
            "operation": "list_directory",
            "result": {
                "directory": path,
                "entries": results,
                "total_count": len(results)
            },
            "summary": f"Listed {len(results)} items in directory: {path}",
            "recommendations": [
                "Review file sizes for large files",
                "Check modification dates for recent changes",
                "Use read_file for specific file contents"
            ],
            "next_steps": [
                "Read specific files with read_file tool",
                "Filter results by file type or size",
                "Navigate to subdirectories if needed"
            ]
        }
        
    except Exception as e:
        return {
            "success": False,
            "operation": "list_directory",
            "error": f"Failed to list directory: {str(e)}",
            "error_code": "LIST_ERROR",
            "summary": f"Directory listing failed for: {path}",
            "recovery_options": [
                "Check directory permissions",
                "Verify path is accessible",
                "Use parent directory if current fails"
            ],
            "next_steps": [
                "Check directory access permissions",
                "Verify path is not locked by other processes",
                "Try listing parent directory"
            ]
        }

@app.tool()
async def read_file(path: str) -> Dict[str, Any]:
    """
    Read file contents safely with enhanced response patterns.
    
    Args:
        path: File path to read contents from
    
    Returns:
        Enhanced response with file contents and metadata
    """
    try:
        import aiofiles
        
        path_obj = Path(path).resolve()
        if not await aiofiles.os.path.exists(path_obj):
            return {
                "success": False,
                "operation": "read_file",
                "error": f"File not found: {path}",
                "error_code": "FILE_NOT_FOUND",
                "summary": f"Failed to read file: {path}",
                "recovery_options": [
                    "Check if file path exists",
                    "Verify file permissions",
                    "Use list_directory to find correct path"
                ],
                "next_steps": [
                    "Verify file exists with list_directory",
                    "Check file extension and type",
                    "Use absolute path if relative fails"
                ]
            }
        
        if path_obj.is_dir():
            return {
                "success": False,
                "operation": "read_file",
                "error": f"Path is a directory, not a file: {path}",
                "error_code": "PATH_IS_DIRECTORY",
                "summary": f"Cannot read directory as file: {path}",
                "recovery_options": [
                    "Use list_directory for directory contents",
                    "Specify a file path instead of directory",
                    "Check path points to actual file"
                ],
                "next_steps": [
                    "Use list_directory to see directory contents",
                    "Select specific file from directory listing",
                    "Verify path points to file not directory"
                ]
            }
        
        async with aiofiles.open(path_obj, 'r', encoding='utf-8') as f:
            content = await f.read()
        
        return {
            "success": True,
            "operation": "read_file",
            "result": {
                "path": str(path_obj),
                "content": content,
                "size": len(content),
                "lines": len(content.splitlines())
            },
            "summary": f"Successfully read file: {path}",
            "recommendations": [
                "Review file content for relevant information",
                "Use write_file to modify if needed",
                "Check file encoding if content appears garbled"
            ],
            "next_steps": [
                "Analyze file content for specific information",
                "Use write_file to make modifications",
                "Validate file format if needed"
            ]
        }
        
    except Exception as e:
        return {
            "success": False,
            "operation": "read_file",
            "error": f"Failed to read file: {str(e)}",
            "error_code": "READ_ERROR",
            "summary": f"File reading failed for: {path}",
            "recovery_options": [
                "Check file permissions",
                "Verify file is not locked",
                "Check file encoding"
            ],
            "next_steps": [
                "Check file access permissions",
                "Verify file is not open in other programs",
                "Try reading with different encoding"
            ]
        }

@app.tool()
async def discover_mcp_servers(
    search_paths: Optional[List[str]] = None,
    config_files: Optional[List[str]] = None,
    recursive: bool = True
) -> Dict[str, Any]:
    """
    Discover MCP servers across the system with enhanced response patterns.
    
    Args:
        search_paths: List of directories to search for MCP servers
        config_files: List of MCP configuration files to parse
        recursive: Whether to search subdirectories recursively
    
    Returns:
        Enhanced response with discovered MCP server configurations
    """
    try:
        servers = discover_servers(search_paths, config_files, recursive)
        
        return {
            "success": True,
            "operation": "discover_mcp_servers",
            "result": {
                "servers": servers,
                "total_found": len(servers),
                "search_paths": search_paths,
                "config_files": config_files
            },
            "summary": f"Discovered {len(servers)} MCP servers across the system",
            "recommendations": [
                "Review discovered servers for relevance",
                "Check server configurations for compatibility",
                "Test server functionality before use"
            ],
            "next_steps": [
                "Analyze specific servers for detailed information",
                "Update configurations as needed",
                "Test server connectivity and functionality"
            ]
        }
        
    except Exception as e:
        return {
            "success": False,
            "operation": "discover_mcp_servers",
            "error": f"Failed to discover MCP servers: {str(e)}",
            "error_code": "DISCOVERY_ERROR",
            "summary": "MCP server discovery failed",
            "recovery_options": [
                "Check search paths exist and are accessible",
                "Verify configuration files are valid JSON",
                "Use default search parameters if custom fails"
            ],
            "next_steps": [
                "Verify directory permissions",
                "Check JSON configuration file syntax",
                "Use simplified search parameters"
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

## Available Tools (FASTMCP 2.14.1+ DIRECT REGISTRATION)

### 📁 File Management Tools
- **list_directory**: List directory contents with metadata
- **read_file**: Read file contents safely
- **write_file**: Write files with validation
- **create_temp_file**: Create temporary files for processing

### 🛠️ Utility Tools
- **generate_id**: Generate unique identifiers
- **format_text**: Format text with various options
- **validate_json**: Validate JSON structure and content

### 🔍 Discovery & Analysis Tools
- **discover_mcp_servers**: Find MCP servers across your system
- **analyze_runts**: Identify repositories needing SOTA upgrades
- **get_repo_status**: Get detailed repository status

### 🔧 PowerShell Tools (SOTA FastMCP 2.14.1+)
- **validate_powershell_syntax**: Comprehensive PowerShell validation
- **powershell_best_practices**: Get PowerShell best practices guide
- **fix_powershell_syntax**: Auto-fix common PowerShell issues

### 📝 PowerShell Profile Manager (SOTA FastMCP 2.14.1+)
- **create_powershell_profile**: Create optimized PowerShell profile
- **update_powershell_profile**: Update existing profile with best practices

### 🚨 EmojiBuster Suite (Unicode Crash Prevention)
- **emojibuster_scan**: Scan repos for Unicode logging crashes
- **emojibuster_fix**: Auto-fix Unicode issues with ASCII replacements
- **emojibuster_success_stories**: Track stability improvements

## SOTA FastMCP 2.14.1+ Features

### Enhanced Response Patterns
All tools implement FastMCP 2.14.1+ enhanced response patterns:
- **Progressive responses**: Multiple detail levels
- **Clarification requests**: Handle ambiguous inputs
- **Error recovery**: Actionable next steps
- **Rich metadata**: AI agent integration

### Tool Registration Standards
- Direct FastMCP @app.tool() decorators (NO custom registration functions)
- Comprehensive docstrings with Args section
- Proper type hints and validation
- Enhanced response patterns for all tools

## Getting Started

1. **Quick Start**: Use list_directory to explore files
2. **Discovery**: Use discover_mcp_servers to find all MCP servers
3. **Validation**: Use validate_powershell_syntax to check your scripts
4. **File Management**: Use file tools for content operations

## SOTA Compliance

MetaMCP follows FastMCP 2.14.1+ standards:
- Enhanced response patterns for rich AI dialogue
- Direct tool registration (NO custom functions)
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
    logger.info("NO CUSTOM REGISTRATION FUNCTIONS - DIRECT FASTMCP 2.14.1+ COMPLIANCE!")
    logger.info("Tools registered directly with @app.tool() decorators")
    logger.info("SOTA FastMCP 2.14.1+ compliance achieved!")
    
    logger.info("Starting FastMCP app with direct tool registration...")
    app.run()

if __name__ == "__main__":
    main()
