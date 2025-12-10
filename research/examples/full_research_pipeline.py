"""
Full Autonomous Research Pipeline Demo
Demonstrates ORCHEX multi-agent system with physics constraints.
"""
import asyncio
import numpy as np
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from orchex import (
    Coordinator, HypothesisAgent, ExperimentAgent,
    run_research_pipeline
)
from orchex.agents.analysis_agent import AnalysisAgent
from orchex.physics_engine import PhysicsConstraintEngine


async def demo_hypothesis_generation():
    """Demo hypothesis generation with physics validation."""
    print("=" * 60)
    print("HYPOTHESIS GENERATION WITH PHYSICS VALIDATION")
    print("=" * 60)

    agent = HypothesisAgent()
    physics = PhysicsConstraintEngine()

    # Generate hypotheses
    task = {
        "type": "generate_hypothesis",
        "question": "What crystal structures exhibit room-temperature superconductivity?",
        "domain": "materials_science",
        "count": 5
    }

    result = await agent.execute(task)

    print(f"\nResearch Question: {task['question']}")
    print(f"\nGenerated {len(result.data)} hypotheses:\n")

    for i, h in enumerate(result.data, 1):
        # Validate against physics
        valid, violations = physics.validate_hypothesis(h.statement)
        status = "✓" if valid else "✗"

        print(f"{i}. {status} Score: {h.overall_score:.2f}")
        print(f"   Statement: {h.statement[:60]}...")
        print(f"   Confidence: {h.confidence:.2f}, Testability: {h.testability_score:.2f}")
        if violations:
            print(f"   ⚠ Physics violations: {violations}")
        print()


async def demo_experiment_design():
    """Demo experiment design and simulation."""
    print("=" * 60)
    print("EXPERIMENT DESIGN AND SIMULATION")
    print("=" * 60)

    # First generate a hypothesis
    hyp_agent = HypothesisAgent()
    hyp_task = {
        "type": "generate_hypothesis",
        "question": "Does pressure affect superconducting transition temperature?",
        "count": 1
    }
    hyp_result = await hyp_agent.execute(hyp_task)
    hypothesis = hyp_result.data[0]

    print(f"\nHypothesis: {hypothesis.statement}")

    # Design experiment
    exp_agent = ExperimentAgent()
    design_task = {
        "type": "design_experiment",
        "hypothesis": hypothesis
    }

    design_result = await exp_agent.execute(design_task)
    design = design_result.data

    print(f"\nExperiment Design:")
    print(f"  Name: {design.name}")
    print(f"  Variables: {list(design.variables.keys())}")
    print(f"  Controls: {design.controls}")
    print(f"  Measurements: {design.measurements}")
    print(f"  Estimated duration: {design.estimated_duration_hours:.1f} hours")
    print(f"  Success probability: {design.success_probability:.2%}")

    # Validate design
    validate_task = {
        "type": "validate_design",
        "design": design,
        "budget": 50000,
        "max_hours": 200
    }

    validation = await exp_agent.execute(validate_task)
    print(f"\nValidation: {validation.data}")

    # Simulate experiment
    sim_task = {
        "type": "simulate_experiment",
        "design": design
    }

    sim_result = await exp_agent.execute(sim_task)
    exp_result = sim_result.data

    print(f"\nSimulation Results:")
    print(f"  Success: {exp_result.success}")
    print(f"  Hypothesis supported: {exp_result.hypothesis_supported}")
    print(f"  Confidence: {exp_result.confidence_level:.2%}")
    print(f"  Measurements: {exp_result.measurements}")


async def demo_analysis():
    """Demo result analysis with physics validation."""
    print("\n" + "=" * 60)
    print("RESULT ANALYSIS WITH PHYSICS VALIDATION")
    print("=" * 60)

    agent = AnalysisAgent()

    # Simulated experimental data
    measurements = {
        "tc_sample_1": 45.2,
        "tc_sample_2": 47.8,
        "tc_sample_3": 44.1,
        "tc_control": 0.0,
        "resistance_ratio": 0.001
    }

    uncertainties = {
        "tc_sample_1": 1.2,
        "tc_sample_2": 1.5,
        "tc_sample_3": 1.1,
        "tc_control": 0.1,
        "resistance_ratio": 0.0005
    }

    task = {
        "type": "analyze_results",
        "measurements": measurements,
        "uncertainties": uncertainties,
        "hypothesis": None
    }

    result = await agent.execute(task)
    analysis = result.data

    print(f"\nAnalysis Results:")
    print(f"  Hypothesis supported: {analysis.hypothesis_supported}")
    print(f"  Confidence: {analysis.confidence:.2%}")
    print(f"  P-value: {analysis.p_value:.4f}")
    print(f"  Effect size: {analysis.effect_size:.2f}")
    print(f"  Physics consistent: {analysis.physics_consistent}")

    print(f"\nInsights:")
    for insight in analysis.insights:
        print(f"  • {insight}")

    print(f"\nRecommendations:")
    for rec in analysis.recommendations:
        print(f"  → {rec}")


