class MadhuAIError(Exception):
    """Base exception for MadhuAI."""
    pass


class APIKeyMissingError(MadhuAIError):
    """Raised when API key is missing."""
    pass