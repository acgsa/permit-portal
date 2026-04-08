from ...models.pic import Document
from ...schemas.pic_crud import DocumentCreate, DocumentResponse, DocumentUpdate
from ._factory import make_router

router = make_router(
    prefix="/documents",
    tag="Documents",
    model=Document,
    create_schema=DocumentCreate,
    update_schema=DocumentUpdate,
    response_schema=DocumentResponse,
)
