"""Advanced quantum error mitigation techniques for real hardware execution."""
import numpy as np
from typing import Dict, Any, List, Optional, Callable
from scipy.optimize import minimize
from scipy.interpolate import interp1d

class ZeroNoiseExtrapolation:
    """Zero-noise extrapolation for error mitigation."""
    
    def __init__(self, noise_factors: List[float] = [1.0, 2.0, 3.0]):
        self.noise_factors = noise_factors
        self.extrapolation_method = 'linear'
    
    def mitigate(self, circuit_executor: Callable, circuit: Dict[str, Any], 
                 shots: int = 1024) -> Dict[str, Any]:
        """Apply ZNE to mitigate errors."""
        
        # Execute circuit at different noise levels
        results = []
        expectation_values = []
        
        for factor in self.noise_factors:
            # Scale noise by repeating circuit elements
            noisy_circuit = self._scale_noise(circuit, factor)
            result = circuit_executor(noisy_circuit, shots)
            
            # Extract expectation value (simplified)
            exp_val = self._extract_expectation_value(result)
            
            results.append(result)
            expectation_values.append(exp_val)
        
        # Extrapolate to zero noise
        zero_noise_value = self._extrapolate_to_zero(expectation_values)
        
        # Return mitigated result
        mitigated_result = results[0].copy()  # Base result
        mitigated_result['mitigated_expectation'] = zero_noise_value
        mitigated_result['raw_expectation'] = expectation_values[0]
        mitigated_result['error_mitigation'] = 'ZNE'
        mitigated_result['improvement_factor'] = abs(zero_noise_value / expectation_values[0]) if expectation_values[0] != 0 else 1.0
        
        return mitigated_result
    
    def _scale_noise(self, circuit: Dict[str, Any], factor: float) -> Dict[str, Any]:
        """Scale circuit noise by given factor."""
        scaled_circuit = circuit.copy()
        
        # Simple noise scaling: repeat gate sequences
        if 'gates' in circuit:
            original_gates = circuit['gates']
            scaled_gates = []
            
            for gate in original_gates:
                # Add original gate
                scaled_gates.append(gate)
                
                # Add noise scaling (simplified: repeat gates)
                if factor > 1.0:
                    repeats = int(factor - 1)
                    for _ in range(repeats):
                        # Add identity operations to increase noise
                        if gate['name'] in ['H', 'X', 'Y', 'Z']:
                            # Single qubit: add X-X (identity with noise)
                            scaled_gates.extend([
                                {'name': 'X', 'qubits': gate['qubits']},
                                {'name': 'X', 'qubits': gate['qubits']}
                            ])
                        elif gate['name'] == 'CNOT':
                            # Two qubit: add CNOT-CNOT (identity with noise)
                            scaled_gates.extend([gate, gate])
            
            scaled_circuit['gates'] = scaled_gates
        
        return scaled_circuit
    
    def _extract_expectation_value(self, result: Dict[str, Any]) -> float:
        """Extract expectation value from measurement results."""
        if 'counts' not in result:
            return 0.0
        
        counts = result['counts']
        total_shots = sum(counts.values())
        
        if total_shots == 0:
            return 0.0
        
        # Simple expectation: probability of |0...0⟩ state
        zero_state = '0' * len(list(counts.keys())[0])
        zero_count = counts.get(zero_state, 0)
        
        return zero_count / total_shots
    
    def _extrapolate_to_zero(self, expectation_values: List[float]) -> float:
        """Extrapolate expectation values to zero noise."""
        if len(expectation_values) < 2:
            return expectation_values[0] if expectation_values else 0.0
        
        # Linear extrapolation
        x = np.array(self.noise_factors)
        y = np.array(expectation_values)
        
        # Fit linear model: y = a*x + b
        # At x=0 (zero noise): y = b
        coeffs = np.polyfit(x, y, 1)
        zero_noise_value = coeffs[1]  # y-intercept
        
        return zero_noise_value

