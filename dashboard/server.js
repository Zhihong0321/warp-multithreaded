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

        // Masterplan API Routes
        this.app.get('/api/masterplan', (req, res) => {
            try {
                const masterplanData = this.getMasterplanData();
                res.json(masterplanData);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.post('/api/masterplan/tasks', (req, res) => {
            try {
                const { title, details, priority, category } = req.body;
                const task = this.createMasterplanTask({ title, details, priority, category });
                res.json({ success: true, task });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        this.app.put('/api/masterplan/tasks/:id', (req, res) => {
            try {
                const { id } = req.params;
                const { title, details, priority, category } = req.body;
                const task = this.updateMasterplanTask(id, { title, details, priority, category });
                res.json({ success: true, task });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        this.app.post('/api/masterplan/tasks/:id/complete', (req, res) => {
            try {
                const { id } = req.params;
                const task = this.completeMasterplanTask(id);
                res.json({ success: true, task });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        this.app.delete('/api/masterplan/tasks/:id', (req, res) => {
            try {
                const { id } = req.params;
                this.deleteMasterplanTask(id);
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Goal management routes
        this.app.put('/api/masterplan/goal', (req, res) => {
            try {
                const { text } = req.body;
                const goal = this.updateProjectGoal(text);
                res.json({ success: true, goal });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Discussion history routes
        this.app.post('/api/masterplan/discussions', (req, res) => {
            try {
                const { title, summary, tags } = req.body;
                const discussion = this.addDiscussion({ title, summary, tags });
                res.json({ success: true, discussion });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        this.app.delete('/api/masterplan/discussions/:id', (req, res) => {
            try {
                const { id } = req.params;
                this.deleteDiscussion(id);
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Development log routes
        this.app.post('/api/masterplan/logs', (req, res) => {
            try {
                const { title, description, type, files } = req.body;
                const logEntry = this.addLogEntry({ title, description, type, files });
                res.json({ success: true, logEntry });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        this.app.delete('/api/masterplan/logs/:id', (req, res) => {
            try {
                const { id } = req.params;
                this.deleteLogEntry(id);
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
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

    // Masterplan Management Methods
    getMasterplanPath() {
        return path.join(this.projectRoot, '.warp-masterplan.json');
    }

    getMasterplanData() {
        const masterplanPath = this.getMasterplanPath();
        
        if (!fs.existsSync(masterplanPath)) {
            // Create default masterplan data
            const defaultData = {
                goal: {
                    text: "Define your project's main goal and vision here. This will serve as the guiding compass for all AI agents throughout the development process.",
                    updated_at: new Date().toISOString()
                },
                project: {
                    status: 'Active',
                    phase: 'Development',
                    progress: 0
                },
                tasks: [],
                discussions: [],
                developmentLog: []
            };
            this.saveMasterplanData(defaultData);
            return defaultData;
        }
        
        try {
            return JSON.parse(fs.readFileSync(masterplanPath, 'utf8'));
        } catch (error) {
            console.error('Error reading masterplan data:', error);
            return {
                project: {
                    status: 'Active',
                    phase: 'Development', 
                    progress: 0
                },
                tasks: []
            };
        }
    }

    saveMasterplanData(data) {
        const masterplanPath = this.getMasterplanPath();
        try {
            fs.writeFileSync(masterplanPath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error saving masterplan data:', error);
            throw new Error('Failed to save masterplan data');
        }
    }

    generateTaskId() {
        return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    createMasterplanTask(taskData) {
        const masterplanData = this.getMasterplanData();
        
        const newTask = {
            id: this.generateTaskId(),
            title: taskData.title,
            details: taskData.details || '',
            priority: taskData.priority || 'medium',
            category: taskData.category || '',
            status: 'pending',
            created_at: new Date().toISOString(),
            completed_at: null
        };
        
        masterplanData.tasks.push(newTask);
        this.saveMasterplanData(masterplanData);
        
        return newTask;
    }

    updateMasterplanTask(taskId, updates) {
        const masterplanData = this.getMasterplanData();
        const taskIndex = masterplanData.tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex === -1) {
            throw new Error('Task not found');
        }
        
        const task = masterplanData.tasks[taskIndex];
        Object.assign(task, updates);
        task.updated_at = new Date().toISOString();
        
        this.saveMasterplanData(masterplanData);
        
        return task;
    }

    completeMasterplanTask(taskId) {
        const masterplanData = this.getMasterplanData();
        const taskIndex = masterplanData.tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex === -1) {
            throw new Error('Task not found');
        }
        
        const task = masterplanData.tasks[taskIndex];
        task.status = 'completed';
        task.completed_at = new Date().toISOString();
        
        // Update project progress based on completed tasks
        const totalTasks = masterplanData.tasks.length;
        const completedTasks = masterplanData.tasks.filter(t => t.status === 'completed').length;
        masterplanData.project.progress = Math.round((completedTasks / totalTasks) * 100);
        
        this.saveMasterplanData(masterplanData);
        
        return task;
    }

    deleteMasterplanTask(taskId) {
        const masterplanData = this.getMasterplanData();
        const taskIndex = masterplanData.tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex === -1) {
            throw new Error('Task not found');
        }
        
        masterplanData.tasks.splice(taskIndex, 1);
        
        // Update project progress after deletion
        if (masterplanData.tasks.length > 0) {
            const totalTasks = masterplanData.tasks.length;
            const completedTasks = masterplanData.tasks.filter(t => t.status === 'completed').length;
            masterplanData.project.progress = Math.round((completedTasks / totalTasks) * 100);
        } else {
            masterplanData.project.progress = 0;
        }
        
        this.saveMasterplanData(masterplanData);
    }

    // Goal Management Methods
    updateProjectGoal(text) {
        const masterplanData = this.getMasterplanData();
        
        masterplanData.goal = {
            text: text,
            updated_at: new Date().toISOString()
        };
        
        this.saveMasterplanData(masterplanData);
        
        return masterplanData.goal;
    }

    // Discussion History Methods
    generateDiscussionId() {
        return 'disc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    addDiscussion(discussionData) {
        const masterplanData = this.getMasterplanData();
        
        if (!masterplanData.discussions) {
            masterplanData.discussions = [];
        }
        
        const newDiscussion = {
            id: this.generateDiscussionId(),
            title: discussionData.title,
            summary: discussionData.summary,
            tags: discussionData.tags ? discussionData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
            created_at: new Date().toISOString()
        };
        
        masterplanData.discussions.unshift(newDiscussion); // Add to beginning
        this.saveMasterplanData(masterplanData);
        
        return newDiscussion;
    }

    deleteDiscussion(discussionId) {
        const masterplanData = this.getMasterplanData();
        
        if (!masterplanData.discussions) {
            throw new Error('Discussion not found');
        }
        
        const discussionIndex = masterplanData.discussions.findIndex(disc => disc.id === discussionId);
        
        if (discussionIndex === -1) {
            throw new Error('Discussion not found');
        }
        
        masterplanData.discussions.splice(discussionIndex, 1);
        this.saveMasterplanData(masterplanData);
    }

    // Development Log Methods
    generateLogId() {
        return 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    addLogEntry(logData) {
        const masterplanData = this.getMasterplanData();
        
        if (!masterplanData.developmentLog) {
            masterplanData.developmentLog = [];
        }
        
        const newLogEntry = {
            id: this.generateLogId(),
            title: logData.title,
            description: logData.description,
            type: logData.type || 'other',
            files: logData.files ? logData.files.split(',').map(file => file.trim()).filter(file => file) : [],
            created_at: new Date().toISOString()
        };
        
        masterplanData.developmentLog.unshift(newLogEntry); // Add to beginning
        this.saveMasterplanData(masterplanData);
        
        return newLogEntry;
    }

    deleteLogEntry(logId) {
        const masterplanData = this.getMasterplanData();
        
        if (!masterplanData.developmentLog) {
            throw new Error('Log entry not found');
        }
        
        const logIndex = masterplanData.developmentLog.findIndex(log => log.id === logId);
        
        if (logIndex === -1) {
            throw new Error('Log entry not found');
        }
        
        masterplanData.developmentLog.splice(logIndex, 1);
        this.saveMasterplanData(masterplanData);
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
