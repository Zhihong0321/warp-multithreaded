#!/usr/bin/env node

/**
 * Warp AI Agent Framework - CLI Coordinator
 * Command-line tool for managing multiple Warp AI Agent sessions
 */

const SessionManager = require('../core/session-manager');
const MasterplanManager = require('../core/masterplan-manager');
const fs = require('fs');
const path = require('path');

class WarpCoordinator {
    constructor() {
        this.sessionManager = new SessionManager();
        this.args = process.argv.slice(2);
    }

    run() {
        if (this.args.length === 0) {
            this.showHelp();
            return;
        }

        const command = this.args[0];
        const subcommand = this.args[1];

        try {
            switch (command) {
                case 'init':
                    this.initProject();
                    break;
                case 'session':
                    this.handleSessionCommand(subcommand);
                    break;
                case 'status':
                    this.showStatus();
                    break;
                case 'conflicts':
                    this.checkConflicts();
                    break;
                case 'suggest':
                    this.suggestTasks();
                    break;
                case 'dashboard':
                    this.startDashboard();
                    break;
                case 'masterplan':
                    this.handleMasterplanCommand(subcommand);
                    break;
                case 'context':
                    this.showContext();
                    break;
                case 'validate':
                    await this.runValidation();
                    break;
                case 'debug':
                    this.handleDebugCommand(subcommand);
                    break;
                case 'help':
                    this.showHelp();
                    break;
                default:
                    console.error(`Unknown command: ${command}`);
                    this.showHelp();
            }
        } catch (error) {
            console.error('❌ Error:', error.message);
            process.exit(1);
        }
    }

    initProject() {
        const projectType = this.getArg('--project-type') || 'web-app';
        const templates = {
            'web-app': {
                project_type: 'web-app',
                sessions: {
                    frontend: {
                        focus: ['ui', 'components', 'styling'],
                        directories: ['src/components', 'src/styles', 'public'],
                        file_patterns: ['*.tsx', '*.jsx', '*.css', '*.scss', '*.html']
                    },
                    backend: {
                        focus: ['api', 'database', 'auth', 'server'],
                        directories: ['src/api', 'src/models', 'src/middleware', 'server'],
                        file_patterns: ['*.js', '*.ts', '*.sql', '*.json']
                    },
                    testing: {
                        focus: ['tests', 'quality', 'e2e'],
                        directories: ['tests', 'cypress', '__tests__'],
                        file_patterns: ['*.test.js', '*.spec.js', '*.cy.js']
                    }
                }
            },
            'api-project': {
                project_type: 'api-project',
                sessions: {
                    endpoints: {
                        focus: ['routes', 'controllers', 'api'],
                        directories: ['src/routes', 'src/controllers'],
                        file_patterns: ['*.js', '*.ts']
                    },
                    database: {
                        focus: ['models', 'migrations', 'seeds'],
                        directories: ['src/models', 'migrations', 'seeds'],
                        file_patterns: ['*.js', '*.ts', '*.sql']
                    },
                    middleware: {
                        focus: ['auth', 'validation', 'middleware'],
                        directories: ['src/middleware', 'src/auth'],
                        file_patterns: ['*.js', '*.ts']
                    }
                }
            }
        };

        const config = templates[projectType] || templates['web-app'];
        
        // Create .warp-config.json
        const configPath = path.join(process.cwd(), '.warp-config.json');
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        // Create coordination file
        const coordPath = path.join(process.cwd(), '.warp-coordination.md');
        const coordContent = this.generateCoordinationTemplate(config);
        fs.writeFileSync(coordPath, coordContent);

        console.log(`✅ Initialized Warp AI Agent Framework for ${projectType}`);
        console.log(`📝 Configuration saved to: .warp-config.json`);
        console.log(`📋 Coordination file created: .warp-coordination.md`);
        console.log(`\n🚀 Next steps:`);
        console.log(`   1. warp-agent session create --name=frontend`);
        console.log(`   2. warp-agent session create --name=backend`);
        console.log(`   3. warp-agent status`);
    }

