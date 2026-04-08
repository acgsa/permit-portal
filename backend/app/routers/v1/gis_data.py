from ...models.pic import GisData
from ...schemas.pic_crud import GisDataCreate, GisDataResponse, GisDataUpdate
from ._factory import make_router

router = make_router(
    prefix="/gis-data",
    tag="GIS Data",
    model=GisData,
    create_schema=GisDataCreate,
    update_schema=GisDataUpdate,
    response_schema=GisDataResponse,
)
