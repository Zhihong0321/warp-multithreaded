#!/usr/bin/env node

/**
 * Warp Multithreaded - Short CLI Commands
 * Provides shorter aliases for common Warp AI Agent Framework commands
 */

const { spawn } = require('child_process');
const path = require('path');

class WarpShortCLI {
    constructor() {
        this.args = process.argv.slice(2);
        this.coordinatorPath = path.join(__dirname, 'scripts', 'coordinator.js');
    }

    run() {
        if (this.args.length === 0) {
            this.showHelp();
            return;
        }

        const command = this.args[0];
        const restArgs = this.args.slice(1);

        // Map short commands to full coordinator commands
        const commandMap = {
            // State management
            'load-state': ['load-state'],
            'save-state': ['update-state'],
            'update-state': ['update-state'],
            
            // Session management
            'startup': ['startup'],
            'resume': ['startup'],
            'shutdown': ['shutdown'],
            'status': ['status'],
            
            // Masterplan
            'tasks': ['masterplan', 'tasks'],
            'add-task': ['masterplan', 'add-task'],
            'complete-task': ['masterplan', 'complete-task'],
            'mp-status': ['masterplan', 'status'],
            'mp-init': ['masterplan', 'init'],
            
            // Context and sessions
            'context': ['context'],
            'conflicts': ['conflicts'],
            'sessions': ['session', 'list'],
            'create-session': ['session', 'create'],
            
            // Setup and initialization
            'init': ['init'],
            'validate': ['validate'],
            'dashboard': ['dashboard'],
            'rules': ['rules'],
            
            // Debug
            'debug': ['debug'],
            'debug-files': ['debug', 'files'],
            'debug-sessions': ['debug', 'sessions'],
            'debug-masterplan': ['debug', 'masterplan'],
            
            // Auto-session
            'auto-status': ['auto-session', 'status'],
            'auto-analyze': ['auto-session', 'analyze'],
            'auto-detect': ['auto-session', 'detect'],
        };

        if (command === 'help' || command === '--help' || command === '-h') {
            this.showHelp();
            return;
        }

        if (!commandMap[command]) {
            console.error(`❌ Unknown command: ${command}`);
            console.log('💡 Run "wm help" to see available commands');
            process.exit(1);
        }

        // Execute the mapped command
        const mappedCommand = commandMap[command];
        const fullArgs = [...mappedCommand, ...restArgs];
        
        this.executeCoordinator(fullArgs);
    }

    executeCoordinator(args) {
        const child = spawn('node', [this.coordinatorPath, ...args], {
            stdio: 'inherit',
            cwd: process.cwd()
        });

        child.on('error', (error) => {
            console.error('❌ Failed to execute command:', error.message);
            process.exit(1);
        });

        child.on('exit', (code) => {
            process.exit(code);
        });
    }

    showHelp() {
        console.log(`
🤖 Warp Multithreaded - Short CLI Commands

USAGE:
  wm <command> [options]

STATE MANAGEMENT:
  load-state                     Load previous development state
  save-state                     Save current development state
  update-state                   Update project documentation and state

SESSION MANAGEMENT:
  startup / resume               Resume development with full context
  shutdown                       End development session
  status                         Show framework status overview
  sessions                       List all active sessions
  create-session                 Create a new session

MASTERPLAN:
  tasks                          List all project tasks
  add-task                       Add a new task
  complete-task                  Mark task as completed
  mp-status                      Show masterplan status
  mp-init                        Initialize masterplan

CONTEXT & ANALYSIS:
  context                        Show AI session context
  conflicts                      Check for file conflicts
  auto-status                    Show auto-session status
  auto-analyze                   Analyze current context
  auto-detect                    Force session detection

SETUP & UTILITIES:
  init                           Initialize framework in project
  validate                       Run system validation
  dashboard                      Start web dashboard
  rules                          Manage Warp Rules

DEBUG:
  debug                          Debug system state
  debug-files                    Debug file system state
  debug-sessions                 Debug active sessions
  debug-masterplan               Debug masterplan state

EXAMPLES:
  wm load-state                  # Load last saved state
  wm save-state --summary="Fixed auth bug" --auto
  wm startup --show-context=true
  wm tasks                       # View all tasks
  wm add-task --title="Fix navbar" --priority=high
  wm status                      # Quick status check
  wm context --save=context.md

OPTIONS:
  All options from the full coordinator.js are supported.
  Use the same --flags as you would with the full commands.

FULL COMMAND REFERENCE:
  For complete documentation, run: node scripts/coordinator.js help
        `);
    }
}

// Run the short CLI
if (require.main === module) {
    const cli = new WarpShortCLI();
    cli.run();
}

module.exports = WarpShortCLI;
