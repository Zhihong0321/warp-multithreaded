# Enhanced Masterplan Mode - AI Session Rules

## 🧠 CRITICAL: You Have Persistent Project Memory

You are working in a project with **Masterplan Mode** activated - a persistent project intelligence system that maintains COMPLETE CONTEXT across ALL AI sessions. **You MUST access this context before starting any work.**

## 🚨 MANDATORY: Context Retrieval Protocol

### STEP 1: GET PROJECT CONTEXT (REQUIRED - ALWAYS FIRST)

**Before doing ANYTHING else, run this command:**
```bash
node scripts/coordinator.js context --session=your-session-name
```

**This command provides you with:**
- 📋 Current project status and phase
- 🎯 Active tasks and priorities 
- ✅ Recent completions and progress
- 📝 Previous session summaries and decisions
- 🏗️ Technical architecture and key decisions
- 🎨 Project goals and requirements

**🚨 NEVER start work without this context!** You need to know:
- What other sessions have already accomplished
- What tasks are currently prioritized
- What technical decisions have been made
- What the overall project goals are

### STEP 2: READ MASTERPLAN FILES (REQUIRED)

**The Masterplan Manager stores context in these files - READ THEM:**

1. **`.warp-masterplan/masterplan.md`** - Main project overview
   - Project description and goals
   - Technical architecture
   - Current status and progress
   - Focus areas and priorities

2. **`.warp-masterplan/tasks.json`** - Active task list
   - Pending tasks with priorities
   - Task assignments and descriptions
   - Completed tasks for reference

3. **`.warp-masterplan/session-log.md`** - Session history
   - Previous AI session summaries
   - Key decisions and outcomes
   - What has been accomplished recently

4. **`.warp-masterplan/decisions.md`** - Technical decisions
   - Architectural choices made
   - Technology selections
   - Design patterns adopted

5. **`.warp-masterplan/context.json`** - Machine-readable context
   - Project metadata
   - Session counts and statistics
   - Current phase and status

### STEP 3: CHECK YOUR ASSIGNED TASKS

```bash
node scripts/coordinator.js masterplan tasks
```

**This shows:**
- 📋 Pending tasks in priority order
- ✅ Recently completed tasks
- 🎯 Tasks that match your session expertise
- ⏱️ Time estimates and complexity

**Work on tasks from this list unless the user specifically redirects you.**

## 🎯 Context-Aware Session Startup

### New Session Startup Protocol

**When starting a new session, you MUST:**

1. **Acknowledge context**: "I'm reading the masterplan context to understand the current project state..."

2. **Summarize understanding**: 
   ```
   "Based on the masterplan, I understand that:
   - Project: [name] is in [phase] phase
   - Progress: [X]% complete with [Y] sessions completed
   - Current focus: [key priorities from masterplan]
   - Recent work: [latest session outcomes]
   - My role: [specific tasks for your session type]"
   ```

3. **Identify your tasks**:
   ```
   "From the task list, I can see [X] pending tasks that match my [session-type] expertise:
   - [Task 1 title] (priority: [level])
   - [Task 2 title] (priority: [level])
   I'll focus on the highest priority task unless you direct otherwise."
   ```

### Context Integration Examples

**Example 1 - Frontend Session:**
```
"I've read the masterplan context. This is a [project-name] in the [phase] phase. 
I can see that the backend team recently completed [recent-backend-work], which means 
I can now work on [dependent-frontend-task]. From the task list, the highest priority 
frontend task is '[task-name]' which aligns with the project's current focus on [focus-area]."
```

**Example 2 - Backend Session:**
```
"Based on the masterplan, I understand that [project-context]. The previous session 
made a decision to use [technology] for [purpose], which is documented in decisions.md. 
I can see that the current high-priority backend task is '[task-name]', which builds 
on the [previous-work] that was completed in session #[number]."
```

## 📋 Working with the Masterplan System

### Task-Driven Development

**The Masterplan Manager provides structured tasks - USE THEM:**

**When you see tasks like:**
```json
{
  "id": "auth-api-endpoints",
  "title": "Implement user authentication API endpoints",
  "description": "Create login, register, and logout endpoints with JWT tokens",
  "priority": "high",
  "tags": ["backend", "auth", "api"]
}
```

**Your response should be:**
```
"I can see the high-priority task 'Implement user authentication API endpoints' in the masterplan. 
This is a backend task that fits my specialization. I'll work on this now and update the 
masterplan when complete."
```

### Progress Tracking Integration

**ALWAYS update the masterplan when completing work:**

```bash
# When you complete a task
node scripts/coordinator.js masterplan complete-task --id=task-id --notes="Brief summary of what was accomplished" --session=your-session
```

**ALWAYS log significant sessions:**

```bash
# When ending a session
node scripts/coordinator.js masterplan log-session --session=frontend --summary="What you accomplished" --outcomes="Key results" --next-goals="What should happen next"
```

## 🔄 Cross-Session Context Continuity

### Understanding Previous Sessions

**When you read the session log, you'll see entries like:**
```markdown
## Session #5 - 2024-01-15
**Session**: Frontend
**Summary**: Implemented user dashboard with responsive design
**Key Outcomes**: 
- ✅ Dashboard layout completed
- ✅ Mobile responsiveness added
**Next Goals**: 
- 🎯 Add user profile editing
- 🎯 Implement settings panel
```

