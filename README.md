# Warp Multithreaded

A comprehensive framework for **high-performance, spec-driven AI development** with coordinated parallel sessions, dynamic goal management, and automated project setup.

## 🚀 Core Features

### 🤖 **Fully Automated Session Management**
- **Auto-Session Creation**: System automatically detects work type and creates appropriate sessions
- **Intelligent Coordination**: Prevent conflicts when multiple AI agents work simultaneously  
- **Real-Time Session Awareness**: Each agent knows what others are working on
- **Performance Optimization**: 3-4x faster development through parallel AI work

### 🎯 **Dynamic Goal Management** (NEW)
- **Real-Time Goal Updates**: Edit project goals via dashboard or CLI with instant rule synchronization
- **Comprehensive History Tracking**: Complete audit trail with similarity analysis and change impact
- **Automatic Rule Regeneration**: Unified rules update automatically when goals change
- **Quality Validation**: Built-in goal validation with length, format, and content checks

### 🌐 **Dashboard CLI Integration** (NEW)
- **Pure Magic Setup**: Dashboard can install CLI tools and run commands automatically
- **Real-Time Terminal Streaming**: Live command output in web interface
- **One-Click Project Setup**: Complete project initialization from web dashboard
- **Tool Management**: Automatic detection and installation of development tools

### 📋 **Masterplan-Driven Development**
- **Spec-Driven Architecture**: AI agents work from comprehensive project specifications
- **Auto-Rule Generation**: Single unified rule file instead of multiple separate rules
- **Context Persistence**: Complete project memory across all AI sessions

## 🎯 Use Cases

- **Web Development**: Separate sessions for frontend, backend, testing, and styling
- **Large Projects**: Multiple developers using AI agents simultaneously
- **Feature Development**: Parallel work on independent functions/components
- **Code Review**: One session for fixes while another handles new features

## 📁 Project Structure

```
warp-multithreaded/
├── core/
│   ├── session-manager.js          # Core session coordination  
│   └── masterplan-manager.js       # Persistent project memory
├── warp-rules/                      # AI Agent behavior rules
│   ├── enhanced-multi-session-coordination.md    # Parallel development
│   ├── enhanced-masterplan-session-rules.md      # Context awareness
│   ├── frontend-session-rules.md   # Frontend specialization
│   └── backend-session-rules.md    # Backend specialization
├── scripts/
│   ├── coordinator.js              # CLI coordination tool
│   └── validate-system.js          # System validation
├── dashboard/                       # Web dashboard
│   ├── server.js                   # Dashboard backend
│   └── public/                     # Dashboard frontend
└── .warp-masterplan/               # Generated project memory
    ├── masterplan.md               # Project overview
    ├── tasks.json                  # Task management
    └── session-log.md              # Session history
```

## 🗝️ The KEY: Warp Rules

**Warp Rules are the activation key** that transforms standard AI into coordinated multithreaded development:

### Enhanced Rules Available:
- **`enhanced-multi-session-coordination.md`** - Crystal clear parallel development protocols  
- **`enhanced-masterplan-session-rules.md`** - Explicit project memory integration
- **Session-specific rules** - Frontend/backend specialization

### How to Activate:
```
Human: Use enhanced-multi-session-coordination and enhanced-masterplan-session-rules from my Warp Drive.
I need to work on user authentication for my web app.
```

## 🚀 Quick Start

### 1. Install the Framework
```bash
# Clone the repository
git clone https://github.com/Zhihong0321/warp-multithreaded.git
cd warp-multithreaded

# Install dependencies
npm install

# Verify installation
npm run health-check

# The 'wm' command will be available for short CLI usage
```

### 2. Create Your Masterplan (NEW)
```bash
# Option A: Use the dashboard (recommended)
npm run cli-service
# Then open http://localhost:3001 in your browser

# Option B: Use CLI to generate unified rules
npm run masterplan

# Option C: Manage goals directly
npm run goal get
npm run goal set "Build an amazing AI-powered application"
```

### 3. Start Development with Auto-Sessions
```bash
# The system automatically creates sessions based on your work:
# Just describe what you want to build - no manual session creation needed!

# Example: Frontend work triggers auto-frontend session
# "Create a login component with validation"

# Example: Backend work triggers auto-backend session  
# "Build authentication API endpoints"

# Example: Full-stack work automatically switches between sessions
# "Add user profile functionality with frontend and backend"
```

### 4. Advanced Features
```bash
# Goal Management
npm run goal history          # View goal change history
npm run goal stats           # Goal statistics and analytics
npm run goal validate "text" # Validate goal content

# CLI Service (Magic Dashboard)
npm run cli-service          # Start dashboard with CLI integration

# System Management
npm run status               # Check coordination status
npm run validate             # Validate system health
```

## 🆕 Latest Features

### ⚡ **Short CLI Commands** (NEW)
Use the `wm` command for faster workflow:

