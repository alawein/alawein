"""
Materials Discovery Demo
Demonstrates the quantum-enhanced materials discovery pipeline.
"""
import asyncio
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from qmatsim.qmatsim.discovery import (
    MaterialsDiscoveryPipeline,
    MaterialProperty,
    StructureGenerator,
    discover_superconductors
)


async def demo_structure_generation():
    """Demo structure generation."""
    print("=" * 60)
    print("CRYSTAL STRUCTURE GENERATION")
    print("=" * 60)

    generator = StructureGenerator()

    # Generate random structures
    print("\nRandom structures:")
    for i in range(3):
        structure = generator.generate_random(n_atoms=4)
        print(f"  {i+1}. {structure.formula} - {structure.n_atoms} atoms, V={structure.volume:.1f} A^3")

    # Generate superconductor candidates
    print("\nSuperconductor candidates:")
    candidates = generator.generate_superconductor_candidates(5)
    for i, structure in enumerate(candidates):
        print(f"  {i+1}. {structure.formula}")


async def demo_property_prediction():
    """Demo property prediction."""
    print("\n" + "=" * 60)
    print("PROPERTY PREDICTION")
    print("=" * 60)

    from qmatsim.qmatsim.discovery import PropertyPredictor

    generator = StructureGenerator()
    predictor = PropertyPredictor()

    structures = generator.generate_superconductor_candidates(5)

    print("\nPredicted superconducting Tc:")
    for structure in structures:
        props = predictor.predict(structure, [MaterialProperty.SUPERCONDUCTING_TC])
        tc = props.get(MaterialProperty.SUPERCONDUCTING_TC, 0)
        print(f"  {structure.formula}: Tc = {tc:.1f} K")


async def demo_full_pipeline():
    """Demo full discovery pipeline."""
    print("\n" + "=" * 60)
    print("FULL MATERIALS DISCOVERY PIPELINE")
    print("=" * 60)

    pipeline = MaterialsDiscoveryPipeline(
        target_property=MaterialProperty.SUPERCONDUCTING_TC,
        target_value=300.0  # Room temperature target
    )

    validated = await pipeline.run_discovery(
        n_candidates=30,
        n_validate=5
    )

    print("\nTop candidates:")
    top = pipeline.get_top_candidates(5)
    for i, candidate in enumerate(top):
        tc = candidate.predicted_properties.get(MaterialProperty.SUPERCONDUCTING_TC, 0)
        print(f"  {i+1}. {candidate.structure.formula}")
        print(f"     Predicted Tc: {tc:.1f} K")
        print(f"     Confidence: {candidate.confidence:.2%}")
        print(f"     DFT Validated: {candidate.dft_validated}")


async def demo_quick_discovery():
    """Quick superconductor discovery."""
    print("\n" + "=" * 60)
    print("QUICK SUPERCONDUCTOR DISCOVERY")
    print("=" * 60)

    candidates = await discover_superconductors(target_tc=200.0)

    print(f"\nFound {len(candidates)} validated candidates")


async def main():
    print("\n" + "=" * 60)
    print("QUANTUM MATERIALS DISCOVERY DEMONSTRATION")
    print("=" * 60)

    await demo_structure_generation()
    await demo_property_prediction()
    await demo_full_pipeline()
    await demo_quick_discovery()

    print("\n" + "=" * 60)
    print("DEMONSTRATION COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
