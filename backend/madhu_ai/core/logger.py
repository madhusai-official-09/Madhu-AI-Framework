import logging
import sys

from ..config import config

_logger = None


def get_logger(name: str = "MadhuAI"):
    global _logger

    if _logger:
        return _logger

    logger = logging.getLogger(name)

    if logger.handlers:
        return logger

    logger.setLevel(getattr(logging, config.log_level.upper(), logging.INFO))

    formatter = logging.Formatter(
        "[%(asctime)s] %(levelname)s | %(name)s | %(message)s",
        "%Y-%m-%d %H:%M:%S"
    )

    console = logging.StreamHandler(sys.stdout)
    console.setFormatter(formatter)

    logger.addHandler(console)
    logger.propagate = False

    _logger = logger
    return logger


logger = get_logger()