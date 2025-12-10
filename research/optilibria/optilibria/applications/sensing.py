"""
Quantum Sensing and Metrology
Quantum-enhanced measurement and parameter estimation.
"""
import numpy as np
from typing import List, Dict, Any, Optional, Callable, Tuple
from dataclasses import dataclass
from scipy.optimize import minimize


@dataclass
class SensingResult:
    """Result from quantum sensing."""
    estimated_value: float
    uncertainty: float
    n_measurements: int
    sensitivity: float
    quantum_advantage: float
    method: str


class QuantumMetrology:
    """
    Quantum metrology for parameter estimation.
    Achieves Heisenberg limit scaling.
    """

    def __init__(self, n_qubits: int):
        self.n_qubits = n_qubits

    def estimate_phase(
        self,
        true_phase: float,
        n_measurements: int = 100,
        method: str = 'ramsey'
    ) -> SensingResult:
        """
        Estimate unknown phase using quantum interferometry.

        Args:
            true_phase: The actual phase to estimate
            n_measurements: Number of measurements
            method: 'ramsey', 'noon', or 'gkp'
        """
        if method == 'ramsey':
            return self._ramsey_interferometry(true_phase, n_measurements)
        elif method == 'noon':
            return self._noon_state_sensing(true_phase, n_measurements)
        else:
            return self._ramsey_interferometry(true_phase, n_measurements)

    def _ramsey_interferometry(self, true_phase: float,
                                n_measurements: int) -> SensingResult:
        """
        Ramsey interferometry for phase estimation.
        Standard quantum limit: delta_phi ~ 1/sqrt(N)
        """
        n = self.n_qubits

        # Prepare |+>^n state
        # Apply phase: e^{i*phi*Z}
        # Measure in X basis

        results = []
        for _ in range(n_measurements):
            # Simulate measurement outcome
            # P(0) = cos^2(phi/2), P(1) = sin^2(phi/2) for each qubit
            outcomes = []
            for q in range(n):
                prob_0 = np.cos(true_phase / 2)**2
                outcome = 0 if np.random.random() < prob_0 else 1
                outcomes.append(outcome)

            # Estimate phase from outcomes
            mean_outcome = np.mean(outcomes)
            results.append(mean_outcome)

        # Estimate phase
        mean_result = np.mean(results)
        estimated_phase = 2 * np.arccos(np.sqrt(np.clip(1 - mean_result, 0, 1)))

        # Uncertainty (standard quantum limit)
        uncertainty = 1 / np.sqrt(n * n_measurements)

        # Classical limit would be 1/sqrt(n_measurements)
        classical_uncertainty = 1 / np.sqrt(n_measurements)
        quantum_advantage = classical_uncertainty / uncertainty

        return SensingResult(
            estimated_value=estimated_phase,
            uncertainty=uncertainty,
            n_measurements=n_measurements,
            sensitivity=uncertainty,
            quantum_advantage=quantum_advantage,
            method='ramsey'
        )

    def _noon_state_sensing(self, true_phase: float,
                            n_measurements: int) -> SensingResult:
        """
        NOON state sensing for Heisenberg-limited precision.
        Heisenberg limit: delta_phi ~ 1/N
        """
        n = self.n_qubits

        # NOON state: (|N,0> + |0,N>)/sqrt(2)
        # Phase sensitivity: N times better than classical

        results = []
        for _ in range(n_measurements):
            # NOON state accumulates N times the phase
            effective_phase = n * true_phase

            # Measurement probability
            prob_0 = np.cos(effective_phase / 2)**2
            outcome = 0 if np.random.random() < prob_0 else 1
            results.append(outcome)

        # Estimate phase
        mean_result = np.mean(results)
        estimated_phase = 2 * np.arccos(np.sqrt(np.clip(1 - mean_result, 0, 1))) / n

        # Heisenberg-limited uncertainty
        uncertainty = 1 / (n * np.sqrt(n_measurements))

        # Classical limit
        classical_uncertainty = 1 / np.sqrt(n_measurements)
        quantum_advantage = classical_uncertainty / uncertainty

        return SensingResult(
            estimated_value=estimated_phase,
            uncertainty=uncertainty,
            n_measurements=n_measurements,
            sensitivity=uncertainty,
            quantum_advantage=quantum_advantage,
            method='noon'
        )


