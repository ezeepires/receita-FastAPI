from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request
from fastapi.responses import JSONResponse
from backend.api.routers.auth import router as auth_router
from backend.api.routers.recipes import router as recipes_router

BASE_DIR = Path(__file__).resolve().parent.parent

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Projeto Receita",
    description="API de receitas com autenticação JWT e rotas organizadas por módulos",
    version="1.0.0",
)

# Adicionar rate limiter ao app
app.state.limiter = limiter

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Muitas requisições. Tente novamente mais tarde."}
    )

# CORS seguro - permitir domínios do localhost e produção
import os
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:8000,http://127.0.0.1:8000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.mount("/frontend", StaticFiles(directory=BASE_DIR / "frontend"), name="frontend")

app.include_router(auth_router)
app.include_router(recipes_router)


@app.get("/")
def root():
    return RedirectResponse(url="/frontend/public/index.html")


@app.get("/frontend/public")
def frontend_public():
    return RedirectResponse(url="/frontend/public/index.html")


@app.get("/frontend/admin")
def frontend_admin():
    return RedirectResponse(url="/frontend/admin/login.html")


@app.get("/favicon.ico")
def favicon():
    return RedirectResponse(url="/frontend/public/favicon.ico")