**Your response should acknowledge this:**
```
"I can see from session #5 that the dashboard layout was completed with mobile responsiveness. 
The next goals listed were user profile editing and settings panel. I'll continue from where 
that session left off and focus on the profile editing functionality."
```

### Building on Previous Decisions

**When you see decisions in decisions.md like:**
```markdown
## Decision #3 - Authentication Strategy
**Decision**: Use JWT tokens with refresh token rotation
**Reasoning**: Provides good security with manageable complexity
**Implementation**: tokens expire in 15 minutes, refresh tokens in 7 days
```

**Your response should reference this:**
```
"I see that Decision #3 established JWT tokens with refresh token rotation for authentication. 
I'll implement the auth endpoints following this established pattern with 15-minute token expiry."
```

## 🚨 Context-Aware Communication Patterns

### Starting a Session - ALWAYS Reference Context
```
"I have reviewed the masterplan context. The project [project-name] is currently in [phase] phase 
with [progress]% completion. Based on the recent session history, [previous-context]. 
From the current task list, I can see [relevant-tasks]. I'll focus on [specific-task] which 
aligns with the project's [current-priorities]."
```

### During Work - Reference Previous Context
```
"This builds on the [previous-work] that was completed in [previous-session]. 
According to the technical decisions, we're using [technology] for [purpose], 
so I'll implement this following that established pattern."
```

### Completing Work - Update Context
```
"Task completed: [task-name]. I'll update the masterplan to reflect this completion 
and its impact on [related-aspects]. Based on the project roadmap, the next logical 
step would be [next-task]."
```

### Encountering Issues - Context-Aware Problem Solving
```
"I found an issue that conflicts with Decision #[X] where we chose [previous-decision]. 
This might require updating the project decisions or reconsidering the approach. 
The impact on [project-aspect] should be evaluated."
```

## 📊 Masterplan Integration Commands

### Essential Commands (Use These Actively)

```bash
# ALWAYS start with this - get full project context
node scripts/coordinator.js context --session=your-session

# Check current tasks and priorities
node scripts/coordinator.js masterplan tasks

# View overall project status
node scripts/coordinator.js masterplan status

# Complete a task (REQUIRED when finishing work)
node scripts/coordinator.js masterplan complete-task --id=task-id --notes="Summary"

# Add new tasks (when you discover needed work)
node scripts/coordinator.js masterplan add-task --title="Task" --description="Details" --priority=medium

# Log your session (recommended for significant work)
node scripts/coordinator.js masterplan log-session --session=your-type --summary="What you did"
```

### Advanced Integration

```bash
# Generate AI tasks based on project analysis
node scripts/coordinator.js masterplan generate-tasks --phase=development --focus=your-areas

# Debug the masterplan system
node scripts/coordinator.js debug masterplan

# Validate the masterplan system integrity
node scripts/coordinator.js validate
```

## 🎯 Context-Driven Decision Making

### Using Project Context for Better Decisions

**Instead of making assumptions, reference the masterplan:**

❌ **Wrong**: "I'll create a user authentication system using sessions..."
✅ **Right**: "Based on Decision #3 in the masterplan, I'll implement JWT authentication as established..."

❌ **Wrong**: "I'll style this component with CSS..."
✅ **Right**: "According to the masterplan, we're using [styling-framework], so I'll implement this component following that pattern..."

❌ **Wrong**: "I'll add this new feature..."
✅ **Right**: "I see this feature aligns with Task #[ID] in the masterplan with [priority] priority, so I'll implement it now..."

### Context-Aware Quality Standards

**Your work should:**
- ✅ Align with project goals in masterplan.md
- ✅ Follow technical decisions in decisions.md
- ✅ Build on previous session outcomes
- ✅ Complete assigned tasks fully
- ✅ Update the masterplan with progress

## 🚨 Critical Reminders

### The Masterplan IS Your Project Memory
- 🧠 **Without it**: You're working blind, potentially duplicating work or contradicting decisions
- 🧠 **With it**: You have full context and can build efficiently on previous work

### Tasks Guide Your Work
- 📋 **Always check the task list** for current priorities
- 📋 **Work on assigned tasks** unless user specifically redirects
- 📋 **Update task status** when completing work

### Cross-Session Continuity
- 🔄 **Read session logs** to understand what happened before
- 🔄 **Reference previous decisions** to maintain consistency
- 🔄 **Update logs** with your contributions

---

## 🎯 Key Takeaway: You Have Project Intelligence

**The Masterplan Manager gives you superhuman project memory:**

- 🧠 **Complete Context**: Know everything that happened before
- 🎯 **Clear Direction**: Always know what to work on next
- 🤝 **Team Continuity**: Build seamlessly on other sessions' work
- 📈 **Progress Tracking**: See how your work fits the bigger picture

**NEVER start a session without accessing this context. It's what makes you an intelligent, context-aware AI agent instead of a blank slate!** 🚀

---

**Remember: Other AI agents have been working on this project before you. The Masterplan Manager contains all their knowledge, decisions, and progress. Use it!** ✨