    handleSessionCommand(subcommand) {
        switch (subcommand) {
            case 'create':
                this.createSession();
                break;
            case 'list':
                this.listSessions();
                break;
            case 'close':
                this.closeSession();
                break;
            case 'info':
                this.sessionInfo();
                break;
            default:
                console.error(`Unknown session subcommand: ${subcommand}`);
                this.showSessionHelp();
        }
    }

    createSession() {
        const name = this.getArg('--name');
        if (!name) {
            console.error('❌ Session name is required. Use --name=<session-name>');
            return;
        }

        const focus = this.getArg('--focus');
        const directories = this.getArg('--directories');
        const patterns = this.getArg('--patterns');

        const options = {};
        if (focus) options.focus = focus.split(',');
        if (directories) options.directories = directories.split(',');
        if (patterns) options.file_patterns = patterns.split(',');

        const session = this.sessionManager.createSession(name, options);
        console.log(`🎯 Focus areas: ${session.focus.join(', ')}`);
        console.log(`📁 Directories: ${session.directories.join(', ') || 'All'}`);
        console.log(`\n💡 To start working:`);
        console.log(`   Tell your Warp AI Agent: "I'm working in session '${name}' on ${session.focus.join(' and ')} tasks"`);
    }

    listSessions() {
        const sessions = this.sessionManager.getActiveSessions();
        
        if (sessions.length === 0) {
            console.log('📭 No active sessions found');
            return;
        }

        console.log(`\n🔄 Active Sessions (${sessions.length}):\n`);
        
        sessions.forEach(session => {
            const lastActive = new Date(session.last_active).toLocaleString();
            console.log(`📋 ${session.name}`);
            console.log(`   🎯 Focus: ${session.focus.join(', ')}`);
            console.log(`   📁 Active files: ${session.active_files.length}`);
            console.log(`   ⏰ Last active: ${lastActive}`);
            if (session.current_task) {
                console.log(`   🚀 Current task: ${session.current_task}`);
            }
            console.log('');
        });
    }

    closeSession() {
        const name = this.getArg('--name');
        if (!name) {
            console.error('❌ Session name is required. Use --name=<session-name>');
            return;
        }

        this.sessionManager.closeSession(name);
    }

    sessionInfo() {
        const name = this.getArg('--name');
        if (!name) {
            console.error('❌ Session name is required. Use --name=<session-name>');
            return;
        }

        const session = this.sessionManager.getSession(name);
        if (!session) {
            console.error(`❌ Session '${name}' not found`);
            return;
        }

        console.log(`\n📋 Session: ${session.name}`);
        console.log(`🆔 ID: ${session.id}`);
        console.log(`📅 Created: ${new Date(session.created).toLocaleString()}`);
        console.log(`⏰ Last active: ${new Date(session.last_active).toLocaleString()}`);
        console.log(`🎯 Focus: ${session.focus.join(', ')}`);
        console.log(`📁 Directories: ${session.directories.join(', ') || 'All'}`);
        console.log(`📄 File patterns: ${session.file_patterns.join(', ')}`);
        console.log(`🔒 Active files: ${session.active_files.length}`);
        
        if (session.active_files.length > 0) {
            console.log(`   ${session.active_files.join('\\n   ')}`);
        }
        
        if (session.current_task) {
            console.log(`🚀 Current task: ${session.current_task}`);
        }
    }

