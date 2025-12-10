"""Quantum gate implementations for Optilibria."""
import numpy as np
from typing import Optional

class QuantumGates:
    """Standard quantum gate matrices."""

    I = np.array([[1, 0], [0, 1]], dtype=complex)
    X = np.array([[0, 1], [1, 0]], dtype=complex)
    Y = np.array([[0, -1j], [1j, 0]], dtype=complex)
    Z = np.array([[1, 0], [0, -1]], dtype=complex)
    H = np.array([[1, 1], [1, -1]], dtype=complex) / np.sqrt(2)
    S = np.array([[1, 0], [0, 1j]], dtype=complex)
    T = np.array([[1, 0], [0, np.exp(1j * np.pi / 4)]], dtype=complex)

    CNOT = np.array([[1,0,0,0],[0,1,0,0],[0,0,0,1],[0,0,1,0]], dtype=complex)
    SWAP = np.array([[1,0,0,0],[0,0,1,0],[0,1,0,0],[0,0,0,1]], dtype=complex)

    @staticmethod
    def Rx(theta: float) -> np.ndarray:
        c, s = np.cos(theta/2), np.sin(theta/2)
        return np.array([[c, -1j*s], [-1j*s, c]], dtype=complex)

    @staticmethod
    def Ry(theta: float) -> np.ndarray:
        c, s = np.cos(theta/2), np.sin(theta/2)
        return np.array([[c, -s], [s, c]], dtype=complex)

    @staticmethod
    def Rz(theta: float) -> np.ndarray:
        return np.array([[np.exp(-1j*theta/2), 0], [0, np.exp(1j*theta/2)]], dtype=complex)

    @staticmethod
    def phase(phi: float) -> np.ndarray:
        return np.array([[1, 0], [0, np.exp(1j * phi)]], dtype=complex)
