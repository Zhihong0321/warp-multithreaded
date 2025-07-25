#!/usr/bin/env node

/**
 * WARP MULTITHREADED - DASHBOARD CLI INTEGRATION SERVICE
 * 
 * Enables dashboard to run CLI commands with real-time output streaming
 * Pure magic - dashboard can install and configure tools automatically
 */

const { spawn, exec } = require('child_process');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { GoalManager } = require('./goal-manager.js');

class DashboardCLIService {
    constructor() {
        this.app = express();
        this.port = process.env.CLI_SERVICE_PORT || 3001;
        this.projectRoot = process.cwd();
        this.setupMiddleware();
        this.setupRoutes();
        this.runningProcesses = new Map(); // Track running processes
        this.goalManager = new GoalManager(); // Initialize goal manager
    }

    /**
     * Setup Express middleware
     */
    setupMiddleware() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('dashboard'));
        
        // Add request logging
        this.app.use((req, res, next) => {
            console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
            next();
        });
    }

    /**
     * Setup API routes
     */
    setupRoutes() {
        // Health check
        this.app.get('/api/health', (req, res) => {
            res.json({ status: 'ok', service: 'dashboard-cli-service' });
        });

        // Get system info
        this.app.get('/api/system-info', (req, res) => {
            res.json({
                platform: process.platform,
                shell: process.platform === 'win32' ? 'powershell' : 'bash',
                nodeVersion: process.version,
                workingDirectory: this.projectRoot
            });
        });

        // Install CLI tools
        this.app.post('/api/install/:tool', this.handleInstallTool.bind(this));

        // Run CLI commands
        this.app.post('/api/run-command', this.handleRunCommand.bind(this));

        // Stream command output (Server-Sent Events)
        this.app.get('/api/stream/:processId', this.handleStreamOutput.bind(this));

        // Check tool installation status
        this.app.get('/api/check-tool/:tool', this.handleCheckTool.bind(this));

        // Generate and apply masterplan
        this.app.post('/api/masterplan/generate', this.handleGenerateMasterplan.bind(this));

        // Setup project based on masterplan
        this.app.post('/api/masterplan/setup-project', this.handleSetupProject.bind(this));

        // Goal Management API endpoints
        this.app.get('/api/goal/current', this.handleGetCurrentGoal.bind(this));
        this.app.post('/api/goal/update', this.handleUpdateGoal.bind(this));
        this.app.get('/api/goal/history', this.handleGetGoalHistory.bind(this));
        this.app.get('/api/goal/stats', this.handleGetGoalStats.bind(this));
        this.app.post('/api/goal/revert', this.handleRevertGoal.bind(this));
        this.app.post('/api/goal/validate', this.handleValidateGoal.bind(this));
    }

    /**
     * Handle tool installation requests
     */
    async handleInstallTool(req, res) {
        const { tool } = req.params;
        const processId = this.generateProcessId();

        try {
            const installCommand = this.getInstallCommand(tool);
            if (!installCommand) {
                return res.status(400).json({ 
                    error: `Unknown tool: ${tool}`,
                    supportedTools: ['vercel', 'railway', 'netlify', 'clerk']
                });
            }

            console.log(`Installing ${tool} with command: ${installCommand.command}`);

            const process = spawn(installCommand.shell, installCommand.args, {
                cwd: this.projectRoot,
                stdio: 'pipe'
            });

            this.runningProcesses.set(processId, {
                process,
                tool,
                command: installCommand.command,
                startTime: new Date(),
                output: []
            });

            res.json({
                processId,
                tool,
                command: installCommand.command,
                streamUrl: `/api/stream/${processId}`
            });

        } catch (error) {
            console.error(`Error installing ${tool}:`, error);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Handle generic command execution
     */
    async handleRunCommand(req, res) {
        const { command, args = [], shell = 'auto' } = req.body;
        const processId = this.generateProcessId();

        try {
            const shellCommand = this.getShellCommand(shell);
            const commandArgs = this.buildCommandArgs(command, args, shellCommand);

            console.log(`Running command: ${command} ${args.join(' ')}`);

            const process = spawn(shellCommand.shell, commandArgs, {
                cwd: this.projectRoot,
                stdio: 'pipe'
            });

            this.runningProcesses.set(processId, {
                process,
                command: `${command} ${args.join(' ')}`,
                startTime: new Date(),
                output: []
            });

            res.json({
                processId,
                command: `${command} ${args.join(' ')}`,
                streamUrl: `/api/stream/${processId}`
            });

        } catch (error) {
            console.error(`Error running command:`, error);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Handle command output streaming
     */
    handleStreamOutput(req, res) {
        const { processId } = req.params;
        const processInfo = this.runningProcesses.get(processId);

        if (!processInfo) {
            return res.status(404).json({ error: 'Process not found' });
        }

        // Setup Server-Sent Events
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        });

        const { process } = processInfo;

        // Send existing output
        processInfo.output.forEach(line => {
            res.write(`data: ${JSON.stringify({ type: 'output', data: line })}\n\n`);
        });

        // Handle new stdout data
        process.stdout.on('data', (data) => {
            const output = data.toString();
            processInfo.output.push(output);
            res.write(`data: ${JSON.stringify({ type: 'stdout', data: output })}\n\n`);
        });

        // Handle stderr data
        process.stderr.on('data', (data) => {
            const output = data.toString();
            processInfo.output.push(output);
            res.write(`data: ${JSON.stringify({ type: 'stderr', data: output })}\n\n`);
        });

        // Handle process completion
        process.on('close', (code) => {
            const endTime = new Date();
            const duration = endTime - processInfo.startTime;
            
            res.write(`data: ${JSON.stringify({ 
                type: 'close', 
                code, 
                duration,
                success: code === 0
            })}\n\n`);
            
            res.end();
            
            // Clean up after 5 minutes
            setTimeout(() => {
                this.runningProcesses.delete(processId);
            }, 5 * 60 * 1000);
        });

        // Handle client disconnect
        req.on('close', () => {
            console.log(`Client disconnected from stream ${processId}`);
        });
    }

    /**
     * Check if a tool is installed
     */
    async handleCheckTool(req, res) {
        const { tool } = req.params;
        
        try {
            const checkCommand = this.getCheckCommand(tool);
            if (!checkCommand) {
                return res.json({ installed: false, error: `Unknown tool: ${tool}` });
            }

            const result = await this.execPromise(checkCommand);
            res.json({ 
                installed: true, 
                version: result.stdout.trim(),
                tool 
            });

        } catch (error) {
            res.json({ 
                installed: false, 
                tool,
                error: error.message 
            });
        }
    }

    /**
     * Generate masterplan and rules
     */
    async handleGenerateMasterplan(req, res) {
        try {
            const masterplanData = req.body;
            
            // Save masterplan configuration
            const configPath = path.join(this.projectRoot, 'masterplan-config.json');
            fs.writeFileSync(configPath, JSON.stringify(masterplanData, null, 2));

            // Generate unified rules
            const { UnifiedRuleGenerator } = require('./generate-unified-rules.js');
            const generator = new UnifiedRuleGenerator();
            const success = await generator.generate();

            if (success) {
                res.json({
                    success: true,
                    message: 'Masterplan generated successfully',
                    files: {
                        config: 'masterplan-config.json',
                        goal: 'masterplan-goal.md',
                        rules: '.warp-unified-rules.md'
                    }
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Failed to generate masterplan'
                });
            }

        } catch (error) {
            console.error('Error generating masterplan:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Setup entire project based on masterplan
     */
    async handleSetupProject(req, res) {
        try {
            const masterplanPath = path.join(this.projectRoot, 'masterplan-config.json');
            
            if (!fs.existsSync(masterplanPath)) {
                return res.status(400).json({
                    error: 'Masterplan not found. Generate masterplan first.'
                });
            }

            const masterplan = JSON.parse(fs.readFileSync(masterplanPath, 'utf8'));
            const setupTasks = this.generateSetupTasks(masterplan);

            res.json({
                success: true,
                message: 'Project setup plan generated',
                tasks: setupTasks,
                masterplan: masterplan
            });

        } catch (error) {
            console.error('Error setting up project:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Get install command for specific tools
     */
    getInstallCommand(tool) {
        const isWindows = process.platform === 'win32';
        
        const commands = {
            vercel: {
                shell: isWindows ? 'powershell' : 'bash',
                args: isWindows ? ['-Command', 'npm install -g vercel'] : ['-c', 'npm install -g vercel'],
                command: 'npm install -g vercel'
            },
            railway: {
                shell: isWindows ? 'powershell' : 'bash', 
                args: isWindows ? ['-Command', 'npm install -g @railway/cli'] : ['-c', 'npm install -g @railway/cli'],
                command: 'npm install -g @railway/cli'
            },
            netlify: {
                shell: isWindows ? 'powershell' : 'bash',
                args: isWindows ? ['-Command', 'npm install -g netlify-cli'] : ['-c', 'npm install -g netlify-cli'],
                command: 'npm install -g netlify-cli'
            },
            clerk: {
                shell: isWindows ? 'powershell' : 'bash',
                args: isWindows ? ['-Command', 'npm install -g @clerk/cli'] : ['-c', 'npm install -g @clerk/cli'],
                command: 'npm install -g @clerk/cli'
            }
        };

        return commands[tool];
    }

    /**
     * Get check command for tools
     */
    getCheckCommand(tool) {
        const commands = {
            vercel: 'vercel --version',
            railway: 'railway --version',
            netlify: 'netlify --version',
            clerk: 'clerk --version',
            node: 'node --version',
            npm: 'npm --version',
            git: 'git --version'
        };

        return commands[tool];
    }

    /**
     * Get appropriate shell command
     */
    getShellCommand(shell) {
        const isWindows = process.platform === 'win32';
        
        if (shell === 'auto') {
            return {
                shell: isWindows ? 'powershell' : 'bash',
                prefix: isWindows ? ['-Command'] : ['-c']
            };
        }

        const shells = {
            powershell: { shell: 'powershell', prefix: ['-Command'] },
            bash: { shell: 'bash', prefix: ['-c'] },
            cmd: { shell: 'cmd', prefix: ['/c'] }
        };

        return shells[shell] || shells.powershell;
    }

    /**
     * Build command arguments
     */
    buildCommandArgs(command, args, shellCommand) {
        const fullCommand = `${command} ${args.join(' ')}`;
        return [...shellCommand.prefix, fullCommand];
    }

    /**
     * Generate setup tasks based on masterplan
     */
    generateSetupTasks(masterplan) {
        const tasks = [];

        // Git initialization
        tasks.push({
            id: 'git-init',
            title: 'Initialize Git Repository',
            command: 'git init',
            required: true
        });

        // Hosting setup
        if (masterplan.hosting === 'vercel') {
            tasks.push({
                id: 'install-vercel',
                title: 'Install Vercel CLI',
                command: 'npm install -g vercel',
                required: true
            });
            tasks.push({
                id: 'vercel-login',
                title: 'Login to Vercel',
                command: 'vercel login',
                required: false,
                interactive: true
            });
        }

        if (masterplan.hosting === 'railway') {
            tasks.push({
                id: 'install-railway',
                title: 'Install Railway CLI',
                command: 'npm install -g @railway/cli',
                required: true
            });
            tasks.push({
                id: 'railway-login',
                title: 'Login to Railway',
                command: 'railway login',
                required: false,
                interactive: true
            });
        }

        // Tech stack setup
        if (masterplan.techStack === 'nextjs_fullstack') {
            tasks.push({
                id: 'create-nextjs',
                title: 'Create Next.js Project',
                command: 'npx create-next-app@latest . --typescript --tailwind --app',
                required: true
            });
        }

        // Authentication setup
        if (masterplan.authentication === 'clerk') {
            tasks.push({
                id: 'install-clerk',
                title: 'Install Clerk',
                command: 'npm install @clerk/nextjs',
                required: true
            });
        }

        return tasks;
    }

    /**
     * Promise wrapper for exec
     */
    execPromise(command) {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({ stdout, stderr });
                }
            });
        });
    }

    /**
     * Handle get current goal request
     */
    async handleGetCurrentGoal(req, res) {
        try {
            const currentGoal = this.goalManager.getCurrentGoal();
            res.json({
                success: true,
                goal: currentGoal
            });
        } catch (error) {
            console.error('Error getting current goal:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Handle update goal request
     */
    async handleUpdateGoal(req, res) {
        try {
            const { goal, metadata = {} } = req.body;
            
            if (!goal) {
                return res.status(400).json({
                    success: false,
                    error: 'Goal text is required'
                });
            }

            // Validate goal
            const validation = this.goalManager.validateGoal(goal);
            if (!validation.valid) {
                return res.status(400).json({
                    success: false,
                    error: 'Goal validation failed',
                    issues: validation.issues
                });
            }

            const result = await this.goalManager.updateGoal(goal, 'dashboard', {
                updatedBy: 'Dashboard user',
                reason: metadata.reason || 'Goal updated via dashboard',
                ...metadata
            });

            if (result.success) {
                res.json({
                    success: true,
                    message: 'Goal updated successfully',
                    goal: result.goal,
                    timestamp: result.timestamp
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error
                });
            }

        } catch (error) {
            console.error('Error updating goal:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Handle get goal history request
     */
    async handleGetGoalHistory(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const history = this.goalManager.getGoalHistory(limit);
            
            res.json({
                success: true,
                history,
                count: history.length
            });
        } catch (error) {
            console.error('Error getting goal history:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Handle get goal statistics request
     */
    async handleGetGoalStats(req, res) {
        try {
            const stats = this.goalManager.getGoalStatistics();
            
            if (stats) {
                res.json({
                    success: true,
                    stats
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Failed to calculate goal statistics'
                });
            }
        } catch (error) {
            console.error('Error getting goal stats:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Handle revert goal request
     */
    async handleRevertGoal(req, res) {
        try {
            const { historyId } = req.body;
            
            if (!historyId) {
                return res.status(400).json({
                    success: false,
                    error: 'History ID is required'
                });
            }

            const result = await this.goalManager.revertToGoal(historyId);
            
            if (result.success) {
                res.json({
                    success: true,
                    message: 'Goal reverted successfully',
                    goal: result.goal,
                    timestamp: result.timestamp
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: result.error
                });
            }

        } catch (error) {
            console.error('Error reverting goal:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Handle validate goal request
     */
    async handleValidateGoal(req, res) {
        try {
            const { goal } = req.body;
            
            if (!goal) {
                return res.status(400).json({
                    success: false,
                    error: 'Goal text is required for validation'
                });
            }

            const validation = this.goalManager.validateGoal(goal);
            
            res.json({
                success: true,
                valid: validation.valid,
                issues: validation.issues
            });

        } catch (error) {
            console.error('Error validating goal:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Generate unique process ID
     */
    generateProcessId() {
        return `proc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Start the CLI service
     */
    start() {
        this.app.listen(this.port, () => {
            console.log(`WARP MULTITHREADED - Dashboard CLI Service`);
            console.log(`===============================================`);
            console.log(`Service running on: http://localhost:${this.port}`);
            console.log(`Health check: http://localhost:${this.port}/api/health`);
            console.log(`Project root: ${this.projectRoot}`);
            console.log(`Platform: ${process.platform}`);
            console.log('');
            console.log('Ready to execute CLI commands from dashboard!');
        });
    }

    /**
     * Graceful shutdown
     */
    shutdown() {
        console.log('Shutting down CLI service...');
        
        // Kill all running processes
        for (const [processId, processInfo] of this.runningProcesses) {
            console.log(`Terminating process ${processId}`);
            processInfo.process.kill();
        }
        
        process.exit(0);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nReceived SIGINT, shutting down gracefully...');
    if (global.cliService) {
        global.cliService.shutdown();
    } else {
        process.exit(0);
    }
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    if (global.cliService) {
        global.cliService.shutdown();
    } else {
        process.exit(0);
    }
});

// CLI execution
async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
WARP MULTITHREADED - Dashboard CLI Service

USAGE:
  node scripts/dashboard-cli-service.js [options]

OPTIONS:
  --help, -h     Show this help message
  --port PORT    Set service port (default: 3001)

EXAMPLES:
  node scripts/dashboard-cli-service.js
  node scripts/dashboard-cli-service.js --port 3002

ENDPOINTS:
  GET  /api/health                    - Health check
  GET  /api/system-info              - System information
  POST /api/install/:tool            - Install CLI tool
  POST /api/run-command              - Run arbitrary command
  GET  /api/stream/:processId        - Stream command output
  GET  /api/check-tool/:tool         - Check tool installation
  POST /api/masterplan/generate      - Generate masterplan from config
  POST /api/masterplan/setup-project - Setup project from masterplan
        `);
        return;
    }

    const portArg = args.findIndex(arg => arg === '--port');
    if (portArg !== -1 && args[portArg + 1]) {
        process.env.CLI_SERVICE_PORT = args[portArg + 1];
    }

    const cliService = new DashboardCLIService();
    global.cliService = cliService;
    cliService.start();
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { DashboardCLIService };
