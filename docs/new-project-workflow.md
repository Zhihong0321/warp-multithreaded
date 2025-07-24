# New Project Workflow - Warp AI Agent Framework

This guide shows you exactly how to set up and use the Warp AI Agent Framework on a new project.

## 🚀 Quick Start Workflow

### **Step 1: Setup Framework (One-time)**

First, set up the framework on your system:

```bash
# Clone the framework
git clone https://github.com/yourusername/warp-agent-framework.git
cd warp-agent-framework

# Run setup (Windows)
.\scripts\setup.ps1

# Or manual setup
# 1. Ensure Node.js is installed
# 2. Copy warp-rules to your Warp Drive (optional but recommended)
```

### **Step 2: Initialize Your Project**

Navigate to your project directory and initialize:

```bash
# Go to your project
cd C:\path\to\your-project

# Initialize framework for web app
node C:\path\to\framework\scripts\coordinator.js init --project-type=web-app

# Or for API project
node C:\path\to\framework\scripts\coordinator.js init --project-type=api-project
```

**This creates:**
- `.warp-config.json` - Project configuration
- `.warp-coordination.md` - Coordination document  
- `.warp-sessions/` - Session data directory

### **Step 3: Create Sessions**

Create specialized sessions for different work areas:

```bash
# Frontend session
node C:\path\to\framework\scripts\coordinator.js session create --name=frontend --focus=ui,components,styling

# Backend session
node C:\path\to\framework\scripts\coordinator.js session create --name=backend --focus=api,database,auth

# Testing session
node C:\path\to\framework\scripts\coordinator.js session create --name=testing --focus=tests,quality

# Check created sessions
node C:\path\to\framework\scripts\coordinator.js session list
```

### **Step 4: Add Warp Rules (Recommended)**

**Option A: If you added rules to Warp Drive:**
- Rules are automatically available in all sessions

**Option B: Project-local rules:**
```bash
# Copy rules to your project
mkdir .warp-rules
copy C:\path\to\framework\warp-rules\* .warp-rules\
```

### **Step 5: Start Multi-Session Development**

Open multiple Warp terminals and begin coordinated work:

**Terminal 1 - Frontend Session:**
```
Human: Use multi-session-coordination and frontend-session-rules from my Warp Drive. 
I'm working on the user dashboard UI. Add a responsive navigation bar with dropdown menus.
```

**Terminal 2 - Backend Session:**
```
Human: Use multi-session-coordination and backend-session-rules from my Warp Drive.
I'm working on user management APIs. Create authentication endpoints with JWT tokens.
```

**Terminal 3 - Testing Session:**
```
Human: Use multi-session-coordination rules from my Warp Drive.
I'm working on testing. Write unit tests for the authentication service.
```

### **Step 6: Monitor and Coordinate**

Periodically check coordination status:

```bash
# View session status
node C:\path\to\framework\scripts\coordinator.js status

# Check for conflicts
node C:\path\to\framework\scripts\coordinator.js conflicts

# Get task suggestions
node C:\path\to\framework\scripts\coordinator.js suggest --tasks="fix navbar,add auth,write tests"
```

---

## 📋 Detailed Project Setup Examples

### **Example 1: React Web App**

```bash
# Your existing React project
cd C:\projects\my-react-app

# Initialize framework
node C:\warp-framework\scripts\coordinator.js init --project-type=web-app

# Create sessions
node C:\warp-framework\scripts\coordinator.js session create --name=frontend
node C:\warp-framework\scripts\coordinator.js session create --name=backend
node C:\warp-framework\scripts\coordinator.js session create --name=testing

# Start development
# Terminal 1: Frontend work on components
# Terminal 2: Backend work on API
# Terminal 3: Testing work on tests
```

### **Example 2: Node.js API Project**

```bash
# Your existing API project
cd C:\projects\my-api

# Initialize framework
node C:\warp-framework\scripts\coordinator.js init --project-type=api-project

# Create specialized sessions
node C:\warp-framework\scripts\coordinator.js session create --name=endpoints --focus=routes,controllers
node C:\warp-framework\scripts\coordinator.js session create --name=database --focus=models,migrations
node C:\warp-framework\scripts\coordinator.js session create --name=middleware --focus=auth,validation

# Start development
# Terminal 1: Work on API endpoints
# Terminal 2: Work on database models
# Terminal 3: Work on middleware
```

