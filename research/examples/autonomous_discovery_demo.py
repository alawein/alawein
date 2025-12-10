#!/usr/bin/env python3
"""
Autonomous Scientific Discovery Demo

Demonstrates the complete ORCHEX 2.0 autonomous research pipeline:
hypothesis generation → experiment design → execution → analysis → validation
"""

import sys
import asyncio
import numpy as np
from pathlib import Path

# Add research modules to path
sys.path.append(str(Path(__file__).parent.parent / "research"))

from orchex.agents.hypothesis_agent import HypothesisAgent
from orchex.agents.experiment_agent import ExperimentAgent
from orchex.agents.analysis_agent import AnalysisAgent
from orchex.orchestrator.coordinator import Coordinator
from optilibria.optilibria.quantum.qaoa import QAOAOptimizer
from optilibria.optilibria.quantum.backends import BackendManager

async def main():
    print("🚀 Autonomous Scientific Discovery Demo")
    print("=" * 50)
    
    # Initialize ORCHEX 2.0 system
    print("\n🤖 Initializing ORCHEX 2.0 Multi-Agent System...")
    
    # Create agents
    hypothesis_agent = HypothesisAgent("hypothesis_001")
    experiment_agent = ExperimentAgent("experiment_001")
    analysis_agent = AnalysisAgent("analysis_001")
    
    # Create coordinator
    coordinator = Coordinator()
    
    # Register agents
    coordinator.register_agent(hypothesis_agent)
    coordinator.register_agent(experiment_agent)
    coordinator.register_agent(analysis_agent)
    
    print("✅ Multi-agent system initialized")
    print(f"  • Hypothesis Agent: {hypothesis_agent.agent_id}")
    print(f"  • Experiment Agent: {experiment_agent.agent_id}")
    print(f"  • Analysis Agent: {analysis_agent.agent_id}")
    
    # Demo 1: Autonomous Superconductor Discovery
    print("\n🔬 Demo 1: Autonomous Superconductor Discovery")
    print("-" * 45)
    
    research_question = "How can we achieve room-temperature superconductivity in layered materials?"
    
    print(f"Research Question: {research_question}")
    print("\n🧠 Phase 1: Hypothesis Generation")
    
    # Generate hypothesis
    hypothesis = await hypothesis_agent.generate_hypothesis(
        research_question=research_question,
        domain="superconductivity",
        constraints={
            'budget': 'medium',
            'timeline': 'long',
            'equipment': 'specialized'
        }
    )
    
    print(f"✅ Hypothesis Generated:")
    print(f"  • ID: {hypothesis.id}")
    print(f"  • Description: {hypothesis.description}")
    print(f"  • Confidence: {hypothesis.confidence:.2f}")
    print(f"  • Novelty Score: {hypothesis.novelty_score:.2f}")
    print(f"  • Feasibility: {hypothesis.feasibility_score:.2f}")
    print(f"  • Impact Score: {hypothesis.impact_score:.2f}")
    
    if hypothesis.physics_constraints:
        print(f"  ⚠️  Physics Constraints: {len(hypothesis.physics_constraints)}")
        for constraint in hypothesis.physics_constraints[:2]:  # Show first 2
            print(f"    - {constraint}")
    
    print(f"\n🔬 Phase 2: Experiment Design")
    
    # Design experiment
    experiment_design = await experiment_agent.design_experiment(
        hypothesis=hypothesis,
        constraints={
            'max_temperature': 400,  # Kelvin
            'max_pressure': 10,      # GPa
            'available_techniques': ['XRD', 'resistivity', 'magnetization']
        }
    )
    
    print(f"✅ Experiment Designed:")
    print(f"  • Type: {experiment_design.experiment_type}")
    print(f"  • Parameters: {len(experiment_design.parameters)} variables")
    print(f"  • Expected Duration: {experiment_design.estimated_duration:.1f} days")
    print(f"  • Success Probability: {experiment_design.success_probability:.2f}")
    
    for i, param in enumerate(experiment_design.parameters[:3]):  # Show first 3
        print(f"    - {param['name']}: {param['range']}")
    
    print(f"\n⚗️ Phase 3: Experiment Execution (Simulated)")
    
    # Execute experiment (simulated)
    experimental_data = await experiment_agent.execute_experiment(experiment_design)
    
    print(f"✅ Experiment Executed:")
    print(f"  • Data Points: {len(experimental_data.measurements)}")
    print(f"  • Success: {experimental_data.success}")
    print(f"  • Quality Score: {experimental_data.quality_score:.2f}")
    
    # Show sample measurements
    for i, measurement in enumerate(experimental_data.measurements[:3]):
        print(f"    - Measurement {i+1}: {measurement}")
    
    print(f"\n📊 Phase 4: Data Analysis")
    
    # Analyze results
    analysis_result = await analysis_agent.analyze_data(
        experimental_data=experimental_data,
        hypothesis=hypothesis
    )
    
    print(f"✅ Analysis Complete:")
    print(f"  • Hypothesis Support: {analysis_result.hypothesis_support:.2f}")
    print(f"  • Statistical Significance: {analysis_result.statistical_significance:.3f}")
    print(f"  • Physics Validation: {analysis_result.physics_valid}")
    print(f"  • Key Findings: {len(analysis_result.key_findings)}")
    
    for finding in analysis_result.key_findings[:2]:  # Show first 2
        print(f"    - {finding}")
    
    if analysis_result.anomalies:
        print(f"  ⚠️  Anomalies Detected: {len(analysis_result.anomalies)}")
    
    # Demo 2: Quantum-Enhanced Materials Optimization
    print("\n⚛️ Demo 2: Quantum-Enhanced Materials Optimization")
    print("-" * 45)
    
    print("🧠 Generating quantum materials hypothesis...")
    
    quantum_hypothesis = await hypothesis_agent.generate_hypothesis(
        research_question="Can topological superconductivity be induced in quantum spin liquids?",
        domain="quantum_materials",
        constraints={'budget': 'high', 'timeline': 'medium'}
    )
    
    print(f"✅ Quantum Hypothesis: {quantum_hypothesis.description[:80]}...")
    print(f"  • Confidence: {quantum_hypothesis.confidence:.2f}")
    
    # Use quantum optimization for experiment design
    print("\n🔧 Quantum-optimized experiment design...")
    
    # Create quantum optimization problem for experiment parameters
    def experiment_cost(params):
        """Cost function for experiment optimization."""
        # Minimize cost while maximizing information gain
        cost = sum(p**2 for p in params)  # Quadratic cost
        info_gain = -sum(np.sin(p) for p in params)  # Information gain
        return cost + 0.5 * info_gain
    
    # Use QAOA for experiment optimization
    backend_manager = BackendManager()
    qaoa = QAOAOptimizer(p=2)
    
    print("Running QAOA optimization for experiment parameters...")
    qaoa_result = qaoa.optimize(experiment_cost, n_vars=4)
    
    print(f"✅ Quantum-Optimized Parameters:")
    print(f"  • Optimal values: {qaoa_result['x']}")
    print(f"  • Cost: {qaoa_result['fun']:.3f}")
    print(f"  • Quantum advantage: {qaoa_result.get('quantum_advantage', False)}")
    
    # Demo 3: Autonomous Research Workflow
    print("\n🔄 Demo 3: Complete Autonomous Workflow")
    print("-" * 45)
    
    # Create autonomous discovery workflow
    workflow_tasks = [
        {
            "task_type": "generate_hypothesis",
            "agent": "HypothesisAgent",
            "data": {
                "research_question": "Novel quantum sensing mechanisms using entangled states",
                "domain": "quantum_materials"
            }
        },
        {
            "task_type": "design_experiment", 
            "agent": "ExperimentAgent",
            "data": {
                "optimization_method": "quantum",
                "constraints": {"budget": "medium"}
            }
        },
        {
            "task_type": "analyze_results",
            "agent": "AnalysisAgent", 
            "data": {
                "validation_level": "strict",
                "physics_checks": True
            }
        }
    ]
    
    # Create and execute workflow
    coordinator.create_workflow("autonomous_discovery", workflow_tasks)
    
    print("🚀 Executing autonomous discovery workflow...")
    workflow_result = await coordinator.execute_workflow("autonomous_discovery")
    
    print(f"✅ Autonomous Workflow Complete:")
    print(f"  • Status: {workflow_result['status']}")
    print(f"  • Tasks Completed: {workflow_result['completed_tasks']}/{workflow_result['total_tasks']}")
    print(f"  • Execution Time: {workflow_result['execution_time']:.2f}s")
    print(f"  • Success Rate: {workflow_result['success_rate']:.1%}")
    
    # Show workflow results
    for task_result in workflow_result['task_results']:
        agent_type = task_result['agent'].split('Agent')[0]
        print(f"    - {agent_type}: {task_result['status']} ({task_result['execution_time']:.2f}s)")
    
    # Demo 4: Multi-Hypothesis Comparison
    print("\n🧪 Demo 4: Multi-Hypothesis Comparison")
    print("-" * 45)
    
    research_questions = [
        "Quantum coherence enhancement in organic superconductors",
        "Topological protection in quantum spin systems", 
        "Machine learning acceleration through quantum entanglement"
    ]
    
    hypotheses = []
    print("Generating multiple hypotheses for comparison...")
    
    for i, question in enumerate(research_questions):
        domain = ["superconductivity", "quantum_materials", "machine_learning"][i]
        hyp = await hypothesis_agent.generate_hypothesis(question, domain)
        hypotheses.append(hyp)
        print(f"  • Hypothesis {i+1}: Confidence {hyp.confidence:.2f}")
    
    # Rank hypotheses
    ranked_hypotheses = sorted(hypotheses, key=lambda h: h.confidence, reverse=True)
    
    print(f"\n🏆 Hypothesis Ranking:")
    for i, hyp in enumerate(ranked_hypotheses):
        print(f"  {i+1}. {hyp.description[:60]}...")
        print(f"     Confidence: {hyp.confidence:.2f} | Impact: {hyp.impact_score:.2f}")
    
    # Summary
    print("\n🎯 Autonomous Discovery Summary")
    print("=" * 50)
    
    agent_summary = hypothesis_agent.get_hypothesis_summary()
    
    print(f"📊 System Performance:")
    print(f"  • Total Hypotheses: {agent_summary['total']}")
    print(f"  • Average Confidence: {agent_summary['average_confidence']:.2f}")
    print(f"  • Physics Valid Rate: {agent_summary['physics_valid_rate']:.1%}")
    print(f"  • Highest Confidence: {agent_summary['highest_confidence']:.2f}")
    print(f"  • Most Novel Score: {agent_summary['most_novel']:.2f}")
    
    print(f"\n🚀 Capabilities Demonstrated:")
    print("  ✅ Physics-constrained hypothesis generation")
    print("  ✅ Quantum-optimized experiment design")
    print("  ✅ Autonomous workflow orchestration")
    print("  ✅ Multi-agent collaboration")
    print("  ✅ Real-time analysis and validation")
    print("  ✅ Hypothesis ranking and comparison")
    
    print(f"\n🎉 Autonomous scientific discovery operational!")
    print("Ready to revolutionize research at the speed of thought!")

if __name__ == "__main__":
    asyncio.run(main())