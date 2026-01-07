from fastmcp import FastMCP, Context
from meta_mcp.services.scaffolding_service import ScaffoldingService
from meta_mcp.models.scaffolding import FullstackAppConfig, LandingPageConfig
from typing import Dict, Any


def register_scaffolding_tools(mcp: FastMCP):
    """Register scaffolding tool suite with FastMCP."""

    service = ScaffoldingService()

    @mcp.tool(name="create_fullstack_app")
    async def create_fullstack_app(
        config: FullstackAppConfig, ctx: Context
    ) -> Dict[str, Any]:
        """Create a fullstack FastAPI + React application via interactive elicitation."""
        return await service.create_fullstack_app(config, ctx)

    @mcp.tool(name="create_landing_page")
    async def create_landing_page(
        config: LandingPageConfig, ctx: Context
    ) -> Dict[str, Any]:
        """Create a stunning, responsive landing page via interactive elicitation."""
        return await service.create_landing_page(config, ctx)

    @mcp.tool(name="create_mcp_server")
    async def create_mcp_server(
        name: str,
        description: str,
        author: str = "MCP Studio",
        repository_path: str = ".",
        license_type: str = "MIT",
        include_ci: bool = True,
        include_tests: bool = True,
        include_docs: bool = True,
        include_frontend: bool = False,
        frontend_type: str = "fullstack",
        include_mcpb: bool = True,
        build_mcpb: bool = True,
        dual_connect: bool = False,
        include_prd: bool = True,
        include_changelog: bool = True,
        include_prompts: bool = True,
    ) -> Dict[str, Any]:
        """Scaffold a new SOTA-compliant MCP server repository."""
        return await service.create_mcp_server(
            name=name,
            description=description,
            author=author,
            repository_path=repository_path,
            license_type=license_type,
            include_ci=include_ci,
            include_tests=include_tests,
            include_docs=include_docs,
            include_frontend=include_frontend,
            frontend_type=frontend_type,
            include_mcpb=include_mcpb,
            build_mcpb=build_mcpb,
            dual_connect=dual_connect,
            include_prd=include_prd,
            include_changelog=include_changelog,
            include_prompts=include_prompts,
        )

    @mcp.tool(name="create_webshop")
    async def create_webshop(config: Any, ctx: Context) -> Dict[str, Any]:
        """Create a fullstack webshop application via interactive elicitation."""
        return await service.create_webshop(config, ctx)

    @mcp.tool(name="create_game")
    async def create_game(config: Any, ctx: Context) -> Dict[str, Any]:
        """Create a browser-based game via interactive elicitation."""
        return await service.create_game(config, ctx)

    @mcp.tool(name="create_wisdom_tree")
    async def create_wisdom_tree(config: Any, ctx: Context) -> Dict[str, Any]:
        """Create an interactive wisdom tree via interactive elicitation."""
        return await service.create_wisdom_tree(config, ctx)
