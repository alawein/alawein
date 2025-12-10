"""
Distributed Quantum Computing
Orchestrates quantum workloads across multiple backends and classical resources.
"""
import numpy as np
import asyncio
from typing import Dict, List, Any, Optional, Callable, Tuple
from dataclasses import dataclass, field
from enum import Enum, auto
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
import time


class ResourceType(Enum):
    """Types of computing resources."""
    QUANTUM_SIMULATOR = auto()
    QUANTUM_HARDWARE = auto()
    GPU = auto()
    CPU = auto()
    TPU = auto()


class TaskStatus(Enum):
    """Status of a distributed task."""
    PENDING = auto()
    QUEUED = auto()
    RUNNING = auto()
    COMPLETED = auto()
    FAILED = auto()
    CANCELLED = auto()


@dataclass
class ComputeResource:
    """Represents a computing resource."""
    name: str
    resource_type: ResourceType
    capacity: int  # Max concurrent tasks
    current_load: int = 0
    available: bool = True
    cost_per_hour: float = 0.0
    performance_factor: float = 1.0

    @property
    def utilization(self) -> float:
        return self.current_load / self.capacity if self.capacity > 0 else 0


@dataclass
class DistributedTask:
    """A task to be executed on distributed resources."""
    task_id: str
    function: Callable
    args: Tuple = field(default_factory=tuple)
    kwargs: Dict = field(default_factory=dict)
    resource_requirements: List[ResourceType] = field(default_factory=list)
    priority: int = 0
    status: TaskStatus = TaskStatus.PENDING
    result: Any = None
    error: Optional[str] = None
    start_time: Optional[float] = None
    end_time: Optional[float] = None
    assigned_resource: Optional[str] = None

    @property
    def execution_time(self) -> Optional[float]:
        if self.start_time and self.end_time:
            return self.end_time - self.start_time
        return None


class ResourceScheduler:
    """Schedules tasks across available resources."""

    def __init__(self, strategy: str = 'least_loaded'):
        self.strategy = strategy

    def select_resource(
        self,
        task: DistributedTask,
        resources: Dict[str, ComputeResource]
    ) -> Optional[str]:
        """Select best resource for a task."""
        compatible = []

        for name, resource in resources.items():
            if not resource.available:
                continue
            if resource.current_load >= resource.capacity:
                continue
            if task.resource_requirements:
                if resource.resource_type not in task.resource_requirements:
                    continue
            compatible.append((name, resource))

        if not compatible:
            return None

        if self.strategy == 'least_loaded':
            return min(compatible, key=lambda x: x[1].utilization)[0]
        elif self.strategy == 'fastest':
            return max(compatible, key=lambda x: x[1].performance_factor)[0]
        elif self.strategy == 'cheapest':
            return min(compatible, key=lambda x: x[1].cost_per_hour)[0]
        else:
            return compatible[0][0]


