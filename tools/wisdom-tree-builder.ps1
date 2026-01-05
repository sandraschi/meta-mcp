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

$TreeDir = Join-Path $TargetPath $Name
if (-not (Test-Path $TreeDir)) {
    New-Item -ItemType Directory -Path $TreeDir -Force
}

Write-Host "Scaffolding wisdom tree template: $Template into $TreeDir"

$WisdomSource = Join-Path $SourceRepo "games\Technical Tree"
$FilesToCopy = @()

if ($Template -eq "technical-roadmap") {
    $FilesToCopy = Get-ChildItem $WisdomSource -Filter "Technical-docs-*.html"
}
elseif ($Template -eq "ai-concepts") {
    $FilesToCopy = Get-ChildItem $WisdomSource -Filter "*AI*.html"
}
elseif ($Template -eq "git-mastery") {
    $FilesToCopy = Get-ChildItem $WisdomSource -Filter "git-github-guide.html"
}
else {
    Write-Error "Invalid technical tree template: $Template"
}

# Copy matches
foreach ($file in $FilesToCopy) {
    Copy-Item $file.FullName $TreeDir -Force
    # Patch paths
    $Content = Get-Content (Join-Path $TreeDir $file.Name) -Raw
    $Content = $Content -replace 'href="/styles.css"', 'href="styles.css"'
    Set-Content (Join-Path $TreeDir $file.Name) $Content
}

# Copy shared assets
Copy-Item (Join-Path $SourceRepo "styles.css") $TreeDir -Force

Write-Host "Scaffolding complete for $Name"
