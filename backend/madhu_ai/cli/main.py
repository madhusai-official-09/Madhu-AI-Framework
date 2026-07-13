import argparse

from .templates import create_project
from .server import serve


def main():

    parser = argparse.ArgumentParser(
        prog="madhu-ai",
        description="MadhuAI CLI",
    )

    parser.add_argument(
        "--version",
        action="version",
        version="MadhuAI 1.0.0",
    )

    subparsers = parser.add_subparsers(
        dest="command",
        required=True,
    )

    init_parser = subparsers.add_parser(
        "init",
        help="Create a new MadhuAI project",
    )

    init_parser.add_argument(
        "project_name",
        help="Project folder name",
    )

    subparsers.add_parser(
        "serve",
        help="Start MadhuAI server",
    )

    plugin_parser = subparsers.add_parser(
        "plugin",
        help="Manage plugins",
    )

    plugin_parser.add_argument(
        "action",
        choices=["list"],
        help="Plugin action",
    )

    args = parser.parse_args()

    if args.command == "init":
        create_project(args.project_name)

    elif args.command == "serve":
        print("CLI reached serve command")
        serve()

    elif args.command == "plugin":

        from ..plugins.manager import PluginManager

        manager = PluginManager()

        if args.action == "list":
            print(manager.list())


if __name__ == "__main__":
    main()