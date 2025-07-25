# 🚀 Warp Multithreaded Framework - Quick Setup Guide

## Single Framework Rule + Project Specifications

The framework uses a **single global rule** that references project-specific files:

### 1. Framework Rule (Global - Use for ALL projects)
- **File**: `WARP_MULTITHREADED_FRAMEWORK_RULE.md`
- **Purpose**: Teaches AI agents how to work with the framework
- **Scope**: General framework operation across all projects
- **Install Once**: Add to your Warp Drive - applies globally in Warp IDE

### 2. Project Specifications (Local files - Referenced by framework rule)
- **Files**: `masterplan-goal.md`, `masterplan-config.json`, `.warp-masterplan/`
- **Purpose**: Project-specific configuration and context
- **Scope**: Individual project details
- **Access**: Framework rule instructs AI to read these files for context

## 🎯 Quick Start Workflow

### Step 1: Install Framework Rule (One-Time Setup)

**Option A: Warp Drive (Recommended)**
```bash
# Copy to your Warp Drive
cp WARP_MULTITHREADED_FRAMEWORK_RULE.md ~/WarpDrive/
```

**Option B: Direct Reference**
- Keep `WARP_MULTITHREADED_FRAMEWORK_RULE.md` handy to reference

### Step 2: Set Up New Project

**For Each New Project:**

1. **Run Masterplan Mode:**
   ```bash
   npm run masterplan-wizard
   # OR via dashboard
   npm run dashboard
   ```

2. **This Creates:**
   - `masterplan-goal.md` - Your project goal
   - `masterplan-config.json` - Project configuration
   - `.warp-masterplan/` - Project specifications folder

3. **Tell Your AI Agent:**
   ```
   Human: Follow the Warp Multithreaded Framework rule. 
   I want to start working on [describe your feature].
   ```

### Step 3: Start Development

The AI agent will now:
- ✅ Understand the framework capabilities
- ✅ Read your project goal from `masterplan-goal.md`
- ✅ Auto-create appropriate sessions (frontend/backend/testing)
- ✅ Follow project-specific tech stack and rules
- ✅ Coordinate across sessions automatically

## 🎨 Usage Examples

### Starting a New Project
```
Human: Follow the Warp Multithreaded Framework rule. I want to create 
a task management SaaS application with user authentication and real-time updates.
```

**AI Response:**
- Checks if framework is set up
- Runs Masterplan Mode to gather requirements
- Generates project-specific rules
- Sets up appropriate tech stack
- Begins development

### Working on Existing Project
```
Human: Follow the Warp Multithreaded Framework rule. 
I need to add a dashboard with data visualization.
```

**AI Response:**
- Reads current project goal from masterplan files
- Checks existing tech stack configuration
- Auto-creates frontend session
- Stays within session boundaries
- Aligns work with project specifications

## 📁 File Structure After Setup

```
~/WarpDrive/
└── WARP_MULTITHREADED_FRAMEWORK_RULE.md  # Global framework rule

your-project/
├── masterplan-goal.md                    # Live project goal
├── masterplan-config.json                # Project configuration
├── .warp-masterplan/                     # Project specifications
│   ├── masterplan.md
│   ├── tasks.json
│   └── decisions.md
└── [your project files]
```

## 🔄 Information Flow

```
WARP IDE GLOBAL RULE
├── WARP_MULTITHREADED_FRAMEWORK_RULE.md (in Warp Drive)
│   ├── Teaches framework operation
│   ├── Explains session management
│   ├── Shows setup procedures
│   └── Instructs AI to read project files
        ↓
PROJECT SPECIFICATION FILES (per project)
├── masterplan-goal.md - Current project goal
├── masterplan-config.json - Tech stack & configuration
├── .warp-masterplan/masterplan.md - Project overview
├── .warp-masterplan/decisions.md - Technical decisions
└── .warp-masterplan/tasks.json - Active tasks
```

## ⚡ Key Benefits

### Clear Separation of Concerns
- **Framework Rule**: How to use the framework (global, consistent)
- **Project Specifications**: What to build (local, project-specific)

### Reduced Confusion
- AI agents won't mix up project details
- Each project has isolated specification files
- Framework knowledge remains consistent across all projects

### Easy Maintenance
- Update framework rule once for all projects
- Project specifications auto-generate from masterplan
- No manual rule management needed

## 🔧 Troubleshooting

### AI Agent Confused About Project
**Problem**: Agent doesn't understand project context
**Solution**: Check that `masterplan-goal.md` and `.warp-masterplan/` exist

### Framework Not Working
**Problem**: Agent doesn't understand framework
**Solution**: Ensure `WARP_MULTITHREADED_FRAMEWORK_RULE.md` is in Warp Drive

### Mixed Project Context
**Problem**: Agent mixing details from different projects
**Solution**: Each project should have its own masterplan files

---

## 🎯 The Big Picture

This two-level system ensures:
1. **Framework knowledge** stays consistent across projects
2. **Project context** remains isolated and specific
3. **AI agents** get clear, non-conflicting instructions
4. **Development** stays aligned with project goals

Just follow the framework rule, run Masterplan Mode for each project, and start building! 🚀