    showStatus() {
        const overview = this.sessionManager.getStatusOverview();
        
        console.log(`\n📊 Warp AI Agent Framework Status\n`);
        console.log(`🔄 Active sessions: ${overview.active_sessions}`);
        console.log(`⚠️  Conflicts: ${overview.conflicts}`);
        
        if (overview.sessions.length > 0) {
            console.log(`\n📋 Session Overview:`);
            overview.sessions.forEach(session => {
                const status = session.active_files > 0 ? '🟢 Working' : '🟡 Idle';
                console.log(`   ${status} ${session.name} (${session.focus.join(', ')}) - ${session.active_files} files`);
            });
        }

        if (overview.conflicts.length > 0) {
            console.log(`\n⚠️  File Conflicts:`);
            overview.conflicts.forEach(conflict => {
                console.log(`   📄 ${conflict.file}`);
                console.log(`      Sessions: ${conflict.sessions.join(', ')}`);
            });
        }

        console.log(`\n💡 Quick actions:`);
        console.log(`   warp-agent session list    # View all sessions`);
        console.log(`   warp-agent conflicts       # Check for conflicts`);
        console.log(`   warp-agent suggest         # Get task suggestions`);
    }

    checkConflicts() {
        const conflicts = this.sessionManager.checkConflicts();
        
        if (conflicts.length === 0) {
            console.log('✅ No conflicts detected');
            return;
        }

        console.log(`⚠️  Found ${conflicts.length} conflict(s):\n`);
        
        conflicts.forEach((conflict, index) => {
            console.log(`${index + 1}. 📄 ${conflict.file}`);
            console.log(`   Sessions: ${conflict.sessions.join(', ')}`);
            console.log(`   Type: ${conflict.type}`);
            console.log('');
        });

        console.log('💡 Recommendations:');
        console.log('   - Coordinate with other sessions before editing shared files');
        console.log('   - Use git to manage conflicts if they occur');
        console.log('   - Consider splitting work into separate files');
    }

    suggestTasks() {
        const tasksArg = this.getArg('--tasks');
        if (!tasksArg) {
            console.log('💡 Task suggestion examples:');
            console.log('   warp-agent suggest --tasks="fix login bug,add navbar,write tests"');
            return;
        }

        const tasks = tasksArg.split(',').map(t => t.trim());
        const suggestions = this.sessionManager.suggestTaskDistribution(tasks);
        
        console.log('🎯 Task Distribution Suggestions:\n');
        
        suggestions.forEach((suggestion, index) => {
            console.log(`${index + 1}. "${suggestion.task}"`);
            console.log(`   👉 Recommended: ${suggestion.recommended_session}`);
            console.log(`   📝 Reason: ${suggestion.reason}`);
            console.log('');
        });
    }

    startDashboard() {
        const port = this.getArg('--port') || 3000;
        const projectRoot = this.getArg('--project') || process.cwd();
        
        console.log('🚀 Starting Warp Multithreaded Dashboard...');
        console.log(`📁 Project: ${projectRoot}`);
        console.log(`🌐 Port: ${port}`);
        
        try {
            const DashboardServer = require('../dashboard/server');
            const dashboard = new DashboardServer(port, projectRoot);
            dashboard.start();
        } catch (error) {
            console.error('❌ Failed to start dashboard:', error.message);
            console.log('\n💡 Make sure to install dependencies first:');
            console.log('   npm install');
            process.exit(1);
        }
    }

    generateCoordinationTemplate(config) {
        const sessions = Object.keys(config.sessions);
        
        return `# Warp AI Agent Framework - Project Coordination

## 🎯 Project Type: ${config.project_type}

## 📋 Available Sessions
${sessions.map(name => `- **${name}**: ${config.sessions[name].focus.join(', ')}`).join('\\n')}

## 🔄 Current Status
\`\`\`
${sessions.map(name => `${name.toUpperCase().padEnd(10)} | Available | Next: [Add your next task]`).join('\\n')}
\`\`\`

## 🚀 Quick Start Commands
\`\`\`bash
# Create sessions
${sessions.map(name => `warp-agent session create --name=${name}`).join('\\n')}

# Check status
warp-agent status

# View conflicts
warp-agent conflicts
\`\`\`

## 📝 Session Guidelines

### Best Practices
1. **Announce your work**: Update this file when starting a new task
2. **Check conflicts**: Run \`warp-agent conflicts\` before editing shared files
3. **Coordinate changes**: Communicate with other sessions about major changes
4. **Use git**: Commit frequently and pull before starting new work

### Task Ideas by Session
${sessions.map(name => {
    const session = config.sessions[name];
    return `#### ${name.charAt(0).toUpperCase() + name.slice(1)} Session
- Focus: ${session.focus.join(', ')}
- Files: ${session.file_patterns.join(', ')}
- Directories: ${session.directories.join(', ')}`;
}).join('\\n\\n')}

---
*Auto-generated by Warp AI Agent Framework*
*Last updated: ${new Date().toISOString()}*`;
    }

