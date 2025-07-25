/**
 * Warp Multithreaded - Masterplan Manager
 * Persistent project intelligence and cross-session coordination
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

class MasterplanManager {
    constructor(projectRoot = process.cwd()) {
        this.projectRoot = projectRoot;
        this.masterplanDir = path.join(projectRoot, '.warp-masterplan');
        this.masterplanFile = path.join(this.masterplanDir, 'masterplan.md');
        this.tasksFile = path.join(this.masterplanDir, 'tasks.json');
        this.sessionLogFile = path.join(this.masterplanDir, 'session-log.md');
        this.decisionsFile = path.join(this.masterplanDir, 'decisions.md');
        this.contextFile = path.join(this.masterplanDir, 'context.json');
        
        this.ensureDirectories();
        this.loadContext();
    }

    ensureDirectories() {
        if (!fs.existsSync(this.masterplanDir)) {
            fs.mkdirSync(this.masterplanDir, { recursive: true });
            console.log('📋 Created .warp-masterplan directory');
        }
    }

    loadContext() {
        try {
            if (fs.existsSync(this.contextFile)) {
                this.context = JSON.parse(fs.readFileSync(this.contextFile, 'utf8'));
            } else {
                this.context = this.getDefaultContext();
                this.saveContext();
            }
        } catch (error) {
            console.warn('Failed to load masterplan context, using defaults:', error.message);
            this.context = this.getDefaultContext();
        }
    }

    getDefaultContext() {
        return {
            project_name: path.basename(this.projectRoot),
            created: new Date().toISOString(),
            last_updated: new Date().toISOString(),
            version: '1.0.0',
            status: 'initialized',
            total_sessions: 0,
            completed_tasks: 0,
            total_tasks: 0,
            key_decisions: [],
            active_sessions: [],
            project_phase: 'planning'
        };
    }

    saveContext() {
        this.context.last_updated = new Date().toISOString();
        this.writeFileAtomic(this.contextFile, JSON.stringify(this.context, null, 2));
    }

    /**
     * Atomic file write to prevent corruption during concurrent access
     */
    writeFileAtomic(filePath, content) {
        const tempFile = filePath + '.tmp.' + crypto.randomUUID().slice(0, 8);
        try {
            fs.writeFileSync(tempFile, content);
            fs.renameSync(tempFile, filePath);
        } catch (error) {
            // Clean up temp file if it exists
            if (fs.existsSync(tempFile)) {
                fs.unlinkSync(tempFile);
            }
            throw error;
        }
    }

    /**
     * Validate session name to prevent filesystem issues
     */
    sanitizeSessionName(sessionName) {
        if (!sessionName || typeof sessionName !== 'string') {
            throw new Error('Session name must be a non-empty string');
        }
        
        // Remove invalid filesystem characters
        const sanitized = sessionName.replace(/[<>:"/\\|?*]/g, '_').trim();
        
        if (sanitized.length === 0) {
            throw new Error('Session name cannot be empty after sanitization');
        }
        
        if (sanitized.length > 50) {
            throw new Error('Session name too long (max 50 characters)');
        }
        
        return sanitized;
    }

    /**
     * Validate task ID format
     */
    validateTaskId(taskId) {
        if (!taskId || typeof taskId !== 'string') {
            throw new Error('Task ID must be a non-empty string');
        }
        
        if (!/^[a-zA-Z0-9-_]+$/.test(taskId)) {
            throw new Error('Task ID can only contain letters, numbers, hyphens, and underscores');
        }
        
        return taskId;
    }

    /**
     * Initialize or update the project masterplan
     */
    initializeMasterplan(projectInfo = {}) {
        const {
            name = path.basename(this.projectRoot),
            description = '',
            goals = [],
            technologies = [],
            architecture = '',
            requirements = []
        } = projectInfo;

        const masterplanContent = this.generateMasterplanTemplate({
            name,
            description,
            goals,
            technologies,
            architecture,
            requirements
        });

        this.writeFileAtomic(this.masterplanFile, masterplanContent);
        
        // Initialize tasks if not exists
        if (!fs.existsSync(this.tasksFile)) {
            this.initializeTasks();
        }

        // Initialize session log if not exists
        if (!fs.existsSync(this.sessionLogFile)) {
            this.initializeSessionLog();
        }

        // Initialize decisions log if not exists
        if (!fs.existsSync(this.decisionsFile)) {
            this.initializeDecisions();
        }

        this.context.project_name = name;
        this.context.status = 'active';
        this.saveContext();

        console.log('✅ Masterplan initialized successfully');
        return this.getMasterplanSummary();
    }

    generateMasterplanTemplate(info) {
        const timestamp = new Date().toISOString();
        
        return `# ${info.name} - Project Masterplan

*Last Updated: ${timestamp}*

## 🎯 Project Overview

### Description
${info.description || 'Project description will be added here...'}

### Goals
${info.goals.length > 0 ? info.goals.map(goal => `- ${goal}`).join('\n') : '- Define project goals...'}

### Current Status
- **Phase**: Planning
- **Progress**: 0%
- **Last Session**: ${timestamp}

## 🏗️ Technical Architecture

### Technology Stack
${info.technologies.length > 0 ? info.technologies.map(tech => `- ${tech}`).join('\n') : '- Define technology stack...'}

### Architecture Overview
${info.architecture || 'Architecture decisions will be documented here...'}

### Requirements
${info.requirements.length > 0 ? info.requirements.map(req => `- ${req}`).join('\n') : '- Define project requirements...'}

## 📋 Current Focus Areas

### Immediate Priorities
- [ ] Complete project setup
- [ ] Define core architecture
- [ ] Implement basic functionality

### Next Steps
- [ ] Add comprehensive testing
- [ ] Optimize performance
- [ ] Prepare for deployment

## 🧠 AI Context Summary

### What's Been Built
- Project structure initialized
- Masterplan system activated

### Key Decisions Made
- Using warp-multithreaded framework for coordination
- Implementing masterplan mode for persistent memory

### Current Understanding
This is a new project being managed with the warp-multithreaded framework. The masterplan system provides persistent context across AI sessions.

## 📊 Progress Tracking

### Completion Status
- **Total Tasks**: 0
- **Completed**: 0
- **In Progress**: 0
- **Blocked**: 0

### Session History
- **Total Sessions**: 0
- **Last Session**: Never
- **Active Sessions**: 0

---

*This masterplan is automatically maintained by the warp-multithreaded framework. It provides persistent context for AI agent sessions.*`;
    }

    initializeTasks() {
        const defaultTasks = {
            meta: {
                created: new Date().toISOString(),
                last_updated: new Date().toISOString(),
                total_tasks: 0,
                completed_tasks: 0,
                auto_generated: true
            },
            tasks: [],
            completed: [],
            templates: {
                basic_setup: [
                    {
                        id: 'setup-project-structure',
                        title: 'Set up basic project structure',
                        description: 'Create directories, configuration files, and basic project layout',
                        priority: 'high',
                        estimated_time: '30 minutes',
                        tags: ['setup', 'structure']
                    },
                    {
                        id: 'configure-development-tools',
                        title: 'Configure development tools',
                        description: 'Set up linting, formatting, and development dependencies',
                        priority: 'medium',
                        estimated_time: '20 minutes',
                        tags: ['setup', 'tools']
                    }
                ]
            }
        };

        this.writeFileAtomic(this.tasksFile, JSON.stringify(defaultTasks, null, 2));
    }

    initializeSessionLog() {
        const logContent = `# Session Log - ${this.context.project_name}

*Chronological record of AI agent sessions and key discussions*

---

## Session #1 - ${new Date().toISOString().split('T')[0]}

**Time**: ${new Date().toLocaleString()}  
**Type**: Initialization  
**AI Agent**: Masterplan System  

### Summary
- Initialized masterplan mode for persistent project context
- Created project structure for cross-session coordination
- Set up task management and decision tracking

### Key Outcomes
- ✅ Masterplan system activated
- ✅ Project context established
- ✅ Ready for development sessions

### Next Session Goals
- Define specific project requirements
- Begin implementation planning
- Set up development environment

---

*New sessions will be logged automatically above this line*
`;

        this.writeFileAtomic(this.sessionLogFile, logContent);
    }

    initializeDecisions() {
        const decisionsContent = `# Technical Decisions - ${this.context.project_name}

*Record of important technical decisions and their reasoning*

---

## Decision #1 - Masterplan Mode Architecture
**Date**: ${new Date().toISOString().split('T')[0]}  
**Status**: ✅ Implemented  
**Impact**: High  

### Decision
Implement persistent masterplan system for cross-session AI coordination.

### Reasoning
- AI agents lose context between Warp sessions
- Need persistent memory for project understanding
- Enable seamless handoffs between sessions

### Alternatives Considered
- Session-only memory (rejected - not persistent)
- External documentation (rejected - not AI-readable)
- Database storage (rejected - too complex)

### Implementation
- File-based storage in .warp-masterplan/
- JSON for structured data, Markdown for human-readable content
- Integration with existing session management

---

*New decisions will be recorded above this line*
`;

        this.writeFileAtomic(this.decisionsFile, decisionsContent);
    }

    /**
     * Add a new task (AI-generated or manual)
     */
    addTask(taskInfo) {
        // Validate input
        if (!taskInfo || typeof taskInfo !== 'object') {
            throw new Error('Task info must be an object');
        }
        
        if (!taskInfo.title || typeof taskInfo.title !== 'string') {
            throw new Error('Task must have a valid title');
        }
        
        if (taskInfo.priority && !['low', 'medium', 'high', 'critical'].includes(taskInfo.priority)) {
            throw new Error('Task priority must be one of: low, medium, high, critical');
        }
        
        const tasks = this.getTasks();
        const taskId = taskInfo.id || crypto.randomUUID();
        
        // Validate task ID if provided
        this.validateTaskId(taskId);
        
        // Check for duplicate task ID
        if (tasks.tasks.some(t => t.id === taskId) || tasks.completed.some(t => t.id === taskId)) {
            throw new Error(`Task with ID '${taskId}' already exists`);
        }
        
        const task = {
            id: taskId,
            title: taskInfo.title.trim(),
            description: (taskInfo.description || '').trim(),
            priority: taskInfo.priority || 'medium',
            status: 'pending',
            created: new Date().toISOString(),
            estimated_time: taskInfo.estimated_time || 'unknown',
            tags: Array.isArray(taskInfo.tags) ? taskInfo.tags : [],
            assigned_session: taskInfo.assigned_session || null,
            dependencies: Array.isArray(taskInfo.dependencies) ? taskInfo.dependencies : [],
            generated_by: taskInfo.generated_by || 'manual'
        };

        tasks.tasks.push(task);
        tasks.meta.total_tasks = tasks.tasks.length;
        tasks.meta.last_updated = new Date().toISOString();

        this.writeFileAtomic(this.tasksFile, JSON.stringify(tasks, null, 2));
        
        this.context.total_tasks = tasks.meta.total_tasks;
        this.saveContext();

        console.log(`✅ Task added: ${task.title}`);
        return task;
    }

    /**
     * Mark task as completed
     */
    completeTask(taskId, completionInfo = {}) {
        // Validate inputs
        this.validateTaskId(taskId);
        
        if (completionInfo && typeof completionInfo !== 'object') {
            throw new Error('Completion info must be an object');
        }
        
        const tasks = this.getTasks();
        const taskIndex = tasks.tasks.findIndex(t => t.id === taskId);
        
        if (taskIndex === -1) {
            throw new Error(`Task with ID '${taskId}' not found`);
        }

        const task = tasks.tasks[taskIndex];
        task.status = 'completed';
        task.completed = new Date().toISOString();
        task.completion_notes = completionInfo.notes || '';
        task.completed_by = completionInfo.session || 'unknown';

        // Move to completed array
        tasks.completed.push(task);
        tasks.tasks.splice(taskIndex, 1);

        tasks.meta.completed_tasks = tasks.completed.length;
        tasks.meta.total_tasks = tasks.tasks.length;
        tasks.meta.last_updated = new Date().toISOString();

        this.writeFileAtomic(this.tasksFile, JSON.stringify(tasks, null, 2));
        
        this.context.completed_tasks = tasks.meta.completed_tasks;
        this.context.total_tasks = tasks.meta.total_tasks;
        this.saveContext();

        // Log the completion
        this.logTaskCompletion(task, completionInfo);

        console.log(`✅ Task completed: ${task.title}`);
        return task;
    }

    /**
     * Generate AI tasks based on project analysis
     */
    generateAITasks(analysisContext = {}) {
        const {
            codebase_analysis = {},
            user_requests = [],
            project_phase = 'development',
            current_focus = []
        } = analysisContext;

        const generatedTasks = [];

        // Basic project setup tasks
        if (project_phase === 'planning' || project_phase === 'setup') {
            generatedTasks.push(
                {
                    title: 'Define project requirements',
                    description: 'Clearly define functional and non-functional requirements',
                    priority: 'high',
                    estimated_time: '1 hour',
                    tags: ['planning', 'requirements'],
                    generated_by: 'ai_analysis'
                },
                {
                    title: 'Create project architecture diagram',
                    description: 'Design and document the overall system architecture',
                    priority: 'high',
                    estimated_time: '45 minutes',
                    tags: ['architecture', 'documentation'],
                    generated_by: 'ai_analysis'
                }
            );
        }

        // Add each generated task
        generatedTasks.forEach(taskInfo => {
            this.addTask(taskInfo);
        });

        console.log(`🤖 Generated ${generatedTasks.length} AI tasks`);
        return generatedTasks;
    }

    /**
     * Log a new session
     */
    logSession(sessionInfo) {
        const {
            session_id,
            session_name,
            summary,
            key_outcomes = [],
            decisions = [],
            next_goals = [],
            duration = 'unknown'
        } = sessionInfo;

        const sessionEntry = `
## Session #${this.context.total_sessions + 1} - ${new Date().toISOString().split('T')[0]}

**Time**: ${new Date().toLocaleString()}  
**Duration**: ${duration}  
**Session**: ${session_name || session_id || 'Unknown'}  
**Type**: Development  

### Summary
${summary || 'Session summary not provided'}

### Key Outcomes
${key_outcomes.length > 0 ? key_outcomes.map(outcome => `- ✅ ${outcome}`).join('\n') : '- No outcomes recorded'}

### Decisions Made
${decisions.length > 0 ? decisions.map(decision => `- 📋 ${decision}`).join('\n') : '- No decisions recorded'}

### Next Session Goals
${next_goals.length > 0 ? next_goals.map(goal => `- 🎯 ${goal}`).join('\n') : '- Goals to be defined'}

---
`;

        // Prepend to session log (newest first)
        let logContent = fs.readFileSync(this.sessionLogFile, 'utf8');
        const headerEnd = logContent.indexOf('---\n') + 4;
        const newContent = logContent.slice(0, headerEnd) + sessionEntry + logContent.slice(headerEnd);
        
        this.writeFileAtomic(this.sessionLogFile, newContent);

        this.context.total_sessions += 1;
        this.saveContext();

        console.log(`📝 Session logged: ${session_name || session_id}`);
    }

    logTaskCompletion(task, completionInfo) {
        const completionEntry = `
### Task Completed: ${task.title}
**Time**: ${new Date().toLocaleString()}  
**Completed by**: ${completionInfo.session || 'Unknown'}  
**Notes**: ${completionInfo.notes || 'No additional notes'}  
`;

        // Add to current session in log
        let logContent = fs.readFileSync(this.sessionLogFile, 'utf8');
        const firstSessionEnd = logContent.indexOf('\n---\n');
        if (firstSessionEnd !== -1) {
            const newContent = logContent.slice(0, firstSessionEnd) + completionEntry + logContent.slice(firstSessionEnd);
            this.writeFileAtomic(this.sessionLogFile, newContent);
        }
    }

    /**
     * Get tasks data
     */
    getTasks() {
        try {
            return JSON.parse(fs.readFileSync(this.tasksFile, 'utf8'));
        } catch (error) {
            console.warn('Failed to load tasks, reinitializing:', error.message);
            this.initializeTasks();
            return JSON.parse(fs.readFileSync(this.tasksFile, 'utf8'));
        }
    }

    /**
     * Get masterplan summary for AI context
     */
    getMasterplanSummary() {
        const tasks = this.getTasks();
        
        return {
            project: {
                name: this.context.project_name,
                status: this.context.status,
                phase: this.context.project_phase,
                last_updated: this.context.last_updated
            },
            progress: {
                total_sessions: this.context.total_sessions,
                total_tasks: tasks.meta.total_tasks,
                completed_tasks: tasks.meta.completed_tasks,
                completion_rate: tasks.meta.total_tasks > 0 ? 
                    Math.round((tasks.meta.completed_tasks / (tasks.meta.total_tasks + tasks.meta.completed_tasks)) * 100) : 0
            },
            current_tasks: tasks.tasks.slice(0, 5), // Top 5 pending tasks
            recent_completions: tasks.completed.slice(-3), // Last 3 completed
            files: {
                masterplan: this.masterplanFile,
                tasks: this.tasksFile,
                session_log: this.sessionLogFile,
                decisions: this.decisionsFile,
                context: this.contextFile
            }
        };
    }

    /**
     * Generate context for new AI session
     */
    generateSessionContext(sessionName = 'unknown') {
        const summary = this.getMasterplanSummary();
        const tasks = this.getTasks();
        
        // Read key content
        let masterplanContent = '';
        let recentLog = '';
        
        try {
            masterplanContent = fs.readFileSync(this.masterplanFile, 'utf8');
            recentLog = fs.readFileSync(this.sessionLogFile, 'utf8').split('---')[0]; // Get most recent session
        } catch (error) {
            console.warn('Could not read masterplan files:', error.message);
        }

        return {
            session_context: `
# 🧠 AI SESSION CONTEXT - ${this.context.project_name}

## 📋 PROJECT STATUS
- **Name**: ${summary.project.name}
- **Phase**: ${summary.project.phase}
- **Progress**: ${summary.progress.completion_rate}% complete
- **Total Sessions**: ${summary.progress.total_sessions}
- **Last Updated**: ${summary.project.last_updated}

## 🎯 CURRENT TASKS (Priority Focus)
${tasks.tasks.slice(0, 3).map(task => 
    `- **${task.title}** (${task.priority})\n  ${task.description}`
).join('\n\n')}

## ✅ RECENT COMPLETIONS
${tasks.completed.slice(-2).map(task => 
    `- ✅ ${task.title} (completed ${task.completed?.split('T')[0]})`
).join('\n')}

## 📝 RECENT SESSION SUMMARY
${recentLog.slice(0, 500)}...

## 🗂️ AVAILABLE FILES
- Masterplan: ${this.masterplanFile}
- Tasks: ${this.tasksFile}  
- Session Log: ${this.sessionLogFile}
- Decisions: ${this.decisionsFile}

---
*This context is automatically generated for AI session continuity*
            `,
            summary,
            masterplan_excerpt: masterplanContent.slice(0, 1000),
            pending_tasks: tasks.tasks,
            completed_tasks: tasks.completed.slice(-5)
        };
    }

    /**
     * Update masterplan with new information
     */
    updateMasterplan(updates = {}) {
        const {
            description,
            goals,
            technologies,
            architecture,
            requirements,
            status,
            phase
        } = updates;

        let content = fs.readFileSync(this.masterplanFile, 'utf8');
        
        // Update timestamp
        content = content.replace(/\*Last Updated: .*?\*/, `*Last Updated: ${new Date().toISOString()}*`);
        
        // Update specific sections if provided
        if (description) {
            content = content.replace(
                /(### Description\n).*?(\n\n### )/s, 
                `$1${description}$2`
            );
        }
        
        if (status) {
            this.context.status = status;
            this.saveContext();
        }
        
        if (phase) {
            this.context.project_phase = phase;
            this.saveContext();
        }

        this.writeFileAtomic(this.masterplanFile, content);
        console.log('📝 Masterplan updated');
    }

    /**
     * Check if masterplan exists
     */
    exists() {
        return fs.existsSync(this.masterplanFile) && 
               fs.existsSync(this.tasksFile) && 
               fs.existsSync(this.contextFile);
    }

    /**
     * Get full masterplan status for dashboard
     */
    getStatus() {
        if (!this.exists()) {
            return {
                initialized: false,
                message: 'Masterplan not initialized'
            };
        }

        const summary = this.getMasterplanSummary();
        const tasks = this.getTasks();
        
        return {
            initialized: true,
            project: summary.project,
            progress: summary.progress,
            tasks: {
                pending: tasks.tasks.length,
                completed: tasks.completed.length,
                total: tasks.tasks.length + tasks.completed.length
            },
            files_exist: {
                masterplan: fs.existsSync(this.masterplanFile),
                tasks: fs.existsSync(this.tasksFile),
                session_log: fs.existsSync(this.sessionLogFile),
                decisions: fs.existsSync(this.decisionsFile)
            },
            last_updated: this.context.last_updated,
            total_sessions: this.context.total_sessions
        };
    }
}

module.exports = MasterplanManager;
