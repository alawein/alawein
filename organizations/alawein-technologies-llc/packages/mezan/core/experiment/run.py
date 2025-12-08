"""
Run management for experiment tracking
"""

import json
import logging
import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Union
from contextlib import contextmanager

from .types import Run as RunData, RunInfo, RunStatus, Metric, Param, Tag, Artifact

logger = logging.getLogger(__name__)


class Run:
    """
    Represents an active experiment run with logging capabilities.
    
    Usage:
        with Run(experiment_id="exp-1", run_name="training-v1") as run:
            run.log_param("learning_rate", 0.001)
            run.log_metric("loss", 0.5, step=0)
            run.log_artifact("model.pkl", "models")
    """

    def __init__(
        self,
        experiment_id: str,
        run_name: Optional[str] = None,
        run_id: Optional[str] = None,
        artifact_uri: Optional[str] = None,
        tags: Optional[Dict[str, str]] = None,
    ):
        self.run_id = run_id or str(uuid.uuid4())
        self.experiment_id = experiment_id
        self.run_name = run_name or f"run-{self.run_id[:8]}"
        self.artifact_uri = artifact_uri or f"./artifacts/{self.experiment_id}/{self.run_id}"
        
        self._info = RunInfo(
            run_id=self.run_id,
            experiment_id=experiment_id,
            run_name=self.run_name,
            status=RunStatus.PENDING,
            start_time=datetime.now(),
            artifact_uri=self.artifact_uri,
            tags=tags or {},
        )
        
        self._metrics: List[Metric] = []
        self._params: List[Param] = []
        self._tags: List[Tag] = []
        self._artifacts: List[Artifact] = []
        self._step = 0

    @property
    def info(self) -> RunInfo:
        return self._info

    @property
    def status(self) -> RunStatus:
        return self._info.status

    def start(self) -> "Run":
        """Start the run"""
        self._info.status = RunStatus.RUNNING
        self._info.start_time = datetime.now()
        
        # Create artifact directory
        os.makedirs(self.artifact_uri, exist_ok=True)
        
        logger.info(f"Run {self.run_id} started")
        return self

    def end(self, status: RunStatus = RunStatus.COMPLETED) -> None:
        """End the run"""
        self._info.status = status
        self._info.end_time = datetime.now()
        
        # Save run data
        self._save_run_data()
        
        logger.info(f"Run {self.run_id} ended with status {status.value}")

    def __enter__(self) -> "Run":
        return self.start()

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        if exc_type is not None:
            self.end(RunStatus.FAILED)
        else:
            self.end(RunStatus.COMPLETED)

    def log_param(self, key: str, value: Any) -> None:
        """Log a parameter"""
        param = Param(key=key, value=str(value))
        self._params.append(param)
        logger.debug(f"Logged param: {key}={value}")

    def log_params(self, params: Dict[str, Any]) -> None:
        """Log multiple parameters"""
        for key, value in params.items():
            self.log_param(key, value)

    def log_metric(self, key: str, value: float, step: Optional[int] = None) -> None:
        """Log a metric value"""
        if step is None:
            step = self._step
            self._step += 1
            
        metric = Metric(key=key, value=value, step=step)
        self._metrics.append(metric)
        logger.debug(f"Logged metric: {key}={value} @ step {step}")

    def log_metrics(self, metrics: Dict[str, float], step: Optional[int] = None) -> None:
        """Log multiple metrics"""
        for key, value in metrics.items():
            self.log_metric(key, value, step)

    def set_tag(self, key: str, value: str) -> None:
        """Set a tag"""
        tag = Tag(key=key, value=value)
        self._tags.append(tag)
        self._info.tags[key] = value

    def log_artifact(self, local_path: str, artifact_path: Optional[str] = None) -> Artifact:
        """Log an artifact (file)"""
        source = Path(local_path)
        if not source.exists():
            raise FileNotFoundError(f"Artifact not found: {local_path}")
            
        dest_dir = Path(self.artifact_uri) / (artifact_path or "")
        dest_dir.mkdir(parents=True, exist_ok=True)
        
        dest = dest_dir / source.name
        
        # Copy file
        import shutil
        shutil.copy2(source, dest)
        
        artifact = Artifact(
            name=source.name,
            path=str(dest),
            artifact_type=artifact_path or "general",
            size_bytes=source.stat().st_size,
        )
        self._artifacts.append(artifact)
        logger.info(f"Logged artifact: {source.name}")
        
        return artifact

    def get_metrics(self, key: Optional[str] = None) -> List[Metric]:
        """Get logged metrics, optionally filtered by key"""
        if key:
            return [m for m in self._metrics if m.key == key]
        return self._metrics

    def get_params(self) -> Dict[str, str]:
        """Get all logged parameters as dict"""
        return {p.key: p.value for p in self._params}

    def _save_run_data(self) -> None:
        """Save run data to disk"""
        data = {
            "info": {
                "run_id": self._info.run_id,
                "experiment_id": self._info.experiment_id,
                "run_name": self._info.run_name,
                "status": self._info.status.value,
                "start_time": self._info.start_time.isoformat(),
                "end_time": self._info.end_time.isoformat() if self._info.end_time else None,
                "tags": self._info.tags,
            },
            "metrics": [{"key": m.key, "value": m.value, "step": m.step} for m in self._metrics],
            "params": [{"key": p.key, "value": p.value} for p in self._params],
            "artifacts": [{"name": a.name, "path": a.path, "type": a.artifact_type} for a in self._artifacts],
        }
        
        run_file = Path(self.artifact_uri) / "run.json"
        with open(run_file, "w") as f:
            json.dump(data, f, indent=2)

