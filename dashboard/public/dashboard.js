/**
 * Warp Multithreaded Dashboard JavaScript
 * Real-time interface for managing AI agent sessions
 */

class WarpDashboard {
    constructor() {
        this.socket = null;
        this.sessions = [];
        this.conflicts = [];
        this.status = {};
        this.projectInfo = {};
        this.currentTaskSession = null;
        this.activityLog = [];
        
        this.init();
    }

    init() {
        this.connectSocket();
        this.loadProjectInfo();
        this.setupEventListeners();
    }

    connectSocket() {
        this.socket = io();
        
        this.socket.on('connect', () => {
            this.updateConnectionStatus('connected');
            this.showToast('Connected to dashboard', 'success');
        });

        this.socket.on('disconnect', () => {
            this.updateConnectionStatus('offline');
            this.showToast('Disconnected from dashboard', 'error');
        });

        this.socket.on('status-update', (status) => {
            this.status = status;
            this.updateOverviewStats();
        });

        this.socket.on('sessions-update', (sessions) => {
            this.sessions = sessions;
            this.renderSessions();
            this.updateActivityLog('Sessions updated', 'session');
        });

        this.socket.on('conflicts-update', (conflicts) => {
            this.conflicts = conflicts;
            this.renderConflicts();
            if (conflicts.length > 0) {
                this.updateActivityLog(`${conflicts.length} conflicts detected`, 'conflict');
            }
        });

        this.socket.on('session-created', (result) => {
            if (result.success) {
                this.showToast(`Session '${result.session.name}' created successfully`, 'success');
                this.hideCreateSessionModal();
                this.resetCreateSessionForm();
            } else {
                this.showToast(`Failed to create session: ${result.error}`, 'error');
            }
        });

        this.socket.on('session-closed', (result) => {
            if (result.success) {
                this.showToast('Session closed successfully', 'success');
            } else {
                this.showToast(`Failed to close session: ${result.error}`, 'error');
            }
        });

        this.socket.on('task-updated', (result) => {
            if (result.success) {
                this.showToast('Task updated successfully', 'success');
                this.hideTaskModal();
            } else {
                this.showToast(`Failed to update task: ${result.error}`, 'error');
            }
        });
    }

    updateConnectionStatus(status) {
        const statusElement = document.getElementById('connection-status');
        statusElement.className = `connection-status ${status}`;
        
        const statusText = statusElement.querySelector('span');
        switch (status) {
            case 'connected':
                statusText.textContent = 'Connected';
                break;
            case 'connecting':
                statusText.textContent = 'Connecting...';
                break;
            case 'offline':
                statusText.textContent = 'Offline';
                break;
        }
    }

    async loadProjectInfo() {
        try {
            const response = await fetch('/api/project-info');
            this.projectInfo = await response.json();
            document.getElementById('project-name').textContent = this.projectInfo.name || 'Unknown Project';
        } catch (error) {
            console.error('Failed to load project info:', error);
            document.getElementById('project-name').textContent = 'Error loading project';
        }
    }

    updateOverviewStats() {
        document.getElementById('active-sessions').textContent = this.status.active_sessions || 0;
        document.getElementById('total-conflicts').textContent = this.status.conflicts || 0;
        
        const totalFiles = this.sessions.reduce((total, session) => total + (session.active_files?.length || 0), 0);
        document.getElementById('total-files').textContent = totalFiles;
        
        const health = this.status.conflicts === 0 ? '100%' : Math.max(0, 100 - (this.status.conflicts * 10)) + '%';
        document.getElementById('session-health').textContent = health;
    }

