"""Tests for core module."""

import pytest
from src.core import BaseProcessor, Result


class TestResult:
    """Tests for Result class."""

    def test_success_result(self) -> None:
        result = Result(data={"key": "value"})
        assert result.success is True
        assert result.data == {"key": "value"}
        assert result.error is None

    def test_error_result(self) -> None:
        result = Result(error="Something went wrong")
        assert result.success is False
        assert result.error == "Something went wrong"

    def test_unwrap_success(self) -> None:
        result = Result(data=42)
        assert result.unwrap() == 42

    def test_unwrap_error(self) -> None:
        result = Result(error="Error message")
        with pytest.raises(ValueError, match="Error message"):
            result.unwrap()

    def test_repr_success(self) -> None:
        result = Result(data="test")
        assert "success=True" in repr(result)

    def test_repr_error(self) -> None:
        result = Result(error="error")
        assert "success=False" in repr(result)


class TestBaseProcessor:
    """Tests for BaseProcessor class."""

    def test_init_default_name(self) -> None:
        processor = BaseProcessor()
        assert processor.name == "default"

    def test_init_custom_name(self) -> None:
        processor = BaseProcessor(name="custom")
        assert processor.name == "custom"

    def test_process_not_implemented(self) -> None:
        processor = BaseProcessor()
        with pytest.raises(NotImplementedError):
            processor.process("data")

    def test_repr(self) -> None:
        processor = BaseProcessor(name="test")
        assert "BaseProcessor" in repr(processor)
        assert "test" in repr(processor)

