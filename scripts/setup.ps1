# Warp AI Agent Framework - Windows Setup Script

Write-Host "🚀 Setting up Warp AI Agent Framework..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Write-Host "   After installing Node.js, run this setup script again." -ForegroundColor Yellow
    exit 1
}

# Create global command alias (optional)
$profilePath = $PROFILE
if (Test-Path $profilePath) {
    $aliasCommand = "function warp-agent { node '$PWD\scripts\coordinator.js' @args }"
    
    if (!(Get-Content $profilePath | Select-String "warp-agent")) {
        Add-Content $profilePath $aliasCommand
        Write-Host "✅ Added 'warp-agent' command to PowerShell profile" -ForegroundColor Green
        Write-Host "   Restart PowerShell or run: . `$PROFILE" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  PowerShell profile not found. Creating one..." -ForegroundColor Yellow
    New-Item -ItemType File -Path $profilePath -Force | Out-Null
    $aliasCommand = "function warp-agent { node '$PWD\scripts\coordinator.js' @args }"
    Add-Content $profilePath $aliasCommand
    Write-Host "✅ Created PowerShell profile with 'warp-agent' command" -ForegroundColor Green
}

# Test the framework
Write-Host "`n🧪 Testing framework..." -ForegroundColor Cyan

try {
    node scripts/coordinator.js help | Out-Null
    Write-Host "✅ Framework test passed!" -ForegroundColor Green
} catch {
    Write-Host "❌ Framework test failed" -ForegroundColor Red
    exit 1
}

# Run demo
Write-Host "`n🎬 Running demo (optional)..." -ForegroundColor Cyan
$runDemo = Read-Host "Would you like to run the demo? (y/N)"

if ($runDemo -eq 'y' -or $runDemo -eq 'Y') {
    node examples/demo.js
}

Write-Host "`n🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host "`n📚 Quick start:" -ForegroundColor Cyan
Write-Host "   1. cd your-project-folder" -ForegroundColor White
Write-Host "   2. node $PWD\scripts\coordinator.js init --project-type=web-app" -ForegroundColor White
Write-Host "   3. node $PWD\scripts\coordinator.js session create --name=frontend" -ForegroundColor White
Write-Host "   4. node $PWD\scripts\coordinator.js status" -ForegroundColor White

Write-Host "`n💡 Or use the global command (after restarting PowerShell):" -ForegroundColor Cyan
Write-Host "   warp-agent init --project-type=web-app" -ForegroundColor White
Write-Host "   warp-agent session create --name=frontend" -ForegroundColor White
Write-Host "   warp-agent status" -ForegroundColor White

Write-Host "`n📖 For more information, see: README.md" -ForegroundColor Gray
