"""
Experiment tracking types and data classes
"""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional


class RunStatus(Enum):
    """Status of an experiment run"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    KILLED = "killed"


@dataclass
class Metric:
    """A single metric measurement"""
    key: str
    value: float
    step: int
    timestamp: datetime = field(default_factory=datetime.now)


@dataclass
class Param:
    """A run parameter"""
    key: str
    value: str  # Stored as string for consistency


@dataclass
class Tag:
    """A run tag for categorization"""
    key: str
    value: str


@dataclass
class Artifact:
    """An artifact (file) associated with a run"""
    name: str
    path: str
    artifact_type: str  # model, dataset, plot, log, etc.
    size_bytes: int
    timestamp: datetime = field(default_factory=datetime.now)


@dataclass
class RunInfo:
    """Metadata about a run"""
    run_id: str
    experiment_id: str
    run_name: Optional[str]
    status: RunStatus
    start_time: datetime
    end_time: Optional[datetime] = None
    artifact_uri: Optional[str] = None
    source_name: Optional[str] = None
    source_version: Optional[str] = None
    tags: Dict[str, str] = field(default_factory=dict)


@dataclass
class RunData:
    """Data logged during a run"""
    metrics: List[Metric] = field(default_factory=list)
    params: List[Param] = field(default_factory=list)
    tags: List[Tag] = field(default_factory=list)


@dataclass
class Run:
    """Complete run including info and data"""
    info: RunInfo
    data: RunData = field(default_factory=RunData)


@dataclass
class Experiment:
    """An experiment containing multiple runs"""
    experiment_id: str
    name: str
    description: Optional[str] = None
    artifact_location: Optional[str] = None
    tags: Dict[str, str] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    last_updated: Optional[datetime] = None


@dataclass
class ExperimentSummary:
    """Summary statistics for an experiment"""
    experiment_id: str
    name: str
    run_count: int
    completed_count: int
    failed_count: int
    best_metric: Optional[Dict[str, float]] = None
    last_run_time: Optional[datetime] = None

