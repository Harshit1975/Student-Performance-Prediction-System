@echo off
echo ========================================
echo   HARSHIT EDU - SYSTEM AUTOMATION
echo ========================================
echo.

echo [1/2] Starting FastAPI Backend...
start cmd /k "cd backend && .\venv\Scripts\activate && uvicorn main:app --reload --port 8000"

echo [2/2] Starting Next.js Frontend...
start cmd /k "cd frontend && npm run dev"

echo.
echo All systems are launching! 
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
pause
