import hashlib
import re
import xml.etree.ElementTree as ET
from collections import defaultdict, deque
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple

NS = {"bpmn": "http://www.omg.org/spec/BPMN/20100524/MODEL"}
BOOL_RE = re.compile(r"^([A-Za-z0-9_]+)\s*==\s*(true|false)$", re.IGNORECASE)
STRING_RE = re.compile(r"^([A-Za-z0-9_]+)\s*==\s*['\"](.+?)['\"]$")
NUMBER_RE = re.compile(r"^([A-Za-z0-9_]+)\s*==\s*(-?\d+(?:\.\d+)?)$")


@dataclass
class BpmnMetadata:
    checksum: str
    process_id: str
    process_name: str
    first_task_id: str
    tasks: List[Dict[str, str]]
    validation_errors: List[str]
    transitions: Dict[str, List[Dict[str, Optional[str]]]]
    node_types: Dict[str, str]


def _checksum(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def parse_bpmn_definition(bpmn_xml: str) -> BpmnMetadata:
    try:
        root = ET.fromstring(bpmn_xml)
    except ET.ParseError as exc:
        raise ValueError(f"Invalid BPMN XML: {exc}") from exc

    process = root.find("bpmn:process", NS)
    if process is None:
        raise ValueError("BPMN file must contain an executable process")

    process_id = process.attrib.get("id", "")
    process_name = process.attrib.get("name") or process_id or "Unnamed Process"
    if not process_id:
        raise ValueError("BPMN process must have an id")

    node_types: Dict[str, str] = {}
    tasks: List[Dict[str, str]] = []
    start_events: List[str] = []

    for element in list(process):
        tag = element.tag.split("}")[-1]
        element_id = element.attrib.get("id")
        if not element_id:
            continue
        if tag in {"startEvent", "userTask", "exclusiveGateway", "endEvent"}:
            node_types[element_id] = tag
        if tag == "startEvent":
            start_events.append(element_id)
        if tag == "userTask":
            tasks.append(
                {
                    "id": element_id,
                    "name": element.attrib.get("name", element_id),
                    "node_type": tag,
                }
            )

    transitions: Dict[str, List[Dict[str, Optional[str]]]] = defaultdict(list)
    for flow in process.findall("bpmn:sequenceFlow", NS):
        source = flow.attrib.get("sourceRef")
        target = flow.attrib.get("targetRef")
        if not source or not target:
            continue
        condition = flow.find("bpmn:conditionExpression", NS)
        transitions[source].append(
            {
                "target": target,
                "condition": condition.text.strip() if condition is not None and condition.text else None,
            }
        )

    first_task_id = _find_first_user_task(start_events, node_types, transitions)
    if not first_task_id:
        raise ValueError("BPMN process must have a reachable user task from a start event")

    validation_errors: List[str] = []
    if not tasks:
        validation_errors.append("Process contains no user tasks")

    return BpmnMetadata(
        checksum=_checksum(bpmn_xml),
        process_id=process_id,
        process_name=process_name,
        first_task_id=first_task_id,
        tasks=tasks,
        validation_errors=validation_errors,
        transitions=dict(transitions),
        node_types=node_types,
    )


def _find_first_user_task(
    start_events: List[str],
    node_types: Dict[str, str],
    transitions: Dict[str, List[Dict[str, Optional[str]]]],
) -> str:
    queue = deque(start_events)
    seen = set(start_events)

    while queue:
        node_id = queue.popleft()
        for edge in transitions.get(node_id, []):
            target = edge["target"]
            if target is None or target in seen:
                continue
            seen.add(target)
            if node_types.get(target) == "userTask":
                return target
            queue.append(target)
    return ""


def resolve_next_task(
    metadata: BpmnMetadata, current_task: str, context: Dict[str, Any]
) -> Tuple[Optional[str], str]:
    return _walk_from_node(current_task, metadata, context, seen=set())


def _walk_from_node(
    node_id: str,
    metadata: BpmnMetadata,
    context: Dict[str, Any],
    seen: set[str],
) -> Tuple[Optional[str], str]:
    if node_id in seen:
        raise ValueError(f"Cycle detected while resolving BPMN from node '{node_id}'")
    seen.add(node_id)

    edges = metadata.transitions.get(node_id, [])
    if not edges:
        return None, "complete"

    if metadata.node_types.get(node_id) == "exclusiveGateway":
        target = _select_gateway_target(edges, context)
        if not target:
            raise ValueError("Exclusive gateway conditions did not match supplied workflow data")
        return _walk_target(target, metadata, context, seen)

    first_edge = edges[0]
    return _walk_target(first_edge["target"], metadata, context, seen)


def _walk_target(
    target: Optional[str],
    metadata: BpmnMetadata,
    context: Dict[str, Any],
    seen: set[str],
) -> Tuple[Optional[str], str]:
    if not target:
        return None, "complete"

    node_type = metadata.node_types.get(target)
    if node_type == "userTask":
        return target, "running"
    if node_type == "endEvent":
        terminal_status = "denied" if target.lower().endswith("denied") else "complete"
        return target, terminal_status
    return _walk_from_node(target, metadata, context, seen)


def _select_gateway_target(
    edges: List[Dict[str, Optional[str]]], context: Dict[str, Any]
) -> Optional[str]:
    fallback: Optional[str] = None
    for edge in edges:
        target = edge["target"]
        condition = edge["condition"]
        if not condition:
            fallback = target
            continue
        if _condition_matches(condition, context):
            return target
    return fallback


def _condition_matches(expression: str, context: Dict[str, Any]) -> bool:
    expr = " ".join(expression.split())

    match = BOOL_RE.match(expr)
    if match:
        field_name, expected = match.groups()
        actual = context.get(field_name)
        return bool(actual) is (expected.lower() == "true")

    match = STRING_RE.match(expr)
    if match:
        field_name, expected = match.groups()
        return str(context.get(field_name)) == expected

    match = NUMBER_RE.match(expr)
    if match:
        field_name, expected = match.groups()
        actual = context.get(field_name)
        try:
            return float(actual) == float(expected)
        except (TypeError, ValueError):
            return False

    raise ValueError(f"Unsupported BPMN condition expression: {expression}")
