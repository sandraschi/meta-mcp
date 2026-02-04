# 🔍 Analysis Suite

**Advanced insights and SOTA compliance.**

Tools that provide meta-analysis of the MCP ecosystem, focusing on standardization, metrics, and deep metadata extraction.

## Tools

### `mcp_analyze_with_repomix`
Leverage Repomix-inspired logic to analyze a repository.
- **Features**: Intelligent packing, context-aware analysis.
- **Args**: `repo_path` (str), `analysis_type` (str)

### `mcp_estimate_context_limits`
Estimate how a set of files or tokens fits into standard LLM context windows.
- **Args**: `token_count` (int)

### `mcp_validate_tool_parameters` (Analysis Mode)
Static analysis of tool parameters against schemas without execution.

## Key Capabilities
- **SOTA Compliance**: Verifies projects against the January 2026 "State of the Art" standards (FastMCP 2.14.1+, `pyproject.toml`, proper logging).
- **Metadata Extraction**: Pulls rich metadata from tool definitions, helping to visualize what an MCP server is capable of without running it.
