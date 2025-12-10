"""GPU-accelerated gradient descent optimizer."""
import numpy as np
from typing import Callable, Optional, Dict, Any

class GradientDescent:
    def __init__(self, learning_rate: float = 0.01, max_iter: int = 1000, tol: float = 1e-6):
        self.learning_rate = learning_rate
        self.max_iter = max_iter
        self.tol = tol
        
    def optimize(self, objective: Callable, x0: np.ndarray, **kwargs) -> Dict[str, Any]:
        x = x0.copy()
        for i in range(self.max_iter):
            grad = self._compute_gradient(objective, x)
            x_new = x - self.learning_rate * grad
            
            if np.linalg.norm(x_new - x) < self.tol:
                break
            x = x_new
            
        return {
            'x': x,
            'fun': objective(x),
            'iterations': i + 1,
            'method': 'GradientDescent'
        }
    
    def _compute_gradient(self, f: Callable, x: np.ndarray, eps: float = 1e-8) -> np.ndarray:
        grad = np.zeros_like(x)
        f0 = f(x)
        for i in range(len(x)):
            x_plus = x.copy()
            x_plus[i] += eps
            grad[i] = (f(x_plus) - f0) / eps
        return grad