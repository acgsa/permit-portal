from ...models.pic import DecisionElement
from ...schemas.pic_crud import DecisionElementCreate, DecisionElementResponse, DecisionElementUpdate
from ._factory import make_router

router = make_router(
    prefix="/decision-elements",
    tag="Decision Elements",
    model=DecisionElement,
    create_schema=DecisionElementCreate,
    update_schema=DecisionElementUpdate,
    response_schema=DecisionElementResponse,
)
