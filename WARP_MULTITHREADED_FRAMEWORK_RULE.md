# WARP MULTITHREADED FRAMEWORK - AI AGENT RULE

## FRAMEWORK OVERVIEW

You are working with the **Warp Multithreaded Framework** - a high-performance multi-session development coordination system that enables seamless collaboration across frontend, backend, testing, and DevOps sessions.

## HOW THE FRAMEWORK WORKS

### 1. Masterplan-Driven Development
- **EVERY PROJECT** using this framework has a `masterplan-goal.md` file
- **ALWAYS** read this file first: `cat masterplan-goal.md` or check `.warp-masterplan/` folder
- This contains the project's current goal, specifications, and context
- Your work must align with the masterplan specifications

### 2. Project Context Discovery
```bash
# Check if project has Warp Multithreaded setup
ls .warp-masterplan/  # Project specifications
ls masterplan-goal.md  # Current project goal
ls masterplan-config.json  # Project configuration
```

**If these files exist**: The project is using Warp Multithreaded. Read project specifications.
**If these files don't exist**: Guide user through first-time setup.

### 3. First-Time Setup Detection
**When masterplan files are missing**, guide the user:
```
I notice this project hasn't been set up with Warp Multithreaded yet.
Let me help you get started:

1. Run the masterplan wizard to set up your project:
   npm run masterplan-wizard
   
2. Or if you prefer, I can help you set up manually:
   - What do you want to build?
   - What type of project is this?
   
This will create the project specifications that I need to help you effectively.
```

### 4. Automatic Session Management
The framework provides **FULLY AUTOMATED** session coordination:

**How Auto-Detection Works:**
- **Frontend triggers**: UI, components, styling, React/Vue/Angular, CSS, HTML, frontend routing
- **Backend triggers**: API, server, database, middleware, authentication, business logic
- **Testing triggers**: Tests, specs, QA, validation, Jest, Cypress, unit tests
- **DevOps triggers**: Docker, CI/CD, deployment, infrastructure, containers

**Session Auto-Switching:**
```bash
# When you mention "create a React component" → Frontend session
# When you mention "API endpoint" → Backend session
# When you mention "write tests" → Testing session
# When you mention "Docker setup" → DevOps session
```

**NEVER manually create sessions** - the system analyzes your request and creates/switches automatically.

## FRAMEWORK SETUP WORKFLOW

### For New Projects
1. **Check if framework is available:**
   ```bash
   # Look for framework in project or globally
   ls scripts/coordinator.js  # Project-local
   which warp-mt  # Global installation
   ```

2. **If framework not found, guide user to install:**
   ```bash
   # Clone or install Warp Multithreaded Framework
   git clone https://github.com/your-username/warp-multithreaded
   ```

3. **Run Masterplan Mode to set up project:**
   ```bash
   # This generates project specifications and setup
   node scripts/masterplan-wizard.js
   # OR via dashboard
   npm run dashboard
   ```

4. **Verify setup completed:**
   ```bash
   ls masterplan-goal.md  # Current project goal
   ls .warp-masterplan/   # Project specifications  
   ls masterplan-config.json  # Project configuration
   ```

### For Existing Framework Projects
1. **Check framework version (MANDATORY FIRST STEP):**
   ```bash
   node scripts/version-detector.js
   ```
   
2. **If version check fails - STOP immediately:**
   - Framework needs updating
   - Do not proceed until status shows "UP_TO_DATE"

3. **Read project specifications:**
   ```bash
   cat masterplan-goal.md  # ALWAYS CHECK FIRST
   cat .warp-masterplan/masterplan.md  # Project overview
   cat masterplan-config.json  # Tech stack and configuration
   cat .warp-masterplan/decisions.md  # Technical decisions
   ```

## SESSION COORDINATION PROTOCOL

### Automatic Session Boundaries
**Frontend Sessions automatically handle:**
- UI components (`src/components/`, `components/`)
- Styling (`src/styles/`, `styles/`, CSS files)
- Client-side interactions
- Frontend routing
- Static assets (`public/`, `assets/`)

**Backend Sessions automatically handle:**
- API endpoints (`src/api/`, `api/`, routes)
- Database models (`src/models/`, `models/`)
- Server middleware
- Authentication logic
- Business logic

**Testing Sessions automatically handle:**
- Test files (`__tests__/`, `tests/`, `.test.js`, `.spec.js`)
- Test configuration
- QA and validation

**DevOps Sessions automatically handle:**
- Docker files
- CI/CD configuration
- Deployment scripts
- Environment configuration

### Conflict Prevention Protocol

**Before editing ANY file, run:**
```bash
# Check active sessions and their focus
node scripts/coordinator.js status
```

**For shared files (package.json, .env, config):**
1. Check if other sessions are modifying them
2. Coordinate via session communication
3. Make changes in designated session only

**Conflict Resolution:**
```bash
# View session assignments
node scripts/coordinator.js sessions
# Check file locks/assignments
node scripts/coordinator.js conflicts
# Force session cleanup if needed
node scripts/coordinator.js cleanup
```

**Communication Protocol:**
- Announce architectural changes before making them
- Use session status to coordinate timing
- Stay within your session's file boundaries

## GOAL-DRIVEN DEVELOPMENT

### Always Check Current Goal
```bash
# CRITICAL: Read this before any work
cat masterplan-goal.md
```

