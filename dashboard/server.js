#!/usr/bin/env node

/**
 * Warp Multithreaded Dashboard Server
 * Real-time web interface for monitoring and managing AI agent sessions
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const SessionManager = require('../core/session-manager');

class DashboardServer {
    constructor(port = 3000, projectRoot = process.cwd()) {
        this.port = port;
        this.projectRoot = projectRoot;
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIo(this.server);
        this.sessionManager = new SessionManager(this.projectRoot);
        
        this.setupMiddleware();
        this.setupRoutes();
        this.setupSocketHandlers();
        this.startStatusBroadcast();
    }

    setupMiddleware() {
        // Serve static files
        this.app.use('/static', express.static(path.join(__dirname, 'public')));
        this.app.use(express.json());
        
        // CORS for development
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
    }

    setupRoutes() {
        // Dashboard home page
        this.app.get('/', (req, res) => {
            res.redirect('/warp-dashboard');
        });

        this.app.get('/warp-dashboard', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });

        // API Routes
        this.app.get('/api/status', (req, res) => {
            try {
                const status = this.sessionManager.getStatusOverview();
                res.json(status);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.get('/api/sessions', (req, res) => {
            try {
                const sessions = this.sessionManager.getActiveSessions();
                res.json(sessions);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.get('/api/conflicts', (req, res) => {
            try {
                const conflicts = this.sessionManager.checkConflicts();
                res.json(conflicts);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.post('/api/sessions', (req, res) => {
            try {
                const { name, focus, directories, file_patterns } = req.body;
                const session = this.sessionManager.createSession(name, {
                    focus: focus || ['general'],
                    directories: directories || [],
                    file_patterns: file_patterns || ['*']
                });
                res.json(session);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.delete('/api/sessions/:name', (req, res) => {
            try {
                const { name } = req.params;
                this.sessionManager.closeSession(name);
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.post('/api/sessions/:name/task', (req, res) => {
            try {
                const { name } = req.params;
                const { task } = req.body;
                const session = this.sessionManager.updateSession(name, {
                    current_task: task
                });
                res.json(session);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.post('/api/sessions/:name/lock-file', (req, res) => {
            try {
                const { name } = req.params;
                const { filePath } = req.body;
                const result = this.sessionManager.lockFile(name, filePath);
                res.json(result);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.post('/api/sessions/:name/release-file', (req, res) => {
            try {
                const { name } = req.params;
                const { filePath } = req.body;
                const result = this.sessionManager.releaseFile(name, filePath);
                res.json(result);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.get('/api/project-info', (req, res) => {
            try {
                const configPath = path.join(this.projectRoot, '.warp-config.json');
                let config = {};
                
                if (fs.existsSync(configPath)) {
                    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                }

                const projectInfo = {
                    name: path.basename(this.projectRoot),
                    path: this.projectRoot,
                    config: config,
                    hasFramework: fs.existsSync(path.join(this.projectRoot, '.warp-sessions'))
                };

                res.json(projectInfo);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }

    setupSocketHandlers() {
        this.io.on('connection', (socket) => {
            console.log('📊 Dashboard client connected');

            // Send initial data
            socket.emit('status-update', this.sessionManager.getStatusOverview());
            socket.emit('sessions-update', this.sessionManager.getActiveSessions());
            socket.emit('conflicts-update', this.sessionManager.checkConflicts());

            socket.on('disconnect', () => {
                console.log('📊 Dashboard client disconnected');
            });

            // Handle real-time commands
            socket.on('create-session', (data) => {
                try {
                    const session = this.sessionManager.createSession(data.name, data.options);
                    this.broadcastUpdates();
                    socket.emit('session-created', { success: true, session });
                } catch (error) {
                    socket.emit('session-created', { success: false, error: error.message });
                }
            });

            socket.on('close-session', (data) => {
                try {
                    this.sessionManager.closeSession(data.name);
                    this.broadcastUpdates();
                    socket.emit('session-closed', { success: true });
                } catch (error) {
                    socket.emit('session-closed', { success: false, error: error.message });
                }
            });

            socket.on('update-task', (data) => {
                try {
                    const session = this.sessionManager.updateSession(data.sessionName, {
                        current_task: data.task
                    });
                    this.broadcastUpdates();
                    socket.emit('task-updated', { success: true, session });
                } catch (error) {
                    socket.emit('task-updated', { success: false, error: error.message });
                }
            });
        });
    }

    startStatusBroadcast() {
        // Broadcast status updates every 5 seconds
        setInterval(() => {
            this.broadcastUpdates();
        }, 5000);
    }

    broadcastUpdates() {
        try {
            const status = this.sessionManager.getStatusOverview();
            const sessions = this.sessionManager.getActiveSessions();
            const conflicts = this.sessionManager.checkConflicts();

            this.io.emit('status-update', status);
            this.io.emit('sessions-update', sessions);
            this.io.emit('conflicts-update', conflicts);
        } catch (error) {
            console.error('Error broadcasting updates:', error);
        }
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`🚀 Warp Multithreaded Dashboard running at:`);
            console.log(`   📊 Dashboard: http://localhost:${this.port}/warp-dashboard`);
            console.log(`   🔗 API: http://localhost:${this.port}/api/status`);
            console.log(`   📁 Project: ${this.projectRoot}`);
            console.log(`\n💡 Use Ctrl+C to stop the server`);
        });
    }

    stop() {
        this.server.close();
    }
}

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);
    const portArg = args.find(arg => arg.startsWith('--port='));
    const projectArg = args.find(arg => arg.startsWith('--project='));
    
    const port = portArg ? parseInt(portArg.split('=')[1]) : 3000;
    const projectRoot = projectArg ? projectArg.split('=')[1] : process.cwd();
    
    const dashboard = new DashboardServer(port, projectRoot);
    dashboard.start();

    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down dashboard server...');
        dashboard.stop();
        process.exit(0);
    });
}

module.exports = DashboardServer;
