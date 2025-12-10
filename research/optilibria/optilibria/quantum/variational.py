"""
Variational Quantum Algorithms
Collection of variational methods beyond VQE.
"""
import numpy as np
from typing import Callable, Dict, Any, List, Optional, Tuple
from scipy.optimize import minimize
from dataclasses import dataclass


@dataclass
class VariationalResult:
    """Result from variational algorithm."""
    optimal_params: np.ndarray
    optimal_value: float
    convergence_history: List[float]
    iterations: int
    success: bool


class VariationalQuantumClassifier:
    """
    Variational Quantum Classifier (VQC).
    Quantum machine learning for classification tasks.
    """

    def __init__(
        self,
        n_qubits: int,
        n_layers: int = 2,
        entanglement: str = 'linear'
    ):
        self.n_qubits = n_qubits
        self.n_layers = n_layers
        self.entanglement = entanglement
        self.params = None
        self.n_params = self._count_params()

    def _count_params(self) -> int:
        """Count variational parameters."""
        # 3 rotations per qubit per layer + 1 final layer
        return self.n_layers * self.n_qubits * 3 + self.n_qubits

    def fit(
        self,
        X: np.ndarray,
        y: np.ndarray,
        epochs: int = 100,
        learning_rate: float = 0.1
    ) -> VariationalResult:
        """
        Train the classifier.

        Args:
            X: Training features (n_samples, n_features)
            y: Training labels (n_samples,)
            epochs: Number of training epochs
            learning_rate: Learning rate for optimization
        """
        # Initialize parameters
        self.params = np.random.uniform(-np.pi, np.pi, self.n_params)

        history = []

        for epoch in range(epochs):
            # Compute predictions and loss
            predictions = self._forward(X)
            loss = self._cross_entropy_loss(predictions, y)
            history.append(loss)

            # Compute gradients via parameter shift
            gradients = self._compute_gradients(X, y)

            # Update parameters
            self.params -= learning_rate * gradients

            if epoch % 20 == 0:
                accuracy = np.mean((predictions > 0.5) == y)
                print(f"Epoch {epoch}: Loss={loss:.4f}, Accuracy={accuracy:.2%}")

        return VariationalResult(
            optimal_params=self.params,
            optimal_value=history[-1],
            convergence_history=history,
            iterations=epochs,
            success=True
        )

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Predict class probabilities."""
        return self._forward(X)

    def predict_class(self, X: np.ndarray) -> np.ndarray:
        """Predict class labels."""
        return (self.predict(X) > 0.5).astype(int)

    def _forward(self, X: np.ndarray) -> np.ndarray:
        """Forward pass through quantum circuit."""
        predictions = []

        for x in X:
            # Encode features
            state = self._encode_features(x)

            # Apply variational layers
            state = self._apply_variational_layers(state)

            # Measure expectation of Z on first qubit
            prob_0 = np.sum(np.abs(state[:len(state)//2])**2)
            predictions.append(prob_0)

        return np.array(predictions)

    def _encode_features(self, x: np.ndarray) -> np.ndarray:
        """Encode classical features into quantum state."""
        dim = 2**self.n_qubits
        state = np.zeros(dim, dtype=complex)
        state[0] = 1.0

        # Angle encoding
        for i, xi in enumerate(x[:self.n_qubits]):
            state = self._apply_ry(state, xi * np.pi, i)

        return state

    def _apply_variational_layers(self, state: np.ndarray) -> np.ndarray:
        """Apply variational ansatz."""
        param_idx = 0

        for layer in range(self.n_layers):
            # Rotation layer
            for q in range(self.n_qubits):
                state = self._apply_rx(state, self.params[param_idx], q)
                param_idx += 1
                state = self._apply_ry(state, self.params[param_idx], q)
                param_idx += 1
                state = self._apply_rz(state, self.params[param_idx], q)
                param_idx += 1

            # Entanglement layer
            if self.entanglement == 'linear':
                for q in range(self.n_qubits - 1):
                    state = self._apply_cnot(state, q, q + 1)
            elif self.entanglement == 'full':
                for q1 in range(self.n_qubits):
                    for q2 in range(q1 + 1, self.n_qubits):
                        state = self._apply_cnot(state, q1, q2)

        # Final rotation
        for q in range(self.n_qubits):
            state = self._apply_ry(state, self.params[param_idx], q)
            param_idx += 1

        return state

    def _compute_gradients(self, X: np.ndarray, y: np.ndarray) -> np.ndarray:
        """Compute gradients via parameter shift rule."""
        gradients = np.zeros(self.n_params)
        shift = np.pi / 2

        for i in range(self.n_params):
            # Shift up
            params_plus = self.params.copy()
            params_plus[i] += shift
            old_params = self.params
            self.params = params_plus
            pred_plus = self._forward(X)
            loss_plus = self._cross_entropy_loss(pred_plus, y)

            # Shift down
            params_minus = self.params.copy()
            params_minus[i] -= 2 * shift
            self.params = params_minus
            pred_minus = self._forward(X)
            loss_minus = self._cross_entropy_loss(pred_minus, y)

            # Restore and compute gradient
            self.params = old_params
            gradients[i] = (loss_plus - loss_minus) / 2

        return gradients

    def _cross_entropy_loss(self, predictions: np.ndarray, targets: np.ndarray) -> float:
        """Binary cross-entropy loss."""
        eps = 1e-10
        predictions = np.clip(predictions, eps, 1 - eps)
        return -np.mean(targets * np.log(predictions) + (1 - targets) * np.log(1 - predictions))

    # Gate implementations
    def _apply_rx(self, state: np.ndarray, theta: float, qubit: int) -> np.ndarray:
        cos_t, sin_t = np.cos(theta/2), np.sin(theta/2)
        return self._apply_single_gate(state,
            np.array([[cos_t, -1j*sin_t], [-1j*sin_t, cos_t]], dtype=complex), qubit)

    def _apply_ry(self, state: np.ndarray, theta: float, qubit: int) -> np.ndarray:
        cos_t, sin_t = np.cos(theta/2), np.sin(theta/2)
        return self._apply_single_gate(state,
            np.array([[cos_t, -sin_t], [sin_t, cos_t]], dtype=complex), qubit)

    def _apply_rz(self, state: np.ndarray, theta: float, qubit: int) -> np.ndarray:
        return self._apply_single_gate(state,
            np.array([[np.exp(-1j*theta/2), 0], [0, np.exp(1j*theta/2)]], dtype=complex), qubit)

    def _apply_single_gate(self, state: np.ndarray, gate: np.ndarray, qubit: int) -> np.ndarray:
        new_state = np.zeros_like(state)
        n = self.n_qubits
        for i in range(len(state)):
            bit = (i >> (n-1-qubit)) & 1
            i_flip = i ^ (1 << (n-1-qubit))
            if bit == 0:
                new_state[i] += gate[0,0]*state[i] + gate[0,1]*state[i_flip]
            else:
                new_state[i] += gate[1,0]*state[i_flip] + gate[1,1]*state[i]
        return new_state

    def _apply_cnot(self, state: np.ndarray, ctrl: int, tgt: int) -> np.ndarray:
        new_state = state.copy()
        n = self.n_qubits
        for i in range(len(state)):
            if (i >> (n-1-ctrl)) & 1:
                i_flip = i ^ (1 << (n-1-tgt))
                new_state[i], new_state[i_flip] = state[i_flip], state[i]
        return new_state


class QSVM:
    """
    Quantum Support Vector Machine.
    Uses quantum kernel estimation for classification.
    """

    def __init__(self, n_qubits: int = 4, feature_map: str = 'zz'):
        self.n_qubits = n_qubits
        self.feature_map = feature_map
        self.support_vectors = None
        self.alphas = None
        self.b = 0

    def fit(self, X: np.ndarray, y: np.ndarray, C: float = 1.0):
        """Train QSVM using quantum kernel."""
        n_samples = len(X)

        # Compute quantum kernel matrix
        K = self._compute_kernel_matrix(X)

        # Solve dual SVM problem (simplified)
        # In practice, would use quadratic programming
        self.alphas = np.zeros(n_samples)

        # Simple gradient ascent on dual
        for _ in range(100):
            for i in range(n_samples):
                gradient = 1 - y[i] * np.sum(self.alphas * y * K[i])
                self.alphas[i] = np.clip(self.alphas[i] + 0.01 * gradient, 0, C)

        # Find support vectors
        sv_mask = self.alphas > 1e-5
        self.support_vectors = X[sv_mask]
        self.sv_alphas = self.alphas[sv_mask]
        self.sv_y = y[sv_mask]
        self.X_train = X
        self.y_train = y

        # Compute bias
        if np.any(sv_mask):
            sv_idx = np.where(sv_mask)[0][0]
            self.b = y[sv_idx] - np.sum(self.alphas * y * K[sv_idx])

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Predict using quantum kernel."""
        predictions = []
        for x in X:
            kernel_vals = np.array([self._quantum_kernel(x, xi) for xi in self.X_train])
            decision = np.sum(self.alphas * self.y_train * kernel_vals) + self.b
            predictions.append(np.sign(decision))
        return np.array(predictions)

    def _compute_kernel_matrix(self, X: np.ndarray) -> np.ndarray:
        """Compute quantum kernel matrix."""
        n = len(X)
        K = np.zeros((n, n))
        for i in range(n):
            for j in range(i, n):
                K[i, j] = self._quantum_kernel(X[i], X[j])
                K[j, i] = K[i, j]
        return K

    def _quantum_kernel(self, x1: np.ndarray, x2: np.ndarray) -> float:
        """Compute quantum kernel between two samples."""
        # Encode x1
        state1 = self._encode(x1)
        # Encode x2
        state2 = self._encode(x2)
        # Kernel is |<φ(x1)|φ(x2)>|²
        return np.abs(np.vdot(state1, state2))**2

    def _encode(self, x: np.ndarray) -> np.ndarray:
        """Encode features into quantum state."""
        dim = 2**self.n_qubits
        state = np.ones(dim, dtype=complex) / np.sqrt(dim)

        # ZZ feature map
        for i, xi in enumerate(x[:self.n_qubits]):
            # Apply Hadamard + Rz encoding
            for j in range(dim):
                bit = (j >> (self.n_qubits - 1 - i)) & 1
                phase = xi * (2 * bit - 1)
                state[j] *= np.exp(1j * phase)

        return state / np.linalg.norm(state)
