# 🤖 AI AGENT SETUP PROTOCOL

## 🎯 FOR AI AGENTS: When User Asks to "Get Warp-Multithreaded"

**This is the EXACT sequence you must follow when a user asks to download or get the warp-multithreaded framework.**

---

## ⚡ STEP 1: Download and Install

```powershell
# Download the repository
git clone https://github.com/yourusername/warp-multithreaded.git
cd warp-multithreaded

# Install dependencies
npm install

# Mark download step as complete
node scripts/setup-tracker.js mark step1_download
node scripts/setup-tracker.js mark step2_install_deps
```

**Response to user:**
```
✅ Downloaded and installed warp-multithreaded framework.

⚠️ CRITICAL NEXT STEP: This framework requires manually adding rules to your Warp IDE. 
Without this step, it will appear to work but won't actually coordinate AI sessions.

Let me check the current setup status and generate instructions...
```

---

## ⚡ STEP 2: Check Setup Status and Generate Instructions

```powershell
# Check current status
node scripts/setup-tracker.js status

# Generate setup instructions
node scripts/coordinator.js rules setup

# Mark this step complete
node scripts/setup-tracker.js mark step3_generate_instructions
```

**Response to user:**
```
📋 Setup Status: [X]% complete

🚨 MANUAL SETUP REQUIRED: I've generated detailed instructions in WARP_RULES_SETUP_REQUIRED.md

You MUST manually add 4 rules to your Warp IDE:
1. Open Warp Settings → Rules
2. Copy content from each rule file and paste as separate rules
3. Save the rules in Warp IDE

The 4 required rule files are:
- enhanced-multi-session-coordination.md (Core coordination)
- enhanced-masterplan-session-rules.md (Persistent memory)
- frontend-session-rules.md (Frontend AI behavior)  
- backend-session-rules.md (Backend AI behavior)

After you've added all 4 rules to Warp IDE, let me know and I'll verify the setup.
```

---

## ⚡ STEP 3: User Confirms Rules Added

When user says "I've added the rules" or similar:

```powershell
# Mark rules step complete
node scripts/setup-tracker.js mark step4_add_rules

# Verify setup
node scripts/coordinator.js rules verify

# Mark verification complete
node scripts/setup-tracker.js mark step5_verify

# Check final status
node scripts/setup-tracker.js status
```

**Response to user:**
```
✅ Excellent! Let me verify the setup is working...

[Run verification commands]

🧪 Testing framework functionality...

✅ Setup verification complete! The framework is now ready for use.

Let me initialize it in your project...
```

---

## ⚡ STEP 4: Initialize Framework

```powershell
# Initialize in user's project
node scripts/coordinator.js init --project-type=web-app

# Mark initialization complete
node scripts/setup-tracker.js mark step6_initialize

# Show final status
node scripts/setup-tracker.js status
```

**Response to user:**
```
🚀 Framework initialized successfully!

You can now use coordinated AI sessions for parallel development:

Next steps:
1. Create sessions: node scripts/coordinator.js session create --name=frontend
2. Test coordination in a new Warp session with:
   "Use enhanced-multi-session-coordination and enhanced-masterplan-session-rules from my Warp Drive"

The framework is ready for multithreaded AI development! 🎉
```

---

## 🔧 AI Context Check Commands

Always run these to understand current state:

```powershell
# Check setup progress
node scripts/setup-tracker.js context

# Check framework status  
node scripts/coordinator.js status

# Check rules status
node scripts/coordinator.js rules check
```

---

## 🚨 Error Handling

### If user reports "rules not working":
```powershell
# Reset and restart setup
node scripts/setup-tracker.js reset
node scripts/coordinator.js rules setup

# Guide user through manual setup again
```

### If framework "doesn't coordinate":
```powershell
# Check if rules are actually loaded
node scripts/coordinator.js rules verify

# Show user how to activate rules in current session
```

---

## 💡 AI Agent Response Templates

### When asked to download warp-multithreaded:
```
I'll help you set up the warp-multithreaded framework for coordinated AI development.

⚠️ IMPORTANT: This framework requires a specific setup process including manually adding rules to your Warp IDE. Let me guide you through it step by step.

[Execute Step 1 commands]

The framework is downloading and installing...
```

### After download completes:
```
✅ Framework downloaded successfully!

🚨 CRITICAL: Before this will work, you need to manually add 4 coordination rules to your Warp IDE settings. This is required because Warp's AI rules can't be programmatically installed.

Let me generate the detailed setup instructions...

[Execute Step 2 commands]

Please follow the instructions in WARP_RULES_SETUP_REQUIRED.md to add the rules to your Warp IDE, then let me know when you're done.
```

### When user confirms rules added:
```
Perfect! Let me verify the setup and initialize the framework...

[Execute Steps 3-4 commands]

🎉 Setup complete! You now have a fully functional multithreaded AI coordination framework.
```

---

## 🎯 Success Indicators

**✅ Setup is working when:**
- `setup-tracker.js status` shows 100% complete
- AI mentions session coordination in responses
- `coordinator.js status` shows active sessions
- New Warp sessions can activate rules successfully

**❌ Setup needs fixing when:**
- AI doesn't mention coordination or sessions
- `rules verify` command fails
- Setup tracker shows incomplete steps
- User reports framework "not working"

---

⚠️ **Remember: NEVER skip the manual rules setup step. The framework will not work without it!**
