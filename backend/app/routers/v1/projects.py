from ...models.pic import Project
from ...schemas.pic_crud import ProjectCreate, ProjectResponse, ProjectUpdate
from ._factory import make_router

router = make_router(
    prefix="/projects",
    tag="Projects",
    model=Project,
    create_schema=ProjectCreate,
    update_schema=ProjectUpdate,
    response_schema=ProjectResponse,
)
