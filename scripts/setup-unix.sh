#!/bin/bash

# Warp Multithreaded Framework - Unix/Linux/macOS Setup Script
# Run with: curl -sSL https://raw.githubusercontent.com/yourusername/warp-multithreaded/main/scripts/setup-unix.sh | bash
# Or: bash setup-unix.sh

set -e  # Exit on any error

# Configuration
INSTALL_PATH="$HOME/warp-multithreaded"
REPO_URL="https://github.com/yourusername/warp-multithreaded.git"
ADD_TO_PATH=false
SKIP_VALIDATION=false

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${CYAN}$1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_step() {
    echo -e "${YELLOW}$1${NC}"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --install-path)
            INSTALL_PATH="$2"
            shift 2
            ;;
        --add-to-path)
            ADD_TO_PATH=true
            shift
            ;;
        --skip-validation)
            SKIP_VALIDATION=true
            shift
            ;;
        --help)
            echo "Warp Multithreaded Framework Setup Script"
            echo ""
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --install-path PATH    Install to specific path (default: $HOME/warp-multithreaded)"
            echo "  --add-to-path         Add scripts to PATH"
            echo "  --skip-validation     Skip validation tests"
            echo "  --help               Show this help message"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

echo -e "${CYAN}🚀 Warp Multithreaded Framework - Unix Setup${NC}"
echo -e "${CYAN}=============================================${NC}"

# Check prerequisites
log_step "📋 Checking prerequisites..."

# Check OS
OS=$(uname -s)
case $OS in
    Darwin)
        OS_NAME="macOS"
        SHELL_RC="$HOME/.zshrc"
        ;;
    Linux)
        OS_NAME="Linux"
        if [[ -f "$HOME/.zshrc" ]]; then
            SHELL_RC="$HOME/.zshrc"
        else
            SHELL_RC="$HOME/.bashrc"
        fi
        ;;
    *)
        log_error "Unsupported operating system: $OS"
        exit 1
        ;;
esac
log_success "Operating System: $OS_NAME"

# Check Node.js
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d'.' -f1 | sed 's/v//')
    if [[ $NODE_MAJOR -ge 14 ]]; then
        log_success "Node.js: $NODE_VERSION"
    else
        log_error "Node.js 14.0.0 or higher required. Current: $NODE_VERSION"
        log_info "💡 Download from: https://nodejs.org/"
        exit 1
    fi
else
    log_error "Node.js not found. Please install from https://nodejs.org/"
    echo ""
    case $OS in
        Darwin)
            log_info "💡 Install with Homebrew: brew install node"
            ;;
        Linux)
            log_info "💡 Install with package manager:"
            log_info "   Ubuntu/Debian: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs"
            log_info "   CentOS/RHEL: sudo dnf install nodejs npm"
            ;;
    esac
    exit 1
fi

# Check Git
if command -v git >/dev/null 2>&1; then
    GIT_VERSION=$(git --version)
    log_success "Git: $GIT_VERSION"
else
    log_error "Git not found"
    case $OS in
        Darwin)
            log_info "💡 Install with: xcode-select --install or brew install git"
            ;;
        Linux)
            log_info "💡 Install with: sudo apt-get install git or sudo dnf install git"
            ;;
    esac
    exit 1
fi

# Check npm
if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    log_success "npm: $NPM_VERSION"
else
    log_error "npm not found. Please reinstall Node.js"
    exit 1
fi

# Check if running in Warp terminal (optional)
if [[ -n "$TERM_PROGRAM" && "$TERM_PROGRAM" == "WarpTerminal" ]]; then
    log_success "Warp Terminal: Detected"
else
    log_info "ℹ️  Not running in Warp Terminal (that's okay)"
fi

# Create installation directory
log_step "📁 Creating installation directory..."
if [[ -d "$INSTALL_PATH" ]]; then
    log_warning "Directory exists: $INSTALL_PATH"
    read -p "Delete and reinstall? [y/N]: " -r
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$INSTALL_PATH"
    else
        log_error "Installation cancelled"
        exit 1
    fi
fi

mkdir -p "$INSTALL_PATH"
log_success "Created: $INSTALL_PATH"

# Clone repository
log_step "📥 Cloning repository..."
cd "$INSTALL_PATH"
if git clone "$REPO_URL" . >/dev/null 2>&1; then
    log_success "Repository cloned successfully"
else
    log_error "Failed to clone repository from $REPO_URL"
    log_info "💡 Check your internet connection and repository URL"
    exit 1
fi

# Install dependencies
log_step "📦 Installing dependencies..."
if npm install --silent >/dev/null 2>&1; then
    log_success "Dependencies installed successfully"
else
    log_error "Failed to install dependencies"
    log_info "💡 Try running: npm cache clean --force && npm install"
    exit 1
fi