### **Example 3: Full-Stack Project**

```bash
# Your full-stack project
cd C:\projects\my-fullstack-app

# Initialize framework
node C:\warp-framework\scripts\coordinator.js init --project-type=web-app

# Create comprehensive sessions
node C:\warp-framework\scripts\coordinator.js session create --name=frontend --focus=ui,components --directories=src/components,src/pages,src/styles
node C:\warp-framework\scripts\coordinator.js session create --name=backend --focus=api,database --directories=server,api,models
node C:\warp-framework\scripts\coordinator.js session create --name=testing --focus=tests,e2e --directories=tests,cypress
node C:\warp-framework\scripts\coordinator.js session create --name=devops --focus=deployment,config --directories=scripts,.github

# Start coordinated development across 4 sessions
```

---

## 🔄 Daily Development Workflow

### **Morning Startup:**
1. **Check project status:**
   ```bash
   node C:\warp-framework\scripts\coordinator.js status
   ```

2. **Review coordination file:**
   - Open `.warp-coordination.md` 
   - See what other sessions worked on yesterday
   - Plan your session's work

3. **Start your specialized session:**
   ```
   Human: Use [session-name]-session-rules and multi-session-coordination from my Warp Drive.
   Today I'm working on [specific feature/task].
   ```

### **During Development:**
- **Before major changes:** Check conflicts
- **When switching tasks:** Update your session's current_task
- **When touching shared files:** Coordinate with other sessions
- **Regular coordination:** Run status check every hour

### **End of Day:**
1. **Update coordination file** with progress
2. **Close your session:**
   ```bash
   node C:\warp-framework\scripts\coordinator.js session close --name=your-session
   ```
3. **Commit your changes** with clear session prefixes:
   ```bash
   git commit -m "FRONTEND: Added responsive navbar with dropdown menus"
   git commit -m "BACKEND: Implemented JWT authentication endpoints"
   ```

---

## 📁 Project Structure After Setup

```
your-project/
├── 📄 .warp-config.json          # Framework configuration
├── 📄 .warp-coordination.md      # Coordination document
├── 🗂️ .warp-sessions/           # Session data
│   ├── frontend.json
│   ├── backend.json
│   └── testing.json
├── 🗂️ .warp-rules/              # Project-local rules (optional)
│   ├── multi-session-coordination.md
│   ├── frontend-session-rules.md
│   └── backend-session-rules.md
└── [your existing project files]
```

---

## 🛠️ Configuration Customization

### **Customize Session Focus Areas**

Edit `.warp-config.json`:

```json
{
  "project_type": "web-app",
  "sessions": {
    "frontend": {
      "focus": ["ui", "components", "styling", "ux"],
      "directories": ["src/components", "src/pages", "src/styles"],
      "file_patterns": ["*.tsx", "*.jsx", "*.css", "*.scss"]
    },
    "backend": {
      "focus": ["api", "database", "auth", "server"],
      "directories": ["server", "api", "models", "middleware"],
      "file_patterns": ["*.js", "*.ts", "*.sql"]
    }
  }
}
```

### **Customize Coordination Document**

Edit `.warp-coordination.md` to add:
- Project-specific guidelines
- Current sprint/milestone info
- Team communication notes
- Custom session assignments

---

## 🚨 Troubleshooting Common Issues

### **"Session not found" error:**
```bash
# List all sessions
node C:\warp-framework\scripts\coordinator.js session list

# Recreate if needed
node C:\warp-framework\scripts\coordinator.js session create --name=frontend
```

### **AI Agent not following rules:**
- Ensure Warp Rules are properly added to Warp Drive
- Try project-local rules in `.warp-rules/`
- Explicitly reference rules: "Use frontend-session-rules from my Warp Drive"

### **File conflicts:**
```bash
# Check what's conflicted
node C:\warp-framework\scripts\coordinator.js conflicts

# Coordinate with other sessions
# Or work on different files temporarily
```

---

## 🎯 Success Metrics

**You'll know it's working when:**
- ✅ AI Agents stay within their session expertise
- ✅ Agents automatically check for conflicts
- ✅ Clear communication about session boundaries
- ✅ Faster parallel development with fewer conflicts
- ✅ Organized, focused work across multiple sessions

---

**This workflow enables you to develop 2-4x faster by running multiple specialized AI Agent sessions in parallel!** 🚀
