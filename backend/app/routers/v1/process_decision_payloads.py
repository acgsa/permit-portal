from ...models.pic import ProcessDecisionPayload
from ...schemas.pic_crud import (
    ProcessDecisionPayloadCreate,
    ProcessDecisionPayloadResponse,
    ProcessDecisionPayloadUpdate,
)
from ._factory import make_router

router = make_router(
    prefix="/process-decision-payloads",
    tag="Process Decision Payloads",
    model=ProcessDecisionPayload,
    create_schema=ProcessDecisionPayloadCreate,
    update_schema=ProcessDecisionPayloadUpdate,
    response_schema=ProcessDecisionPayloadResponse,
)
