# Enhanced Warp AI Agent Multi-Session Coordination Rules

## 🚨 CRITICAL: You Are in a Parallel Development Environment

You are working in a **multi-session development environment** where **multiple AI Agent sessions are working simultaneously** on the same project. **Other AI agents may be actively editing files at the same time as you.**

## 🔄 MANDATORY Session Startup Protocol

### STEP 0: Framework Version Check (CRITICAL - ALWAYS FIRST)
```bash
# MANDATORY: Check framework version BEFORE any work
node scripts/version-detector.js
```

**🚨 IF VERSION CHECK FAILS:**
- ❌ **STOP IMMEDIATELY** - Do not proceed with any tasks
- 📥 **UPDATE REQUIRED** - Framework is outdated or incomplete
- 🔄 **FOLLOW UPDATE INSTRUCTIONS** - Update before continuing
- ✅ **VERIFY UPDATE** - Re-run version check until it passes

**ONLY proceed to Step 1 if version check shows "UP_TO_DATE"**

### STEP 1: Session Identity Check (REQUIRED)
```bash
# ALWAYS run this first to understand your role
node scripts/coordinator.js status
```

**What this tells you:**
- Your session name and specialization
- Other active sessions and their focus areas
- Current file conflicts that MUST be avoided
- Project coordination status

### STEP 2: Live Conflict Detection (REQUIRED)
```bash
# Check for active conflicts before ANY file edits
node scripts/coordinator.js conflicts
```

**If conflicts exist:**
- 🛑 **STOP** - Do not edit conflicting files
- 🤝 **COORDINATE** - Alert user about conflicts
- 🔄 **PIVOT** - Work on non-conflicting tasks instead

### STEP 3: Session File Analysis (REQUIRED)
Check your session configuration file:
- **Frontend session**: Read `.warp-sessions/frontend.json`
- **Backend session**: Read `.warp-sessions/backend.json`
- **General session**: Check available session files

**Extract from your session file:**
- `focus`: Your areas of expertise
- `directories`: Your primary working directories
- `file_patterns`: File types you should prioritize
- `active_files`: Files currently locked by your session

## 🎯 Parallel Development Awareness

### Understanding the Multi-Session Environment

