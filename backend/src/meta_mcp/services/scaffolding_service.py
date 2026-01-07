from typing import Any, Dict, Optional
from meta_mcp.services.base import MetaMCPService
from meta_mcp.tools.fullstack import create_fullstack_app_tool
from meta_mcp.tools.landing_page_builder import create_landing_page
from meta_mcp.tools.server_builder import create_mcp_server
from meta_mcp.tools.webshop import create_webshop_tool
from meta_mcp.tools.gamemaker import create_game_tool
from meta_mcp.tools.wisdom import create_wisdom_tree_tool


class ScaffoldingService(MetaMCPService):
    """
    Service for scaffolding new projects and applications.
    """

    async def create_fullstack_app(
        self, config: Any, ctx: Optional[Any] = None
    ) -> Dict[str, Any]:
        """Create a fullstack application with FastAPI and React."""
        return await create_fullstack_app_tool(
            name=config.name,
            description=config.description,
            author=config.author,
            target_path=config.target_path,
            include_ai=config.include_ai,
            include_mcp=config.include_mcp,
            include_mcp_server=config.include_mcp_server,
            include_pwa=config.include_pwa,
            include_monitoring=config.include_monitoring,
        )

    async def create_landing_page(
        self, config: Any, ctx: Optional[Any] = None
    ) -> Dict[str, Any]:
        """Create a responsive landing page."""
        return await create_landing_page(
            project_name=config.project_name,
            hero_title=config.hero_title,
            hero_subtitle=config.hero_subtitle,
            github_url=config.github_url,
            target_path=config.target_path,
            author_name=config.author_name,
            author_bio=config.author_bio,
            show_locally=config.show_locally,
        )

    async def create_mcp_server(
        self,
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
        return await create_mcp_server(
            server_name=name,
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

    async def create_webshop(
        self, config: Any, ctx: Optional[Any] = None
    ) -> Dict[str, Any]:
        """Create a fullstack webshop application."""
        return await create_webshop_tool(
            name=config.name, target_path=config.target_path
        )

    async def create_game(
        self, config: Any, ctx: Optional[Any] = None
    ) -> Dict[str, Any]:
        """Create a browser-based game."""
        return await create_game_tool(
            name=config.name, template=config.template, target_path=config.target_path
        )

    async def create_wisdom_tree(
        self, config: Any, ctx: Optional[Any] = None
    ) -> Dict[str, Any]:
        """Create an interactive knowledge tree."""
        return await create_wisdom_tree_tool(
            name=config.name, template=config.template, target_path=config.target_path
        )
