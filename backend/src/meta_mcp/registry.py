from typing import Dict, List, Callable
import structlog
from fastmcp import FastMCP

logger = structlog.get_logger(__name__)


class MetaMCPRegistry:
    """
    Decentralized registry for Meta MCP tool suites.
    Allows loading tools from different logical clusters into a FastMCP instance.
    """

    def __init__(self, mcp: FastMCP):
        self.mcp = mcp
        self._suites: Dict[str, List[Callable]] = {}

    def register_suite(self, name: str, registration_func: Callable[[FastMCP], None]):
        """Register a suite of tools using a provided registration function."""
        logger.info(f"Registering tool suite: {name}")
        registration_func(self.mcp)
        self._suites[name] = registration_func

    def get_registered_suites(self) -> List[str]:
        """Return a list of all registered suites."""
        return list(self._suites.keys())