    // Masterplan Management Commands
    handleMasterplanCommand(subcommand) {
        const masterplan = new MasterplanManager();
        
        switch (subcommand) {
            case 'init':
                this.initMasterplan(masterplan);
                break;
            case 'status':
                this.showMasterplanStatus(masterplan);
                break;
            case 'tasks':
                this.showTasks(masterplan);
                break;
            case 'add-task':
                this.addTask(masterplan);
                break;
            case 'complete-task':
                this.completeTask(masterplan);
                break;
            case 'generate-tasks':
                this.generateTasks(masterplan);
                break;
            case 'log-session':
                this.logSession(masterplan);
                break;
            default:
                console.error(`Unknown masterplan subcommand: ${subcommand}`);
                this.showMasterplanHelp();
        }
    }

    initMasterplan(masterplan) {
        const name = this.getArg('--name') || path.basename(process.cwd());
        const description = this.getArg('--description') || '';
        const goals = this.getArg('--goals') ? this.getArg('--goals').split(',').map(g => g.trim()) : [];
        const technologies = this.getArg('--technologies') ? this.getArg('--technologies').split(',').map(t => t.trim()) : [];
        const architecture = this.getArg('--architecture') || '';
        const requirements = this.getArg('--requirements') ? this.getArg('--requirements').split(',').map(r => r.trim()) : [];

        console.log('🧠 Initializing Masterplan Mode...');
        
        const summary = masterplan.initializeMasterplan({
            name,
            description,
            goals,
            technologies,
            architecture,
            requirements
        });

        console.log('\n📋 Masterplan Summary:');
        console.log(`   📁 Project: ${summary.project.name}`);
        console.log(`   📊 Status: ${summary.project.status}`);
        console.log(`   🎯 Phase: ${summary.project.phase}`);
        console.log(`   📝 Files created:`);
        Object.entries(summary.files).forEach(([type, file]) => {
            console.log(`      ${type}: ${file}`);
        });
        
        console.log('\n🚀 Next steps:');
        console.log('   1. node coordinator.js masterplan tasks     # View current tasks');
        console.log('   2. node coordinator.js masterplan add-task --title="Your task"');
        console.log('   3. node coordinator.js context              # Get AI session context');
    }

    showMasterplanStatus(masterplan) {
        const status = masterplan.getStatus();
        
        if (!status.initialized) {
            console.log('❌ Masterplan not initialized');
            console.log('\n💡 Run: node coordinator.js masterplan init');
            return;
        }

        console.log('\n🧠 Masterplan Status\n');
        console.log(`📁 Project: ${status.project.name}`);
        console.log(`📊 Status: ${status.project.status}`);
        console.log(`🎯 Phase: ${status.project.phase}`);
        console.log(`📈 Progress: ${status.progress.completion_rate}%`);
        console.log(`🔄 Sessions: ${status.total_sessions}`);
        console.log(`⏰ Last Updated: ${new Date(status.last_updated).toLocaleString()}`);
        
        console.log('\n📋 Tasks Overview:');
        console.log(`   📝 Pending: ${status.tasks.pending}`);
        console.log(`   ✅ Completed: ${status.tasks.completed}`);
        console.log(`   📊 Total: ${status.tasks.total}`);
        
        console.log('\n🗂️ Files Status:');
        Object.entries(status.files_exist).forEach(([type, exists]) => {
            const status = exists ? '✅' : '❌';
            console.log(`   ${status} ${type}`);
        });
    }

