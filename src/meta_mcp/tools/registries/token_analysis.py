from typing import Any, Dict, List, Optional
from fastmcp import FastMCP
from meta_mcp.services.token_analysis_service import TokenAnalysisService


def register_token_analysis_tools(mcp: FastMCP):
    """Register token analysis tool suite with FastMCP."""

    service = TokenAnalysisService()

    @mcp.tool(name="analyze_file_tokens")
    async def analyze_file_tokens(file_path: str) -> Dict[str, Any]:
        """Analyze token usage in a specific file.

        Args:
            file_path: Path to the file to analyze

        Returns:
            Token analysis including count, language detection, and metrics
        """
        return await service.analyze_file_tokens(file_path)

    @mcp.tool(name="analyze_directory_tokens")
    async def analyze_directory_tokens(dir_path: str, extensions: Optional[List[str]] = None) -> Dict[str, Any]:
        """Analyze token usage across all files in a directory.

        Args:
            dir_path: Path to the directory to analyze
            extensions: File extensions to include (default: common programming languages)

        Returns:
            Comprehensive token analysis with distribution statistics
        """
        return await service.analyze_directory_tokens(dir_path, extensions)

    @mcp.tool(name="estimate_context_limits")
    async def estimate_context_limits(token_count: int) -> Dict[str, Any]:
        """Estimate how a token count fits within various LLM context limits.

        Args:
            token_count: Number of tokens to analyze

        Returns:
            Compatibility analysis across major LLM models with recommendations
        """
        return await service.estimate_context_limits(token_count)