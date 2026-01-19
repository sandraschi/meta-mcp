param (
    [Parameter(Mandatory = $true)]
    [string]$ShopName,

    [Parameter(Mandatory = $false)]
    [string]$Template = "medusa",

    [Parameter(Mandatory = $false)]
    [string]$Description = "A premium e-commerce store",

    [Parameter(Mandatory = $false)]
    [string]$OutputPath = ".",

    [Parameter(Mandatory = $false)]
    [string]$ConfigPath
)

Write-Host "--- MakerMCP Webshop Builder ---"
Write-Host "Scaffolding shop: $ShopName using template: $Template"

$TargetDir = Join-Path $OutputPath $ShopName

if (Test-Path $TargetDir) {
    Write-Error "Target directory $TargetDir already exists."
    exit 1
}

# Ensure OutputPath exists
if (!(Test-Path $OutputPath)) {
    New-Item -ItemType Directory -Path $OutputPath -Force
}

try {
    if ($Template -eq "medusa") {
        Write-Host "Initializing Medusa JS project..."
        # Note: In a real environment, this might require user interaction or --skip-db
        # We'll use a simplified mock for now to demonstrate the flow
        npx create-medusa-app@latest $TargetDir --repo-url https://github.com/medusajs/medusa-starter-default
    }
    elseif ($Template -eq "nextjs-commerce") {
        Write-Host "Cloning Next.js Commerce template..."
        git clone https://github.com/vercel/commerce.git $TargetDir
    }
    else {
        Write-Error "Unknown template: $Template"
        exit 1
    }

    Write-Host "Shop successfully scaffolded at $TargetDir"
}
catch {
    Write-Error "Failed to scaffold webshop: $_"
    exit 1
}
