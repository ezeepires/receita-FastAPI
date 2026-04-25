from fastapi import APIRouter, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from backend.schemas.auth_schema import LoginRequest
from backend.core.auth import login_admin_service

router = APIRouter(prefix="/admin", tags=["admin"])

limiter = Limiter(key_func=get_remote_address)


@router.post("/login")
@limiter.limit("5/minute")
def login_admin(request: Request, data: LoginRequest):
    token = login_admin_service(data.username, data.password)

    if not token:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    return {"token": token}