    showTasks(masterplan) {
        const tasks = masterplan.getTasks();
        
        console.log('\n📋 Project Tasks\n');
        
        if (tasks.tasks.length === 0) {
            console.log('📭 No pending tasks');
            console.log('\n💡 Generate tasks: node coordinator.js masterplan generate-tasks');
            console.log('💡 Add task: node coordinator.js masterplan add-task --title="Task title"');
        } else {
            console.log(`📝 Pending Tasks (${tasks.tasks.length}):\n`);
            tasks.tasks.forEach((task, index) => {
                console.log(`${index + 1}. **${task.title}** (${task.priority})`);
                console.log(`   📝 ${task.description}`);
                console.log(`   ⏱️  ${task.estimated_time}`);
                console.log(`   🏷️  ${task.tags.join(', ')}`);
                console.log(`   🆔 ID: ${task.id}`);
                console.log('');
            });
        }
        
        if (tasks.completed.length > 0) {
            console.log(`✅ Recently Completed (${Math.min(tasks.completed.length, 3)}):`);
            tasks.completed.slice(-3).forEach(task => {
                console.log(`   ✅ ${task.title} (${task.completed?.split('T')[0]})`);
            });
            console.log('');
        }
    }

    addTask(masterplan) {
        const title = this.getArg('--title');
        if (!title) {
            console.error('❌ Task title is required. Use --title="Task title"');
            return;
        }

        const description = this.getArg('--description') || '';
        const priority = this.getArg('--priority') || 'medium';
        const estimatedTime = this.getArg('--time') || 'unknown';
        const tags = this.getArg('--tags') ? this.getArg('--tags').split(',').map(t => t.trim()) : [];
        const session = this.getArg('--session') || null;

        const task = masterplan.addTask({
            title,
            description,
            priority,
            estimated_time: estimatedTime,
            tags,
            assigned_session: session,
            generated_by: 'manual'
        });

        console.log(`✅ Task added: ${task.title}`);
        console.log(`🆔 Task ID: ${task.id}`);
    }

    completeTask(masterplan) {
        const taskId = this.getArg('--id');
        if (!taskId) {
            console.error('❌ Task ID is required. Use --id=task-id');
            console.log('\n💡 View tasks with IDs: node coordinator.js masterplan tasks');
            return;
        }

        const notes = this.getArg('--notes') || '';
        const session = this.getArg('--session') || 'unknown';

        try {
            const task = masterplan.completeTask(taskId, { notes, session });
            console.log(`✅ Task completed: ${task.title}`);
            console.log(`📝 Notes: ${notes || 'No additional notes'}`);
        } catch (error) {
            console.error(`❌ ${error.message}`);
        }
    }

    generateTasks(masterplan) {
        const phase = this.getArg('--phase') || 'development';
        const focus = this.getArg('--focus') ? this.getArg('--focus').split(',').map(f => f.trim()) : [];
        
        console.log('🤖 Generating AI tasks...');
        
        const tasks = masterplan.generateAITasks({
            project_phase: phase,
            current_focus: focus
        });

        console.log(`✅ Generated ${tasks.length} tasks`);
        tasks.forEach(task => {
            console.log(`   📝 ${task.title} (${task.priority})`);
        });
    }

    logSession(masterplan) {
        const sessionName = this.getArg('--session') || 'unknown';
        const summary = this.getArg('--summary') || 'Session summary not provided';
        const outcomes = this.getArg('--outcomes') ? this.getArg('--outcomes').split(',').map(o => o.trim()) : [];
        const decisions = this.getArg('--decisions') ? this.getArg('--decisions').split(',').map(d => d.trim()) : [];
        const nextGoals = this.getArg('--next-goals') ? this.getArg('--next-goals').split(',').map(g => g.trim()) : [];
        const duration = this.getArg('--duration') || 'unknown';

        masterplan.logSession({
            session_name: sessionName,
            summary,
            key_outcomes: outcomes,
            decisions,
            next_goals: nextGoals,
            duration
        });

        console.log(`📝 Session logged: ${sessionName}`);
    }

