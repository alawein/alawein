"""
ORCHEX 2.0 - Base Agent Architecture
Multi-agent autonomous research orchestration system.
"""
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Callable
from enum import Enum, auto
import asyncio
import logging

logger = logging.getLogger(__name__)


class AgentState(Enum):
    IDLE = auto()
    RUNNING = auto()
    WAITING = auto()
    COMPLETED = auto()
    FAILED = auto()


@dataclass
class AgentMessage:
    """Message passed between agents."""
    sender: str
    receiver: str
    content: Dict[str, Any]
    priority: int = 0
    timestamp: float = field(default_factory=lambda: __import__('time').time())


@dataclass
class TaskResult:
    """Result of an agent task execution."""
    success: bool
    data: Any
    error: Optional[str] = None
    execution_time: float = 0.0
    physics_validated: bool = True


class BaseAgent(ABC):
    """Abstract base class for all ORCHEX agents."""

    def __init__(self, name: str, capabilities: List[str] = None):
        self.name = name
        self.capabilities = capabilities or []
        self.state = AgentState.IDLE
        self.message_queue: asyncio.Queue = asyncio.Queue()
        self.results_history: List[TaskResult] = []

    @abstractmethod
    async def execute(self, task: Dict[str, Any]) -> TaskResult:
        """Execute a task. Must be implemented by subclasses."""
        pass

    @abstractmethod
    def can_handle(self, task_type: str) -> bool:
        """Check if agent can handle a specific task type."""
        pass

    async def receive_message(self, message: AgentMessage):
        """Receive a message from another agent."""
        await self.message_queue.put(message)
        logger.info(f"{self.name} received message from {message.sender}")

    async def send_message(self, receiver: 'BaseAgent', content: Dict[str, Any]):
        """Send a message to another agent."""
        message = AgentMessage(sender=self.name, receiver=receiver.name, content=content)
        await receiver.receive_message(message)

    def get_status(self) -> Dict[str, Any]:
        """Get current agent status."""
        return {
            "name": self.name,
            "state": self.state.name,
            "capabilities": self.capabilities,
            "tasks_completed": len(self.results_history),
            "success_rate": self._calculate_success_rate()
        }

    def _calculate_success_rate(self) -> float:
        if not self.results_history:
            return 1.0
        return sum(1 for r in self.results_history if r.success) / len(self.results_history)
