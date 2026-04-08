"""PIC Schema Compliance Middleware.

Validates API responses against the official nepa.schema.json to prove
PIC compliance. Togglable via PIC_SCHEMA_VALIDATE_RESPONSES env flag.
"""

import json
import logging
from pathlib import Path
from typing import Optional

import jsonschema
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger("pic_compliance")

_SCHEMA_PATH = (
    Path(__file__).resolve().parents[2] / "pic-standards" / "src" / "jsonschema" / "nepa.schema.json"
)

_schema_cache: Optional[dict] = None


def _load_schema() -> dict:
    global _schema_cache
    if _schema_cache is None:
        _schema_cache = json.loads(_SCHEMA_PATH.read_text())
    return _schema_cache


# Entity names that map to top-level definitions in the PIC JSON Schema
_PIC_ENTITIES = {
    "projects": "Project",
    "process-instances": "ProcessInstance",
    "documents": "Document",
    "comments": "Comment",
    "engagements": "Engagement",
    "case-events": "CaseEvent",
    "gis-data": "GisData",
    "gis-data-elements": "GisDataElement",
    "legal-structures": "LegalStructure",
    "process-models": "ProcessModel",
    "decision-elements": "DecisionElement",
    "process-decision-payloads": "ProcessDecisionPayload",
    "user-roles": "UserRole",
}


class PICComplianceMiddleware(BaseHTTPMiddleware):
    """Validates JSON responses from /api/v1/ against nepa.schema.json."""

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        response = await call_next(request)

        # Only validate /api/v1/ GET responses with JSON content
        if (
            not request.url.path.startswith("/api/v1/")
            or request.method != "GET"
            or response.status_code >= 400
        ):
            return response

        content_type = response.headers.get("content-type", "")
        if "application/json" not in content_type:
            return response

        # Determine which PIC entity this path maps to
        path_parts = request.url.path.strip("/").split("/")
        # e.g. ["api", "v1", "projects", "123"]
        if len(path_parts) < 3:
            return response

        entity_slug = path_parts[2]
        schema_ref = _PIC_ENTITIES.get(entity_slug)
        if schema_ref is None:
            return response

        # Read response body
        body = b""
        async for chunk in response.body_iterator:
            body += chunk if isinstance(chunk, bytes) else chunk.encode()

        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            return Response(content=body, status_code=response.status_code, headers=dict(response.headers))

        # Validate individual items (handle both list and single-object responses)
        schema = _load_schema()
        items = data if isinstance(data, list) else [data]
        for item in items:
            if not isinstance(item, dict):
                continue
            try:
                jsonschema.validate(
                    instance=item,
                    schema={"$ref": f"#/$defs/{schema_ref}"},
                    resolver=jsonschema.RefResolver.from_schema(schema),
                )
            except jsonschema.ValidationError as exc:
                logger.warning(
                    "PIC compliance violation on %s: %s",
                    request.url.path,
                    exc.message,
                )

        return Response(content=body, status_code=response.status_code, headers=dict(response.headers))
