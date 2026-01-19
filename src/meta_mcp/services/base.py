import abc
from typing import Any, Dict, Optional
import structlog

logger = structlog.get_logger(__name__)


class MetaMCPService(abc.ABC):
    """
    Base class for all Meta MCP services.
    Provides standard patterns for response generation and diagnostic metadata.
    """

    def __init__(self):
        self.logger = structlog.get_logger(self.__class__.__name__)

    def create_response(
        self,
        success: bool,
        message: str,
        data: Optional[Dict[str, Any]] = None,
        errors: Optional[list] = None,
    ) -> Dict[str, Any]:
        """Create a standard SOTA-compliant response dictionary."""
        return {
            "success": success,
            "message": message,
            "data": data or {},
            "errors": errors or [],
            "metadata": {
                "service": self.__class__.__name__,
                "timestamp": __import__("time").time(),
            },
        }

    async def get_health_status(self) -> Dict[str, Any]:
        """Get basic health status for this service."""
        return {
            "healthy": True,
            "service": self.__class__.__name__,
            "status": "operational",
        }
