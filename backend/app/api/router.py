from fastapi import APIRouter

from app.api.routes import assessment, health

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(assessment.router, prefix="/v1")
