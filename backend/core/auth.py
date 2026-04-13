from datetime import datetime, timedelta
import bcrypt
from jose import jwt, JWTError
from fastapi import Header, HTTPException
from backend.supabase_client import supabase
from backend.core.config import get_settings

settings = get_settings()
SECRET_KEY = settings.JWT_SECRET
ALGORITHM = settings.JWT_ALGORITHM
EXPIRE_HOURS = settings.JWT_EXPIRE_HOURS


def create_admin_token(admin_id: str) -> str:
    payload = {
        "sub": admin_id,
        "role": "admin",
        "exp": datetime.utcnow() + timedelta(hours=EXPIRE_HOURS),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_admin(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token ausente")

    token = authorization.replace("Bearer ", "")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Sem permissão")
        return payload
    except JWTError:
        raise HTTPException(status_code=403, detail="Token inválido")


def verify_password(password: str, hashed: str) -> bool:
    password_bytes = password.encode()[:72]
    return bcrypt.checkpw(password_bytes, hashed.encode())


def login_admin_service(username: str, password: str) -> str | None:
    res = supabase.table("admins").select("*").eq("username", username).execute().data
    if not res:
        return None

    admin = res[0]
    if not verify_password(password, admin["password_hash"]):
        return None

    return create_admin_token(admin["id"])

