import json
import os


def get_interface(path_to_interface: str) -> dict:
    if not os.path.exists(path_to_interface):
        raise FileExistsError(f"Interface not found on: {path_to_interface}")

    with open(path_to_interface, "r") as file:
        interface = json.loads(file.read())
    return interface
