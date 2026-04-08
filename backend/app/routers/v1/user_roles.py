from ...models.pic import UserRole
from ...schemas.pic_crud import UserRoleCreate, UserRoleResponse, UserRoleUpdate
from ._factory import make_router

router = make_router(
    prefix="/user-roles",
    tag="User Roles",
    model=UserRole,
    create_schema=UserRoleCreate,
    update_schema=UserRoleUpdate,
    response_schema=UserRoleResponse,
)
