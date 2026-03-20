from typing import Optional

TASK_PROGRESSION: dict[str, str] = {
    "intake": "agency-review",
    "agency-review": "nepa-compliance",
    "nepa-compliance": "final-decision",
    "final-decision": "approved",
}


def get_next_task(current_task: Optional[str]) -> Optional[str]:
    if current_task is None:
        return None
    return TASK_PROGRESSION.get(current_task)


def resolve_workflow_status(next_task: Optional[str]) -> str:
    if next_task == "approved":
        return "complete"
    if next_task:
        return "running"
    return "complete"
