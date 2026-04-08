from ...models.pic import CaseEvent
from ...schemas.pic_crud import CaseEventCreate, CaseEventResponse, CaseEventUpdate
from ._factory import make_router

router = make_router(
    prefix="/case-events",
    tag="Case Events",
    model=CaseEvent,
    create_schema=CaseEventCreate,
    update_schema=CaseEventUpdate,
    response_schema=CaseEventResponse,
)
