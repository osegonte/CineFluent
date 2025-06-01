"""Movie management routes"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_movies():
    return {"message": "Movies endpoint - coming soon"}
