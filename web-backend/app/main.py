import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.api.v1 import auth, scans, users, payments, admin
from app.db.database import engine, Base

# Create tables for hackathon/dev (In production, use Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Rakshak Web API", version="1.0.0")

app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"], # Frontend dev servers
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred", "message": str(exc)},
    )

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(scans.router, prefix="/api/v1/scans", tags=["scans"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(payments.router, prefix="/api/v1/payments", tags=["payments"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])

# Frontend static files (SPA) - check web-frontend/dist first, then web-backend/static
candidates = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "web-frontend", "dist")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "static")),
]
static_dir = next((d for d in candidates if os.path.isdir(d)), None)

if os.path.isdir(static_dir):
    assets_dir = os.path.join(static_dir, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/api")
    def api_root():
        return {"message": "Welcome to Rakshak API"}

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Allow API routes to be handled by routers
        if full_path.startswith("api/"):
            return JSONResponse(status_code=404, content={"detail": "Not Found"})
        file_path = os.path.join(static_dir, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(static_dir, "index.html"))
else:
    @app.get("/")
    def read_root():
        return {"message": "Welcome to Rakshak API"}
