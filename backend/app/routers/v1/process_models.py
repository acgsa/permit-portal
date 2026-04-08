from ...models.pic import ProcessModel
from ...schemas.pic_crud import ProcessModelCreate, ProcessModelResponse, ProcessModelUpdate
from ._factory import make_router

router = make_router(
    prefix="/process-models",
    tag="Process Models",
    model=ProcessModel,
    create_schema=ProcessModelCreate,
    update_schema=ProcessModelUpdate,
    response_schema=ProcessModelResponse,
)
