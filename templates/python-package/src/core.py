"""Core module for {{PROJECT_NAME}}."""

from typing import Any

__all__ = ["BaseProcessor", "Result"]


class Result:
    """Generic result container with success/error handling."""

    def __init__(self, data: Any = None, error: str | None = None) -> None:
        self.data = data
        self.error = error
        self.success = error is None

    def __repr__(self) -> str:
        if self.success:
            return f"Result(success=True, data={self.data!r})"
        return f"Result(success=False, error={self.error!r})"

    def unwrap(self) -> Any:
        """Return data or raise if error."""
        if not self.success:
            raise ValueError(self.error)
        return self.data


class BaseProcessor:
    """Base class for all processors in the package."""

    def __init__(self, name: str = "default") -> None:
        self.name = name

    def process(self, data: Any) -> Result:
        """Process input data and return a Result.

        Args:
            data: Input data to process.

        Returns:
            Result containing processed data or error.
        """
        raise NotImplementedError("Subclasses must implement process()")

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(name={self.name!r})"

