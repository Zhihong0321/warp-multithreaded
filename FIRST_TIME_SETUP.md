# 🚀 FIRST TIME SETUP: Warp Multithreaded Framework

## 🎯 FOR AI AGENTS: Complete Setup Protocol

**When a user asks to "get warp-multithreaded" or "download warp-multithreaded", follow this EXACT sequence:**

---

## ⚡ STEP 1: Download and Install

```powershell
# Clone the repository
git clone https://github.com/yourusername/warp-multithreaded.git
cd warp-multithreaded

# Install dependencies
npm install
```

---

## ⚡ STEP 2: CRITICAL - Check Setup Status

```powershell
# Check current setup status
node scripts/coordinator.js rules check

# Generate setup instructions (ALWAYS do this first time)
node scripts/coordinator.js rules setup
```

**This creates `WARP_RULES_SETUP_REQUIRED.md` with specific instructions.**

---

## ⚡ STEP 3: MANDATORY - Add Rules to Warp IDE

**⚠️ STOP HERE - User must manually complete this step:**

1. **Open Warp Settings** (⚙️ icon)
2. **Navigate to "Rules" section**
3. **Add 4 rules by copying content from these files:**
   - `warp-rules/enhanced-multi-session-coordination.md`
   - `warp-rules/enhanced-masterplan-session-rules.md` 
   - `warp-rules/frontend-session-rules.md`
   - `warp-rules/backend-session-rules.md`

**Each rule must be copied and pasted as a separate rule in Warp IDE.**

---

## ⚡ STEP 4: Verify Setup

```powershell
# Test if rules are working
node scripts/coordinator.js rules verify

# Initialize framework in user's project
cd D:\your-actual-project
node D:\warp-multithreaded\warp-multithreaded\scripts\coordinator.js init
```

---

## ⚡ STEP 5: Test AI Coordination

**Start a new Warp session and test:**

```
Use enhanced-multi-session-coordination and enhanced-masterplan-session-rules from my Warp Drive.
Check the current project status and show me available sessions.
```

**✅ SUCCESS**: AI should mention checking sessions, coordination, and project status
**❌ FAILURE**: AI responds normally without coordination awareness

---

## 🔧 SELF-CHECK SYSTEM

The framework includes a self-check system to track setup completion:

```powershell
# Check setup status
node scripts/coordinator.js setup-status

# Mark setup as complete (after manual verification)
node scripts/coordinator.js setup-complete

# Reset setup status
node scripts/coordinator.js setup-reset
```

---

## 🚨 COMMON ISSUES

### "AI doesn't coordinate in new sessions"
**Problem**: Rules not activated in current session
**Solution**: Always start with: "Use enhanced-multi-session-coordination from my Warp Drive"

### "Framework says ready but doesn't work"
**Problem**: Rules not actually added to Warp IDE  
**Solution**: Verify rules exist in Warp Settings → Rules section

### "Rules work once then stop working"
**Problem**: Each session needs rules activated separately
**Solution**: Mention rules at start of every session

---

## 💡 FOR AI AGENTS: Key Responses

### When asked to download warp-multithreaded:
```
I'll help you set up the warp-multithreaded framework. This requires a specific setup process to work properly.

First, let me download and install it:
[run download commands]

⚠️ CRITICAL: This framework requires manually adding rules to your Warp IDE. 
Without this step, it will appear to work but won't actually coordinate sessions.

Let me generate the setup instructions...
[run setup commands]

Please follow the generated instructions in WARP_RULES_SETUP_REQUIRED.md to add the 4 rules to your Warp IDE, then I can help you test and initialize it.
```

### After user confirms rules are added:
```
Great! Now let me verify the setup is working and initialize the framework:
[run verification commands]

The framework is now ready. You can use coordinated AI sessions for parallel development!
```

---

## 🎯 SUCCESS METRICS

**✅ Setup is COMPLETE when:**
- All 4 rules added to Warp IDE
- Self-check status shows "complete" 
- AI agent demonstrates coordination awareness
- New sessions can activate rules successfully

**❌ Setup is INCOMPLETE when:**
- Self-check shows "undone"
- AI agent doesn't mention coordination
- Rules verification fails
- Framework behaves like regular AI

---

⚠️ **Remember: The framework WILL NOT WORK without manual rules setup in Warp IDE!**
