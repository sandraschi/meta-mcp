Write-Host "🚀 Starting MetaMCP Development Environment..." -ForegroundColor Magenta

# 1. Kill Zombies
./scripts/kill-zombies.ps1

# 2. Start Backend (Port 14400)
Write-Host "🐍 Starting Backend on Port 14400..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "pip install -e .; uvicorn meta_mcp.main:create_fastapi_app --factory --reload --port 14400"

# 3. Start Frontend (Port 5173)
Write-Host "⚛️ Starting Frontend on Port 5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd web; npm run dev"

Write-Host "✅ Dev environment started!" -ForegroundColor Green
Write-Host "👉 Webapp: http://localhost:5173"
Write-Host "👉 Backend: http://localhost:14400"