async def demo_full_pipeline():
    """Demo complete research pipeline."""
    print("\n" + "=" * 60)
    print("FULL AUTONOMOUS RESEARCH PIPELINE")
    print("=" * 60)

    question = "What materials could exhibit high-temperature superconductivity above 200K?"

    print(f"\nResearch Question: {question}")
    print("\nInitializing multi-agent system...")

    # Initialize coordinator
    coordinator = Coordinator()
    coordinator.register_agent(HypothesisAgent())
    coordinator.register_agent(ExperimentAgent())
    coordinator.register_agent(AnalysisAgent())

    print(f"Registered agents: {list(coordinator.agents.keys())}")

    # Define workflow
    workflow = coordinator.create_workflow(
        name="superconductor_discovery",
        stages=[
            {
                "task_type": "generate_hypothesis",
                "agent": "HypothesisAgent",
                "data": {"question": question, "count": 3}
            },
            {
                "task_type": "rank_hypotheses",
                "agent": "HypothesisAgent",
                "data": {"criteria": ["physics_plausibility", "testability_score"]}
            }
        ]
    )

    print(f"\nExecuting workflow: {workflow.name}")
    print(f"Stages: {len(workflow.stages)}")

    # Execute
    result = await coordinator.execute_workflow("superconductor_discovery")

    print(f"\nWorkflow completed!")
    print(f"  Success: {result['success']}")
    print(f"  Stages completed: {len(result.get('results', {}))}")

    # Show system status
    status = coordinator.get_system_status()
    print(f"\nSystem Status:")
    print(f"  Total agents: {status['total_agents']}")
    for name, agent_status in status['agents'].items():
        print(f"  • {name}: {agent_status['state']}, {agent_status['tasks_completed']} tasks")


async def demo_physics_constraints():
    """Demo physics constraint engine."""
    print("\n" + "=" * 60)
    print("PHYSICS CONSTRAINT ENGINE")
    print("=" * 60)

    engine = PhysicsConstraintEngine()

    # Test various physics scenarios
    print("\n1. Energy Conservation Test:")
    data1 = {
        "initial_energy": 100.0,
        "final_energy": 100.0,
        "work_done": 0,
        "heat_added": 0
    }
    valid, violations = engine.check_all(data1)
    print(f"   Conserved system: Valid = {valid}")

    data2 = {
        "initial_energy": 100.0,
        "final_energy": 150.0,  # Energy appeared from nowhere!
        "work_done": 0,
        "heat_added": 0
    }
    valid, violations = engine.check_all(data2)
    print(f"   Violated system: Valid = {valid}")
    if violations:
        print(f"   Violation: {violations[0].constraint_name}")

    print("\n2. Quantum State Normalization:")
    data3 = {"quantum_state": np.array([1, 0, 0, 0], dtype=complex)}
    valid, _ = engine.check_all(data3)
    print(f"   Normalized |00⟩: Valid = {valid}")

    data4 = {"quantum_state": np.array([1, 1, 0, 0], dtype=complex)}
    valid, violations = engine.check_all(data4)
    print(f"   Unnormalized: Valid = {valid}")

    print("\n3. Hypothesis Validation:")
    hypotheses = [
        "High pressure increases Tc in hydrides",
        "A perpetual motion machine could generate unlimited energy",
        "Electron pairing leads to superconductivity"
    ]

    for h in hypotheses:
        valid, violations = engine.validate_hypothesis(h)
        status = "✓" if valid else "✗"
        print(f"   {status} {h[:50]}...")
        if violations:
            print(f"      ⚠ {violations[0]}")


async def main():
    """Run all demos."""
    print("\n" + "🔬" * 30)
    print("\n  ORCHEX 2.0 - AUTONOMOUS RESEARCH DEMONSTRATION\n")
    print("🔬" * 30 + "\n")

    await demo_hypothesis_generation()
    await demo_experiment_design()
    await demo_analysis()
    await demo_physics_constraints()
    await demo_full_pipeline()

    print("\n" + "=" * 60)
    print("✅ ALL DEMONSTRATIONS COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
