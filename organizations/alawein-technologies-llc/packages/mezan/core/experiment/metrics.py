"""
Metrics logging and aggregation for experiment tracking
"""

import logging
from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime
from typing import Callable, Dict, List, Optional, Tuple

import numpy as np

from .types import Metric

logger = logging.getLogger(__name__)


@dataclass
class MetricSummary:
    """Summary statistics for a metric"""
    key: str
    count: int
    min_value: float
    max_value: float
    mean_value: float
    std_value: float
    last_value: float
    last_step: int


class MetricsLogger:
    """
    Advanced metrics logging with aggregation and callbacks.
    
    Features:
    - Automatic aggregation (mean, min, max, std)
    - Step-based and epoch-based logging
    - Metric history tracking
    - Callbacks on metric updates
    - Moving average computation
    """

    def __init__(self, smoothing_window: int = 10):
        self._metrics: Dict[str, List[Metric]] = defaultdict(list)
        self._callbacks: Dict[str, List[Callable]] = defaultdict(list)
        self._smoothing_window = smoothing_window
        self._current_step = 0

    def log(self, key: str, value: float, step: Optional[int] = None) -> None:
        """Log a single metric value"""
        if step is None:
            step = self._current_step
            
        metric = Metric(key=key, value=value, step=step, timestamp=datetime.now())
        self._metrics[key].append(metric)
        
        # Trigger callbacks
        for callback in self._callbacks.get(key, []):
            callback(key, value, step)
        for callback in self._callbacks.get("*", []):
            callback(key, value, step)

    def log_dict(self, metrics: Dict[str, float], step: Optional[int] = None) -> None:
        """Log multiple metrics at once"""
        for key, value in metrics.items():
            self.log(key, value, step)

    def step(self, increment: int = 1) -> int:
        """Increment the global step counter"""
        self._current_step += increment
        return self._current_step

    def get_history(self, key: str) -> List[Tuple[int, float]]:
        """Get the history of a metric as (step, value) tuples"""
        return [(m.step, m.value) for m in self._metrics.get(key, [])]

    def get_values(self, key: str) -> List[float]:
        """Get all values for a metric"""
        return [m.value for m in self._metrics.get(key, [])]

    def get_last(self, key: str) -> Optional[float]:
        """Get the most recent value for a metric"""
        metrics = self._metrics.get(key, [])
        return metrics[-1].value if metrics else None

    def get_best(self, key: str, mode: str = "min") -> Optional[Tuple[int, float]]:
        """Get the best value for a metric (min or max)"""
        metrics = self._metrics.get(key, [])
        if not metrics:
            return None
            
        if mode == "min":
            best = min(metrics, key=lambda m: m.value)
        else:
            best = max(metrics, key=lambda m: m.value)
            
        return (best.step, best.value)

    def get_moving_average(self, key: str, window: Optional[int] = None) -> Optional[float]:
        """Get the moving average of the last N values"""
        window = window or self._smoothing_window
        values = self.get_values(key)
        
        if not values:
            return None
            
        recent = values[-window:]
        return sum(recent) / len(recent)

    def get_summary(self, key: str) -> Optional[MetricSummary]:
        """Get summary statistics for a metric"""
        values = self.get_values(key)
        if not values:
            return None
            
        metrics = self._metrics[key]
        
        return MetricSummary(
            key=key,
            count=len(values),
            min_value=min(values),
            max_value=max(values),
            mean_value=float(np.mean(values)),
            std_value=float(np.std(values)),
            last_value=values[-1],
            last_step=metrics[-1].step,
        )

    def get_all_summaries(self) -> Dict[str, MetricSummary]:
        """Get summaries for all logged metrics"""
        summaries = {}
        for key in self._metrics:
            summary = self.get_summary(key)
            if summary:
                summaries[key] = summary
        return summaries

    def register_callback(self, key: str, callback: Callable[[str, float, int], None]) -> None:
        """Register a callback for metric updates. Use '*' for all metrics."""
        self._callbacks[key].append(callback)

    def clear(self, key: Optional[str] = None) -> None:
        """Clear metric history"""
        if key:
            self._metrics[key] = []
        else:
            self._metrics.clear()

    def export_csv(self, filepath: str) -> None:
        """Export all metrics to CSV"""
        import csv
        
        with open(filepath, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["metric", "step", "value", "timestamp"])
            
            for key, metrics in self._metrics.items():
                for m in metrics:
                    writer.writerow([key, m.step, m.value, m.timestamp.isoformat()])

    def to_dict(self) -> Dict[str, List[Dict]]:
        """Export all metrics as dictionary"""
        return {
            key: [{"step": m.step, "value": m.value, "timestamp": m.timestamp.isoformat()}
                  for m in metrics]
            for key, metrics in self._metrics.items()
        }

