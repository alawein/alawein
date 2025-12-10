"""
ORCHEX 2.0 - Multi-Agent Coordinator
Orchestrates research workflow across multiple specialized agents.
"""
import asyncio
from typing import Any, Dict, List, Optional, Type
from dataclasses import dataclass
from enum import Enum, auto
import logging

from ..agents.base_agent import BaseAgent, AgentMessage, TaskResult, AgentState

logger = logging.getLogger(__name__)


class WorkflowState(Enum):
    PENDING = auto()
    RUNNING = auto()
    PAUSED = auto()
    COMPLETED = auto()
    FAILED = auto()


@dataclass
class ResearchWorkflow:
    """Definition of a research workflow."""
    name: str
    stages: List[Dict[str, Any]]
    current_stage: int = 0
    state: WorkflowState = WorkflowState.PENDING
    results: Dict[str, Any] = None

    def __post_init__(self):
        if self.results is None:
            self.results = {}


class Coordinator:
    """
    Central coordinator for multi-agent research orchestration.

    Manages agent lifecycle, task distribution, and workflow execution.
    """

    def __init__(self):
        self.agents: Dict[str, BaseAgent] = {}
        self.workflows: Dict[str, ResearchWorkflow] = {}
        self.message_bus: asyncio.Queue = asyncio.Queue()
        self.running = False

    def register_agent(self, agent: BaseAgent):
        """Register an agent with the coordinator."""
        self.agents[agent.name] = agent
        logger.info(f"Registered agent: {agent.name} with capabilities: {agent.capabilities}")

    def unregister_agent(self, agent_name: str):
        """Remove an agent from the coordinator."""
        if agent_name in self.agents:
            del self.agents[agent_name]
            logger.info(f"Unregistered agent: {agent_name}")

    def create_workflow(self, name: str, stages: List[Dict[str, Any]]) -> ResearchWorkflow:
        """Create a new research workflow."""
        workflow = ResearchWorkflow(name=name, stages=stages)
        self.workflows[name] = workflow
        return workflow

    async def execute_workflow(self, workflow_name: str) -> Dict[str, Any]:
        """Execute a complete research workflow."""
        workflow = self.workflows.get(workflow_name)
        if not workflow:
            raise ValueError(f"Workflow not found: {workflow_name}")

        workflow.state = WorkflowState.RUNNING
        logger.info(f"Starting workflow: {workflow_name}")

        try:
            for i, stage in enumerate(workflow.stages):
                workflow.current_stage = i
                stage_result = await self._execute_stage(stage, workflow.results)
                workflow.results[f"stage_{i}"] = stage_result

                if not stage_result.success:
                    workflow.state = WorkflowState.FAILED
                    return {"success": False, "failed_stage": i, "error": stage_result.error}

            workflow.state = WorkflowState.COMPLETED
            return {"success": True, "results": workflow.results}

        except Exception as e:
            workflow.state = WorkflowState.FAILED
            logger.error(f"Workflow failed: {e}")
            return {"success": False, "error": str(e)}

    async def _execute_stage(self, stage: Dict[str, Any], context: Dict[str, Any]) -> TaskResult:
        """Execute a single workflow stage."""
        task_type = stage.get("task_type")
        agent_name = stage.get("agent")
        task_data = stage.get("data", {})

        # Inject context from previous stages
        task_data["context"] = context
        task_data["type"] = task_type

        # Find appropriate agent
        agent = self._find_agent(agent_name, task_type)
        if not agent:
            return TaskResult(success=False, data=None, error=f"No agent found for task: {task_type}")

        # Execute task
        return await agent.execute(task_data)

    def _find_agent(self, agent_name: Optional[str], task_type: str) -> Optional[BaseAgent]:
        """Find an agent that can handle the task."""
        if agent_name and agent_name in self.agents:
            return self.agents[agent_name]

        # Find by capability
        for agent in self.agents.values():
            if agent.can_handle(task_type):
                return agent

        return None

    async def broadcast_message(self, content: Dict[str, Any], sender: str = "Coordinator"):
        """Broadcast a message to all agents."""
        for agent in self.agents.values():
            message = AgentMessage(sender=sender, receiver=agent.name, content=content)
            await agent.receive_message(message)

    def get_system_status(self) -> Dict[str, Any]:
        """Get status of all agents and workflows."""
        return {
            "agents": {name: agent.get_status() for name, agent in self.agents.items()},
            "workflows": {
                name: {"state": wf.state.name, "current_stage": wf.current_stage}
                for name, wf in self.workflows.items()
            },
            "total_agents": len(self.agents),
            "active_workflows": sum(1 for wf in self.workflows.values() if wf.state == WorkflowState.RUNNING)
        }


async def run_research_pipeline(question: str) -> Dict[str, Any]:
    """
    Run a complete autonomous research pipeline.

    Example usage:
        result = await run_research_pipeline("What materials exhibit room-temperature superconductivity?")
    """
    from ..agents.hypothesis_agent import HypothesisAgent
    from ..agents.experiment_agent import ExperimentAgent

    # Initialize coordinator and agents
    coordinator = Coordinator()
    coordinator.register_agent(HypothesisAgent())
    coordinator.register_agent(ExperimentAgent())

    # Define research workflow
    workflow = coordinator.create_workflow(
        name="autonomous_research",
        stages=[
            {"task_type": "generate_hypothesis", "agent": "HypothesisAgent",
             "data": {"question": question, "count": 5}},
            {"task_type": "rank_hypotheses", "agent": "HypothesisAgent", "data": {}},
            {"task_type": "design_experiment", "agent": "ExperimentAgent", "data": {}},
            {"task_type": "validate_design", "agent": "ExperimentAgent", "data": {}},
            {"task_type": "simulate_experiment", "agent": "ExperimentAgent", "data": {}},
        ]
    )

    # Execute workflow
    result = await coordinator.execute_workflow("autonomous_research")

    return result
