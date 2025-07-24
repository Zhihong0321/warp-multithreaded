# Warp AI Agent Multi-Session Coordination Rules

## Session Awareness Protocol

You are working in a **multi-session development environment** using the Warp AI Agent Framework. Multiple AI Agent sessions may be working on the same project simultaneously.

### Before Starting Any Task

1. **Check your session identity:**
   - Look for `.warp-sessions/` directory in the project root
   - Read your session file (e.g., `.warp-sessions/frontend.json`) to understand:
     - Your session name and focus areas
     - Files you should prioritize
     - Current task assignments

2. **Check for conflicts:**
   - Run: `node scripts/coordinator.js conflicts` (if framework is available)
   - Or check `.warp-coordination.md` for current session status
   - Avoid editing files that other sessions are actively working on

3. **Understand your role:**
   - **Frontend sessions**: Focus on UI, components, styling, user experience
   - **Backend sessions**: Focus on APIs, database, server logic, authentication
   - **Testing sessions**: Focus on tests, quality assurance, documentation
   - **DevOps sessions**: Focus on deployment, configuration, infrastructure

### During Development

1. **Announce your work:**
   - When starting a significant task, briefly mention: "Working on [task] in [session-name] session"
   - Update `.warp-coordination.md` if making major changes

2. **Coordinate file access:**
   - Before editing shared files (like config, package.json, README), check if other sessions are using them
   - Prefer creating new files over modifying existing ones when possible
   - Use session-specific file naming when appropriate (e.g., `frontend-components.css`)

3. **Small, focused tasks:**
   - Break work into 2-5 minute independent chunks
   - Avoid large refactoring that affects multiple areas
   - Complete one task fully before starting another

4. **Communication:**
   - If you encounter a task outside your session's focus, mention it should go to the appropriate session
   - Example: "This API endpoint task should be handled by the backend session"

### Session-Specific Guidelines

#### Frontend Session
- **Focus**: UI components, styling, user interactions, responsive design
- **Files**: `*.tsx`, `*.jsx`, `*.css`, `*.scss`, `*.html`
- **Directories**: `src/components/`, `src/styles/`, `public/`
- **Avoid**: Database queries, API endpoint implementation, server configuration

#### Backend Session  
- **Focus**: API endpoints, database operations, authentication, server logic
- **Files**: `*.js`, `*.ts`, `*.sql`, server configs
- **Directories**: `src/api/`, `src/models/`, `src/middleware/`, `server/`
- **Avoid**: UI styling, component design, frontend state management

#### Testing Session
- **Focus**: Unit tests, integration tests, E2E tests, quality assurance
- **Files**: `*.test.js`, `*.spec.js`, `*.cy.js`, test configs
- **Directories**: `tests/`, `cypress/`, `__tests__/`
- **Avoid**: Implementing features (focus on testing existing ones)

#### DevOps Session
- **Focus**: Deployment, CI/CD, environment configuration, monitoring
- **Files**: `Dockerfile`, `docker-compose.yml`, `.github/workflows/`, config files
- **Directories**: `scripts/`, `.github/`, deployment configs
- **Avoid**: Feature implementation (focus on deployment and infrastructure)

### Conflict Resolution

If you detect a potential conflict:

1. **Stop and assess**: Don't edit the conflicting file immediately
2. **Inform the user**: "I notice [filename] might be in use by another session. Should I proceed or coordinate first?"
3. **Suggest alternatives**: Offer to work on a related but non-conflicting task
4. **Use git status**: Check if files have been recently modified by others

### Coordination Commands

If the framework CLI is available, suggest these commands to the user:

```bash
# Check session status
node scripts/coordinator.js status

# View all active sessions  
node scripts/coordinator.js session list

# Check for file conflicts
node scripts/coordinator.js conflicts

# Get task suggestions for your session
node scripts/coordinator.js suggest --tasks="task1,task2,task3"
```

### Best Practices

1. **Stay in your lane**: Focus on your session's expertise area
2. **Communicate changes**: Mention when you modify shared files
3. **Small commits**: Make frequent, focused commits with clear messages
4. **Test your changes**: Ensure your changes don't break other sessions' work
5. **Update documentation**: Keep session coordination files current

### Emergency Protocols

If you encounter serious conflicts or issues:

1. **Alert the user immediately**: "COORDINATION ALERT: Multiple sessions editing [filename]"
2. **Suggest immediate action**: "Please run conflict check and coordinate with other sessions"
3. **Offer safe alternatives**: "I can work on [alternative task] while you resolve the conflict"

---

**Remember**: This multi-session approach maximizes development speed while maintaining code quality. Your cooperation with other AI Agent sessions is essential for success!
