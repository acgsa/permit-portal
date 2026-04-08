from ...models.pic import ProcessInstance
from ...schemas.pic_crud import ProcessInstanceCreate, ProcessInstanceResponse, ProcessInstanceUpdate
from ._factory import make_router

router = make_router(
    prefix="/process-instances",
    tag="Process Instances",
    model=ProcessInstance,
    create_schema=ProcessInstanceCreate,
    update_schema=ProcessInstanceUpdate,
    response_schema=ProcessInstanceResponse,
)
