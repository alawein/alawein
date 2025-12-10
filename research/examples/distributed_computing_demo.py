"""
Distributed Quantum Computing Demo
Demonstrates the quantum cluster and hybrid workflows.
"""
import asyncio
import numpy as np
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from optilibria.optilibria.distributed import (
    QuantumCluster,
    ResourceType,
    HybridWorkflow
)


async def demo_cluster_setup():
    """Demo cluster setup and status."""
    print("=" * 60)
    print("QUANTUM CLUSTER SETUP")
    print("=" * 60)

    cluster = QuantumCluster(max_workers=4)

    # Add resources
    cluster.add_quantum_simulator("quantum_sim_1", capacity=10)
    cluster.add_quantum_simulator("quantum_sim_2", capacity=10)
    cluster.add_gpu_cluster("gpu_cluster", n_gpus=4)

    print("\nCluster Resources:")
    status = cluster.get_cluster_status()
    for name, info in status['resources'].items():
        print(f"  {name}: {info['type']}, Available: {info['available']}")

    return cluster


async def demo_parallel_qaoa(cluster: QuantumCluster):
    """Demo parallel QAOA execution."""
    print("\n" + "=" * 60)
    print("PARALLEL QAOA EXECUTION")
    print("=" * 60)

    await cluster.start()

    # Define multiple MaxCut problems
    problems = [
        ([(0,1), (1,2), (2,0)], 3),  # Triangle
        ([(0,1), (1,2), (2,3), (3,0)], 4),  # Square
        ([(0,1), (1,2), (2,3), (3,4), (4,0)], 5),  # Pentagon
    ]

    task_ids = []
    for edges, n_vars in problems:
        def make_cost(e):
            return lambda x: -sum(x[i] != x[j] for i, j in e)

        cost_fn = make_cost(edges)
        task_id = await cluster.submit_qaoa(cost_fn, n_vars=n_vars, p=1)
        task_ids.append((task_id, n_vars))
        print(f"Submitted QAOA for {n_vars}-node graph: {task_id}")

    print("\nWaiting for results...")
    for task_id, n_vars in task_ids:
        try:
            result = await cluster.get_result(task_id, timeout=30)
            print(f"  {task_id} ({n_vars} nodes): Cost = {result['fun']}")
        except Exception as e:
            print(f"  {task_id}: Failed - {e}")

    print("\nCluster Status:")
    status = cluster.get_cluster_status()
    print(f"  Completed: {status['tasks']['completed']}")
    print(f"  Failed: {status['tasks']['failed']}")

    await cluster.stop()


async def demo_hybrid_workflow(cluster: QuantumCluster):
    """Demo hybrid quantum-classical workflow."""
    print("\n" + "=" * 60)
    print("HYBRID QUANTUM-CLASSICAL WORKFLOW")
    print("=" * 60)

    await cluster.start()

    # Define workflow stages
    def classical_preprocess(deps):
        """Classical preprocessing."""
        print("  Running classical preprocessing...")
        return {'data': np.random.randn(10)}

    def quantum_compute(deps):
        """Quantum computation."""
        print("  Running quantum computation...")
        data = deps.get('preprocess', {}).get('data', np.zeros(10))
        return {'quantum_result': np.sum(data**2)}

    def classical_postprocess(deps):
        """Classical postprocessing."""
        print("  Running classical postprocessing...")
        qr = deps.get('quantum', {}).get('quantum_result', 0)
        return {'final_result': np.sqrt(qr)}

    workflow = HybridWorkflow(cluster)
    workflow.add_classical_stage('preprocess', classical_preprocess)
    workflow.add_quantum_stage('quantum', quantum_compute, depends_on=['preprocess'])
    workflow.add_classical_stage('postprocess', classical_postprocess, depends_on=['quantum'])

    print("\nExecuting workflow...")
    results = await workflow.execute()

    print("\nWorkflow Results:")
    for stage, result in results.items():
        print(f"  {stage}: {result}")

    await cluster.stop()


async def demo_vqe_distributed():
    """Demo distributed VQE execution."""
    print("\n" + "=" * 60)
    print("DISTRIBUTED VQE EXECUTION")
    print("=" * 60)

    cluster = QuantumCluster(max_workers=2)
    cluster.add_quantum_simulator("vqe_sim", capacity=5)

    await cluster.start()

    # Create H2 Hamiltonians at different bond lengths
    from optilibria.optilibria import create_h2_hamiltonian

    bond_lengths = [0.5, 0.74, 1.0, 1.5]
    task_ids = []

    print("Submitting VQE tasks for H2 at different bond lengths...")
    for r in bond_lengths:
        H, n_qubits = create_h2_hamiltonian(r)
        task_id = await cluster.submit_vqe(H, n_qubits, depth=2)
        task_ids.append((task_id, r))
        print(f"  r={r:.2f} A: {task_id}")

    print("\nResults:")
    for task_id, r in task_ids:
        try:
            result = await cluster.get_result(task_id, timeout=60)
            print(f"  r={r:.2f} A: E = {result['energy']:.6f} Hartree")
        except Exception as e:
            print(f"  r={r:.2f} A: Failed - {e}")

    await cluster.stop()


async def main():
    print("\n" + "=" * 60)
    print("DISTRIBUTED QUANTUM COMPUTING DEMONSTRATION")
    print("=" * 60)

    cluster = await demo_cluster_setup()
    await demo_parallel_qaoa(cluster)

    cluster2 = QuantumCluster(max_workers=4)
    cluster2.add_quantum_simulator("sim", capacity=10)
    cluster2.add_gpu_cluster("gpu", n_gpus=2)
    await demo_hybrid_workflow(cluster2)

    await demo_vqe_distributed()

    print("\n" + "=" * 60)
    print("DEMONSTRATION COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
