"""API v1 – PIC NEPA Data Standard endpoints.

Aggregates all 13 PIC entity routers under /api/v1/.
"""

from fastapi import APIRouter

from . import (
    case_events,
    comments,
    decision_elements,
    documents,
    engagements,
    gis_data,
    gis_data_elements,
    legal_structures,
    process_decision_payloads,
    process_instances,
    process_models,
    projects,
    user_roles,
)

router = APIRouter(prefix="/api/v1")

router.include_router(projects.router)
router.include_router(process_instances.router)
router.include_router(documents.router)
router.include_router(comments.router)
router.include_router(case_events.router)
router.include_router(engagements.router)
router.include_router(gis_data.router)
router.include_router(gis_data_elements.router)
router.include_router(legal_structures.router)
router.include_router(process_models.router)
router.include_router(decision_elements.router)
router.include_router(process_decision_payloads.router)
router.include_router(user_roles.router)
