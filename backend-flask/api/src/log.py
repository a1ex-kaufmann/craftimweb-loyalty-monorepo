import logging
import sys
from logging.handlers import RotatingFileHandler

from config import FlaskConfig

FORMATTER = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
LOG_FILE = FlaskConfig.LOG_FILE

loggers = {}


def get_console_handler():
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(FORMATTER)
    console_handler.setLevel(logging.DEBUG)
    return console_handler


def get_file_handler():
    file_handler = RotatingFileHandler(LOG_FILE, maxBytes=100 * 1024 * 1024, backupCount=365)
    file_handler.setFormatter(FORMATTER)
    file_handler.setLevel(logging.DEBUG)
    return file_handler


def get_logger(logger_name):
    if loggers.get(logger_name):
        return loggers.get(logger_name)
    else:
        logger = logging.getLogger(logger_name)

        logger.setLevel(logging.DEBUG)  # better to have too much log than not enough

        logger.addHandler(get_console_handler())
        logger.addHandler(get_file_handler())

        # with this pattern, it's rarely necessary to propagate the error up to parent
        logger.propagate = False

        loggers[logger_name] = logger

        return logger
