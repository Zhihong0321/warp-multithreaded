# Getting Started with Warp AI Agent Framework

This guide will help you set up and start using the Warp AI Agent Framework for coordinated multi-session development.

## Prerequisites

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **Warp Terminal** with AI Agent enabled
- A development project (web app, API, etc.)

## Installation

### 1. Clone the Framework
```bash
git clone https://github.com/yourusername/warp-agent-framework.git
cd warp-agent-framework
```

### 2. Run Setup
**Windows (PowerShell):**
```powershell
.\scripts\setup.ps1
```

**Unix/Mac:**
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 3. Test Installation
```bash
node scripts/coordinator.js help
```

## Quick Start

### Step 1: Initialize Your Project
Navigate to your project directory and initialize the framework:

```bash
# For web applications
node /path/to/framework/scripts/coordinator.js init --project-type=web-app

# For API projects  
node /path/to/framework/scripts/coordinator.js init --project-type=api-project
```

This creates:
- `.warp-config.json` - Configuration file
- `.warp-coordination.md` - Coordination document
- `.warp-sessions/` - Session data directory

### Step 2: Create Sessions
Create specialized sessions for different types of work:

```bash
# Frontend work
node scripts/coordinator.js session create --name=frontend --focus=ui,components

# Backend work  
node scripts/coordinator.js session create --name=backend --focus=api,database

# Testing work
node scripts/coordinator.js session create --name=testing --focus=tests,quality
```

### Step 3: Start Working
1. **Open multiple Warp terminals** - one for each session
2. **In each terminal**, tell your AI Agent:
   ```
   "I'm working in session 'frontend' on UI and component tasks"
   "I'm working in session 'backend' on API and database tasks"  
   "I'm working in session 'testing' on test and quality tasks"
   ```

### Step 4: Monitor and Coordinate
Check session status and conflicts:

```bash
# View all sessions
node scripts/coordinator.js session list

# Check overall status
node scripts/coordinator.js status

# Look for conflicts
node scripts/coordinator.js conflicts

# Get task suggestions
node scripts/coordinator.js suggest --tasks="fix navbar,add auth,write tests"
```

## Example Workflow

Here's a typical workflow for web app development:

### 1. Project Setup
```bash
cd my-web-app
node /path/to/framework/scripts/coordinator.js init --project-type=web-app
```

### 2. Create Sessions
```bash
# Create three specialized sessions
node scripts/coordinator.js session create --name=frontend
node scripts/coordinator.js session create --name=backend  
node scripts/coordinator.js session create --name=testing
```

### 3. Parallel Development
**Terminal 1 (Frontend Session):**
```
Human: I'm working in session 'frontend' on UI tasks. Add hover animations to the navigation bar.
```

**Terminal 2 (Backend Session):**
```  
Human: I'm working in session 'backend' on API tasks. Implement user authentication endpoints.
```

**Terminal 3 (Testing Session):**
```
Human: I'm working in session 'testing' on quality tasks. Write unit tests for the auth service.
```

### 4. Coordination Checks
Periodically check for conflicts:
```bash
node scripts/coordinator.js status
node scripts/coordinator.js conflicts
```

## Configuration

### Session Configuration
Edit `.warp-config.json` to customize sessions:

```json
{
  "project_type": "web-app",
  "sessions": {
    "frontend": {
      "focus": ["ui", "components", "styling"],
      "directories": ["src/components", "src/styles"],
      "file_patterns": ["*.tsx", "*.jsx", "*.css"]
    },
    "backend": {
      "focus": ["api", "database", "auth"],
      "directories": ["src/api", "src/models"],
      "file_patterns": ["*.js", "*.ts", "*.sql"]
    }
  }
}
```

### Coordination Document
Use `.warp-coordination.md` to:
- Track current work status
- Note task assignments
- Communicate between sessions
- Plan upcoming work

## Best Practices

### 1. **Function-Based Separation**
Organize work by features/functions rather than files:
- Session A: User authentication
- Session B: Data visualization  
- Session C: API integration

### 2. **Clear Communication**
- Update session status regularly
- Use descriptive task names
- Check conflicts before major changes

### 3. **Small, Independent Tasks**  
Break work into 2-5 minute chunks that can be done independently:
- "Add loading spinner to login button"
- "Fix responsive navbar on mobile"
- "Write test for user registration"

### 4. **Regular Coordination**
- Check `warp-agent status` every 10-15 minutes
- Run `warp-agent conflicts` before editing shared files
- Commit changes frequently with clear messages

## Troubleshooting

### Common Issues

**"Session not found" error:**
```bash
# List all sessions to see what exists
node scripts/coordinator.js session list
```

**File conflicts:**
```bash  
# Check what files are locked
node scripts/coordinator.js conflicts

# Release locks by closing sessions
node scripts/coordinator.js session close --name=session-name
```

**Node.js not found:**
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal after installation

### Getting Help

- Check the `README.md` for overview
- Run `node scripts/coordinator.js help` for command reference
- Look at `examples/demo.js` for usage examples

## Next Steps

Once you're comfortable with basic usage:

1. **Explore Advanced Features**: Task suggestions, automated conflict resolution
2. **Customize Templates**: Create your own project templates
3. **Integrate with Tools**: Git hooks, IDE extensions, CI/CD
4. **Share and Contribute**: Help improve the framework

---

Happy parallel development with Warp AI Agents! 🚀