**RIGHT NOW, other AI agents might be:**
- ✏️ Editing backend API files (if you're frontend)
- 🎨 Working on UI components (if you're backend)
- 🧪 Writing tests for features you're building
- 🚀 Setting up deployment for your work

### Session Coordination Matrix

| Your Session | Other Sessions Active | Coordination Strategy |
|--------------|----------------------|----------------------|
| **Frontend** | Backend, Testing | Focus on UI/components, avoid API/server files |
| **Backend** | Frontend, Testing | Focus on APIs/database, avoid UI/component files |
| **Testing** | Frontend, Backend | Test their completed work, avoid core implementation |
| **DevOps** | All sessions | Handle deployment/infrastructure, avoid feature code |

### Real-Time Coordination Protocol

**When Starting Any Task:**
1. 📢 **Announce**: "Working on [specific task] in [session-name] session"
2. 🔍 **Check**: Run conflict detection if touching shared files
3. 🎯 **Focus**: Stay within your session's expertise boundaries
4. ⏱️ **Time-bound**: Complete tasks in 5-10 minute focused chunks

**During Development:**
- 🚨 **Before editing ANY file**: Check if other sessions have it locked
- 🤝 **If unsure**: Ask user "Should I coordinate with [other-session] before editing [filename]?"
- 📝 **Communicate changes**: Mention when you modify shared configuration files

## 🚫 Conflict Avoidance - Session Boundaries

### Frontend Session - Stay in Your Lane
**✅ YOU SHOULD HANDLE:**
- `src/components/**/*` - React/Vue components
- `src/pages/**/*` - Page-level components
- `src/styles/**/*` - CSS, SCSS, styling
- `public/**/*` - Static assets
- UI interactions, responsive design, accessibility

**🚫 AVOID - Let Backend Handle:**
- `src/api/**/*` - API routes and endpoints
- `src/models/**/*` - Database models
- `server.js`, `app.js` - Server configuration
- Database queries, authentication logic

**⚠️ COORDINATE FIRST:**
- `package.json` - Dependencies (check with all sessions)
- `.env` files - Environment variables
- Config files - May affect multiple sessions

### Backend Session - Stay in Your Lane
**✅ YOU SHOULD HANDLE:**
- `src/api/**/*` - API endpoints and routes
- `src/models/**/*` - Database models
- `src/middleware/**/*` - Server middleware
- Database operations, authentication, server logic

**🚫 AVOID - Let Frontend Handle:**
- `src/components/**/*` - UI components
- `src/styles/**/*` - Styling and CSS
- UI interactions, responsive design

**⚠️ COORDINATE FIRST:**
- `package.json` - Dependencies
- `.env` files - Environment variables
- Shared configuration files

## 🚨 Emergency Conflict Resolution

### If You Detect Active Conflicts

**IMMEDIATE ACTION:**
```
🚨 CONFLICT ALERT: I detect that [filename] is being modified by [other-session-name].
I should NOT edit this file right now to avoid conflicts.

OPTIONS:
1. Wait for other session to complete their work
2. Work on an alternative task in my specialization area
3. Coordinate with user to resolve the conflict

What would you prefer?
```

### Warning Signs to Watch For
- Multiple sessions editing the same file
- Git merge conflicts in recent commits
- Configuration files with recent changes
- Shared dependencies being modified

### Conflict Prevention Strategies
1. **File Ownership**: Respect session-specific file boundaries
2. **Time Boxing**: Complete tasks quickly to release file locks
3. **Communication**: Always announce major changes
4. **Alternatives**: Have backup tasks ready when conflicts arise

## 📋 Coordination Commands - Use These Actively

### Essential Commands (Use Frequently)
```bash
# Check overall status - run every 10-15 minutes
node scripts/coordinator.js status

# Detect conflicts before editing files
node scripts/coordinator.js conflicts

# See all active sessions and their focus
node scripts/coordinator.js session list

# Get task suggestions specific to your session
node scripts/coordinator.js suggest --tasks="your-task-list"
```

### Session Management
```bash
# Create a new session (if needed)
node scripts/coordinator.js session create --name=your-session --focus=your-area

# Close your session when done
node scripts/coordinator.js session close --name=your-session

# Get detailed info about your session
node scripts/coordinator.js session info --name=your-session
```

## 🎯 Communication Protocols

### Starting a Session
```
"I'm starting work in a [session-type] session. I can see [X] other active sessions working on [their-areas]. 
I'll focus on [your-specific-task] while avoiding [potential-conflict-areas] that other sessions are handling."
```

### During Work
```
"Working on [specific-task] in [session-name] session. This stays within my [session-type] boundaries and avoids files that [other-sessions] are using."
```

### If Asked to Work Outside Your Session
```
"This task involves [other-area] work which should be handled by the [appropriate-session] session. 
I can focus on the [your-area] aspects of this feature instead. Should I coordinate with the [other-session] or work on my part?"
```

### Before Ending
```
"Completed [task] in [session-name] session. I've stayed within my session boundaries and haven't conflicted with other active sessions working on [their-areas]."
```

## 💡 Best Practices for Parallel Development

### Session Discipline
1. **Know Your Role**: Always work within your session's expertise
2. **Respect Boundaries**: Don't cross into other sessions' territories
3. **Communicate Early**: Mention potential conflicts before they happen
4. **Stay Focused**: Complete one task fully before starting another

### Conflict Prevention
1. **Check First**: Always run conflict detection before major file edits
2. **Work Fast**: Complete tasks in small, quick iterations
3. **Release Locks**: Don't hold onto files longer than necessary
4. **Coordinate**: When in doubt, ask for coordination

### Quality Assurance
1. **Test Your Changes**: Ensure you don't break other sessions' work
2. **Clean Commits**: Make focused commits with clear messages
3. **Document Changes**: Note what you changed and why
4. **Update Status**: Keep coordination files current

---

## 🎯 Remember: You Are Part of a Coordinated Team

**This is NOT single-session development!** Other AI agents are working RIGHT NOW on:
- Different parts of the same project
- Complementary features to what you're building
- Testing and deployment of your work

**Your success depends on:**
- 🤝 **Coordination** with other sessions
- 🎯 **Focus** on your specialized area
- 🚫 **Avoiding** conflicts and overlaps
- 💬 **Communication** about your work

**The goal is 3-4x faster development through parallel AI work, not conflicts and confusion!** 🚀
