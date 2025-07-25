# Warp Multithreaded Framework - Windows Setup Script
# Run with: PowerShell -ExecutionPolicy Bypass -File setup-windows.ps1

param(
    [string]$InstallPath = "$env:USERPROFILE\warp-multithreaded",
    [switch]$AddToPath = $false,
    [switch]$SkipValidation = $false
)

Write-Host "🚀 Warp Multithreaded Framework - Windows Setup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

# Check PowerShell version
if ($PSVersionTable.PSVersion.Major -lt 5) {
    Write-Error "❌ PowerShell 5.0 or higher required. Current: $($PSVersionTable.PSVersion)"
    exit 1
}
Write-Host "✅ PowerShell: $($PSVersionTable.PSVersion)" -ForegroundColor Green

# Check Node.js
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion -match "v(\d+)\.(\d+)\.(\d+)") {
        $majorVersion = [int]$matches[1]
        if ($majorVersion -ge 14) {
            Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
        } else {
            Write-Error "❌ Node.js 14.0.0 or higher required. Current: $nodeVersion"
            Write-Host "💡 Download from: https://nodejs.org/" -ForegroundColor Yellow
            exit 1
        }
    } else {
        throw "Invalid version format"
    }
} catch {
    Write-Error "❌ Node.js not found. Please install from https://nodejs.org/"
    exit 1
}

# Check Git
try {
    $gitVersion = git --version 2>$null
    Write-Host "✅ Git: $gitVersion" -ForegroundColor Green
} catch {
    Write-Error "❌ Git not found. Please install from https://git-scm.com/"
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version 2>$null
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Error "❌ npm not found. Please reinstall Node.js"
    exit 1
}

# Create installation directory
Write-Host "📁 Creating installation directory..." -ForegroundColor Yellow
try {
    if (Test-Path $InstallPath) {
        Write-Host "⚠️  Directory exists: $InstallPath" -ForegroundColor Yellow
        $response = Read-Host "Delete and reinstall? [y/N]"
        if ($response -eq 'y' -or $response -eq 'Y') {
            Remove-Item -Path $InstallPath -Recurse -Force
        } else {
            Write-Host "❌ Installation cancelled" -ForegroundColor Red
            exit 1
        }
    }
    New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
    Write-Host "✅ Created: $InstallPath" -ForegroundColor Green
} catch {
    Write-Error "❌ Failed to create directory: $InstallPath"
    exit 1
}

# Clone repository
Write-Host "📥 Cloning repository..." -ForegroundColor Yellow
Set-Location $InstallPath
try {
    # For this example, using current directory. In real deployment, use actual repo URL
    $repoUrl = "https://github.com/yourusername/warp-multithreaded.git"
    Write-Host "🔗 Cloning from: $repoUrl" -ForegroundColor Blue
    git clone $repoUrl . 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Git clone failed"
    }
    Write-Host "✅ Repository cloned successfully" -ForegroundColor Green
} catch {
    Write-Error "❌ Failed to clone repository. Check your internet connection."
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
try {
    npm install --silent
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed"
    }
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Error "❌ Failed to install dependencies"
    Write-Host "💡 Try running: npm cache clean --force && npm install" -ForegroundColor Yellow
    exit 1
}

# Add to PATH if requested
if ($AddToPath) {
    Write-Host "🔧 Adding to PATH..." -ForegroundColor Yellow
    try {
        $scriptsPath = Join-Path $InstallPath "scripts"
        $currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
        if ($currentPath -notlike "*$scriptsPath*") {
            $newPath = "$currentPath;$scriptsPath"
            [Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
            Write-Host "✅ Added to PATH: $scriptsPath" -ForegroundColor Green
            Write-Host "⚠️  Restart your terminal to use global commands" -ForegroundColor Yellow
        } else {
            Write-Host "✅ Already in PATH" -ForegroundColor Green
        }
    } catch {
        Write-Warning "⚠️  Failed to add to PATH. You can add manually: $scriptsPath"
    }
}

# Run validation
if (-not $SkipValidation) {
    Write-Host "🧪 Running validation tests..." -ForegroundColor Yellow
    try {
        npm run validate --silent
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ All validation tests passed!" -ForegroundColor Green
        } else {
            Write-Warning "⚠️  Some validation tests failed. Framework may still be functional."
        }
    } catch {
        Write-Warning "⚠️  Could not run validation tests. Framework may still be functional."
    }
}

# Create desktop shortcut (optional)
Write-Host "🔗 Creating shortcuts..." -ForegroundColor Yellow
try {
    $desktopPath = [Environment]::GetFolderPath("Desktop")
    $shortcutPath = Join-Path $desktopPath "Warp Multithreaded Dashboard.lnk"
    
    $WshShell = New-Object -comObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut($shortcutPath)
    $Shortcut.TargetPath = "node"
    $Shortcut.Arguments = "`"$InstallPath\scripts\coordinator.js`" dashboard"
    $Shortcut.WorkingDirectory = $InstallPath
    $Shortcut.IconLocation = "shell32.dll,13"
    $Shortcut.Description = "Launch Warp Multithreaded Dashboard"
    $Shortcut.Save()
    
    Write-Host "✅ Desktop shortcut created" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not create desktop shortcut" -ForegroundColor Yellow
}

# Success message
Write-Host ""
Write-Host "🎉 Installation completed successfully!" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Installation location: $InstallPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Quick start commands:" -ForegroundColor Cyan
Write-Host "  # Navigate to a project directory"
Write-Host "  cd `"C:\path\to\your\project`""
Write-Host ""
Write-Host "  # Initialize framework"
Write-Host "  node `"$InstallPath\scripts\coordinator.js`" init"
Write-Host ""
Write-Host "  # Start dashboard"
Write-Host "  node `"$InstallPath\scripts\coordinator.js`" dashboard"
Write-Host ""
Write-Host "  # Test installation"
Write-Host "  node `"$InstallPath\scripts\coordinator.js`" --help"
Write-Host ""

if ($AddToPath) {
    Write-Host "🌍 Global commands available (after terminal restart):" -ForegroundColor Cyan
    Write-Host "  coordinator.js init"
    Write-Host "  coordinator.js dashboard"
    Write-Host ""
}

Write-Host "📚 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Read: $InstallPath\INSTALLATION.md"
Write-Host "  2. Try:  $InstallPath\QUICK_START_RULES.md"
Write-Host "  3. Use:  Enhanced Warp Rules in your terminal"
Write-Host ""
Write-Host "🎯 Example Warp Rule activation:" -ForegroundColor Green
Write-Host '  "Use enhanced-multi-session-coordination from my Warp Drive."' -ForegroundColor White
Write-Host ""
Write-Host "Happy multithreaded development! 🚀" -ForegroundColor Green