    async runValidation() {
        console.log('🔍 Running system validation...');
        try {
            const SystemValidator = require('./validate-system');
            const validator = new SystemValidator();
            await validator.runValidation();
        } catch (error) {
            console.error('❌ Validation failed:', error.message);
            process.exit(1);
        }
    }

    handleDebugCommand(subcommand) {
        switch (subcommand) {
            case 'files':
                this.debugFiles();
                break;
            case 'sessions':
                this.debugSessions();
                break;
            case 'masterplan':
                this.debugMasterplan();
                break;
            default:
                console.log('Debug commands: files, sessions, masterplan');
        }
    }

    debugFiles() {
        console.log('🗂️ Checking file system state...');
        const fs = require('fs');
        
        const checkDir = (dirPath, name) => {
            if (fs.existsSync(dirPath)) {
                const files = fs.readdirSync(dirPath);
                console.log(`  ${name}: ${files.length} files`);
                files.forEach(file => console.log(`    - ${file}`));
            } else {
                console.log(`  ${name}: Directory does not exist`);
            }
        };
        
        checkDir('.warp-sessions', 'Sessions');
        checkDir('.warp-masterplan', 'Masterplan');
        
        // Check config files
        const configFiles = ['.warp-config.json', '.warp-coordination.md'];
        console.log('\n  Config Files:');
        configFiles.forEach(file => {
            const exists = fs.existsSync(file) ? '✅' : '❌';
            console.log(`    ${exists} ${file}`);
        });
    }

    debugSessions() {
        console.log('🔍 Active session details...');
        const sessions = this.sessionManager.getActiveSessions();
        
        if (sessions.length === 0) {
            console.log('  No active sessions found');
            return;
        }
        
        sessions.forEach(session => {
            console.log(`\n  Session: ${session.name}`);
            console.log(`    ID: ${session.id}`);
            console.log(`    Status: ${session.status}`);
            console.log(`    Focus: ${session.focus.join(', ')}`);
            console.log(`    Active files: ${session.active_files.length}`);
            console.log(`    Last active: ${session.last_active}`);
            if (session.active_files.length > 0) {
                console.log(`    Files:`);
                session.active_files.forEach(file => console.log(`      - ${file}`));
            }
        });
    }

    debugMasterplan() {
        console.log('📋 Masterplan state...');
        const masterplan = new MasterplanManager();
        
        if (!masterplan.exists()) {
            console.log('  Masterplan not initialized');
            return;
        }
        
        const status = masterplan.getStatus();
        console.log('  Status:', JSON.stringify(status, null, 2));
        
        const tasks = masterplan.getTasks();
        console.log(`\n  Tasks: ${tasks.tasks.length} pending, ${tasks.completed.length} completed`);
        
        console.log('\n  Recent tasks:');
        tasks.tasks.slice(0, 3).forEach(task => {
            console.log(`    - ${task.title} (${task.priority})`);
        });
    }

    showContext() {
        const masterplan = new MasterplanManager();
        
        if (!masterplan.exists()) {
            console.log('❌ Masterplan not initialized');
            console.log('\n💡 Run: node coordinator.js masterplan init');
            return;
        }

        const sessionName = this.getArg('--session') || 'ai-agent';
        const context = masterplan.generateSessionContext(sessionName);
        
        console.log('\n🧠 AI Session Context\n');
        console.log(context.session_context);
        
        // Optionally save to file for easy copy-paste
        const saveFile = this.getArg('--save');
        if (saveFile) {
            fs.writeFileSync(saveFile, context.session_context);
            console.log(`\n💾 Context saved to: ${saveFile}`);
        }
    }