class ReadoutErrorMitigation:
    """Readout error mitigation using calibration matrices."""
    
    def __init__(self):
        self.calibration_matrix = None
        self.inverse_matrix = None
    
    def calibrate(self, circuit_executor: Callable, n_qubits: int, shots: int = 1024) -> None:
        """Calibrate readout errors by measuring computational basis states."""
        
        # Create calibration matrix
        n_states = 2 ** n_qubits
        self.calibration_matrix = np.zeros((n_states, n_states))
        
        for i in range(n_states):
            # Prepare computational basis state |i⟩
            basis_state = format(i, f'0{n_qubits}b')
            
            # Create circuit to prepare this state
            prep_circuit = self._create_basis_state_circuit(basis_state, n_qubits)
            
            # Execute and measure
            result = circuit_executor(prep_circuit, shots)
            counts = result.get('counts', {})
            
            # Fill calibration matrix column
            for j in range(n_states):
                measured_state = format(j, f'0{n_qubits}b')
                count = counts.get(measured_state, 0)
                self.calibration_matrix[j, i] = count / shots
        
        # Compute pseudo-inverse for error correction
        try:
            self.inverse_matrix = np.linalg.pinv(self.calibration_matrix)
        except np.linalg.LinAlgError:
            # Fallback: regularized inverse
            reg = 1e-6
            self.inverse_matrix = np.linalg.inv(
                self.calibration_matrix + reg * np.eye(n_states)
            )
    
    def mitigate(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Apply readout error mitigation to measurement results."""
        if self.inverse_matrix is None:
            raise ValueError("Must calibrate before mitigation")
        
        counts = result.get('counts', {})
        if not counts:
            return result
        
        # Convert counts to probability vector
        total_shots = sum(counts.values())
        n_qubits = len(list(counts.keys())[0])
        n_states = 2 ** n_qubits
        
        measured_probs = np.zeros(n_states)
        for i in range(n_states):
            state = format(i, f'0{n_qubits}b')
            measured_probs[i] = counts.get(state, 0) / total_shots
        
        # Apply inverse calibration matrix
        corrected_probs = self.inverse_matrix @ measured_probs
        
        # Ensure probabilities are valid (non-negative, normalized)
        corrected_probs = np.maximum(corrected_probs, 0)
        corrected_probs = corrected_probs / np.sum(corrected_probs)
        
        # Convert back to counts
        corrected_counts = {}
        for i in range(n_states):
            state = format(i, f'0{n_qubits}b')
            corrected_counts[state] = int(corrected_probs[i] * total_shots)
        
        # Create mitigated result
        mitigated_result = result.copy()
        mitigated_result['raw_counts'] = counts
        mitigated_result['counts'] = corrected_counts
        mitigated_result['error_mitigation'] = 'REM'
        mitigated_result['calibration_fidelity'] = self._compute_calibration_fidelity()
        
        return mitigated_result
    
    def _create_basis_state_circuit(self, basis_state: str, n_qubits: int) -> Dict[str, Any]:
        """Create circuit to prepare computational basis state."""
        gates = []
        
        for i, bit in enumerate(basis_state):
            if bit == '1':
                gates.append({'name': 'X', 'qubits': [i]})
        
        # Add measurements
        gates.append({'name': 'MEASURE', 'qubits': list(range(n_qubits))})
        
        return {
            'n_qubits': n_qubits,
            'gates': gates,
            'type': 'calibration'
        }
    
    def _compute_calibration_fidelity(self) -> float:
        """Compute average fidelity of calibration matrix."""
        if self.calibration_matrix is None:
            return 0.0
        
        # Average diagonal elements (correct readout probability)
        diagonal_avg = np.mean(np.diag(self.calibration_matrix))
        return diagonal_avg

class QuantumErrorMitigation:
    """Combined error mitigation techniques."""
    
    def __init__(self):
        self.zne = ZeroNoiseExtrapolation()
        self.rem = ReadoutErrorMitigation()
        self.calibrated = False
    
    def calibrate(self, circuit_executor: Callable, n_qubits: int, shots: int = 1024) -> None:
        """Calibrate all error mitigation techniques."""
        print(f"🔧 Calibrating error mitigation for {n_qubits} qubits...")
        
        # Calibrate readout error mitigation
        self.rem.calibrate(circuit_executor, n_qubits, shots)
        self.calibrated = True
        
        print("✅ Error mitigation calibration complete")
    
    def mitigate(self, circuit_executor: Callable, circuit: Dict[str, Any], 
                 shots: int = 1024, methods: List[str] = ['REM', 'ZNE']) -> Dict[str, Any]:
        """Apply multiple error mitigation techniques."""
        
        if not self.calibrated and 'REM' in methods:
            n_qubits = circuit.get('n_qubits', 2)
            self.calibrate(circuit_executor, n_qubits, shots)
        
        result = circuit_executor(circuit, shots)
        
        # Apply readout error mitigation first
        if 'REM' in methods:
            result = self.rem.mitigate(result)
        
        # Apply zero-noise extrapolation
        if 'ZNE' in methods:
            # Create executor that applies REM
            def rem_executor(circ, shots):
                raw_result = circuit_executor(circ, shots)
                return self.rem.mitigate(raw_result) if 'REM' in methods else raw_result
            
            result = self.zne.mitigate(rem_executor, circuit, shots)
        
        result['mitigation_methods'] = methods
        return result