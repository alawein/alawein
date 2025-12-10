"""
Quantum Transformer Architecture
Hybrid quantum-classical attention mechanism.
"""
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass


@dataclass
class TransformerConfig:
    """Configuration for quantum transformer."""
    d_model: int = 64
    n_heads: int = 4
    n_layers: int = 2
    n_qubits: int = 4
    dropout: float = 0.1
    max_seq_len: int = 512


class QuantumAttention:
    """
    Quantum-enhanced attention mechanism.
    Uses quantum circuits for computing attention weights.
    """

    def __init__(self, d_model: int, n_heads: int, n_qubits: int = 4):
        self.d_model = d_model
        self.n_heads = n_heads
        self.d_head = d_model // n_heads
        self.n_qubits = n_qubits

        # Classical projection matrices
        self.W_q = np.random.randn(d_model, d_model) * 0.02
        self.W_k = np.random.randn(d_model, d_model) * 0.02
        self.W_v = np.random.randn(d_model, d_model) * 0.02
        self.W_o = np.random.randn(d_model, d_model) * 0.02

        # Quantum parameters for attention
        self.quantum_params = np.random.randn(n_qubits * 3) * 0.1

    def _quantum_attention_weights(self, q: np.ndarray, k: np.ndarray) -> np.ndarray:
        """
        Compute attention weights using quantum circuit.
        """
        seq_len = q.shape[0]
        attention = np.zeros((seq_len, seq_len))

        for i in range(seq_len):
            for j in range(seq_len):
                # Encode query and key into quantum state
                state = self._encode_qk(q[i], k[j])

                # Apply variational circuit
                state = self._variational_circuit(state)

                # Measure overlap as attention weight
                attention[i, j] = np.abs(state[0])**2

        # Softmax normalization
        attention = np.exp(attention - np.max(attention, axis=-1, keepdims=True))
        attention = attention / (attention.sum(axis=-1, keepdims=True) + 1e-10)

        return attention

    def _encode_qk(self, q: np.ndarray, k: np.ndarray) -> np.ndarray:
        """Encode query and key into quantum state."""
        n = self.n_qubits
        state = np.zeros(2**n, dtype=complex)
        state[0] = 1.0

        # Hadamard on all qubits
        for qubit in range(n):
            state = self._apply_h(state, qubit)

        # Encode query (first half of qubits)
        for i in range(min(n//2, len(q))):
            angle = np.arctan(q[i]) * 2
            state = self._apply_ry(state, i, angle)

        # Encode key (second half of qubits)
        for i in range(min(n//2, len(k))):
            angle = np.arctan(k[i]) * 2
            state = self._apply_ry(state, n//2 + i, angle)

        return state

    def _variational_circuit(self, state: np.ndarray) -> np.ndarray:
        """Apply variational circuit."""
        n = self.n_qubits
        param_idx = 0

        for qubit in range(n):
            state = self._apply_ry(state, qubit, self.quantum_params[param_idx])
            param_idx += 1

        # Entangling layer
        for qubit in range(n - 1):
            state = self._apply_cnot(state, qubit, qubit + 1)

        for qubit in range(n):
            state = self._apply_rz(state, qubit, self.quantum_params[param_idx])
            param_idx += 1

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

    def forward(self, x: np.ndarray) -> np.ndarray:
        """
        Forward pass through quantum attention.

        Args:
            x: Input tensor of shape (seq_len, d_model)
        """
        seq_len = x.shape[0]

        # Project to Q, K, V
        Q = x @ self.W_q
        K = x @ self.W_k
        V = x @ self.W_v

        # Multi-head attention
        outputs = []

        for h in range(self.n_heads):
            start = h * self.d_head
            end = start + self.d_head

            q_h = Q[:, start:end]
            k_h = K[:, start:end]
            v_h = V[:, start:end]

            # Compute attention weights (quantum-enhanced)
            if seq_len <= 16:  # Use quantum for small sequences
                attn = self._quantum_attention_weights(q_h, k_h)
            else:  # Classical for larger sequences
                scale = np.sqrt(self.d_head)
                attn = np.exp(q_h @ k_h.T / scale)
                attn = attn / (attn.sum(axis=-1, keepdims=True) + 1e-10)

            # Apply attention to values
            out_h = attn @ v_h
            outputs.append(out_h)

        # Concatenate heads
        output = np.concatenate(outputs, axis=-1)

        # Output projection
        output = output @ self.W_o

        return output


class QuantumFeedForward:
    """
    Quantum-enhanced feed-forward layer.
    """

    def __init__(self, d_model: int, d_ff: int = None, n_qubits: int = 4):
        self.d_model = d_model
        self.d_ff = d_ff or d_model * 4
        self.n_qubits = n_qubits

        self.W1 = np.random.randn(d_model, self.d_ff) * 0.02
        self.W2 = np.random.randn(self.d_ff, d_model) * 0.02
        self.b1 = np.zeros(self.d_ff)
        self.b2 = np.zeros(d_model)

    def forward(self, x: np.ndarray) -> np.ndarray:
        """Forward pass."""
        # First linear + activation
        hidden = x @ self.W1 + self.b1
        hidden = np.maximum(hidden, 0)  # ReLU

        # Second linear
        output = hidden @ self.W2 + self.b2

        return output


class QuantumTransformerLayer:
    """
    Single quantum transformer layer.
    """

    def __init__(self, config: TransformerConfig):
        self.attention = QuantumAttention(
            config.d_model,
            config.n_heads,
            config.n_qubits
        )
        self.ff = QuantumFeedForward(config.d_model, n_qubits=config.n_qubits)
        self.dropout = config.dropout

        # Layer norm parameters
        self.ln1_gamma = np.ones(config.d_model)
        self.ln1_beta = np.zeros(config.d_model)
        self.ln2_gamma = np.ones(config.d_model)
        self.ln2_beta = np.zeros(config.d_model)

    def _layer_norm(self, x: np.ndarray, gamma: np.ndarray, beta: np.ndarray) -> np.ndarray:
        """Apply layer normalization."""
        mean = x.mean(axis=-1, keepdims=True)
        std = x.std(axis=-1, keepdims=True) + 1e-6
        return gamma * (x - mean) / std + beta

    def forward(self, x: np.ndarray) -> np.ndarray:
        """Forward pass through transformer layer."""
        # Self-attention with residual
        attn_out = self.attention.forward(x)
        x = self._layer_norm(x + attn_out, self.ln1_gamma, self.ln1_beta)

        # Feed-forward with residual
        ff_out = self.ff.forward(x)
        x = self._layer_norm(x + ff_out, self.ln2_gamma, self.ln2_beta)

        return x


class QuantumTransformer:
    """
    Full quantum transformer model.
    """

    def __init__(self, config: TransformerConfig = None):
        self.config = config or TransformerConfig()

        # Embedding
        self.embedding = np.random.randn(10000, self.config.d_model) * 0.02

        # Positional encoding
        self.pos_encoding = self._create_positional_encoding()

        # Transformer layers
        self.layers = [
            QuantumTransformerLayer(self.config)
            for _ in range(self.config.n_layers)
        ]

        # Output projection
        self.output_proj = np.random.randn(self.config.d_model, 10000) * 0.02

    def _create_positional_encoding(self) -> np.ndarray:
        """Create sinusoidal positional encoding."""
        pos = np.arange(self.config.max_seq_len)[:, np.newaxis]
        dim = np.arange(self.config.d_model)[np.newaxis, :]

        angles = pos / np.power(10000, (2 * (dim // 2)) / self.config.d_model)

        pe = np.zeros((self.config.max_seq_len, self.config.d_model))
        pe[:, 0::2] = np.sin(angles[:, 0::2])
        pe[:, 1::2] = np.cos(angles[:, 1::2])

        return pe

    def forward(self, token_ids: np.ndarray) -> np.ndarray:
        """
        Forward pass through transformer.

        Args:
            token_ids: Token indices of shape (seq_len,)
        """
        seq_len = len(token_ids)

        # Embedding + positional encoding
        x = self.embedding[token_ids] + self.pos_encoding[:seq_len]

        # Transformer layers
        for layer in self.layers:
            x = layer.forward(x)

        # Output projection
        logits = x @ self.output_proj

        return logits

    def generate(self, prompt_ids: np.ndarray, max_length: int = 50) -> np.ndarray:
        """Generate tokens autoregressively."""
        generated = list(prompt_ids)

        for _ in range(max_length):
            # Get logits for current sequence
            logits = self.forward(np.array(generated))

            # Sample from last position
            last_logits = logits[-1]
            probs = np.exp(last_logits - np.max(last_logits))
            probs = probs / probs.sum()

            # Sample next token
            next_token = np.random.choice(len(probs), p=probs)
            generated.append(next_token)

            # Stop if EOS (assume token 1 is EOS)
            if next_token == 1:
                break

        return np.array(generated)


def demo_quantum_transformer():
    """Demonstrate quantum transformer."""
    print("=" * 60)
    print("QUANTUM TRANSFORMER DEMO")
    print("=" * 60)

    config = TransformerConfig(
        d_model=32,
        n_heads=2,
        n_layers=1,
        n_qubits=4
    )

    model = QuantumTransformer(config)

    # Test forward pass
    test_input = np.array([5, 10, 15, 20, 25])
    print(f"\nInput tokens: {test_input}")

    logits = model.forward(test_input)
    print(f"Output shape: {logits.shape}")

    # Test generation
    prompt = np.array([5, 10])
    generated = model.generate(prompt, max_length=10)
    print(f"\nGenerated sequence: {generated}")


if __name__ == "__main__":
    demo_quantum_transformer()