### Align All Work with Goal
- Every code change must advance the project goal
- Question requests that diverge from the goal
- Reference project specifications in `.warp-masterplan/`
- Update goal via dashboard if direction changes

## TECHNOLOGY STACK HANDLING

### Check Project Configuration
```bash
cat masterplan-config.json  # See chosen tech stack
cat .warp-masterplan/decisions.md  # Technical decisions
```

### AI Decision Strategy
If tech stack isn't specified, the framework uses "Let AI Decide":
1. Analyze project goal and requirements
2. Choose modern, well-supported technologies
3. Prefer full-stack solutions (Next.js, etc.)
4. Optimize for performance and developer experience
5. Consider deployment target (Vercel, Railway, etc.)

## ENVIRONMENT AWARENESS

### Cross-Platform Commands
Always check the user's environment and use appropriate commands:
- **Windows/PowerShell**: Use `Get-Content`, `Set-Location`, `New-Item`
- **Linux/macOS**: Use `cat`, `cd`, `touch`
- **Check shell**: Look at shell type in context

### Performance Targets
Reference project's performance requirements:
```bash
cat .warp-masterplan/specs.json  # Performance targets
```

## DASHBOARD INTEGRATION

### CLI Service Integration
If dashboard is running:
```bash
# Check dashboard CLI service
curl http://localhost:3100/api/status
# Or use dashboard for tool installation, project setup
```

### Goal Management
```bash
# Update project goal via CLI
node scripts/goal-manager.js get
node scripts/goal-manager.js set "New project goal"
```

## AVAILABLE COMMANDS REFERENCE

### Core Framework Commands
```bash
# Framework health and version
node scripts/version-detector.js           # Check framework version
node scripts/health-check.js               # System health check
npm run health-check                       # Same as above

# Session coordination
node scripts/coordinator.js status         # View session status
node scripts/coordinator.js sessions       # List all sessions
node scripts/coordinator.js conflicts      # Check for conflicts
node scripts/coordinator.js cleanup        # Clean up sessions

# Project validation
node scripts/validate-system.js            # Validate system setup
node scripts/comprehensive-validation.js   # Full validation
npm run validate                          # System validation
npm run validate-comprehensive           # Comprehensive check
```

### Masterplan & Goal Management
```bash
# Masterplan setup
node scripts/masterplan-wizard.js          # Run masterplan wizard
npm run dashboard                          # Open dashboard
npm run masterplan                        # Generate unified rules

# Goal management
node scripts/goal-manager.js get           # Get current goal
node scripts/goal-manager.js set "goal"    # Set new goal
node scripts/goal-manager.js history       # View goal history
node scripts/goal-manager.js stats         # Goal statistics
npm run goal                              # Goal manager CLI
```

### Dashboard & CLI Service
```bash
# Dashboard services
npm run dashboard                          # Start web dashboard
npm run cli-service                       # Start CLI service

# CLI service API
curl http://localhost:3100/api/status      # Service status
curl http://localhost:3100/api/tools       # Available tools
curl http://localhost:3100/api/goal        # Current goal
```

### Rules & Setup Management
```bash
# Rule management
npm run rules:check                       # Check rule status
npm run rules:setup                       # Setup rules
npm run rules:verify                      # Verify rules
node scripts/rules-checker.js --status    # Rule status

# Project initialization
npm run init                              # Initialize project
npm run status                            # Project status
node scripts/setup-tracker.js            # Track setup progress
```

### Development & Testing
```bash
# Testing and demos
npm run test                              # Run tests
npm run demo                              # Run demo
node examples/demo.js                     # Direct demo

# Platform-specific setup
npm run setup:windows                    # Windows setup
npm run setup:unix                       # Unix/Linux setup
```

## CRITICAL SUCCESS FACTORS

### ✅ DO THIS ALWAYS
1. **Read `masterplan-goal.md` first** - This is THE source of truth
2. **Check framework version** with `version-detector.js`  
3. **Read project specifications** from `masterplan-config.json` and `.warp-masterplan/`
4. **Stay within auto-assigned session boundaries**
5. **Align all work with the current project goal**

### ❌ NEVER DO THIS
1. **Never** manually create sessions - use auto-session management
2. **Never** ignore the project goal - everything must align
3. **Never** work outside your session's expertise area
4. **Never** proceed if version check fails
5. **Never** assume tech stack - check project configuration

## TROUBLESHOOTING

### Framework Not Working
```bash
# Reinstall framework
npm install -g warp-multithreaded
# Or update local version
git pull origin main
npm install
```

### Missing Project Setup
```bash
# Run masterplan wizard to set up project
node scripts/masterplan-wizard.js
# This creates all necessary project files
```

### Session Conflicts
```bash
# Check session status
node scripts/coordinator.js status
# View active sessions and their focus areas
```

---

## FRAMEWORK PHILOSOPHY

The Warp Multithreaded Framework turns development into a **spec-driven, goal-aligned, multi-session orchestrated experience**. You don't manage sessions manually - you describe what you want to build, and the system:

1. **Reads the project goal** to understand context
2. **Auto-creates appropriate sessions** for the work type  
3. **Coordinates between sessions** to prevent conflicts
4. **Aligns all work** with the project specifications
5. **Maintains high performance** through optimized coordination

**Just describe what you want to build - the framework handles the complexity.**

---

*This rule helps AI agents work effectively with the Warp Multithreaded Framework across any project. For project-specific context, always read the masterplan files in each project.*
