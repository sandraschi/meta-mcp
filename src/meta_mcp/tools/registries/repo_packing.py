from typing import Any, Dict, List, Optional
from fastmcp import FastMCP
from meta_mcp.services.repo_packing_service import RepoPackingService


def register_repo_packing_tools(mcp: FastMCP):
    """Register repository packing tool suite with FastMCP."""

    service = RepoPackingService()

    @mcp.tool(name="pack_repository")
    async def pack_repository(repo_path: str, output_format: str = "xml",
                            include_patterns: Optional[List[str]] = None,
                            exclude_patterns: Optional[List[str]] = None) -> Dict[str, Any]:
        """Pack repository contents into a single AI-friendly file.

        Inspired by repomix, this creates a consolidated view of repository
        contents optimized for AI consumption.

        Args:
            repo_path: Path to the repository to pack
            output_format: Output format - "xml", "markdown", "json", or "plain"
            include_patterns: Glob patterns for files to include
            exclude_patterns: Glob patterns for files to exclude

        Returns:
            Packed repository content with metadata and token analysis
        """
        return await service.pack_repository(repo_path, output_format, include_patterns, exclude_patterns)

    @mcp.tool(name="pack_repository_for_ai")
    async def pack_repository_for_ai(repo_path: str, max_tokens: int = 100000) -> Dict[str, Any]:
        """Pack repository optimized for AI consumption with token limits.

        Automatically optimizes file selection and content to fit within
        LLM context limits while preserving the most important information.

        Args:
            repo_path: Path to the repository to pack
            max_tokens: Maximum token count for the packed output

        Returns:
            AI-optimized repository package with token analysis and compression info
        """
        return await service.pack_for_ai_consumption(repo_path, max_tokens)