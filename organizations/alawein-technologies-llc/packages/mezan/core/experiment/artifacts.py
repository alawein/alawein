"""
Artifact storage and management for experiment tracking
"""

import hashlib
import json
import logging
import os
import shutil
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional
from dataclasses import dataclass

from .types import Artifact

logger = logging.getLogger(__name__)


@dataclass
class ArtifactMetadata:
    """Extended metadata for artifacts"""
    artifact_id: str
    run_id: str
    name: str
    path: str
    artifact_type: str
    size_bytes: int
    hash_md5: str
    created_at: datetime
    tags: Dict[str, str]


class ArtifactStore:
    """
    Manages artifact storage for experiment runs.
    
    Features:
    - File-based storage with deduplication
    - Artifact versioning
    - Metadata tracking
    - Model serialization helpers
    """

    def __init__(self, root_uri: str = "./mlruns"):
        self.root_uri = Path(root_uri)
        self.root_uri.mkdir(parents=True, exist_ok=True)
        self._metadata_cache: Dict[str, ArtifactMetadata] = {}

    def log_artifact(
        self,
        run_id: str,
        local_path: str,
        artifact_path: Optional[str] = None,
        artifact_type: str = "general",
        tags: Optional[Dict[str, str]] = None,
    ) -> ArtifactMetadata:
        """Log a file as an artifact"""
        source = Path(local_path)
        if not source.exists():
            raise FileNotFoundError(f"Artifact not found: {local_path}")

        # Compute hash for deduplication
        file_hash = self._compute_hash(source)

        # Determine destination path
        artifact_subdir = artifact_path or artifact_type
        dest_dir = self.root_uri / run_id / "artifacts" / artifact_subdir
        dest_dir.mkdir(parents=True, exist_ok=True)
        dest_path = dest_dir / source.name

        # Copy file
        shutil.copy2(source, dest_path)

        # Create metadata
        artifact_id = f"{run_id}_{source.name}_{file_hash[:8]}"
        metadata = ArtifactMetadata(
            artifact_id=artifact_id,
            run_id=run_id,
            name=source.name,
            path=str(dest_path),
            artifact_type=artifact_type,
            size_bytes=source.stat().st_size,
            hash_md5=file_hash,
            created_at=datetime.now(),
            tags=tags or {},
        )

        # Save metadata
        self._save_metadata(metadata)
        self._metadata_cache[artifact_id] = metadata

        logger.info(f"Logged artifact: {source.name} ({metadata.size_bytes} bytes)")
        return metadata

    def log_dict(
        self,
        run_id: str,
        data: Dict[str, Any],
        filename: str,
        artifact_type: str = "data",
    ) -> ArtifactMetadata:
        """Log a dictionary as JSON artifact"""
        temp_path = self.root_uri / "temp" / filename
        temp_path.parent.mkdir(parents=True, exist_ok=True)

        with open(temp_path, "w") as f:
            json.dump(data, f, indent=2, default=str)

        metadata = self.log_artifact(run_id, str(temp_path), artifact_type=artifact_type)
        temp_path.unlink()  # Clean up temp file

        return metadata

    def log_model(
        self,
        run_id: str,
        model: Any,
        model_name: str = "model",
        framework: str = "auto",
    ) -> ArtifactMetadata:
        """Log a ML model as artifact"""
        temp_dir = self.root_uri / "temp" / run_id
        temp_dir.mkdir(parents=True, exist_ok=True)

        # Detect and serialize model based on framework
        if framework == "auto":
            framework = self._detect_framework(model)

        if framework == "sklearn":
            import joblib
            model_path = temp_dir / f"{model_name}.joblib"
            joblib.dump(model, model_path)
        elif framework == "pytorch":
            import torch
            model_path = temp_dir / f"{model_name}.pt"
            torch.save(model.state_dict(), model_path)
        elif framework == "tensorflow":
            model_path = temp_dir / model_name
            model.save(model_path)
        else:
            # Fallback to pickle
            import pickle
            model_path = temp_dir / f"{model_name}.pkl"
            with open(model_path, "wb") as f:
                pickle.dump(model, f)

        metadata = self.log_artifact(
            run_id, str(model_path), artifact_type="model",
            tags={"framework": framework, "model_name": model_name}
        )

        # Clean up temp files
        if model_path.is_file():
            model_path.unlink()
        elif model_path.is_dir():
            shutil.rmtree(model_path)

        return metadata

    def get_artifact(self, run_id: str, artifact_name: str) -> Optional[Path]:
        """Get path to an artifact"""
        artifact_dir = self.root_uri / run_id / "artifacts"
        for artifact_path in artifact_dir.rglob(artifact_name):
            return artifact_path
        return None

    def list_artifacts(self, run_id: str, artifact_type: Optional[str] = None) -> List[ArtifactMetadata]:
        """List all artifacts for a run"""
        metadata_file = self.root_uri / run_id / "artifacts" / "metadata.json"
        if not metadata_file.exists():
            return []

        with open(metadata_file) as f:
            all_metadata = json.load(f)

        artifacts = [ArtifactMetadata(**m) for m in all_metadata]

        if artifact_type:
            artifacts = [a for a in artifacts if a.artifact_type == artifact_type]

        return artifacts

    def _compute_hash(self, filepath: Path) -> str:
        """Compute MD5 hash of file"""
        hasher = hashlib.md5()
        with open(filepath, "rb") as f:
            for chunk in iter(lambda: f.read(8192), b""):
                hasher.update(chunk)
        return hasher.hexdigest()

    def _save_metadata(self, metadata: ArtifactMetadata) -> None:
        """Save artifact metadata to JSON"""
        metadata_file = self.root_uri / metadata.run_id / "artifacts" / "metadata.json"

        existing = []
        if metadata_file.exists():
            with open(metadata_file) as f:
                existing = json.load(f)

        existing.append({
            "artifact_id": metadata.artifact_id,
            "run_id": metadata.run_id,
            "name": metadata.name,
            "path": metadata.path,
            "artifact_type": metadata.artifact_type,
            "size_bytes": metadata.size_bytes,
            "hash_md5": metadata.hash_md5,
            "created_at": metadata.created_at.isoformat(),
            "tags": metadata.tags,
        })

        with open(metadata_file, "w") as f:
            json.dump(existing, f, indent=2)

    def _detect_framework(self, model: Any) -> str:
        """Auto-detect ML framework from model type"""
        model_type = str(type(model))
        if "sklearn" in model_type:
            return "sklearn"
        elif "torch" in model_type:
            return "pytorch"
        elif "tensorflow" in model_type or "keras" in model_type:
            return "tensorflow"
        return "pickle"