class QuantumCluster:
    """
    Distributed quantum computing cluster.
    Manages quantum and classical resources for hybrid workloads.
    """

    def __init__(self, max_workers: int = 4):
        self.resources: Dict[str, ComputeResource] = {}
        self.tasks: Dict[str, DistributedTask] = {}
        self.task_queue: asyncio.Queue = asyncio.Queue()
        self.scheduler = ResourceScheduler()
        self.executor = ThreadPoolExecutor(max_workers=max_workers)
        self.running = False
        self._task_counter = 0

    def add_resource(self, resource: ComputeResource):
        """Add a computing resource to the cluster."""
        self.resources[resource.name] = resource

    def add_quantum_simulator(self, name: str, capacity: int = 10):
        """Add a quantum simulator resource."""
        self.add_resource(ComputeResource(
            name=name,
            resource_type=ResourceType.QUANTUM_SIMULATOR,
            capacity=capacity,
            performance_factor=1.0
        ))

    def add_quantum_hardware(self, name: str, provider: str = 'ibm'):
        """Add quantum hardware resource."""
        self.add_resource(ComputeResource(
            name=name,
            resource_type=ResourceType.QUANTUM_HARDWARE,
            capacity=1,  # Usually one job at a time
            cost_per_hour=1.0,
            performance_factor=0.5  # Slower due to queue times
        ))

    def add_gpu_cluster(self, name: str, n_gpus: int = 4):
        """Add GPU cluster resource."""
        self.add_resource(ComputeResource(
            name=name,
            resource_type=ResourceType.GPU,
            capacity=n_gpus,
            performance_factor=10.0
        ))

    async def submit(
        self,
        function: Callable,
        *args,
        resource_types: List[ResourceType] = None,
        priority: int = 0,
        **kwargs
    ) -> str:
        """
        Submit a task to the cluster.

        Returns:
            Task ID for tracking
        """
        self._task_counter += 1
        task_id = f"task_{self._task_counter}"

        task = DistributedTask(
            task_id=task_id,
            function=function,
            args=args,
            kwargs=kwargs,
            resource_requirements=resource_types or [],
            priority=priority
        )

        self.tasks[task_id] = task
        await self.task_queue.put(task)

        return task_id

    async def submit_quantum_circuit(
        self,
        circuit_function: Callable,
        n_shots: int = 1000,
        use_hardware: bool = False
    ) -> str:
        """Submit a quantum circuit for execution."""
        resource_types = [ResourceType.QUANTUM_HARDWARE] if use_hardware else [ResourceType.QUANTUM_SIMULATOR]

        return await self.submit(
            circuit_function,
            n_shots,
            resource_types=resource_types,
            priority=1 if use_hardware else 0
        )

    async def submit_vqe(
        self,
        hamiltonian: np.ndarray,
        n_qubits: int,
        depth: int = 2
    ) -> str:
        """Submit VQE optimization task."""
        from ..quantum.vqe import VQEOptimizer

        def run_vqe():
            vqe = VQEOptimizer(depth=depth)
            return vqe.optimize(hamiltonian, n_qubits)

        return await self.submit(
            run_vqe,
            resource_types=[ResourceType.QUANTUM_SIMULATOR, ResourceType.GPU]
        )

    async def submit_qaoa(
        self,
        cost_function: Callable,
        n_vars: int,
        p: int = 2
    ) -> str:
        """Submit QAOA optimization task."""
        from ..quantum.qaoa import QAOAOptimizer

        def run_qaoa():
            qaoa = QAOAOptimizer(p=p)
            return qaoa.optimize(cost_function, n_vars)

        return await self.submit(
            run_qaoa,
            resource_types=[ResourceType.QUANTUM_SIMULATOR]
        )

    async def get_result(self, task_id: str, timeout: float = None) -> Any:
        """Get result of a task, waiting if necessary."""
        task = self.tasks.get(task_id)
        if not task:
            raise ValueError(f"Unknown task: {task_id}")

        start = time.time()
        while task.status not in [TaskStatus.COMPLETED, TaskStatus.FAILED]:
            if timeout and (time.time() - start) > timeout:
                raise TimeoutError(f"Task {task_id} did not complete in time")
            await asyncio.sleep(0.1)

        if task.status == TaskStatus.FAILED:
            raise RuntimeError(f"Task failed: {task.error}")

        return task.result

    async def start(self):
        """Start the cluster worker loop."""
        self.running = True
        asyncio.create_task(self._worker_loop())

    async def stop(self):
        """Stop the cluster."""
        self.running = False
        self.executor.shutdown(wait=True)

    async def _worker_loop(self):
        """Main worker loop processing tasks."""
        while self.running:
            try:
                task = await asyncio.wait_for(self.task_queue.get(), timeout=1.0)
            except asyncio.TimeoutError:
                continue

            # Find resource
            resource_name = self.scheduler.select_resource(task, self.resources)

            if resource_name is None:
                # Re-queue if no resource available
                await self.task_queue.put(task)
                await asyncio.sleep(0.1)
                continue

            # Execute task
            resource = self.resources[resource_name]
            resource.current_load += 1
            task.assigned_resource = resource_name
            task.status = TaskStatus.RUNNING
            task.start_time = time.time()

            try:
                # Run in thread pool
                loop = asyncio.get_event_loop()
                result = await loop.run_in_executor(
                    self.executor,
                    lambda: task.function(*task.args, **task.kwargs)
                )
                task.result = result
                task.status = TaskStatus.COMPLETED
            except Exception as e:
                task.error = str(e)
                task.status = TaskStatus.FAILED
            finally:
                task.end_time = time.time()
                resource.current_load -= 1

    def get_cluster_status(self) -> Dict[str, Any]:
        """Get current cluster status."""
        return {
            'resources': {
                name: {
                    'type': r.resource_type.name,
                    'utilization': f"{r.utilization:.1%}",
                    'available': r.available
                }
                for name, r in self.resources.items()
            },
            'tasks': {
                'total': len(self.tasks),
                'pending': sum(1 for t in self.tasks.values() if t.status == TaskStatus.PENDING),
                'running': sum(1 for t in self.tasks.values() if t.status == TaskStatus.RUNNING),
                'completed': sum(1 for t in self.tasks.values() if t.status == TaskStatus.COMPLETED),
                'failed': sum(1 for t in self.tasks.values() if t.status == TaskStatus.FAILED)
            },
            'queue_size': self.task_queue.qsize()
        }


