# backend/cinefluent/learning/routes.py - Add these endpoints:
@router.get("/quiz/{lesson_id}")
@router.post("/quiz/{lesson_id}/answer")
@router.get("/vocabulary/review")