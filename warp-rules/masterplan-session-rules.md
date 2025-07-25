# Masterplan Mode - AI Session Rules

You are working in a project with **Masterplan Mode** activated - a persistent project intelligence system that maintains context across all AI sessions.

## 🧠 Session Continuity Protocol

### Before Starting Work

1. **Get Current Context**:
   ```bash
   node scripts/coordinator.js context --session=your-session-name
   ```
   This provides you with complete project understanding including:
   - Project goals and current status
   - Pending tasks and recent completions
   - Session history and decisions made
   - Technical context and architecture

2. **Check Your Tasks**:
   ```bash
   node scripts/coordinator.js masterplan tasks
   ```
   View current priority tasks to understand what needs focus.

3. **Understand Your Role**:
   - Read the project masterplan: `.warp-masterplan/masterplan.md`
   - Check session log: `.warp-masterplan/session-log.md`
   - Review recent decisions: `.warp-masterplan/decisions.md`

### During Development

1. **Work on Assigned Tasks**:
   - Focus on tasks from the masterplan task list
   - Complete tasks that align with project goals
   - Reference the masterplan for context and decisions

2. **Update Progress**:
   When you complete a task, update the masterplan:
   ```bash
   node scripts/coordinator.js masterplan complete-task --id=task-id --notes="Brief completion summary" --session=your-session
   ```

3. **Add New Tasks** (if needed):
   ```bash
   node scripts/coordinator.js masterplan add-task --title="Task title" --description="Details" --priority=medium
   ```

### Communication Style

**When Starting a Session**:
```
"I've read the masterplan context. Currently working on [specific task from task list]. 
The project is in [phase] phase and I understand that [key context from masterplan]."
```

**When Completing Work**:
```
"Task completed: [task name]. I'll update the masterplan to reflect this completion.
Next logical step based on the masterplan would be [suggestion]."
```

**When Encountering Issues**:
```
"I found an issue that might affect the masterplan. This could impact [aspect] 
and may require updating the project decisions or architecture."
```

## 📋 Masterplan Integration

### Available Files
- **`.warp-masterplan/masterplan.md`** - Main project document with goals, architecture, status
- **`.warp-masterplan/tasks.json`** - Structured task list with priorities and status
- **`.warp-masterplan/session-log.md`** - Chronological record of all sessions
- **`.warp-masterplan/decisions.md`** - Technical decisions and reasoning
- **`.warp-masterplan/context.json`** - Machine-readable project context

### Key Commands
```bash
# Get session context (run this first!)
node scripts/coordinator.js context

# View project status
node scripts/coordinator.js masterplan status

# See current tasks
node scripts/coordinator.js masterplan tasks

# Complete a task
node scripts/coordinator.js masterplan complete-task --id=task-id --notes="Done"

# Add a task
node scripts/coordinator.js masterplan add-task --title="New task"

# Log session summary
node scripts/coordinator.js masterplan log-session --session=frontend --summary="Session summary"
```

## 🎯 Working with Tasks

### Task Priority Guidelines
- **High Priority**: Blocking issues, core functionality, critical bugs
- **Medium Priority**: Feature implementation, improvements, non-critical fixes
- **Low Priority**: Optimization, documentation, nice-to-have features

### Task Completion Protocol
1. Work on the task as described
2. Complete the work fully
3. Test/verify the implementation
4. Update the masterplan: `complete-task --id=task-id --notes="What was accomplished"`
5. Suggest next steps if appropriate

### Adding Tasks
Only add tasks when:
- You discover necessary work not in the current task list
- The user requests new functionality
- You identify important technical debt or issues

## 🔄 Session Handoff

### Ending a Session
Before ending work, consider logging the session:
```bash
node scripts/coordinator.js masterplan log-session \
  --session=frontend \
  --summary="Worked on navigation component" \
  --outcomes="Fixed responsive issues,Added accessibility" \
  --decisions="Chose CSS Grid over Flexbox for layout" \
  --next-goals="Implement mobile menu,Add animations"
```

### Starting After Another Session
1. Run `node scripts/coordinator.js context` to get full context
2. Read the most recent session log entries
3. Understand what was accomplished and what's next
4. Continue from where the previous session left off

## 💡 Best Practices

### Maintaining Project Memory
- **Always** check context before starting significant work
- **Update** the masterplan when completing tasks
- **Log** important decisions and outcomes
- **Reference** previous sessions when making related changes

### Cross-Session Coordination
- Check if other sessions are working on related functionality
- Update shared understanding in the masterplan
- Communicate major architectural changes through decisions.md
- Keep task list current and accurate

### Quality Standards
- All work should align with project goals in masterplan
- Follow architectural decisions recorded in decisions.md
- Complete tasks fully before marking them done
- Document significant changes or discoveries

## 🚨 Important Notes

- **The masterplan is your project memory** - use it to understand context
- **Tasks guide your work** - focus on listed priorities unless user redirects
- **Session logs maintain continuity** - read them to understand what happened
- **Decisions prevent redundant discussions** - check existing decisions first

## Example Session Flow

```bash
# 1. Get context (always do this first)
node scripts/coordinator.js context

# 2. Check current tasks
node scripts/coordinator.js masterplan tasks

# 3. Work on highest priority task that matches your expertise

# 4. When task is complete
node scripts/coordinator.js masterplan complete-task --id=abc123 --notes="Implemented user login with validation"

# 5. Before ending session (optional but helpful)
node scripts/coordinator.js masterplan log-session --session=backend --summary="Implemented authentication system"
```

---

**This masterplan system ensures every AI session has full project context and maintains continuity across all development work. Use it to build on previous sessions rather than starting from scratch each time.**