# Make scripts executable
log_step "🔧 Setting up permissions..."
chmod +x scripts/*.js scripts/*.sh 2>/dev/null || true
log_success "Script permissions configured"

# Add to PATH if requested
if $ADD_TO_PATH; then
    log_step "🔧 Adding to PATH..."
    SCRIPTS_PATH="$INSTALL_PATH/scripts"
    
    if [[ -f "$SHELL_RC" ]]; then
        if ! grep -q "$SCRIPTS_PATH" "$SHELL_RC" 2>/dev/null; then
            echo "" >> "$SHELL_RC"
            echo "# Warp Multithreaded Framework" >> "$SHELL_RC"
            echo "export PATH=\"$SCRIPTS_PATH:\$PATH\"" >> "$SHELL_RC"
            log_success "Added to PATH in $SHELL_RC"
            log_warning "Restart your terminal or run: source $SHELL_RC"
        else
            log_success "Already in PATH"
        fi
    else
        log_warning "Shell RC file not found. Add manually: export PATH=\"$SCRIPTS_PATH:\$PATH\""
    fi
fi

# Run validation
if ! $SKIP_VALIDATION; then
    log_step "🧪 Running validation tests..."
    if npm run validate --silent >/dev/null 2>&1; then
        log_success "All validation tests passed!"
    else
        log_warning "Some validation tests failed. Framework may still be functional."
        log_info "💡 Run 'npm run validate' for detailed output"
    fi
fi

# Create convenient aliases
log_step "🔗 Creating convenience scripts..."

# Create a simple wrapper script
cat > "$INSTALL_PATH/warp-coordinator" << 'EOF'
#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
node "$SCRIPT_DIR/scripts/coordinator.js" "$@"
EOF
chmod +x "$INSTALL_PATH/warp-coordinator"

# Create desktop entry for Linux
if [[ "$OS" == "Linux" ]] && command -v desktop-file-install >/dev/null 2>&1; then
    DESKTOP_FILE="$HOME/.local/share/applications/warp-multithreaded.desktop"
    mkdir -p "$(dirname "$DESKTOP_FILE")"
    cat > "$DESKTOP_FILE" << EOF
[Desktop Entry]
Name=Warp Multithreaded Dashboard
Comment=Launch Warp Multithreaded Framework Dashboard
Exec=node "$INSTALL_PATH/scripts/coordinator.js" dashboard
Icon=applications-development
Terminal=true
Type=Application
Categories=Development;
EOF
    log_success "Desktop entry created"
fi

# Test installation
log_step "🧪 Testing installation..."
if "$INSTALL_PATH/scripts/coordinator.js" --help >/dev/null 2>&1; then
    log_success "Installation test passed"
else
    log_warning "Installation test failed, but framework might still work"
fi

# Success message
echo ""
log_info "🎉 Installation completed successfully!"
log_info "==========================================="
echo ""
log_info "📁 Installation location: $INSTALL_PATH"
echo ""
log_info "🚀 Quick start commands:"
echo "  # Navigate to a project directory"
echo "  cd /path/to/your/project"
echo ""
echo "  # Initialize framework"
echo "  node \"$INSTALL_PATH/scripts/coordinator.js\" init"
echo ""
echo "  # Start dashboard"
echo "  node \"$INSTALL_PATH/scripts/coordinator.js\" dashboard"
echo ""
echo "  # Test installation"
echo "  node \"$INSTALL_PATH/scripts/coordinator.js\" --help"
echo ""
echo "  # Or use the wrapper script"
echo "  \"$INSTALL_PATH/warp-coordinator\" --help"
echo ""

if $ADD_TO_PATH; then
    log_info "🌍 Global commands available (after shell restart):"
    echo "  coordinator.js init"
    echo "  coordinator.js dashboard"
    echo ""
fi

log_info "📚 Next steps:"
echo "  1. Read: $INSTALL_PATH/INSTALLATION.md"
echo "  2. Try:  $INSTALL_PATH/QUICK_START_RULES.md"
echo "  3. Use:  Enhanced Warp Rules in your terminal"
echo ""
log_success "🎯 Example Warp Rule activation:"
echo '  "Use enhanced-multi-session-coordination from my Warp Drive."'
echo ""

# Create a test project (optional)
read -p "Create a test project to verify installation? [Y/n]: " -r
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    log_step "🧪 Creating test project..."
    TEST_DIR="$HOME/warp-test-project"
    mkdir -p "$TEST_DIR"
    cd "$TEST_DIR"
    
    if node "$INSTALL_PATH/scripts/coordinator.js" init --project-type=web-app >/dev/null 2>&1; then
        log_success "Test project created at: $TEST_DIR"
        log_info "💡 Try running: cd \"$TEST_DIR\" && node \"$INSTALL_PATH/scripts/coordinator.js\" status"
    else
        log_warning "Failed to create test project"
    fi
fi

log_success "Happy multithreaded development! 🚀"

# Final setup instructions
echo ""
echo "🔧 To complete setup:"
if $ADD_TO_PATH; then
    echo "  1. Restart your terminal or run: source $SHELL_RC"
    echo "  2. Navigate to your project: cd /path/to/project"
    echo "  3. Initialize framework: coordinator.js init"
else
    echo "  1. Navigate to your project: cd /path/to/project"
    echo "  2. Initialize framework: node \"$INSTALL_PATH/scripts/coordinator.js\" init"
fi
echo "  3. Start using Warp Rules in your AI sessions!"
echo ""
