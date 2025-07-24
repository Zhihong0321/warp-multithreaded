#!/usr/bin/env node

/**
 * Warp AI Agent Framework - CLI Coordinator
 * Command-line tool for managing multiple Warp AI Agent sessions
 */

const SessionManager = require('../core/session-manager');
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
