from ...models.pic import Engagement
from ...schemas.pic_crud import EngagementCreate, EngagementResponse, EngagementUpdate
from ._factory import make_router

router = make_router(
    prefix="/engagements",
    tag="Engagements",
    model=Engagement,
    create_schema=EngagementCreate,
    update_schema=EngagementUpdate,
    response_schema=EngagementResponse,
)
