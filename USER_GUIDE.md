# Warp-Multithreaded User Guide
## Complete Session Continuity & AI Development Framework

---

## 🎯 Why Session Continuity Matters

**The Problem:**
- ❌ AI assistants forget context between sessions
- ❌ Technical decisions and rationale are lost
- ❌ Project goals drift over time
- ❌ Difficult to resume work after breaks
- ❌ No coordination between multiple AI sessions

**The Solution:**
- ✅ **Complete context preservation** across all sessions
- ✅ **AI assistants remember** project history and decisions
- ✅ **Project vision maintained** through Masterplan system
- ✅ **Seamless resume** after any break (5 minutes or 5 days)
- ✅ **Coordinated multi-session** development

---

## 🚀 Fresh Installation Guide

### Prerequisites
- **Node.js 14+** - [Download here](https://nodejs.org/)
- **Warp Terminal** - [Download here](https://www.warp.dev/)
- **Git** - For version control

### Step-by-Step Installation

1. **Clone and Setup:**
```bash
git clone https://github.com/yourusername/warp-multithreaded.git
cd warp-multithreaded
npm install
```

2. **Initialize Your Project:**
```bash
# Navigate to your project directory
cd /path/to/your-project

# Initialize framework
node /path/to/warp-multithreaded/scripts/coordinator.js init --project-type=web-app
```

3. **Setup Warp Rules (CRITICAL):**
```bash
node /path/to/warp-multithreaded/scripts/coordinator.js rules setup
```
> ⚠️ **CRITICAL**: Follow the generated instructions to add Warp Rules to your terminal. The framework won't work without this step.

4. **Initialize Masterplan:**
```bash
node /path/to/warp-multithreaded/scripts/coordinator.js masterplan init \
  --name="Your Project Name" \
  --description="Project description" \
  --goals="goal1,goal2,goal3" \
  --technologies="tech1,tech2,tech3"
```

5. **Verify Installation:**
```bash
node /path/to/warp-multithreaded/scripts/coordinator.js status
```

---

## 📱 The Three Essential Commands

### 🔄 Command 1: `update-state` - Save Progress During Development

**Use throughout your development session** to create checkpoints:

```bash
# Quick auto-save (use every 30-60 minutes)
node /path/to/warp-multithreaded/scripts/coordinator.js update-state --auto

# Detailed milestone checkpoint
node /path/to/warp-multithreaded/scripts/coordinator.js update-state \
  --summary="Completed user authentication system" \
  --outcomes="login working,JWT tokens,password hashing,validation" \
  --decisions="chose bcrypt over plain hashing,JWT over sessions" \
  --next-goals="implement user profiles,add email verification" \
  --checkpoint="auth-milestone"

# Silent save without prompts
node /path/to/warp-multithreaded/scripts/coordinator.js update-state \
  --summary="Fixed responsive navbar issues" \
  --checkpoint="navbar-fix" \
  --interactive=false
```

**When to use `update-state`:**
- ✅ After completing a feature
- ✅ Before taking breaks (even short ones)
- ✅ At major milestones
- ✅ When switching focus areas
- ✅ Before potentially risky changes

### 🛑 Command 2: `shutdown` - End Development Session

**Use when ending your work day** or shutting down your computer:

```bash
# Interactive shutdown (recommended for end of day)
node /path/to/warp-multithreaded/scripts/coordinator.js shutdown

# Quick shutdown with summary
node /path/to/warp-multithreaded/scripts/coordinator.js shutdown \
  --summary="Completed user dashboard with real-time updates" \
  --outcomes="dashboard working,websocket integration,responsive design" \
  --decisions="chose Socket.io over plain websockets" \
  --next-goals="add notifications,user settings,performance optimization"

# Silent shutdown
node /path/to/warp-multithreaded/scripts/coordinator.js shutdown \
  --summary="End of development session" \
  --interactive=false \
  --close-sessions=true
```

### 🎬 Command 3: `startup` - Resume Development

**Use when starting your development session:**

```bash
# Basic startup (shows project status and recent activity)
node /path/to/warp-multithreaded/scripts/coordinator.js startup

# Startup with AI context generation
node /path/to/warp-multithreaded/scripts/coordinator.js startup \
  --session=frontend \
  --save-context=today-context.md

# Full startup with session restoration
node /path/to/warp-multithreaded/scripts/coordinator.js startup \
  --show-context=true \
  --restore-sessions=true \
  --save-context=session-brief.md
```

---

## 📅 Daily Workflow Guide

### 🌅 Starting Your Development Day

1. **Resume development session:**
```bash
node /path/to/warp-multithreaded/scripts/coordinator.js startup --save-context=today.md
```

2. **Review your work plan:**
```bash
# Check current tasks
node /path/to/warp-multithreaded/scripts/coordinator.js masterplan tasks

# View project status
node /path/to/warp-multithreaded/scripts/coordinator.js status
```

3. **Create working session:**
```bash
node /path/to/warp-multithreaded/scripts/coordinator.js session create \
  --name=todays-work \
  --focus=authentication,validation
```

4. **Share context with your AI assistant:**
```
"Here's my project context from today.md - let's continue development where we left off"
```

### 🔄 During Development

**Save progress frequently:**
```bash
# Quick saves every 30-60 minutes
node /path/to/warp-multithreaded/scripts/coordinator.js update-state --auto

# Milestone saves at feature completion
node /path/to/warp-multithreaded/scripts/coordinator.js update-state \
  --summary="Implemented login validation with proper error handling" \
  --checkpoint="login-validation-complete"
```

**Check for conflicts before major changes:**
```bash
node /path/to/warp-multithreaded/scripts/coordinator.js conflicts
```

### 🌆 Ending Your Development Day

1. **Save final progress:**
```bash
node /path/to/warp-multithreaded/scripts/coordinator.js update-state \
  --summary="Today's development summary" \
  --outcomes="what was completed today" \
  --next-goals="tomorrow's top priorities"
```

2. **Shutdown with full context:**
```bash
node /path/to/warp-multithreaded/scripts/coordinator.js shutdown \
  --summary="Completed authentication module and started user profiles" \
  --outcomes="login/logout working,JWT implementation,password validation" \
  --next-goals="finish user profile form,add email verification,implement password reset"
```

---

## 🏆 Best Practices

### ✅ Essential Do's

- **Save state frequently** with `update-state --auto`
- **Use descriptive checkpoints** like "auth-complete", "dashboard-mvp"
- **Include clear outcomes** in your summaries
- **Set specific next-goals** for easy restart
- **Check conflicts** before editing shared files
- **Use meaningful session names** that reflect your current focus

### ❌ Critical Don'ts

- Don't skip saving state before breaks (even 5-minute breaks)
- Don't use vague summaries like "worked on stuff"
- Don't ignore conflict warnings
- Don't forget to set next-goals for smooth continuation
- Don't work without a clear session focus

### 📝 Command Templates

**For update-state:**
```bash
node /path/to/warp-multithreaded/scripts/coordinator.js update-state \
  --summary="[What you accomplished]" \
  --outcomes="[Specific results achieved]" \
  --decisions="[Technical choices made]" \
  --next-goals="[Next 1-3 tasks]" \
  --checkpoint="[milestone-name]"
```

**For shutdown:**
```bash
node /path/to/warp-multithreaded/scripts/coordinator.js shutdown \
  --summary="[Session accomplishments]" \
  --outcomes="[Key deliverables]" \
  --next-goals="[Tomorrow's focus]"
```

---

## 🎨 Visual Dashboard

For a web-based interface, launch the dashboard:

```bash
node /path/to/warp-multithreaded/scripts/coordinator.js dashboard
```

Access at `http://localhost:3000` to:
- 📊 View all active sessions
- 📋 Manage masterplan tasks  
- ⚠️ Monitor file conflicts
- 📈 Track project progress
- 🎯 Edit project goals
- 📝 View discussion history
- 📚 Access development logs

---

## 🐛 Troubleshooting Guide

### Framework Not Responding

```bash
# Verify Warp Rules setup
node /path/to/warp-multithreaded/scripts/coordinator.js rules verify

# Run system validation
node /path/to/warp-multithreaded/scripts/coordinator.js validate
```

### Lost Session Data

Check these backup files:
- `.warp-session-snapshot.json` - Latest state
- `.warp-state-history.json` - Recent 20 checkpoints
- `.warp-state-*.json` - Timestamped backups

### Session Conflicts

```bash
# Check conflicts
node /path/to/warp-multithreaded/scripts/coordinator.js conflicts

# Get task suggestions
node /path/to/warp-multithreaded/scripts/coordinator.js suggest --tasks="your,tasks,here"
```

### Need to Reset

```bash
# Reset setup status
node /path/to/warp-multithreaded/scripts/coordinator.js setup-reset

# Reinitialize
node /path/to/warp-multithreaded/scripts/coordinator.js init
```

### Getting Help

```bash
# View all commands
node /path/to/warp-multithreaded/scripts/coordinator.js help

# Debug system state
node /path/to/warp-multithreaded/scripts/coordinator.js debug files
node /path/to/warp-multithreaded/scripts/coordinator.js debug sessions
node /path/to/warp-multithreaded/scripts/coordinator.js debug masterplan
```

---

## 🚨 Critical Success Factors

1. **Warp Rules Setup** - Framework won't work without proper Warp rules configuration
2. **Regular State Saving** - Use `update-state --auto` every 30-60 minutes
3. **Meaningful Summaries** - Clear documentation enables better AI assistance
4. **Checkpoint System** - Named milestones help track progress over time
5. **Next Goals** - Always set clear next steps for smooth continuation

---

## 🎯 Real-World Example Session

```bash
# Morning startup
node coordinator.js startup --save-context=monday.md

# Share with AI: "Here's my project context from monday.md"

# Work for 1 hour on authentication
node coordinator.js update-state --auto

# Complete login feature
node coordinator.js update-state \
  --summary="Completed login form with validation" \
  --outcomes="login working,form validation,error handling" \
  --checkpoint="login-complete"

# Lunch break
node coordinator.js update-state \
  --summary="Taking lunch break - login form complete" \
  --next-goals="implement logout,add password reset"

# Resume after lunch with fresh AI session
node coordinator.js startup --save-context=afternoon.md

# End of day
node coordinator.js shutdown \
  --summary="Completed authentication module" \
  --outcomes="login/logout working,password reset,JWT tokens" \
  --next-goals="implement user profiles,add email verification"
```

---

## 🎉 Success Indicators

You know the framework is working when:

✅ **Health check passes** - No errors in validation  
✅ **AI remembers context** - AI references previous decisions  
✅ **Seamless resume** - Can pick up work immediately after breaks  
✅ **Progress tracking** - Can see clear development history  
✅ **Conflict prevention** - Multiple sessions coordinate effectively  

---

## 🚀 Ready to Transform Your Development?

**Start with these three commands:**

1. `startup` - Begin your development session
2. `update-state --auto` - Save progress regularly  
3. `shutdown` - End with complete context preservation

**Your AI assistants will thank you for the context, and you'll never lose track of your work again!** 🎯

---

*For more advanced features, see [GETTING_STARTED.md](GETTING_STARTED.md) and [SESSION_CONTINUITY_GUIDE.md](SESSION_CONTINUITY_GUIDE.md)*
