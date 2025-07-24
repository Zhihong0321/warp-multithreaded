# Conflict Warning Demo

This demonstrates how the framework warns about file conflicts.

## Test Scenario Setup

```bash
# Initialize a test project
mkdir test-project
cd test-project
node ../scripts/coordinator.js init --project-type=web-app

# Create two sessions
node ../scripts/coordinator.js session create --name=frontend --focus=ui,components
node ../scripts/coordinator.js session create --name=backend --focus=api,database

# Simulate backend session working on package.json
# This would normally happen when AI Agent starts working on a file
node ../scripts/coordinator.js lock-file backend package.json
```

## Expected AI Agent Behavior

### ✅ **What SHOULD Happen (with Warp Rules)**

**Terminal 1 - Frontend Session:**
```
Human: Edit package.json to add React dependencies

AI Agent (following frontend-session-rules):
"Before editing package.json, let me check for conflicts...

I notice package.json might be in use by another session. Let me verify:

⚠️ CONFLICT DETECTED: package.json appears to be tracked by the 'backend' session.

This is a shared configuration file. Should I:
1. Proceed with adding React dependencies (coordinate first)
2. Wait for the backend session to finish their changes
3. Focus on component-specific dependencies in a separate config

I recommend coordinating with the backend session first to avoid merge conflicts."
```

### ❌ **What MIGHT Happen (without proper rules)**

```
Human: Edit package.json to add React dependencies

AI Agent (not following rules):
"I'll add the React dependencies to package.json..."
[Proceeds without checking, creates conflict]
```

## Manual Conflict Check

You can always manually check for conflicts:

```bash
# Check current conflicts
node ../scripts/coordinator.js conflicts

# Expected output if conflict exists:
# ⚠️ Found 1 conflict(s):
# 1. 📄 package.json
#    Sessions: frontend, backend
#    Type: file_conflict
```

## Session Status Check

```bash
# View what each session is working on
node ../scripts/coordinator.js session list

# Expected output:
# 📋 frontend
#    🎯 Focus: ui, components
#    📁 Active files: 0
#    ⏰ Last active: [timestamp]
#
# 📋 backend  
#    🎯 Focus: api, database
#    📁 Active files: 1
#    🔒 Working on: package.json
#    ⏰ Last active: [timestamp]
```

## Coordination File Status

Check `.warp-coordination.md`:
```markdown
## 🔄 Current Status
```
FRONTEND   | Available     | Next: Add React components  
BACKEND    | Working       | Current: Updating package.json dependencies
TESTING    | Available     | Next: Setup test framework
```
```

## Best Case Scenario

**With proper Warp Rules integration:**

1. **AI Agent automatically checks** before editing any file
2. **Warns about conflicts** before making changes  
3. **Suggests alternatives** or coordination steps
4. **Waits for your decision** instead of proceeding blindly

## Fallback Manual Check

If AI Agent doesn't check automatically, you can:

```bash
# Before any major file edit, run:
node ../scripts/coordinator.js conflicts

# If conflicts found, coordinate manually:
# "Hey backend session, I need to edit package.json for React deps"
```
