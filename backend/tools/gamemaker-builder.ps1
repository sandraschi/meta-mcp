param (
    [Parameter(Mandatory = $true)]
    [string]$Name,
    [Parameter(Mandatory = $true)]
    [string]$Template,
    [Parameter(Mandatory = $true)]
    [string]$TargetPath,
    [string]$SourceRepo = "d:\Dev\repos\games-app"
)

$ErrorActionPreference = "Stop"

$ShopDir = Join-Path $TargetPath $Name
if (-not (Test-Path $ShopDir)) {
    New-Item -ItemType Directory -Path $ShopDir -Force
}

Write-Host "Scaffolding game template: $Template into $ShopDir"

$GameSource = Join-Path $SourceRepo "games"
$HtmlPath = Join-Path $GameSource "$Template.html"
$JsPath = Join-Path $GameSource "$Template.js"

if (-not (Test-Path $HtmlPath)) {
    Write-Error "Template HTML not found: $HtmlPath"
}

# Copy essential files
Copy-Item $HtmlPath (Join-Path $ShopDir "index.html") -Force
if (Test-Path $JsPath) {
    Copy-Item $JsPath (Join-Path $ShopDir "$Template.js") -Force
}

# Copy shared assets
Copy-Item (Join-Path $SourceRepo "styles.css") $ShopDir -Force
Copy-Item (Join-Path $SourceRepo "js\theme-switcher.js") $ShopDir -Force

# Patch paths in index.html to be local
$Content = Get-Content (Join-Path $ShopDir "index.html") -Raw
$Content = $Content -replace 'href="/styles.css"', 'href="styles.css"'
$Content = $Content -replace 'src="/js/theme-switcher.js"', 'src="theme-switcher.js"'
Set-Content (Join-Path $ShopDir "index.html") $Content

Write-Host "Scaffolding complete for $Name"