class QuantumMagnetometer:
    """
    Quantum magnetometer using NV centers or atomic sensors.
    """

    def __init__(self, n_sensors: int = 1, coherence_time: float = 1e-3):
        self.n_sensors = n_sensors
        self.coherence_time = coherence_time  # T2 in seconds
        self.gyromagnetic_ratio = 28e9  # Hz/T for electron spin

    def measure_field(
        self,
        true_field: float,  # Tesla
        integration_time: float = 1.0,  # seconds
        method: str = 'ramsey'
    ) -> SensingResult:
        """
        Measure magnetic field strength.

        Args:
            true_field: Actual magnetic field in Tesla
            integration_time: Total measurement time
            method: 'ramsey', 'echo', or 'dynamical_decoupling'
        """
        # Number of measurements possible
        n_measurements = int(integration_time / self.coherence_time)

        # Phase accumulated
        phase = self.gyromagnetic_ratio * true_field * self.coherence_time

        # Simulate measurements
        results = []
        for _ in range(n_measurements):
            for _ in range(self.n_sensors):
                # Add noise based on method
                if method == 'ramsey':
                    noise = np.random.normal(0, 0.1)
                elif method == 'echo':
                    noise = np.random.normal(0, 0.05)  # Echo reduces noise
                else:
                    noise = np.random.normal(0, 0.02)  # DD further reduces

                measured_phase = phase + noise
                results.append(measured_phase)

        # Estimate field
        mean_phase = np.mean(results)
        estimated_field = mean_phase / (self.gyromagnetic_ratio * self.coherence_time)

        # Sensitivity in T/sqrt(Hz)
        sensitivity = 1 / (self.gyromagnetic_ratio * np.sqrt(self.coherence_time * self.n_sensors))

        # Uncertainty
        uncertainty = sensitivity / np.sqrt(integration_time)

        return SensingResult(
            estimated_value=estimated_field,
            uncertainty=uncertainty,
            n_measurements=n_measurements * self.n_sensors,
            sensitivity=sensitivity,
            quantum_advantage=np.sqrt(self.n_sensors),
            method=method
        )


class QuantumGravimeter:
    """
    Quantum gravimeter using atom interferometry.
    """

    def __init__(self, atom_mass: float = 87 * 1.66e-27):  # Rb-87
        self.atom_mass = atom_mass
        self.hbar = 1.055e-34
        self.k_eff = 2 * np.pi / 780e-9 * 2  # Effective wavevector

    def measure_gravity(
        self,
        true_g: float = 9.81,  # m/s^2
        interrogation_time: float = 0.1,  # seconds
        n_atoms: int = 1000000
    ) -> SensingResult:
        """
        Measure gravitational acceleration.

        Args:
            true_g: Actual gravitational acceleration
            interrogation_time: Free-fall time
            n_atoms: Number of atoms in ensemble
        """
        T = interrogation_time

        # Phase shift from gravity
        phase = self.k_eff * true_g * T**2

        # Quantum projection noise limit
        phase_uncertainty = 1 / np.sqrt(n_atoms)

        # Simulate measurement
        measured_phase = phase + np.random.normal(0, phase_uncertainty)

        # Estimate g
        estimated_g = measured_phase / (self.k_eff * T**2)

        # Uncertainty in g
        g_uncertainty = phase_uncertainty / (self.k_eff * T**2)

        # Sensitivity
        sensitivity = g_uncertainty * np.sqrt(2 * T)  # per sqrt(Hz)

        return SensingResult(
            estimated_value=estimated_g,
            uncertainty=g_uncertainty,
            n_measurements=1,
            sensitivity=sensitivity,
            quantum_advantage=np.sqrt(n_atoms),
            method='atom_interferometry'
        )


class QuantumClock:
    """
    Quantum optical clock for precision timekeeping.
    """

    def __init__(self, n_ions: int = 1, transition_frequency: float = 429e12):
        self.n_ions = n_ions
        self.transition_frequency = transition_frequency  # Hz (Sr+ clock transition)

    def measure_frequency(
        self,
        true_frequency: float = None,
        interrogation_time: float = 1.0,
        n_measurements: int = 100
    ) -> SensingResult:
        """
        Measure transition frequency.

        Args:
            true_frequency: Actual frequency (default: transition_frequency)
            interrogation_time: Ramsey interrogation time
            n_measurements: Number of measurements
        """
        if true_frequency is None:
            true_frequency = self.transition_frequency

        # Frequency uncertainty from quantum projection noise
        # delta_f = 1 / (2*pi * T * sqrt(N * n_ions))
        frequency_uncertainty = 1 / (2 * np.pi * interrogation_time *
                                     np.sqrt(n_measurements * self.n_ions))

        # Simulate measurements
        measurements = []
        for _ in range(n_measurements):
            noise = np.random.normal(0, frequency_uncertainty * np.sqrt(n_measurements))
            measurements.append(true_frequency + noise)

        estimated_frequency = np.mean(measurements)

        # Fractional uncertainty
        fractional_uncertainty = frequency_uncertainty / true_frequency

        return SensingResult(
            estimated_value=estimated_frequency,
            uncertainty=frequency_uncertainty,
            n_measurements=n_measurements,
            sensitivity=fractional_uncertainty,
            quantum_advantage=np.sqrt(self.n_ions),
            method='optical_clock'
        )


