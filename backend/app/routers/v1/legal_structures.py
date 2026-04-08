from ...models.pic import LegalStructure
from ...schemas.pic_crud import LegalStructureCreate, LegalStructureResponse, LegalStructureUpdate
from ._factory import make_router

router = make_router(
    prefix="/legal-structures",
    tag="Legal Structures",
    model=LegalStructure,
    create_schema=LegalStructureCreate,
    update_schema=LegalStructureUpdate,
    response_schema=LegalStructureResponse,
)
