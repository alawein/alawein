"""
Advanced Quantum Machine Learning
Neural network architectures with quantum layers.
"""
import numpy as np
from typing import List, Dict, Any, Optional, Callable, Tuple
from dataclasses import dataclass
from scipy.optimize import minimize


@dataclass
class QuantumLayerConfig:
    """Configuration for a quantum layer."""
    n_qubits: int
    n_layers: int
    entanglement: str = 'full'  # 'full', 'linear', 'circular'
    data_reuploading: bool = False


class QuantumNeuralNetwork:
    """
    Hybrid quantum-classical neural network.
    Combines classical preprocessing with quantum variational layers.
    """

    def __init__(
        self,
        input_dim: int,
        n_qubits: int,
        n_quantum_layers: int = 2,
        output_dim: int = 1
    ):
        self.input_dim = input_dim
        self.n_qubits = n_qubits
        self.n_quantum_layers = n_quantum_layers
        self.output_dim = output_dim

        # Classical encoding layer
        self.encoding_weights = np.random.randn(input_dim, n_qubits) * 0.1

        # Quantum variational parameters
        self.n_quantum_params = n_quantum_layers * n_qubits * 3
        self.quantum_params = np.random.randn(self.n_quantum_params) * 0.1

        # Classical output layer
        self.output_weights = np.random.randn(n_qubits, output_dim) * 0.1
        self.output_bias = np.zeros(output_dim)

    def _encode_data(self, x: np.ndarray) -> np.ndarray:
        """Encode classical data for quantum circuit."""
        return np.tanh(x @ self.encoding_weights) * np.pi

    def _quantum_layer(self, encoded: np.ndarray, params: np.ndarray) -> np.ndarray:
        """Execute quantum variational layer."""
        n = self.n_qubits

        # Initialize state
        state = np.zeros(2**n, dtype=complex)
        state[0] = 1.0

        param_idx = 0

        for layer in range(self.n_quantum_layers):
            # Data encoding (angle embedding)
            for q in range(n):
                angle = encoded[q] if q < len(encoded) else 0
                state = self._apply_ry(state, q, angle)

            # Variational rotations
            for q in range(n):
                state = self._apply_rx(state, q, params[param_idx])
                param_idx += 1
                state = self._apply_ry(state, q, params[param_idx])
                param_idx += 1
                state = self._apply_rz(state, q, params[param_idx])
                param_idx += 1

            # Entangling layer
            for q in range(n - 1):
                state = self._apply_cnot(state, q, q + 1)

        # Measure expectation values
        expectations = []
        for q in range(n):
            exp_z = self._measure_z(state, q)
            expectations.append(exp_z)

        return np.array(expectations)

    def _apply_rx(self, state: np.ndarray, qubit: int, theta: float) -> np.ndarray:
        """Apply RX gate."""
        n = self.n_qubits
        new_state = state.copy()
        c, s = np.cos(theta/2), np.sin(theta/2)

        for i in range(2**n):
            bit = (i >> (n - 1 - qubit)) & 1
            partner = i ^ (1 << (n - 1 - qubit))
            if bit == 0 and i < partner:
                a, b = state[i], state[partner]
                new_state[i] = c * a - 1j * s * b
                new_state[partner] = -1j * s * a + c * b

        return new_state

    def _apply_ry(self, state: np.ndarray, qubit: int, theta: float) -> np.ndarray:
        """Apply RY gate."""
        n = self.n_qubits
        new_state = state.copy()
        c, s = np.cos(theta/2), np.sin(theta/2)

        for i in range(2**n):
            bit = (i >> (n - 1 - qubit)) & 1
            partner = i ^ (1 << (n - 1 - qubit))
            if bit == 0 and i < partner:
                a, b = state[i], state[partner]
                new_state[i] = c * a - s * b
                new_state[partner] = s * a + c * b

        return new_state

    def _apply_rz(self, state: np.ndarray, qubit: int, theta: float) -> np.ndarray:
        """Apply RZ gate."""
        n = self.n_qubits
        new_state = state.copy()

        for i in range(2**n):
            bit = (i >> (n - 1 - qubit)) & 1
            phase = np.exp(1j * theta / 2 * (1 if bit else -1))
            new_state[i] = state[i] * phase

        return new_state

    def _apply_cnot(self, state: np.ndarray, control: int, target: int) -> np.ndarray:
        """Apply CNOT gate."""
        n = self.n_qubits
        new_state = state.copy()

        for i in range(2**n):
            ctrl_bit = (i >> (n - 1 - control)) & 1
            if ctrl_bit == 1:
                partner = i ^ (1 << (n - 1 - target))
                new_state[i], new_state[partner] = state[partner], state[i]

        return new_state

    def _measure_z(self, state: np.ndarray, qubit: int) -> float:
        """Measure Z expectation value."""
        n = self.n_qubits
        exp_val = 0.0

        for i in range(2**n):
            bit = (i >> (n - 1 - qubit)) & 1
            sign = 1 if bit == 0 else -1
            exp_val += sign * np.abs(state[i])**2

        return exp_val

    def forward(self, x: np.ndarray) -> np.ndarray:
        """Forward pass through the network."""
        # Encode data
        encoded = self._encode_data(x)

        # Quantum layer
        quantum_out = self._quantum_layer(encoded, self.quantum_params)

        # Classical output
        output = quantum_out @ self.output_weights + self.output_bias

        return output

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Make predictions for multiple samples."""
        predictions = []
        for x in X:
            pred = self.forward(x)
            predictions.append(pred)
        return np.array(predictions)

    def fit(
        self,
        X: np.ndarray,
        y: np.ndarray,
        epochs: int = 100,
        learning_rate: float = 0.01,
        batch_size: int = 32
    ) -> Dict[str, List[float]]:
        """Train the network."""
        history = {'loss': [], 'accuracy': []}
        n_samples = len(X)

        for epoch in range(epochs):
            # Shuffle data
            indices = np.random.permutation(n_samples)

            epoch_loss = 0.0

            for i in range(0, n_samples, batch_size):
                batch_idx = indices[i:i+batch_size]
                X_batch = X[batch_idx]
                y_batch = y[batch_idx]

                # Compute gradients numerically
                loss, grads = self._compute_gradients(X_batch, y_batch)
                epoch_loss += loss

                # Update parameters
                self.quantum_params -= learning_rate * grads['quantum']
                self.encoding_weights -= learning_rate * grads['encoding']
                self.output_weights -= learning_rate * grads['output']
                self.output_bias -= learning_rate * grads['bias']

            # Compute metrics
            predictions = self.predict(X)
            if self.output_dim == 1:
                pred_classes = (predictions.flatten() > 0).astype(int)
                accuracy = np.mean(pred_classes == y)
            else:
                pred_classes = np.argmax(predictions, axis=1)
                accuracy = np.mean(pred_classes == y)

            history['loss'].append(epoch_loss / (n_samples // batch_size))
            history['accuracy'].append(accuracy)

            if epoch % 20 == 0:
                print(f"Epoch {epoch}: Loss={history['loss'][-1]:.4f}, Accuracy={accuracy:.2%}")

        return history

    def _compute_gradients(
        self,
        X: np.ndarray,
        y: np.ndarray,
        epsilon: float = 0.01
    ) -> Tuple[float, Dict[str, np.ndarray]]:
        """Compute gradients using parameter shift rule."""
        # Compute loss
        predictions = self.predict(X)
        loss = np.mean((predictions.flatten() - y)**2)

        grads = {
            'quantum': np.zeros_like(self.quantum_params),
            'encoding': np.zeros_like(self.encoding_weights),
            'output': np.zeros_like(self.output_weights),
            'bias': np.zeros_like(self.output_bias)
        }

        # Quantum parameter gradients (parameter shift)
        for i in range(len(self.quantum_params)):
            self.quantum_params[i] += np.pi/2
            pred_plus = self.predict(X)
            loss_plus = np.mean((pred_plus.flatten() - y)**2)

            self.quantum_params[i] -= np.pi
            pred_minus = self.predict(X)
            loss_minus = np.mean((pred_minus.flatten() - y)**2)

            self.quantum_params[i] += np.pi/2  # Restore
            grads['quantum'][i] = (loss_plus - loss_minus) / 2

        # Classical gradients (numerical)
        for i in range(self.output_weights.shape[0]):
            for j in range(self.output_weights.shape[1]):
                self.output_weights[i, j] += epsilon
                loss_plus = np.mean((self.predict(X).flatten() - y)**2)
                self.output_weights[i, j] -= 2*epsilon
                loss_minus = np.mean((self.predict(X).flatten() - y)**2)
                self.output_weights[i, j] += epsilon
                grads['output'][i, j] = (loss_plus - loss_minus) / (2*epsilon)

        return loss, grads


class QuantumKernel:
    """
    Quantum kernel for kernel-based ML methods.
    Computes kernel values using quantum feature maps.
    """

    def __init__(self, n_qubits: int, feature_map: str = 'zz'):
        self.n_qubits = n_qubits
        self.feature_map = feature_map

    def compute_kernel_matrix(self, X: np.ndarray) -> np.ndarray:
        """Compute full kernel matrix."""
        n = len(X)
        K = np.zeros((n, n))

        for i in range(n):
            for j in range(i, n):
                k_ij = self.kernel(X[i], X[j])
                K[i, j] = k_ij
                K[j, i] = k_ij

        return K

    def kernel(self, x1: np.ndarray, x2: np.ndarray) -> float:
        """Compute kernel value between two points."""
        # Encode both points
        state1 = self._encode(x1)
        state2 = self._encode(x2)

        # Compute overlap
        overlap = np.abs(np.vdot(state1, state2))**2

        return overlap

    def _encode(self, x: np.ndarray) -> np.ndarray:
        """Encode data into quantum state."""
        n = self.n_qubits
        state = np.zeros(2**n, dtype=complex)
        state[0] = 1.0

        # Apply Hadamard to all qubits
        for q in range(n):
            state = self._apply_h(state, q)

        # Feature map encoding
        if self.feature_map == 'zz':
            # ZZ feature map
            for q in range(n):
                if q < len(x):
                    state = self._apply_rz(state, q, x[q])

            # Entangling
            for q in range(n - 1):
                if q < len(x) - 1:
                    state = self._apply_rzz(state, q, q+1, x[q] * x[q+1])
        else:
            # Simple angle encoding
            for q in range(min(n, len(x))):
                state = self._apply_ry(state, q, x[q])

        return state

    def _apply_h(self, state: np.ndarray, qubit: int) -> np.ndarray:
        """Apply Hadamard gate."""
        n = self.n_qubits
        new_state = np.zeros_like(state)

        for i in range(2**n):
            bit = (i >> (n - 1 - qubit)) & 1
            partner = i ^ (1 << (n - 1 - qubit))
            if bit == 0:
                new_state[i] += state[i] / np.sqrt(2)
                new_state[partner] += state[i] / np.sqrt(2)
            else:
                new_state[i] += state[i] / np.sqrt(2)
                new_state[partner] -= state[i] / np.sqrt(2)

        return new_state

    def _apply_ry(self, state: np.ndarray, qubit: int, theta: float) -> np.ndarray:
        """Apply RY gate."""
        n = self.n_qubits
        new_state = state.copy()
        c, s = np.cos(theta/2), np.sin(theta/2)

        for i in range(2**n):
            bit = (i >> (n - 1 - qubit)) & 1
            partner = i ^ (1 << (n - 1 - qubit))
            if bit == 0 and i < partner:
                a, b = state[i], state[partner]
                new_state[i] = c * a - s * b
                new_state[partner] = s * a + c * b

        return new_state

    def _apply_rz(self, state: np.ndarray, qubit: int, theta: float) -> np.ndarray:
        """Apply RZ gate."""
        n = self.n_qubits
        new_state = state.copy()

        for i in range(2**n):
            bit = (i >> (n - 1 - qubit)) & 1
            phase = np.exp(1j * theta / 2 * (1 if bit else -1))
            new_state[i] = state[i] * phase

        return new_state

    def _apply_rzz(self, state: np.ndarray, q1: int, q2: int, theta: float) -> np.ndarray:
        """Apply RZZ gate."""
        n = self.n_qubits
        new_state = state.copy()

        for i in range(2**n):
            bit1 = (i >> (n - 1 - q1)) & 1
            bit2 = (i >> (n - 1 - q2)) & 1
            parity = bit1 ^ bit2
            phase = np.exp(1j * theta / 2 * (1 if parity == 0 else -1))
            new_state[i] = state[i] * phase

        return new_state


class QuantumBoltzmannMachine:
    """
    Quantum Boltzmann Machine.
    Generative model using quantum sampling.
    """

    def __init__(self, n_visible: int, n_hidden: int):
        self.n_visible = n_visible
        self.n_hidden = n_hidden
        self.n_qubits = n_visible + n_hidden

        # Initialize weights
        self.weights = np.random.randn(n_visible, n_hidden) * 0.1
        self.visible_bias = np.zeros(n_visible)
        self.hidden_bias = np.zeros(n_hidden)

    def energy(self, v: np.ndarray, h: np.ndarray) -> float:
        """Compute energy of a configuration."""
        return -(v @ self.weights @ h +
                 self.visible_bias @ v +
                 self.hidden_bias @ h)

    def sample(self, n_samples: int = 100) -> np.ndarray:
        """Generate samples using quantum annealing simulation."""
        samples = []

        for _ in range(n_samples):
            # Initialize random state
            v = np.random.randint(0, 2, self.n_visible)
            h = np.random.randint(0, 2, self.n_hidden)

            # Gibbs sampling steps
            for _ in range(10):
                # Sample hidden given visible
                h_prob = 1 / (1 + np.exp(-(self.weights.T @ v + self.hidden_bias)))
                h = (np.random.random(self.n_hidden) < h_prob).astype(int)

                # Sample visible given hidden
                v_prob = 1 / (1 + np.exp(-(self.weights @ h + self.visible_bias)))
                v = (np.random.random(self.n_visible) < v_prob).astype(int)

            samples.append(v)

        return np.array(samples)

    def fit(self, data: np.ndarray, epochs: int = 100, learning_rate: float = 0.1):
        """Train the QBM using contrastive divergence."""
        for epoch in range(epochs):
            for v_data in data:
                # Positive phase
                h_prob_pos = 1 / (1 + np.exp(-(self.weights.T @ v_data + self.hidden_bias)))
                h_sample = (np.random.random(self.n_hidden) < h_prob_pos).astype(int)

                # Negative phase (reconstruction)
                v_prob_neg = 1 / (1 + np.exp(-(self.weights @ h_sample + self.visible_bias)))
                v_sample = (np.random.random(self.n_visible) < v_prob_neg).astype(int)
                h_prob_neg = 1 / (1 + np.exp(-(self.weights.T @ v_sample + self.hidden_bias)))

                # Update weights
                self.weights += learning_rate * (np.outer(v_data, h_prob_pos) -
                                                  np.outer(v_sample, h_prob_neg))
                self.visible_bias += learning_rate * (v_data - v_sample)
                self.hidden_bias += learning_rate * (h_prob_pos - h_prob_neg)
