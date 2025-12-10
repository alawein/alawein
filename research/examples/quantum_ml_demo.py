"""
Quantum Machine Learning Demo
Demonstrates VQC and QSVM on classification tasks.
"""
import numpy as np
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from optilibria.optilibria import VariationalQuantumClassifier, QSVM


def generate_classification_data(n_samples: int = 100, noise: float = 0.1):
    """Generate a simple 2D classification dataset."""
    np.random.seed(42)

    # Class 0: centered at (-1, -1)
    X0 = np.random.randn(n_samples // 2, 2) * 0.5 + np.array([-1, -1])
    y0 = np.zeros(n_samples // 2)

    # Class 1: centered at (1, 1)
    X1 = np.random.randn(n_samples // 2, 2) * 0.5 + np.array([1, 1])
    y1 = np.ones(n_samples // 2)

    X = np.vstack([X0, X1])
    y = np.hstack([y0, y1])

    # Shuffle
    idx = np.random.permutation(len(y))
    return X[idx], y[idx]


def demo_vqc():
    """Demonstrate Variational Quantum Classifier."""
    print("=" * 60)
    print("VARIATIONAL QUANTUM CLASSIFIER (VQC)")
    print("=" * 60)

    # Generate data
    X_train, y_train = generate_classification_data(80)
    X_test, y_test = generate_classification_data(20)

    print(f"\nDataset: {len(X_train)} training, {len(X_test)} test samples")
    print(f"Features: {X_train.shape[1]}")

    # Create and train VQC
    vqc = VariationalQuantumClassifier(n_qubits=2, n_layers=2)

    print("\nTraining VQC...")
    result = vqc.fit(X_train, y_train, epochs=50, learning_rate=0.2)

    # Evaluate
    train_pred = vqc.predict_class(X_train)
    test_pred = vqc.predict_class(X_test)

    train_acc = np.mean(train_pred == y_train)
    test_acc = np.mean(test_pred == y_test)

    print(f"\nResults:")
    print(f"  Training accuracy: {train_acc:.2%}")
    print(f"  Test accuracy: {test_acc:.2%}")
    print(f"  Final loss: {result.optimal_value:.4f}")

    return test_acc


def demo_qsvm():
    """Demonstrate Quantum Support Vector Machine."""
    print("\n" + "=" * 60)
    print("QUANTUM SUPPORT VECTOR MACHINE (QSVM)")
    print("=" * 60)

    # Generate data
    X_train, y_train = generate_classification_data(60)
    X_test, y_test = generate_classification_data(20)

    # Convert labels to {-1, 1}
    y_train = 2 * y_train - 1
    y_test = 2 * y_test - 1

    print(f"\nDataset: {len(X_train)} training, {len(X_test)} test samples")

    # Create and train QSVM
    qsvm = QSVM(n_qubits=2)

    print("Training QSVM with quantum kernel...")
    qsvm.fit(X_train, y_train, C=1.0)

    # Evaluate
    train_pred = qsvm.predict(X_train)
    test_pred = qsvm.predict(X_test)

    train_acc = np.mean(train_pred == y_train)
    test_acc = np.mean(test_pred == y_test)

    print(f"\nResults:")
    print(f"  Training accuracy: {train_acc:.2%}")
    print(f"  Test accuracy: {test_acc:.2%}")
    print(f"  Support vectors: {len(qsvm.support_vectors)}")

    return test_acc


def demo_quantum_kernel():
    """Demonstrate quantum kernel computation."""
    print("\n" + "=" * 60)
    print("QUANTUM KERNEL ANALYSIS")
    print("=" * 60)

    qsvm = QSVM(n_qubits=3)

    # Sample points
    x1 = np.array([0.5, 0.5, 0.5])
    x2 = np.array([0.5, 0.5, 0.5])  # Same point
    x3 = np.array([-0.5, -0.5, -0.5])  # Opposite
    x4 = np.array([0.1, 0.2, 0.3])  # Different

    print("\nQuantum kernel values K(x, y) = |⟨φ(x)|φ(y)⟩|²:")
    print(f"  K(x1, x1) = {qsvm._quantum_kernel(x1, x1):.4f}  (same point, should be 1)")
    print(f"  K(x1, x2) = {qsvm._quantum_kernel(x1, x2):.4f}  (identical points)")
    print(f"  K(x1, x3) = {qsvm._quantum_kernel(x1, x3):.4f}  (opposite points)")
    print(f"  K(x1, x4) = {qsvm._quantum_kernel(x1, x4):.4f}  (different point)")


if __name__ == "__main__":
    print("\n=== QUANTUM MACHINE LEARNING DEMONSTRATION ===\n")

    vqc_acc = demo_vqc()
    qsvm_acc = demo_qsvm()
    demo_quantum_kernel()

    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"  VQC Test Accuracy: {vqc_acc:.2%}")
    print(f"  QSVM Test Accuracy: {qsvm_acc:.2%}")
    print("\n✅ Quantum ML demo complete!")