class QuantumImaging:
    """
    Quantum-enhanced imaging beyond classical limits.
    """

    def __init__(self, n_photons: int = 1000):
        self.n_photons = n_photons

    def estimate_separation(
        self,
        true_separation: float,  # In units of wavelength
        method: str = 'classical'
    ) -> SensingResult:
        """
        Estimate separation between two point sources.

        Args:
            true_separation: Actual separation (wavelength units)
            method: 'classical', 'spade', or 'sliver'
        """
        n = self.n_photons

        if method == 'classical':
            # Rayleigh limit: uncertainty diverges as separation -> 0
            if true_separation < 0.1:
                uncertainty = 1 / (np.sqrt(n) * true_separation)
            else:
                uncertainty = 1 / np.sqrt(n)
            quantum_advantage = 1.0

        elif method == 'spade':
            # SPADE: Spatial mode demultiplexing
            # Constant uncertainty even for small separations
            uncertainty = 1 / np.sqrt(n)

            # Advantage over classical at small separations
            if true_separation < 0.1:
                classical_uncertainty = 1 / (np.sqrt(n) * true_separation)
                quantum_advantage = classical_uncertainty / uncertainty
            else:
                quantum_advantage = 1.0

        else:
            uncertainty = 1 / np.sqrt(n)
            quantum_advantage = 1.0

        # Simulate measurement
        estimated = true_separation + np.random.normal(0, uncertainty)

        return SensingResult(
            estimated_value=max(0, estimated),
            uncertainty=uncertainty,
            n_measurements=n,
            sensitivity=uncertainty,
            quantum_advantage=quantum_advantage,
            method=method
        )


def demo_quantum_sensing():
    """Demonstrate quantum sensing capabilities."""
    print("=" * 60)
    print("QUANTUM SENSING DEMO")
    print("=" * 60)

    # Phase estimation
    print("\n1. Quantum Phase Estimation")
    metrology = QuantumMetrology(n_qubits=4)

    true_phase = 0.5
    result_ramsey = metrology.estimate_phase(true_phase, n_measurements=100, method='ramsey')
    result_noon = metrology.estimate_phase(true_phase, n_measurements=100, method='noon')

    print(f"   True phase: {true_phase:.4f}")
    print(f"   Ramsey estimate: {result_ramsey.estimated_value:.4f} +/- {result_ramsey.uncertainty:.4f}")
    print(f"   NOON estimate: {result_noon.estimated_value:.4f} +/- {result_noon.uncertainty:.4f}")
    print(f"   NOON quantum advantage: {result_noon.quantum_advantage:.1f}x")

    # Magnetometry
    print("\n2. Quantum Magnetometry")
    magnetometer = QuantumMagnetometer(n_sensors=10)

    true_field = 1e-9  # 1 nT
    result = magnetometer.measure_field(true_field, integration_time=1.0)

    print(f"   True field: {true_field*1e9:.2f} nT")
    print(f"   Measured: {result.estimated_value*1e9:.2f} +/- {result.uncertainty*1e9:.2f} nT")
    print(f"   Sensitivity: {result.sensitivity*1e12:.2f} pT/sqrt(Hz)")

    # Gravimetry
    print("\n3. Quantum Gravimetry")
    gravimeter = QuantumGravimeter()

    result = gravimeter.measure_gravity(true_g=9.81, interrogation_time=0.1)

    print(f"   True g: 9.81 m/s^2")
    print(f"   Measured: {result.estimated_value:.6f} +/- {result.uncertainty:.2e} m/s^2")
    print(f"   Relative precision: {result.uncertainty/9.81:.2e}")

    # Optical clock
    print("\n4. Quantum Optical Clock")
    clock = QuantumClock(n_ions=10)

    result = clock.measure_frequency(interrogation_time=1.0, n_measurements=100)

    print(f"   Frequency: {result.estimated_value:.6e} Hz")
    print(f"   Fractional uncertainty: {result.sensitivity:.2e}")

    # Quantum imaging
    print("\n5. Quantum-Enhanced Imaging")
    imaging = QuantumImaging(n_photons=10000)

    true_sep = 0.05  # Sub-Rayleigh
    result_classical = imaging.estimate_separation(true_sep, method='classical')
    result_spade = imaging.estimate_separation(true_sep, method='spade')

    print(f"   True separation: {true_sep:.3f} wavelengths")
    print(f"   Classical uncertainty: {result_classical.uncertainty:.4f}")
    print(f"   SPADE uncertainty: {result_spade.uncertainty:.4f}")
    print(f"   Quantum advantage: {result_spade.quantum_advantage:.1f}x")


if __name__ == "__main__":
    demo_quantum_sensing()
