#!/usr/bin/env python3
import argparse
import asyncio
import json
import sys
from typing import Any, Generator

plugin: dict[Any, Any] = {
    "name": "Run marimo contents",
    # "directives": [
    #     {
    #         "name": "marimo",
    #         "arg": {},
    #         "options": {},
    #         "body": {
    #             "type": "string",
    #         },
    #     }
    # ],
    "transforms": [
        {
            "name": "marimo",
            "doc": "This transform picks up any directives with ```{marimo} and generates the marimo islands",
            "stage": "document",
        }
    ],
}

# - type: mystDirective
#   name: marimo
#   value: |-
#     import marimo as mo
#     mo.md("Hello, marimo!")

DIRECTIVE_TYPE = "mystDirective"
DIRECTIVE_NAME = "marimo"


def find_all_by_type(
    node: dict[Any, Any], type_: str, name: str
) -> Generator[dict[Any, Any], None, None]:
    """Simple node visitor that matches a particular node type

    :param parent: starting node
    :param type_: type of the node to search for
    """
    if node["type"] == type_:
        yield node

    if "children" not in node:
        return
    for next_node in node["children"]:
        yield from find_all_by_type(next_node, type_, name)


def declare_result(content: dict[Any, Any]):
    """Declare result as JSON to stdout

    :param content: content to declare as the result
    """

    # Format result and write to stdout
    json.dump(content, sys.stdout, indent=2)
    # Successfully exit
    raise SystemExit(0)


def run_transform(name: str, data: dict[Any, Any]) -> dict[Any, Any]:
    """Execute a transform with the given name and data

    :param name: name of the transform to run
    :param data: AST of the document upon which the transform is being run
    """
    assert name == "marimo"
    try:
        import marimo
    except ImportError:
        sys.stderr.write(
            "Error: marimo is not installed. Install with 'pip install marimo'\n"
        )
        sys.exit(1)

    generator = marimo.MarimoIslandGenerator()
    outputs: list[Any] = []

    # First pass, collect code and add placeholder
    for idx, marimo_node in enumerate(
        find_all_by_type(data, DIRECTIVE_TYPE, DIRECTIVE_NAME)
    ):
        code = marimo_node["value"]
        outputs.append(generator.add_code(code))
        marimo_node["name"] = "marimo-placeholder"
        marimo_node["value"] = idx

    # Run generator
    asyncio.run(generator.build())

    # Second pass, replace placeholder
    for idx, marimo_node in enumerate(
        find_all_by_type(data, DIRECTIVE_TYPE, "marimo-placeholder")
    ):
        marimo_node["type"] = "html"
        del marimo_node["name"]
        del marimo_node["position"]
        html = outputs[idx].render()
        marimo_node["value"] = html

    # Add header as first child
    if data["type"] == "root":
        head: str = generator.render_head()
        # Bug with bad html
        head = head.replace(
            "<marimo-filename hidden></>", "<marimo-filename hidden></marimo-filename>"
        )
        header_node = {
            "type": "block",
            "children": [{"type": "html", "value": f"<div>{head}</div>"}],
        }
        data["children"].insert(0, header_node)

    return data


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--role")
    group.add_argument("--directive")
    group.add_argument("--transform")
    args = parser.parse_args()

    if args.directive:
        # Noop, will be handled in run_transform
        declare_result(json.load(sys.stdin))
    elif args.transform:
        data = json.load(sys.stdin)
        declare_result(run_transform(args.transform, data))
    elif args.role:
        raise NotImplementedError
    else:
        declare_result(plugin)