    showMasterplanHelp() {
        console.log(`
Masterplan Management Commands:

  init                           Initialize masterplan for project
    --name=<name>                Project name
    --description=<desc>         Project description
    --goals=<goals>              Comma-separated goals
    --technologies=<techs>       Comma-separated technologies
    --architecture=<arch>        Architecture description
    --requirements=<reqs>        Comma-separated requirements

  status                         Show masterplan status
  tasks                          List all tasks
  
  add-task                       Add a new task
    --title=<title>              Task title (required)
    --description=<desc>         Task description
    --priority=<priority>        Priority: low, medium, high
    --time=<estimate>            Time estimate
    --tags=<tags>                Comma-separated tags
    --session=<session>          Assigned session
  
  complete-task                  Mark task as completed
    --id=<task-id>               Task ID (required)
    --notes=<notes>              Completion notes
    --session=<session>          Completing session
  
  generate-tasks                 Generate AI tasks
    --phase=<phase>              Project phase
    --focus=<areas>              Focus areas
  
  log-session                    Log session activity
    --session=<name>             Session name
    --summary=<summary>          Session summary
    --outcomes=<outcomes>        Key outcomes
    --decisions=<decisions>      Decisions made
    --next-goals=<goals>         Next session goals
    --duration=<time>            Session duration

Examples:
  node coordinator.js masterplan init --name="My Project" --description="A web app"
  node coordinator.js masterplan add-task --title="Fix navbar" --priority=high
  node coordinator.js masterplan complete-task --id=task-123 --notes="Fixed styling"
  node coordinator.js context --session=frontend --save=context.md
        `);
    }

    getArg(argName) {
        const arg = this.args.find(a => a.startsWith(argName));
        return arg ? arg.split('=')[1] : null;
    }

    showHelp() {
        console.log(`
🤖 Warp AI Agent Framework - CLI Coordinator

USAGE:
  node coordinator.js <command> [options]

COMMANDS:
  init                           Initialize framework in current project
    --project-type=<type>        Project type: web-app, api-project (default: web-app)

  session create                 Create a new session
    --name=<name>                Session name (required)
    --focus=<areas>              Focus areas (comma-separated)
    --directories=<dirs>         Target directories (comma-separated)
    --patterns=<patterns>        File patterns (comma-separated)

  session list                   List all active sessions
  session close --name=<name>    Close a session
  session info --name=<name>     Show session details

  status                         Show framework status overview
  conflicts                      Check for file conflicts
  suggest --tasks=<tasks>        Get task distribution suggestions
  dashboard                      Start web dashboard server
    --port=<port>               Dashboard port (default: 3000)
    --project=<path>            Project path (default: current directory)

  masterplan <subcommand>        Manage project masterplan (see masterplan help)
  context                        Show AI session context
    --session=<name>            Session name
    --save=<file>               Save context to file

  validate                       Run system validation tests
  debug <command>                Debug system state (files, sessions, masterplan)

  help                           Show this help message

EXAMPLES:
  node coordinator.js init --project-type=web-app
  node coordinator.js session create --name=frontend --focus=ui,components
  node coordinator.js session list
  node coordinator.js status
  node coordinator.js suggest --tasks="fix navbar,add auth,write tests"

For more information, visit: https://github.com/yourusername/warp-agent-framework
        `);
    }

    showSessionHelp() {
        console.log(`
Session Management Commands:

  create --name=<name>           Create a new session
  list                           List all active sessions  
  close --name=<name>            Close a session
  info --name=<name>             Show session details

Examples:
  node coordinator.js session create --name=frontend
  node coordinator.js session list
  node coordinator.js session close --name=frontend
        `);
    }
}

// Run the coordinator
if (require.main === module) {
    const coordinator = new WarpCoordinator();
    coordinator.run();
}

module.exports = WarpCoordinator;
