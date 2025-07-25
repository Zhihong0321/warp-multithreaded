# Warp Multithreaded - Quick Commands Reference

This guide provides multiple ways to use shorter commands for the Warp AI Agent Framework.

## 🚀 Quick Command Options

### 1. Short CLI (`wm` command)

After installation, use the `wm` command for short aliases:

```bash
# State management
wm load-state                  # Load previous development state
wm save-state --summary="..."  # Save current state
wm update-state               # Update project documentation

# Session management  
wm startup                    # Resume development with context
wm shutdown --summary="..."   # End session with summary
wm status                     # Show framework status
wm sessions                   # List active sessions

# Tasks and planning
wm tasks                      # List all project tasks
wm add-task --title="..."     # Add new task
wm complete-task --id=...     # Mark task completed
wm mp-status                  # Masterplan status

# Context and analysis
wm context --save=context.md  # Generate AI context
wm conflicts                  # Check file conflicts
wm auto-analyze              # Analyze current context
```

### 2. NPM Scripts

Use npm/yarn scripts for common commands:

```bash
# State management
npm run load-state            # Load previous state
npm run save-state            # Save current state
npm run update-state          # Update documentation

# Session management
npm run startup               # Resume development
npm run shutdown              # End session
npm run status                # Show status

# Tasks and context
npm run tasks                 # List tasks
npm run context               # Generate context
```

### 3. Full Commands (when you need all options)

```bash
# Full coordinator access
node scripts/coordinator.js <command> [options]

# Or if installed globally
warp-multithreaded <command> [options]
```

## 📋 Command Comparison

| Action | Short CLI | NPM Script | Full Command |
|--------|-----------|------------|--------------|
| Load state | `wm load-state` | `npm run load-state` | `node scripts/coordinator.js load-state` |
| Save state | `wm save-state --auto` | `npm run save-state -- --auto` | `node scripts/coordinator.js update-state --auto` |
| Show status | `wm status` | `npm run status` | `node scripts/coordinator.js status` |
| List tasks | `wm tasks` | `npm run tasks` | `node scripts/coordinator.js masterplan tasks` |
| Resume work | `wm startup` | `npm run startup` | `node scripts/coordinator.js startup` |

## 🎯 Recommended Workflow

### Starting a new AI session:
```bash
wm load-state                 # Check where you left off
wm startup                    # Resume with full context
wm status                     # Verify current state
```

### During development:
```bash
wm save-state --summary="Implemented user auth" --auto
wm tasks                      # Check pending tasks  
wm context --save=context.md  # Generate context for AI
```

### Ending a session:
```bash
wm save-state --summary="..." --outcomes="..." --next-goals="..."
wm shutdown --summary="What was accomplished"
```

## 🔧 Installation

Make sure the framework is installed:

```bash
npm install
```

The `wm` command will be available globally after installation.

## 💡 Pro Tips

1. **Use `wm` for daily workflow** - fastest and most convenient
2. **Use npm scripts for automation** - great for CI/CD or scripts
3. **Use full commands for advanced options** - when you need specific flags

### Examples:

```bash
# Quick daily workflow
wm load-state
wm startup --show-context=true
# ... do development work ...
wm save-state --summary="Fixed login bug" --auto

# Advanced with specific options
node scripts/coordinator.js update-state \
  --summary="Major refactor completed" \
  --outcomes="performance,maintainability,tests" \
  --decisions="switched-to-typescript,added-validation" \
  --next-goals="deploy,monitoring,documentation" \
  --progress="85"
```

## 📚 Help

- `wm help` - Show short CLI help
- `npm run start help` - Show full coordinator help
- See [README.md](README.md) for complete documentation
