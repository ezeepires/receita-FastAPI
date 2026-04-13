from fastapi import APIRouter, HTTPException
from backend.schemas.auth_schema import LoginRequest
from backend.core.auth import login_admin_service

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/login")
def login_admin(data: LoginRequest):
    token = login_admin_service(data.username, data.password)

    if not token:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    return {"token": token}
