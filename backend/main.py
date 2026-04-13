from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from backend.api.routers.auth import router as auth_router
from backend.api.routers.recipes import router as recipes_router

BASE_DIR = Path(__file__).resolve().parent.parent

app = FastAPI(
    title="Projeto Receita",
    description="API de receitas com autenticação JWT e rotas organizadas por módulos",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