    renderSessions() {
        const container = document.getElementById('sessions-container');
        
        if (this.sessions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-cube"></i>
                    <p>No active sessions</p>
                    <button class="btn btn-primary" onclick="showCreateSessionModal()">Create First Session</button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.sessions.map(session => this.renderSessionCard(session)).join('');
    }

    renderSessionCard(session) {
        const isActive = (session.active_files?.length || 0) > 0;
        const statusClass = isActive ? 'active' : 'idle';
        const statusText = isActive ? 'Working' : 'Idle';
        
        const focusTags = (session.focus || []).map(focus => 
            `<span class="focus-tag">${focus}</span>`
        ).join('');

        const taskSection = session.current_task ? 
            `<div class="session-task">📋 ${session.current_task}</div>` : 
            '<div class="session-task" style="color: #999;">No current task</div>';

        return `
            <div class="session-card">
                <div class="session-header">
                    <div class="session-name">${session.name}</div>
                    <div class="session-status ${statusClass}">${statusText}</div>
                </div>
                <div class="session-body">
                    <div class="session-focus">
                        ${focusTags}
                    </div>
                    ${taskSection}
                    <div class="session-files">
                        <div class="file-count">
                            <i class="fas fa-file"></i> ${session.active_files?.length || 0} files in use
                        </div>
                    </div>
                    <div class="session-actions">
                        <button class="btn btn-small btn-info" onclick="dashboard.editTask('${session.name}', '${session.current_task || ''}')">
                            <i class="fas fa-edit"></i> Task
                        </button>
                        <button class="btn btn-small btn-secondary" onclick="dashboard.viewSessionDetails('${session.name}')">
                            <i class="fas fa-info"></i> Details
                        </button>
                        <button class="btn btn-small btn-danger" onclick="dashboard.closeSession('${session.name}')">
                            <i class="fas fa-times"></i> Close
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderConflicts() {
        const section = document.getElementById('conflicts-section');
        const container = document.getElementById('conflicts-container');

        if (this.conflicts.length === 0) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';
        container.innerHTML = this.conflicts.map(conflict => `
            <div class="conflict-item">
                <div class="conflict-file">
                    <i class="fas fa-exclamation-triangle"></i> ${conflict.file}
                </div>
                <div class="conflict-sessions">
                    Sessions in conflict: ${conflict.sessions.join(', ')}
                </div>
            </div>
        `).join('');
    }

    updateActivityLog(message, type) {
        const activity = {
            message,
            type,
            timestamp: new Date()
        };
        
        this.activityLog.unshift(activity);
        this.activityLog = this.activityLog.slice(0, 10); // Keep only last 10 items
        
        this.renderActivity();
    }

    renderActivity() {
        const container = document.getElementById('activity-list');
        
        if (this.activityLog.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clock"></i>
                    <p>No recent activity</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.activityLog.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.message}</div>
                    <div class="activity-time">${this.formatTime(activity.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }

    getActivityIcon(type) {
        switch (type) {
            case 'session': return 'layer-group';
            case 'file': return 'file-alt';
            case 'conflict': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }

    formatTime(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return timestamp.toLocaleDateString();
    }

    setupEventListeners() {
        // Modal click outside to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    // Session Management Methods
    editTask(sessionName, currentTask) {
        this.currentTaskSession = sessionName;
        document.getElementById('task-description').value = currentTask;
        document.getElementById('task-modal').style.display = 'block';
    }

    closeSession(sessionName) {
        if (confirm(`Are you sure you want to close session '${sessionName}'?`)) {
            this.socket.emit('close-session', { name: sessionName });
        }
    }

    viewSessionDetails(sessionName) {
        const session = this.sessions.find(s => s.name === sessionName);
        if (!session) return;

        const details = `
            <div style="padding: 20px;">
                <h4>Session: ${session.name}</h4>
                <p><strong>ID:</strong> ${session.id}</p>
                <p><strong>Created:</strong> ${new Date(session.created).toLocaleString()}</p>
                <p><strong>Last Active:</strong> ${new Date(session.last_active).toLocaleString()}</p>
                <p><strong>Focus Areas:</strong> ${session.focus.join(', ')}</p>
                <p><strong>Directories:</strong> ${session.directories.join(', ') || 'All'}</p>
                <p><strong>File Patterns:</strong> ${session.file_patterns.join(', ')}</p>
                <p><strong>Active Files:</strong> ${session.active_files.length}</p>
                ${session.active_files.length > 0 ? `
                    <ul>
                        ${session.active_files.map(file => `<li>${file}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        `;

        document.getElementById('project-info-content').innerHTML = details;
        document.getElementById('project-info-modal').style.display = 'block';
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-circle' : 
                    type === 'warning' ? 'exclamation-triangle' : 'info-circle';
        
        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    // Modal Management
    hideCreateSessionModal() {
        document.getElementById('create-session-modal').style.display = 'none';
    }

    hideTaskModal() {
        document.getElementById('task-modal').style.display = 'none';
    }

    hideProjectInfoModal() {
        document.getElementById('project-info-modal').style.display = 'none';
    }

    resetCreateSessionForm() {
        document.getElementById('create-session-form').reset();
    }
}

// Global Functions (called from HTML)
let dashboard;

document.addEventListener('DOMContentLoaded', () => {
    dashboard = new WarpDashboard();
});

function showCreateSessionModal() {
    document.getElementById('create-session-modal').style.display = 'block';
}

function hideCreateSessionModal() {
    dashboard.hideCreateSessionModal();
}

function createSession(event) {
    event.preventDefault();
    
    const name = document.getElementById('session-name').value;
    const focus = document.getElementById('session-focus').value;
    const directories = document.getElementById('session-directories').value;
    const patterns = document.getElementById('session-patterns').value;
    
    const options = {};
    if (focus) options.focus = focus.split(',').map(f => f.trim());
    if (directories) options.directories = directories.split(',').map(d => d.trim());
    if (patterns) options.file_patterns = patterns.split(',').map(p => p.trim());
    
    dashboard.socket.emit('create-session', { name, options });
}

function refreshAll() {
    location.reload();
}

function checkConflicts() {
    dashboard.socket.emit('request-conflicts-update');
    dashboard.showToast('Checking for conflicts...', 'info');
}

function showProjectInfo() {
    const info = `
        <div style="padding: 20px;">
            <h4>Project Information</h4>
            <p><strong>Name:</strong> ${dashboard.projectInfo.name || 'Unknown'}</p>
            <p><strong>Path:</strong> ${dashboard.projectInfo.path || 'Unknown'}</p>
            <p><strong>Type:</strong> ${dashboard.projectInfo.config?.project_type || 'Not configured'}</p>
            <p><strong>Framework Status:</strong> ${dashboard.projectInfo.hasFramework ? '✅ Initialized' : '❌ Not initialized'}</p>
            ${dashboard.projectInfo.config?.sessions ? `
                <h5>Configured Sessions:</h5>
                <ul>
                    ${Object.keys(dashboard.projectInfo.config.sessions).map(name => 
                        `<li><strong>${name}:</strong> ${dashboard.projectInfo.config.sessions[name].focus.join(', ')}</li>`
                    ).join('')}
                </ul>
            ` : ''}
        </div>
    `;
    
    document.getElementById('project-info-content').innerHTML = info;
    document.getElementById('project-info-modal').style.display = 'block';
}

function hideTaskModal() {
    dashboard.hideTaskModal();
}

function updateTask(event) {
    event.preventDefault();
    
    const task = document.getElementById('task-description').value;
    dashboard.socket.emit('update-task', { 
        sessionName: dashboard.currentTaskSession, 
        task 
    });
}

function hideProjectInfoModal() {
    dashboard.hideProjectInfoModal();
}

function refreshConflicts() {
    checkConflicts();
}