```bash
# State management
wm load-state                  # Load previous development state
wm save-state --summary="..."  # Save current state
wm update-state               # Update project documentation

# Session management  
wm startup                    # Resume development with context
wm shutdown --summary="..."   # End session with summary
wm status                     # Show framework status
wm sessions                   # List active sessions

# Tasks and planning
wm tasks                      # List all project tasks
wm add-task --title="..."     # Add new task
wm complete-task --id=...     # Mark task completed

# Context and analysis
wm context --save=context.md  # Generate AI context
wm conflicts                  # Check file conflicts
```

### 🔄 **Session Continuity** (NEW)
Never lose development context again:

```bash
# Save your work during development
wm save-state --summary="Implemented user authentication" --auto

# End your development session
wm shutdown --summary="What was accomplished" --next-goals="What to do next"

# Resume where you left off
wm load-state                 # Quick context check
wm startup                    # Full resume with context
```

### 🚀 **Improved Setup Process** (NEW)
Streamlined initialization with better error handling:

```bash
# Initialize with automatic Warp Rules setup
node scripts/coordinator.js init --project-type=web-app

# System validates and guides you through setup
node scripts/coordinator.js rules setup

# Verify everything is working
node scripts/coordinator.js rules verify
```

## 🏗️ Architecture

### Session Manager
- Tracks active sessions and their assigned tasks
- Prevents file conflicts through smart locking
- Provides real-time coordination between sessions

### Task Distribution
- **Function-based**: Tasks organized by features/functions
- **Priority-based**: Critical tasks get precedence
- **Dependency-aware**: Handles task dependencies automatically

### File Management
- **Soft locks**: Prevent simultaneous edits without blocking
- **Change tracking**: Monitor file modifications across sessions
- **Merge assistance**: Help resolve conflicts when they occur

## 📋 Configuration

Create a `.warp-config.json` in your project root:

```json
{
  "project_type": "web-app",
  "sessions": {
    "frontend": {
      "focus": ["ui", "components", "styling"],
      "directories": ["src/components", "src/styles"],
      "file_patterns": ["*.tsx", "*.jsx", "*.css", "*.scss"]
    },
    "backend": {
      "focus": ["api", "database", "auth"],
      "directories": ["src/api", "src/models", "src/middleware"],
      "file_patterns": ["*.js", "*.ts", "*.sql"]
    },
    "testing": {
      "focus": ["tests", "quality"],
      "directories": ["tests", "cypress"],
      "file_patterns": ["*.test.js", "*.spec.js", "*.cy.js"]
    }
  }
}
```

## 🛠️ Available Commands

### Quick Commands (using `wm`)
```bash
# State management
wm load-state                     # Load previous development state
wm save-state                     # Save current state with prompts
wm update-state                   # Update project documentation
wm startup                        # Resume development session
wm shutdown                       # End development session

# Project management
wm status                         # Show framework status
wm tasks                          # List all project tasks
wm sessions                       # List active sessions
wm context                        # Generate AI context
wm conflicts                      # Check for file conflicts

# Task management
wm add-task --title="Task name"   # Add new task
wm complete-task --id=task-123    # Mark task completed
```

### Full Commands (using full coordinator)
```bash
# State management
node scripts/coordinator.js load-state
node scripts/coordinator.js update-state --summary="..." --auto
node scripts/coordinator.js shutdown --summary="..." --next-goals="..."
node scripts/coordinator.js startup --show-context=true

# Session management
node scripts/coordinator.js session create --name=<session-name>
node scripts/coordinator.js session list
node scripts/coordinator.js status
node scripts/coordinator.js conflicts

# Masterplan management
node scripts/coordinator.js masterplan tasks
node scripts/coordinator.js masterplan add-task --title="..."
node scripts/coordinator.js masterplan complete-task --id=...
node scripts/coordinator.js context --save=context.md

# Setup and validation
node scripts/coordinator.js init --project-type=web-app
node scripts/coordinator.js rules setup
node scripts/coordinator.js validate
```

### NPM Scripts
```bash
# State management
npm run load-state               # Load previous state
npm run save-state               # Save current state
npm run startup                   # Resume development
npm run shutdown                  # End session

# Project management
npm run status                    # Show status
npm run tasks                     # List tasks
npm run context                   # Generate context
```

## 📊 Dashboard

The framework includes a web dashboard for visual coordination:

- **Session Overview**: See all active sessions and their current tasks
- **File Status**: Real-time view of locked/modified files
- **Task Queue**: Visual task management and assignment
- **Conflict Resolution**: GUI for resolving merge conflicts

Access at: `http://localhost:3000/warp-dashboard`

## 📚 Documentation

- **[QUICK_COMMANDS.md](QUICK_COMMANDS.md)** - Complete guide to short CLI commands and workflow
- **[USER_GUIDE.md](USER_GUIDE.md)** - Comprehensive user guide with daily workflow examples
- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Detailed setup and first-time usage guide
- **[SESSION_CONTINUITY_GUIDE.md](SESSION_CONTINUITY_GUIDE.md)** - Advanced session continuity features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the Warp terminal and AI Agent community
- Inspired by the need for efficient parallel AI-assisted development
- Thanks to all contributors and early adopters

---

**Made with ❤️ for the Warp AI Agent community**
