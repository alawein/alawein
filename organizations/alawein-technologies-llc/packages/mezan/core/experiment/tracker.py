"""
Main experiment tracker - MLflow-style API
"""

import json
import logging
import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Union
from contextlib import contextmanager

from .types import Experiment, ExperimentSummary, RunInfo, RunStatus
from .run import Run
from .metrics import MetricsLogger
from .artifacts import ArtifactStore

logger = logging.getLogger(__name__)


class ExperimentTracker:
    """
    Main experiment tracking interface.
    
    MLflow-compatible API for tracking experiments, runs, metrics, and artifacts.
    
    Usage:
        tracker = ExperimentTracker("./mlruns")
        tracker.set_experiment("my-experiment")
        
        with tracker.start_run(run_name="training-v1") as run:
            run.log_params({"lr": 0.001, "epochs": 100})
            for epoch in range(100):
                run.log_metrics({"loss": loss, "accuracy": acc}, step=epoch)
            run.log_artifact("model.pkl", "models")
    """

    def __init__(self, tracking_uri: str = "./mlruns"):
        self.tracking_uri = Path(tracking_uri)
        self.tracking_uri.mkdir(parents=True, exist_ok=True)
        
        self._active_experiment: Optional[Experiment] = None
        self._active_run: Optional[Run] = None
        self._experiments: Dict[str, Experiment] = {}
        self._artifact_store = ArtifactStore(str(self.tracking_uri))
        
        # Load existing experiments
        self._load_experiments()

    def _load_experiments(self) -> None:
        """Load existing experiments from disk"""
        for exp_dir in self.tracking_uri.iterdir():
            if exp_dir.is_dir() and (exp_dir / "meta.json").exists():
                with open(exp_dir / "meta.json") as f:
                    data = json.load(f)
                    exp = Experiment(
                        experiment_id=data["experiment_id"],
                        name=data["name"],
                        description=data.get("description"),
                        artifact_location=data.get("artifact_location"),
                        tags=data.get("tags", {}),
                    )
                    self._experiments[exp.name] = exp

    def create_experiment(
        self,
        name: str,
        description: Optional[str] = None,
        tags: Optional[Dict[str, str]] = None,
    ) -> str:
        """Create a new experiment"""
        if name in self._experiments:
            return self._experiments[name].experiment_id
            
        experiment_id = str(uuid.uuid4())
        exp_dir = self.tracking_uri / experiment_id
        exp_dir.mkdir(parents=True, exist_ok=True)
        
        experiment = Experiment(
            experiment_id=experiment_id,
            name=name,
            description=description,
            artifact_location=str(exp_dir / "artifacts"),
            tags=tags or {},
            created_at=datetime.now(),
        )
        
        # Save metadata
        with open(exp_dir / "meta.json", "w") as f:
            json.dump({
                "experiment_id": experiment.experiment_id,
                "name": experiment.name,
                "description": experiment.description,
                "artifact_location": experiment.artifact_location,
                "tags": experiment.tags,
                "created_at": experiment.created_at.isoformat(),
            }, f, indent=2)
        
        self._experiments[name] = experiment
        logger.info(f"Created experiment: {name} ({experiment_id})")
        
        return experiment_id

    def set_experiment(self, name: str) -> Experiment:
        """Set the active experiment (creates if doesn't exist)"""
        if name not in self._experiments:
            self.create_experiment(name)
        
        self._active_experiment = self._experiments[name]
        logger.info(f"Set active experiment: {name}")
        return self._active_experiment

    def get_experiment(self, name: str) -> Optional[Experiment]:
        """Get an experiment by name"""
        return self._experiments.get(name)

    def list_experiments(self) -> List[Experiment]:
        """List all experiments"""
        return list(self._experiments.values())

    @contextmanager
    def start_run(
        self,
        run_name: Optional[str] = None,
        tags: Optional[Dict[str, str]] = None,
        nested: bool = False,
    ):
        """Start a new run within the active experiment"""
        if not self._active_experiment:
            raise ValueError("No active experiment. Call set_experiment() first.")
        
        if self._active_run and not nested:
            raise ValueError("A run is already active. Use nested=True for nested runs.")
        
        run = Run(
            experiment_id=self._active_experiment.experiment_id,
            run_name=run_name,
            artifact_uri=str(self.tracking_uri / self._active_experiment.experiment_id / "runs"),
            tags=tags,
        )
        
        previous_run = self._active_run
        self._active_run = run
        
        try:
            with run:
                yield run
        finally:
            self._active_run = previous_run

    def log_param(self, key: str, value: Any) -> None:
        """Log a parameter to the active run"""
        if not self._active_run:
            raise ValueError("No active run")
        self._active_run.log_param(key, value)

    def log_params(self, params: Dict[str, Any]) -> None:
        """Log multiple parameters"""
        if not self._active_run:
            raise ValueError("No active run")
        self._active_run.log_params(params)

    def log_metric(self, key: str, value: float, step: Optional[int] = None) -> None:
        """Log a metric to the active run"""
        if not self._active_run:
            raise ValueError("No active run")
        self._active_run.log_metric(key, value, step)

    def log_metrics(self, metrics: Dict[str, float], step: Optional[int] = None) -> None:
        """Log multiple metrics"""
        if not self._active_run:
            raise ValueError("No active run")
        self._active_run.log_metrics(metrics, step)

    def log_artifact(self, local_path: str, artifact_path: Optional[str] = None) -> None:
        """Log an artifact to the active run"""
        if not self._active_run:
            raise ValueError("No active run")
        self._active_run.log_artifact(local_path, artifact_path)

    def get_run(self, run_id: str) -> Optional[Dict]:
        """Get run data by ID"""
        for exp in self._experiments.values():
            run_file = self.tracking_uri / exp.experiment_id / "runs" / run_id / "run.json"
            if run_file.exists():
                with open(run_file) as f:
                    return json.load(f)
        return None

    def search_runs(
        self,
        experiment_ids: Optional[List[str]] = None,
        filter_string: Optional[str] = None,
        order_by: Optional[str] = None,
    ) -> List[Dict]:
        """Search for runs across experiments"""
        runs = []
        
        exp_ids = experiment_ids or [e.experiment_id for e in self._experiments.values()]
        
        for exp_id in exp_ids:
            runs_dir = self.tracking_uri / exp_id / "runs"
            if not runs_dir.exists():
                continue
                
            for run_dir in runs_dir.iterdir():
                run_file = run_dir / "run.json"
                if run_file.exists():
                    with open(run_file) as f:
                        run_data = json.load(f)
                        runs.append(run_data)
        
        # Sort if requested
        if order_by and runs:
            key_parts = order_by.split(" ")
            key = key_parts[0]
            desc = len(key_parts) > 1 and key_parts[1].upper() == "DESC"
            
            runs.sort(
                key=lambda r: r.get("metrics", {}).get(key, float("inf")),
                reverse=desc,
            )
        
        return runs

