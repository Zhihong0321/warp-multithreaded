# 🚨 CRITICAL SETUP: Warp Multithreaded Framework

## ⚠️ IMPORTANT: Manual Rules Setup Required

**The framework will NOT work without manually adding rules to your Warp IDE.** This is a critical step that cannot be automated.

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Framework
```powershell
# Already done if you're reading this
```

### Step 2: 🔴 CRITICAL - Add Warp Rules (MANUAL)
```powershell
# Check if rules are set up
npm run rules:check

# Generate setup instructions
npm run rules:setup
```

**You MUST follow the generated instructions to add 4 rules to your Warp IDE:**

1. **enhanced-multi-session-coordination.md** - Core coordination logic
2. **enhanced-masterplan-session-rules.md** - Persistent memory 
3. **frontend-session-rules.md** - Frontend AI behavior
4. **backend-session-rules.md** - Backend AI behavior

### Step 3: Initialize Your Project
```powershell
# This will also check rules setup
npm run init

# Or with full path
node scripts/coordinator.js init --project-type=web-app
```

### Step 4: Verify Everything Works
```powershell
# Test framework
npm run status

# Verify rules are working
npm run rules:verify
```

## 🤔 Why Manual Setup?

**Warp's AI rules are stored internally** and cannot be programmatically added. Each rule must be:

1. **Copied** from the rule file 
2. **Pasted** into Warp IDE settings
3. **Saved** in the Rules section
4. **Activated** by mentioning them in AI chats

## 🔧 Complete Workflow

### 1. Initial Setup
```powershell
# Clone/download framework
git clone https://github.com/yourusername/warp-multithreaded.git
cd warp-multithreaded

# Install dependencies
npm install

# CRITICAL: Set up rules (follow generated instructions)
npm run rules:setup
```

### 2. Project Initialization
```powershell
# Navigate to your project
cd D:\your-project

# Initialize framework (includes rules check)
node D:\warp-multithreaded\warp-multithreaded\scripts\coordinator.js init
```

### 3. Test Setup
```powershell
# Check status
node D:\warp-multithreaded\warp-multithreaded\scripts\coordinator.js status

# Test in new Warp session
"Use enhanced-multi-session-coordination and enhanced-masterplan-session-rules from my Warp Drive.
Show me the current project status."
```

## 🚨 Common Issues

### "Framework not working in new sessions"
**Problem**: Rules not added to Warp IDE
**Solution**: Must manually add all 4 rules to Warp settings

### "AI doesn't mention sessions or coordination"
**Problem**: Rules not activated in current session
**Solution**: Mention rules explicitly: "Use enhanced-multi-session-coordination from my Warp Drive"

### "Rules work in one session but not others"
**Problem**: Each session needs rules activated separately
**Solution**: Start each session by mentioning the rules

## 📋 Commands Reference

```powershell
# Rules Management
npm run rules:check          # Check if rules are set up
npm run rules:setup         # Generate setup instructions
npm run rules:verify        # Test if rules are working

# Project Management  
npm run init                # Initialize framework in project
npm run status              # Show framework status
npm run demo                # Run demonstration

# Advanced
npm run dashboard           # Start web dashboard
npm run validate            # Run system validation
```

## 🎯 Success Indicators

**✅ Setup is working when:**
- AI agent mentions checking session status
- AI agent asks about coordination with other sessions
- AI agent respects session boundaries (frontend vs backend)
- AI agent references project masterplan

**❌ Setup is NOT working when:**
- AI agent works on any file without checking sessions
- AI agent doesn't mention other active sessions
- AI agent doesn't use the coordination framework

## 💡 Pro Tips

1. **Save rule files locally** for easy copying across projects
2. **Test in multiple sessions** to verify coordination
3. **Use session-specific language** when talking to AI
4. **Check dashboard** for visual coordination monitoring

---

⚠️ **Without proper rules setup, you'll just have a regular AI agent - not coordinated multithreaded development!**
