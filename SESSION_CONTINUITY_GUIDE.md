# Session Continuity Guide - Warp Multithreaded

## Overview
Session continuity ensures that when you end a development session (shutdown PC, take a break), all context is preserved and can be seamlessly restored when you return.

## The Three Essential Commands

### 1. `update-state` - Save Development State (Use Throughout Development)
```bash
# Save current progress with detailed summary
warp-multithreaded update-state \
  --summary="Implemented user authentication with JWT" \
  --outcomes="login working,JWT tokens,password validation" \
  --decisions="chose bcrypt for hashing,JWT over sessions" \
  --next-goals="implement signup,add email verification" \
  --checkpoint="auth-milestone"

# Quick auto-save during development
warp-multithreaded update-state --auto

# Silent save without prompts
warp-multithreaded update-state \
  --summary="Fixed navbar styling issues" \
  --checkpoint="navbar-fix" \
  --interactive=false
```

**What it does:**
- Records current development progress in Masterplan
- Captures active sessions and project state
- Creates timestamped backups for recovery
- Maintains development history with checkpoints
- Can be used anytime during development (not just at shutdown)

### 2. `shutdown` - End Session with Context Preservation
```bash
# Basic shutdown with interactive prompts
warp-multithreaded shutdown

# Quick shutdown with summary
warp-multithreaded shutdown \
  --summary="Fixed login bug and implemented user authentication" \
  --outcomes="login working,tests passing,JWT integration complete" \
  --decisions="used bcrypt for passwords,chose JWT over sessions" \
  --next-goals="implement signup,add password reset,enhance validation"

# Silent shutdown (no prompts)
warp-multithreaded shutdown \
  --summary="End of day work" \
  --interactive=false \
  --close-sessions=true
```

**What it does:**
- Records session summary in Masterplan
- Captures current active sessions and their state
- Notes any file conflicts that need resolution
- Creates a recovery snapshot file
- Optionally closes all active sessions

### 2. `startup/resume` - Restore Development Context
```bash
# Basic startup with context restoration
warp-multithreaded startup

# Startup with full context display
warp-multithreaded startup \
  --show-context=true \
  --save-context=session-context.md

# Startup with session restoration
warp-multithreaded startup \
  --restore-sessions=true \
  --session=frontend
```

**What it does:**
- Shows project status and progress
- Displays recent session activity and goals
- Lists high-priority tasks to focus on
- Generates AI context for immediate work
- Optionally restores previous session configurations

## Typical Workflow

### End of Session
```bash
# When ending development work
warp-multithreaded shutdown \
  --summary="Implemented user dashboard with real-time updates" \
  --outcomes="dashboard working,websocket integration,responsive design" \
  --decisions="chose Socket.io over plain websockets,used flexbox layout" \
  --next-goals="add user settings,implement notifications,optimize performance"
```

### Start of New Session
```bash
# When resuming development
warp-multithreaded startup --session=frontend --save-context=today-context.md

# Then share the context with your AI assistant:
# "Here's my project context from today-context.md - let's continue development"
```

## Files Created for Continuity

1. **`.warp-session-snapshot.json`** - Complete project state snapshot
2. **`today-context.md`** - AI-ready context summary
3. **Masterplan logs** - Historical session records

## Integration with Masterplan

The shutdown/startup commands are tightly integrated with the Masterplan system:

- **Goal Tracking**: Maintains focus on original project vision
- **Task Management**: Shows priority tasks for immediate attention  
- **Progress Tracking**: Displays completion status and next milestones
- **Discussion History**: Records important decisions and rationale
- **Development Log**: Maintains chronological development narrative

## Benefits

1. **Zero Context Loss**: Never lose track of what you were working on
2. **AI Continuity**: Provide your AI assistant with complete project context
3. **Progress Visibility**: Always know project status and next priorities
4. **Decision Memory**: Recall why certain technical decisions were made
5. **Team Coordination**: Share context easily with team members

## Example Session Flow

```bash
# End yesterday's work
warp-multithreaded shutdown \
  --summary="Completed user authentication module" \
  --outcomes="login/logout working,JWT tokens,password validation" \
  --decisions="used bcrypt for hashing,implemented JWT refresh tokens" \
  --next-goals="build user profile page,add email verification"

# Start today's work  
warp-multithreaded startup --save-context=today.md

# Create new session for today's focus
warp-multithreaded session create --name=profile --focus=ui,forms,validation

# View current tasks
warp-multithreaded masterplan tasks

# Work with AI using saved context...
# Later, end today's session
warp-multithreaded shutdown \
  --summary="Built user profile page with image upload" \
  --outcomes="profile form complete,image upload working,validation added" \
  --next-goals="add email verification,implement password change"
```

This ensures complete continuity between development sessions while maintaining the project's original vision and goals through the Masterplan system.
