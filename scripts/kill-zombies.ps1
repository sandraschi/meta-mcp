$ports = @(14400, 5173)
$patterns = @("*meta_mcp*", "*uvicorn*", "*watchfiles*", "*vite*")

Write-Host "🧟 Checking for zombie processes..." -ForegroundColor Cyan

# 1. Kill by port
foreach ($port in $ports) {
    $processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    
    if ($processes) {
        foreach ($procId in $processes) {
            try {
                $process = Get-Process -Id $procId -ErrorAction Stop
                Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
                Write-Host "💥 Killed zombie process $($process.ProcessName) (PID: $procId) on port $port" -ForegroundColor Red
            }
            catch {
                Write-Host "⚠️ Could not kill process on port $port (PID: $procId)" -ForegroundColor Yellow
            }
        }
    }
}

# 2. Kill by pattern
foreach ($pattern in $patterns) {
    $processes = Get-Process | Where-Object { $_.CommandLine -like $pattern -or $_.ProcessName -like $pattern } -ErrorAction SilentlyContinue
    if ($processes) {
        foreach ($p in $processes) {
            try {
                $id = $p.Id
                $name = $p.ProcessName
                Stop-Process -Id $id -Force -ErrorAction SilentlyContinue
                Write-Host "💨 Terminated process $name (PID: $id) matching pattern '$pattern'" -ForegroundColor Red
            }
            catch {
                # Process might already be gone
            }
        }
    }
}

Write-Host "✨ Clean start prepared." -ForegroundColor Green

