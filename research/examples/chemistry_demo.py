"""
Quantum Chemistry Demo
Demonstrates molecular simulation using quantum algorithms.
"""
import numpy as np
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from optilibria.optilibria.applications.chemistry import (
    MolecularSimulator,
    create_h2,
    create_h2o,
    create_lih,
    Molecule
)


def demo_h2_ground_state():
    """Demo H2 ground state calculation."""
    print("=" * 60)
    print("H2 GROUND STATE CALCULATION")
    print("=" * 60)

    simulator = MolecularSimulator()

    # Create H2 at equilibrium
    h2 = create_h2(bond_length=0.74)

    print(f"\nMolecule: {h2.formula}")
    print(f"Atoms: {h2.n_atoms}")
    print(f"Electrons: {h2.n_electrons}")

    # Compute with different methods
    print("\nGround State Energy:")

    exact = simulator.compute_ground_state(h2, method='exact')
    print(f"  Exact: {exact['energy']:.6f} Hartree")

    vqe = simulator.compute_ground_state(h2, method='vqe')
    print(f"  VQE:   {vqe['energy']:.6f} Hartree ({vqe['iterations']} iterations)")

    error = abs(vqe['energy'] - exact['energy'])
    print(f"  Error: {error:.2e} Hartree")


def demo_potential_energy_surface():
    """Demo potential energy surface calculation."""
    print("\n" + "=" * 60)
    print("H2 POTENTIAL ENERGY SURFACE")
    print("=" * 60)

    simulator = MolecularSimulator()
    h2 = create_h2()

    distances = [0.5, 0.6, 0.74, 0.9, 1.0, 1.2, 1.5, 2.0]

    print("\nBond Length Scan:")
    print(f"{'Distance (A)':>12} {'Energy (Ha)':>12}")
    print("-" * 26)

    for d in distances:
        h2_d = create_h2(bond_length=d)
        result = simulator.compute_ground_state(h2_d, method='vqe')
        print(f"{d:>12.2f} {result['energy']:>12.6f}")

    # Find equilibrium
    energies = []
    for d in np.linspace(0.5, 1.5, 20):
        h2_d = create_h2(bond_length=d)
        result = simulator.compute_ground_state(h2_d, method='vqe')
        energies.append((d, result['energy']))

    min_d, min_e = min(energies, key=lambda x: x[1])
    print(f"\nEquilibrium bond length: {min_d:.3f} A")
    print(f"Equilibrium energy: {min_e:.6f} Hartree")


def demo_lih():
    """Demo LiH molecule calculation."""
    print("\n" + "=" * 60)
    print("LiH MOLECULE CALCULATION")
    print("=" * 60)

    simulator = MolecularSimulator()
    lih = create_lih(bond_length=1.6)

    print(f"\nMolecule: {lih.formula}")
    print(f"Atoms: {lih.n_atoms}")
    print(f"Electrons: {lih.n_electrons}")

    result = simulator.compute_ground_state(lih, method='vqe')
    print(f"\nGround State Energy: {result['energy']:.6f} Hartree")
    print(f"Method: {result['method']}")
    print(f"Qubits used: {result['n_qubits']}")


def demo_h2o():
    """Demo H2O molecule calculation."""
    print("\n" + "=" * 60)
    print("H2O MOLECULE CALCULATION")
    print("=" * 60)

    simulator = MolecularSimulator()
    h2o = create_h2o(oh_length=0.96, angle=104.5)

    print(f"\nMolecule: {h2o.formula}")
    print(f"Atoms: {h2o.n_atoms}")
    print(f"Electrons: {h2o.n_electrons}")

    print("\nAtom positions:")
    for elem, pos in h2o.atoms:
        print(f"  {elem}: [{pos[0]:.3f}, {pos[1]:.3f}, {pos[2]:.3f}]")

    result = simulator.compute_ground_state(h2o, method='vqe')
    print(f"\nGround State Energy: {result['energy']:.6f} Hartree")
    print(f"Qubits used: {result['n_qubits']}")


def demo_custom_molecule():
    """Demo custom molecule creation."""
    print("\n" + "=" * 60)
    print("CUSTOM MOLECULE: BeH2")
    print("=" * 60)

    # Create BeH2 (linear)
    beh2 = Molecule(atoms=[
        ('Be', np.array([0.0, 0.0, 0.0])),
        ('H', np.array([-1.3, 0.0, 0.0])),
        ('H', np.array([1.3, 0.0, 0.0]))
    ])

    print(f"\nMolecule: {beh2.formula}")
    print(f"Atoms: {beh2.n_atoms}")
    print(f"Electrons: {beh2.n_electrons}")

    simulator = MolecularSimulator()
    result = simulator.compute_ground_state(beh2, method='vqe')
    print(f"\nGround State Energy: {result['energy']:.6f} Hartree")


def main():
    print("\n" + "=" * 60)
    print("QUANTUM CHEMISTRY DEMONSTRATION")
    print("=" * 60)

    demo_h2_ground_state()
    demo_potential_energy_surface()
    demo_lih()
    demo_h2o()
    demo_custom_molecule()

    print("\n" + "=" * 60)
    print("DEMONSTRATION COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    main()
