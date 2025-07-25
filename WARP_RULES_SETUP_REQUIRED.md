
# 🚀 CRITICAL: Warp Rules Setup Required

## ⚠️ SETUP STATUS
✅ Warp Terminal detected
✅ Rule files available

## 📋 SIMPLIFIED SETUP - ONLY 1 RULE NEEDED! 🎉

### Step 1: Add Rules to Your Warp IDE

You MUST manually add this ONE unified rule to your Warp IDE:

1. **Open Warp IDE Settings**
   - Click the ⚙️ settings icon in Warp
   - Navigate to "Rules" section

2. **Add the Unified Rule (Copy & Paste)**

   **WARP MULTITHREADED UNIFIED RULE**
   ```
   Copy content from: D:\warp-multithreaded\warp-multithreaded\.warp-unified-rules.md
   ```
   
   📝 **This single rule replaces all previous multiple rules!**
   ✅ No need for frontend-session-rules.md
   ✅ No need for backend-session-rules.md  
   ✅ No need for enhanced-multi-session-coordination.md
   ✅ Everything is unified in one file!

### Step 2: Verify Rules Are Active

After adding the rule, test in a new Warp session:

```
Use the warp-multithreaded-unified-development-rules from my Warp Drive.
I need to work on my project - show me the current status.
```

If AI responds with session-aware behavior and mentions checking the project goal, rules are working! ✅

### Step 3: Test Project Goal Integration

The unified rule will automatically:
- Check your project goal from masterplan-goal.md
- Create appropriate sessions automatically
- Coordinate between frontend/backend work
- Prevent conflicts and manage state

## 🔧 AUTOMATION COMMANDS

Run this after manual setup:
```powershell
# Verify setup
node "D:\warp-multithreaded\warp-multithreaded\scripts\rules-checker.js" --verify

# Initialize project with unified rules
node "D:\warp-multithreaded\warp-multithreaded\scripts\coordinator.js" init --project-type=web-app
```

## ❌ TROUBLESHOOTING

**Rules not working in new sessions?**
- Rule must be added to Warp IDE settings, not just mentioned in chat
- Use exact phrase: "Use the warp-multithreaded-unified-development-rules"
- Verify rule name matches exactly in Warp settings

**Framework not coordinating?**
- Check: `node scripts/coordinator.js status`
- Ensure project is initialized: `node scripts/coordinator.js init`
- Verify project goal exists: `masterplan-goal.md`

---
⚠️ **THE FRAMEWORK WILL NOT WORK WITHOUT THIS RULE IN WARP IDE** ⚠️
