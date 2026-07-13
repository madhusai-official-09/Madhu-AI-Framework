from .base import MadhuAIError


class DocumentNotFoundError(MadhuAIError):
    """Raised when a document cannot be found."""


class UnsupportedFileTypeError(MadhuAIError):
    """Raised when an unsupported file type is used."""