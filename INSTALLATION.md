# 🚀 Warp Multithreaded Framework - Installation & Setup Guide

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Installation Methods](#installation-methods)
- [Platform-Specific Setup](#platform-specific-setup)
- [Verification & Testing](#verification--testing)
- [Troubleshooting](#troubleshooting)
- [Integration with Existing Projects](#integration-with-existing-projects)

## ✅ Prerequisites

### System Requirements
- **Node.js**: Version 14.0.0 or higher
- **Warp Terminal**: Latest version recommended
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **Git**: For cloning and version control
- **Disk Space**: ~50MB for framework files

### Check Your System
```bash
# Verify Node.js version
node --version
# Should show v14.0.0 or higher

# Verify npm is available
npm --version

# Check if you're in Warp terminal
echo $TERM_PROGRAM
# Should show "WarpTerminal" if using Warp
```

## 🔧 Installation Methods

### Method 1: Direct Download (Recommended)
```bash
# Clone the repository
git clone https://github.com/yourusername/warp-multithreaded.git
cd warp-multithreaded

# Install dependencies
npm install

# Verify installation
npm run validate
```

### Method 2: NPM Global Install (Coming Soon)
```bash
# Global installation (future version)
npm install -g warp-multithreaded

# Initialize in any project
warp-multithreaded init
```

### Method 3: Local Project Integration
```bash
# Add to existing project
cd your-existing-project
git clone https://github.com/yourusername/warp-multithreaded.git .warp-framework
cd .warp-framework
npm install
```

## 🖥️ Platform-Specific Setup

### Windows Setup

#### Option A: PowerShell (Recommended)
```powershell
# Create installation directory
New-Item -ItemType Directory -Path "$env:USERPROFILE\warp-multithreaded" -Force
Set-Location "$env:USERPROFILE\warp-multithreaded"

# Clone and install
git clone https://github.com/yourusername/warp-multithreaded.git .
npm install

# Add to PATH (optional - for global access)
$env:PATH += ";$env:USERPROFILE\warp-multithreaded\scripts"
```

#### Option B: Command Prompt
```cmd
# Create and navigate to installation directory
mkdir %USERPROFILE%\warp-multithreaded
cd /d %USERPROFILE%\warp-multithreaded

# Clone and install
git clone https://github.com/yourusername/warp-multithreaded.git .
npm install
```

#### Windows Troubleshooting
```powershell
# If you get execution policy errors
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# If npm install fails
npm cache clean --force
npm install --verbose
```

### macOS Setup

#### Using Terminal
```bash
# Create installation directory
mkdir -p ~/warp-multithreaded
cd ~/warp-multithreaded

# Clone and install
git clone https://github.com/yourusername/warp-multithreaded.git .
npm install

# Add to PATH (optional)
echo 'export PATH="$HOME/warp-multithreaded/scripts:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

#### Using Homebrew (Future)
```bash
# Will be available in future versions
brew tap yourusername/warp-multithreaded
brew install warp-multithreaded
```

### Linux Setup

#### Ubuntu/Debian
```bash
# Install Node.js if not available
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install framework
mkdir -p ~/warp-multithreaded
cd ~/warp-multithreaded
git clone https://github.com/yourusername/warp-multithreaded.git .
npm install

# Add to PATH
echo 'export PATH="$HOME/warp-multithreaded/scripts:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

#### CentOS/RHEL/Fedora
```bash
# Install Node.js
sudo dnf install nodejs npm git

# Install framework
mkdir -p ~/warp-multithreaded
cd ~/warp-multithreaded
git clone https://github.com/yourusername/warp-multithreaded.git .
npm install
```

## ✅ Verification & Testing

### Basic Verification
```bash
# Test framework installation
node scripts/coordinator.js --help
# Should show help menu

# Run system validation
npm run validate
# Should show "All tests passed! ✅"

# Test dashboard
npm run dashboard
# Should start server on http://localhost:3000
```

### Complete System Test
```bash
# Initialize a test project
mkdir test-project
cd test-project

# Initialize framework
node /path/to/warp-multithreaded/scripts/coordinator.js init --project-type=web-app

# Initialize masterplan
node /path/to/warp-multithreaded/scripts/coordinator.js masterplan init --name="Test Project"

# Create test session
node /path/to/warp-multithreaded/scripts/coordinator.js session create --name=frontend --focus=ui

# Check status
node /path/to/warp-multithreaded/scripts/coordinator.js status

# Verify files created
ls -la .warp-*
# Should show .warp-sessions/ and .warp-masterplan/ directories
```

### Expected Output
```
✅ Warp AI Agent Framework for web-app
📝 Configuration saved to: .warp-config.json
📋 Coordination file created: .warp-coordination.md
🧠 Masterplan initialized successfully
✅ Session 'frontend' created with ID: [uuid]
📊 Warp AI Agent Framework Status
🔄 Active sessions: 1
⚠️  Conflicts: 0
```

## 🛠️ Integration with Existing Projects

### New Project Setup
```bash
# Create new project
mkdir my-new-project
cd my-new-project

# Initialize framework
node /path/to/warp-multithreaded/scripts/coordinator.js init --project-type=web-app

# Initialize masterplan
node /path/to/warp-multithreaded/scripts/coordinator.js masterplan init \
  --name="My Project" \
  --description="A web application" \
  --goals="User authentication,Dashboard,API integration"

# Start dashboard (optional)
node /path/to/warp-multithreaded/scripts/coordinator.js dashboard
```

### Existing Project Integration
```bash
# Navigate to your existing project
cd /path/to/your-existing-project

# Initialize framework (non-invasive)
node /path/to/warp-multithreaded/scripts/coordinator.js init --project-type=web-app

# This creates:
# ├── .warp-config.json          # Framework configuration
# ├── .warp-coordination.md      # Live coordination document  
# └── .warp-sessions/            # Session tracking directory
# (Your existing files remain untouched)

# Optional: Initialize masterplan for persistent memory
node /path/to/warp-multithreaded/scripts/coordinator.js masterplan init
```

### Project-Specific Aliases (Recommended)
Create a `package.json` script in your project:
```json
{
  "scripts": {
    "warp": "node /path/to/warp-multithreaded/scripts/coordinator.js",
    "warp:init": "npm run warp init",
    "warp:status": "npm run warp status",
    "warp:dashboard": "npm run warp dashboard",
    "warp:validate": "node /path/to/warp-multithreaded/scripts/validate-system.js"
  }
}
```

Then use:
```bash
npm run warp:init
npm run warp:status
npm run warp:dashboard
```

## 🔧 Configuration

### Framework Configuration
Edit `.warp-config.json` in your project:
```json
{
  "project_type": "web-app",
  "sessions": {
    "frontend": {
      "focus": ["ui", "components", "styling"],
      "directories": ["src/components", "src/styles", "public"],
      "file_patterns": ["*.tsx", "*.jsx", "*.css", "*.scss", "*.html"]
    },
    "backend": {
      "focus": ["api", "database", "auth", "server"],
      "directories": ["src/api", "src/models", "src/middleware", "server"],
      "file_patterns": ["*.js", "*.ts", "*.sql", "*.json"]
    }
  },
  "coordination": {
    "check_interval": 5000,
    "auto_sync": true,
    "conflict_resolution": "prompt"
  }
}
```

### Environment Variables (Optional)
```bash
# Set in your shell profile (.bashrc, .zshrc, etc.)
export WARP_MULTITHREADED_HOME="/path/to/warp-multithreaded"
export WARP_DEFAULT_PROJECT_TYPE="web-app"
export WARP_DASHBOARD_PORT="3000"
```

## 🐛 Troubleshooting

### Common Issues

#### Issue 1: "Command not found"
**Problem**: `node scripts/coordinator.js` not working
**Solution**:
```bash
# Use full path
node /full/path/to/warp-multithreaded/scripts/coordinator.js

# Or add to PATH
export PATH="/path/to/warp-multithreaded/scripts:$PATH"

# Or use npm scripts
npm run warp -- status
```

#### Issue 2: "Module not found"
**Problem**: Dependencies not installed
**Solution**:
```bash
cd /path/to/warp-multithreaded
npm install
```

#### Issue 3: "Permission denied"
**Problem**: File permissions on Unix systems
**Solution**:
```bash
chmod +x /path/to/warp-multithreaded/scripts/coordinator.js
```

#### Issue 4: "Port already in use"
**Problem**: Dashboard port 3000 occupied
**Solution**:
```bash
# Use different port
node scripts/coordinator.js dashboard --port=3001

# Or find and kill process using port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows
```

#### Issue 5: "Validation failed"
**Problem**: System validation errors
**Solution**:
```bash
# Check detailed validation output
npm run validate

# Debug specific components
node scripts/coordinator.js debug files
node scripts/coordinator.js debug sessions
node scripts/coordinator.js debug masterplan
```

### Platform-Specific Issues

#### Windows Issues
```powershell
# PowerShell execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Long path issues
git config --system core.longpaths true

# Antivirus blocking npm install
# Temporarily disable real-time protection during installation
```

#### macOS Issues
```bash
# Xcode command line tools required for some npm packages
xcode-select --install

# Node.js permissions (if using system Node.js)
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

#### Linux Issues
```bash
# Permission issues with global npm
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
```

## 📊 Verification Commands

### Health Check Script
```bash
#!/bin/bash
echo "🔍 Warp Multithreaded Framework Health Check"
echo "============================================"

# Check Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js: Not installed"
fi

# Check framework
if [ -f "scripts/coordinator.js" ]; then
    echo "✅ Framework: Installed"
    node scripts/coordinator.js --help > /dev/null 2>&1 && echo "✅ CLI: Working" || echo "❌ CLI: Not working"
else
    echo "❌ Framework: Not found"
fi

# Check dependencies
if [ -d "node_modules" ]; then
    echo "✅ Dependencies: Installed"
else
    echo "❌ Dependencies: Missing - run 'npm install'"
fi

# Test validation
echo "🧪 Running system validation..."
npm run validate
```

Save as `health-check.sh` and run:
```bash
chmod +x health-check.sh
./health-check.sh
```

## 🎯 Quick Start Verification

After installation, run this complete test:

```bash
# 1. Create test environment
mkdir warp-test && cd warp-test

# 2. Initialize framework
node /path/to/warp-multithreaded/scripts/coordinator.js init

# 3. Initialize masterplan
node /path/to/warp-multithreaded/scripts/coordinator.js masterplan init --name="Test"

# 4. Create session
node /path/to/warp-multithreaded/scripts/coordinator.js session create --name=test

# 5. Check status
node /path/to/warp-multithreaded/scripts/coordinator.js status

# 6. Test Warp Rules
echo "Testing Warp Rules activation..."
echo "Use enhanced-multi-session-coordination from my test Warp Drive."
echo "Check if the framework files were created properly."

# 7. Cleanup
cd .. && rm -rf warp-test
echo "✅ Installation verified successfully!"
```

## 🚀 Next Steps After Installation

1. **Read the enhanced Warp Rules**: `warp-rules/enhanced-*.md`
2. **Try the dashboard**: `npm run dashboard`
3. **Initialize your first project**: Follow the integration guide
4. **Test with multiple terminals**: Use different Warp Rules in each
5. **Join the community**: Report issues and share feedback

---

## 🆘 Getting Help

If installation fails:
1. **Check this troubleshooting guide** for common issues
2. **Run the health check script** to diagnose problems
3. **Create an issue** with your error output and system info
4. **Join our community** for real-time support

**Installation successful? You're ready to revolutionize your AI-assisted development workflow!** 🎉
