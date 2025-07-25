# Warp AI Agent Coordination Rules

This directory contains the coordination rules for Warp AI agents working in multi-session environments.

## 📋 Rule Files Overview

### 🤖 Primary Coordination Rules (Use These)

#### `enhanced-auto-session-coordination.md` 
**🎯 RECOMMENDED FOR MOST USERS**
- **Fully automated session management** - no manual session creation needed
- **Intelligent work detection** - automatically creates appropriate sessions
- **Zero-friction workflow** - just describe what you want, system handles the rest
- **Built-in conflict prevention** - automatically avoids file conflicts
- **Version checking integration** - ensures framework is up-to-date

#### `enhanced-multi-session-coordination.md`
**⚙️ FOR ADVANCED USERS WHO PREFER MANUAL CONTROL**
- **Manual session management** with detailed protocols
- **Structured coordination commands** and procedures
- **Advanced conflict detection** and resolution strategies
- **Step-by-step coordination workflows**
- **Version checking integration**

### 📑 Session-Specific Rules

#### `backend-session-rules.md`
- Rules specific to backend development sessions
- API, database, and server logic guidelines

#### `frontend-session-rules.md` 
- Rules specific to frontend development sessions
- UI, components, and styling guidelines

#### `masterplan-session-rules.md`
- Rules for using the persistent masterplan system
- Project memory and decision tracking

#### `enhanced-masterplan-session-rules.md`
- Enhanced version with more detailed masterplan protocols

## 🚀 Quick Start Guide

### For New Users (Recommended)
1. Use **`enhanced-auto-session-coordination.md`**
2. Just describe your development needs naturally
3. Let the system auto-create and manage sessions
4. Focus on building, not session management

### For Advanced Users
1. Use **`enhanced-multi-session-coordination.md`**
2. Manually create and manage sessions
3. Use detailed coordination commands
4. Full control over session boundaries

### For Specific Workflows
- **Backend focus**: Also reference `backend-session-rules.md`
- **Frontend focus**: Also reference `frontend-session-rules.md`
- **Project planning**: Use `enhanced-masterplan-session-rules.md`

## 🔧 Integration with Warp AI

### Adding Rules to Warp Terminal
1. Copy the appropriate rule file content
2. Add to Warp AI agent configuration
3. Restart Warp AI for rules to take effect

### Framework Commands
```bash
# Check framework version (always run first)
node scripts/version-detector.js

# Check coordination status
node scripts/coordinator.js status

# Detect conflicts
node scripts/coordinator.js conflicts
```

## 🆕 Version Updates

These rules include **mandatory version checking** to ensure you're always working with the latest framework features. Always run the version detector before starting any development work.

---

**Choose the coordination style that best fits your workflow!** 🎯
