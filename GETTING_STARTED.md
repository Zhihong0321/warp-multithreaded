# 🚀 Getting Started with Warp Multithreaded Framework

## 📖 Table of Contents
- [Quick Start (5 Minutes)](#quick-start-5-minutes)
- [Detailed Setup](#detailed-setup)
- [Your First Multithreaded Session](#your-first-multithreaded-session)
- [Common Use Cases](#common-use-cases)
- [Troubleshooting](#troubleshooting)

## ⚡ Quick Start (5 Minutes)

### Step 1: Install the Framework

**Windows (PowerShell):**
```powershell
# Download and run setup script
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/yourusername/warp-multithreaded/main/scripts/setup-windows.ps1" -OutFile "setup.ps1"
PowerShell -ExecutionPolicy Bypass -File setup.ps1 -AddToPath
```

**macOS/Linux:**
```bash
# Download and run setup script
curl -sSL https://raw.githubusercontent.com/yourusername/warp-multithreaded/main/scripts/setup-unix.sh | bash -s -- --add-to-path
```

**Manual Installation:**
```bash
# Clone repository
git clone https://github.com/yourusername/warp-multithreaded.git
cd warp-multithreaded

# Install dependencies
npm install

# Run health check
npm run health-check
```

### Step 2: Initialize Your Project

```bash
# Navigate to your project
cd /path/to/your-project

# Initialize framework (Windows - use your actual path)
node "C:\Users\%USERNAME%\warp-multithreaded\scripts\coordinator.js" init --project-type=web-app

# Initialize framework (macOS/Linux)
node "$HOME/warp-multithreaded/scripts/coordinator.js" init --project-type=web-app

# Initialize masterplan for persistent memory
node "path/to/warp-multithreaded/scripts/coordinator.js" masterplan init --name="My Project"
```

### Step 3: Start Using Warp Rules

Open Warp terminal and use enhanced rules:

**For Frontend Work:**
```
Use enhanced-multi-session-coordination and enhanced-masterplan-session-rules and frontend-session-rules from my Warp Drive.
I need to work on the user interface components.
```

**For Backend Work:**
```
Use enhanced-multi-session-coordination and enhanced-masterplan-session-rules and backend-session-rules from my Warp Drive.
I need to work on the API endpoints and database.
```

### Step 4: Verify Everything Works

```bash
# Check status
node "path/to/warp-multithreaded/scripts/coordinator.js" status

# Start dashboard (optional)
node "path/to/warp-multithreaded/scripts/coordinator.js" dashboard
# Open: http://localhost:3000/warp-dashboard
```

## 🔧 Detailed Setup

### Prerequisites Check

Run this in your terminal to verify prerequisites:
```bash
# Check Node.js (must be 14+)
node --version

# Check npm
npm --version

# Check Git
git --version

# Check if you're in Warp Terminal
echo $TERM_PROGRAM  # Should show "WarpTerminal"
```

### Installation Options

#### Option 1: Automated Setup (Recommended)

**Windows PowerShell:**
```powershell
# Basic installation
scripts/setup-windows.ps1

# With PATH addition and skip validation
scripts/setup-windows.ps1 -AddToPath -SkipValidation

# Custom installation path
scripts/setup-windows.ps1 -InstallPath "D:\Tools\warp-multithreaded"
```

**Unix/Linux/macOS:**
```bash
# Basic installation
bash scripts/setup-unix.sh

# With PATH addition
bash scripts/setup-unix.sh --add-to-path

# Custom installation path
bash scripts/setup-unix.sh --install-path "/opt/warp-multithreaded"

# Skip validation tests
bash scripts/setup-unix.sh --skip-validation
```

#### Option 2: Manual Installation

```bash
# 1. Create installation directory
mkdir -p ~/warp-multithreaded
cd ~/warp-multithreaded

# 2. Clone repository
git clone https://github.com/yourusername/warp-multithreaded.git .

# 3. Install dependencies
npm install

# 4. Verify installation
npm run health-check

# 5. Test basic functionality
npm run validate
```

### Post-Installation Verification

```bash
# Health check - diagnoses any issues
npm run health-check

# System validation - tests all components
npm run validate

# CLI test
node scripts/coordinator.js --help

# Dashboard test (optional)
npm run dashboard
```

## 🎯 Your First Multithreaded Session

### Scenario: Building a Web Application

Let's walk through setting up coordinated AI sessions for a typical web app:

#### 1. Initialize Project Structure

```bash
# Navigate to your project
cd my-web-app

# Initialize framework
node ~/warp-multithreaded/scripts/coordinator.js init --project-type=web-app

# Initialize masterplan
node ~/warp-multithreaded/scripts/coordinator.js masterplan init \
  --name="My Web App" \
  --description="A modern web application" \
  --goals="User authentication,Dashboard,API integration" \
  --technologies="React,Node.js,PostgreSQL"
```

This creates:
```
my-web-app/
├── .warp-config.json          # Framework configuration
├── .warp-coordination.md      # Live coordination document
├── .warp-sessions/            # Session tracking
└── .warp-masterplan/          # Persistent project memory
    ├── masterplan.md          # Project overview
    ├── tasks.json             # Task management
    ├── session-log.md         # Session history
    ├── decisions.md           # Technical decisions
    └── context.json           # Project metadata
```

#### 2. Open Multiple Warp Terminals

**Terminal 1 - Frontend Session:**
```
Use enhanced-multi-session-coordination, enhanced-masterplan-session-rules, and frontend-session-rules from my Warp Drive.

I'm working on the frontend of our web app. Let me check the masterplan context first to understand what needs to be done.
```

Expected AI Response:
```
I'm reading the masterplan context to understand the current project state...

Based on the masterplan, I understand that:
- Project: My Web App is in planning phase
- Progress: 0% complete with 0 sessions completed
- Current focus: User authentication, Dashboard, API integration
- Recent work: Project just initialized
- My role: Frontend development focusing on UI/components

From the task list, I can see [X] pending tasks that match my frontend expertise:
- [Task examples from masterplan]
I'll focus on the highest priority task unless you direct otherwise.
```

**Terminal 2 - Backend Session:**
```
Use enhanced-multi-session-coordination, enhanced-masterplan-session-rules, and backend-session-rules from my Warp Drive.

I'm working on the backend API for our web app. Let me get the project context and see what backend tasks need attention.
```

**Terminal 3 - General Coordination:**
```
Use enhanced-multi-session-coordination and enhanced-masterplan-session-rules from my Warp Drive.

I'm helping coordinate the overall project. Let me check the current status and see what needs oversight.
```

#### 3. Watch the Coordination in Action

The AI agents will:
- ✅ Check for conflicts before editing files
- ✅ Reference previous session decisions
- ✅ Work within their specialized boundaries
- ✅ Update the masterplan with progress
- ✅ Coordinate with each other

#### 4. Monitor with Dashboard (Optional)

```bash
# Start dashboard
node ~/warp-multithreaded/scripts/coordinator.js dashboard

# Open in browser
# http://localhost:3000/warp-dashboard
```

## 📋 Common Use Cases

### Use Case 1: Existing Project Integration

```bash
# Navigate to existing project
cd /path/to/existing-project

# Non-invasive initialization
node ~/warp-multithreaded/scripts/coordinator.js init

# Your existing files remain untouched
# Framework adds coordination files only
```

### Use Case 2: Large Refactoring Project

```bash
# Create specialized sessions
node ~/warp-multithreaded/scripts/coordinator.js session create \
  --name=refactor-components --focus=components,refactoring

node ~/warp-multithreaded/scripts/coordinator.js session create \
  --name=update-tests --focus=testing,validation

node ~/warp-multithreaded/scripts/coordinator.js session create \
  --name=update-docs --focus=documentation,examples
```

Use different Warp Rules in each terminal:
- **Refactoring Terminal**: Frontend + coordination rules
- **Testing Terminal**: General coordination rules
- **Documentation Terminal**: General coordination rules

### Use Case 3: Team Collaboration

Each team member uses framework with different sessions:
- **Developer A**: Frontend session
- **Developer B**: Backend session  
- **Developer C**: Testing session
- **AI Agents**: Coordinated assistance in each session

### Use Case 4: Learning New Technology

```bash
# Initialize learning project
node ~/warp-multithreaded/scripts/coordinator.js masterplan init \
  --name="Learning React" \
  --goals="Build components,State management,API integration" \
  --phase=learning

# Create learning-focused sessions
node ~/warp-multithreaded/scripts/coordinator.js session create \
  --name=practice --focus=learning,examples

node ~/warp-multithreaded/scripts/coordinator.js session create \
  --name=theory --focus=documentation,concepts
```

## 🐛 Troubleshooting

### Quick Diagnosis

```bash
# Run health check first
npm run health-check

# If that fails, check installation
npm run validate

# Check CLI is working
node scripts/coordinator.js --help
```

### Common Issues

#### Issue: "Command not found"
```bash
# Solution 1: Use full path
node "/full/path/to/warp-multithreaded/scripts/coordinator.js" --help

# Solution 2: Add to PATH (see INSTALLATION.md)

# Solution 3: Use npm script
npm run status
```

#### Issue: "Module not found"
```bash
# Solution: Install dependencies
cd /path/to/warp-multithreaded
npm install
```

#### Issue: "Permission denied" (Unix/Linux)
```bash
# Solution: Fix permissions
chmod +x /path/to/warp-multithreaded/scripts/*.js
```

#### Issue: "Validation failed"
```bash
# Solution: Debug specific components
node scripts/coordinator.js debug files
node scripts/coordinator.js debug sessions
node scripts/coordinator.js debug masterplan
```

#### Issue: Warp Rules not working
```bash
# Check rule files exist
ls warp-rules/enhanced-*.md

# Verify rule content
cat warp-rules/enhanced-multi-session-coordination.md

# Test with simple rule first
"Use multi-session-coordination from my Warp Drive."
```

### Getting Help

1. **Check documentation**: INSTALLATION.md, SECURITY_IMPROVEMENTS.md
2. **Run diagnostics**: `npm run health-check`
3. **Check examples**: Look at warp-rules/ directory
4. **Create an issue**: Include health check output

## 🎉 Success Indicators

You know the framework is working when:

✅ **Health check passes**: `npm run health-check` shows no errors  
✅ **CLI responds**: `coordinator.js --help` shows usage information  
✅ **Sessions coordinate**: AI agents check for conflicts and reference context  
✅ **Masterplan updates**: Progress is tracked across sessions  
✅ **Dashboard works**: Real-time session monitoring available  

## 🚀 Next Steps

Once you have the framework running:

1. **Read the enhanced Warp Rules**: Understand how AI behavior changes
2. **Try the dashboard**: Visual monitoring at http://localhost:3000
3. **Experiment with sessions**: Create specialized sessions for different work
4. **Build project memory**: Use masterplan for persistent context
5. **Scale your workflow**: Add more parallel sessions as needed

## 🎯 Advanced Usage

### Custom Project Types
```bash
# Create custom project configuration
node scripts/coordinator.js init --project-type=custom
# Edit .warp-config.json to match your project structure
```

### Task Automation
```bash
# Generate AI tasks based on project analysis
node scripts/coordinator.js masterplan generate-tasks --phase=development

# Add custom tasks
node scripts/coordinator.js masterplan add-task \
  --title="Implement user authentication" \
  --priority=high \
  --description="JWT-based auth system"
```

### Session Specialization
```bash
# Create highly specialized sessions
node scripts/coordinator.js session create \
  --name=mobile-responsive \
  --focus=mobile,responsive,css \
  --directories=src/styles \
  --patterns="*.css,*.scss"
```

---

**Congratulations! You're now ready to revolutionize your development workflow with coordinated AI agents!** 🎉

**Remember**: The key to success is using the correct Warp Rules to activate the framework. Without them, it's just a standard AI - with them, it becomes a coordinated team member! 🤖✨
