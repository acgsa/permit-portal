from ...models.pic import Comment
from ...schemas.pic_crud import CommentCreate, CommentResponse, CommentUpdate
from ._factory import make_router

router = make_router(
    prefix="/comments",
    tag="Comments",
    model=Comment,
    create_schema=CommentCreate,
    update_schema=CommentUpdate,
    response_schema=CommentResponse,
)
