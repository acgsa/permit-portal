from ...models.pic import GisDataElement
from ...schemas.pic_crud import GisDataElementCreate, GisDataElementResponse, GisDataElementUpdate
from ._factory import make_router

router = make_router(
    prefix="/gis-data-elements",
    tag="GIS Data Elements",
    model=GisDataElement,
    create_schema=GisDataElementCreate,
    update_schema=GisDataElementUpdate,
    response_schema=GisDataElementResponse,
)