class HybridWorkflow:
    """
    Defines a hybrid quantum-classical workflow.
    Automatically partitions work between quantum and classical resources.
    """

    def __init__(self, cluster: QuantumCluster):
        self.cluster = cluster
        self.stages: List[Dict] = []

    def add_quantum_stage(
        self,
        name: str,
        circuit_function: Callable,
        depends_on: List[str] = None
    ):
        """Add a quantum computation stage."""
        self.stages.append({
            'name': name,
            'type': 'quantum',
            'function': circuit_function,
            'depends_on': depends_on or []
        })
        return self

    def add_classical_stage(
        self,
        name: str,
        function: Callable,
        depends_on: List[str] = None
    ):
        """Add a classical computation stage."""
        self.stages.append({
            'name': name,
            'type': 'classical',
            'function': function,
            'depends_on': depends_on or []
        })
        return self

    async def execute(self) -> Dict[str, Any]:
        """Execute the workflow."""
        results = {}
        completed = set()

        while len(completed) < len(self.stages):
            for stage in self.stages:
                if stage['name'] in completed:
                    continue

                # Check dependencies
                deps_met = all(d in completed for d in stage['depends_on'])
                if not deps_met:
                    continue

                # Get dependency results
                dep_results = {d: results[d] for d in stage['depends_on']}

                # Submit task
                if stage['type'] == 'quantum':
                    task_id = await self.cluster.submit(
                        stage['function'],
                        dep_results,
                        resource_types=[ResourceType.QUANTUM_SIMULATOR]
                    )
                else:
                    task_id = await self.cluster.submit(
                        stage['function'],
                        dep_results,
                        resource_types=[ResourceType.CPU, ResourceType.GPU]
                    )

                # Wait for result
                result = await self.cluster.get_result(task_id)
                results[stage['name']] = result
                completed.add(stage['name'])

        return results


async def demo_distributed_quantum():
    """Demonstrate distributed quantum computing."""
    # Create cluster
    cluster = QuantumCluster(max_workers=4)
    cluster.add_quantum_simulator("sim_1", capacity=10)
    cluster.add_quantum_simulator("sim_2", capacity=10)
    cluster.add_gpu_cluster("gpu_cluster", n_gpus=2)

    await cluster.start()

    print("Cluster Status:", cluster.get_cluster_status())

    # Submit multiple QAOA tasks
    def maxcut(x):
        return -sum(x[i] != x[j] for i, j in [(0,1), (1,2), (2,0)])

    task_ids = []
    for i in range(5):
        task_id = await cluster.submit_qaoa(maxcut, n_vars=3, p=1)
        task_ids.append(task_id)
        print(f"Submitted task {task_id}")

    # Wait for results
    for task_id in task_ids:
        result = await cluster.get_result(task_id, timeout=30)
        print(f"Task {task_id}: {result['fun']}")

    print("\nFinal Status:", cluster.get_cluster_status())

    await cluster.stop()


if __name__ == "__main__":
    asyncio.run(demo_distributed_quantum())
