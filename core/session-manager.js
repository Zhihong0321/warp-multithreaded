/**
 * Warp AI Agent Framework - Session Manager
 * Coordinates multiple Warp AI Agent sessions working on the same project
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class SessionManager {
    constructor(projectRoot = process.cwd()) {
        this.projectRoot = projectRoot;
        this.sessionsDir = path.join(projectRoot, '.warp-sessions');
        this.configFile = path.join(projectRoot, '.warp-config.json');
        this.lockFile = path.join(this.sessionsDir, 'sessions.lock');
        
        this.ensureDirectories();
        this.loadConfig();
    }

    ensureDirectories() {
        if (!fs.existsSync(this.sessionsDir)) {
            fs.mkdirSync(this.sessionsDir, { recursive: true });
        }
    }

    loadConfig() {
        try {
            if (fs.existsSync(this.configFile)) {
                this.config = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
            } else {
                this.config = this.getDefaultConfig();
                this.saveConfig();
            }
        } catch (error) {
            console.warn('Failed to load config, using defaults:', error.message);
            this.config = this.getDefaultConfig();
        }
    }

    getDefaultConfig() {
        return {
            project_type: 'general',
            sessions: {
                main: {
                    focus: ['general'],
                    directories: ['src'],
                    file_patterns: ['*']
                }
            },
            coordination: {
                check_interval: 5000,
                auto_sync: true,
                conflict_resolution: 'prompt'
            }
        };
    }

    saveConfig() {
        fs.writeFileSync(this.configFile, JSON.stringify(this.config, null, 2));
    }

    /**
     * Create a new session
     */
    createSession(sessionName, options = {}) {
        const sessionId = crypto.randomUUID();
        const session = {
            id: sessionId,
            name: sessionName,
            created: new Date().toISOString(),
            last_active: new Date().toISOString(),
            focus: options.focus || ['general'],
            directories: options.directories || [],
            file_patterns: options.file_patterns || ['*'],
            current_task: null,
            active_files: [],
            locked_files: [],
            status: 'active'
        };

        const sessionFile = path.join(this.sessionsDir, `${sessionName}.json`);
        fs.writeFileSync(sessionFile, JSON.stringify(session, null, 2));

        this.updateSessionsLock();
        console.log(`✅ Session '${sessionName}' created with ID: ${sessionId}`);
        return session;
    }

    /**
     * Get all active sessions
     */
    getActiveSessions() {
        const sessions = [];
        if (!fs.existsSync(this.sessionsDir)) return sessions;

        const sessionFiles = fs.readdirSync(this.sessionsDir)
            .filter(file => file.endsWith('.json') && file !== 'sessions.lock');

        for (const file of sessionFiles) {
            try {
                const sessionData = JSON.parse(
                    fs.readFileSync(path.join(this.sessionsDir, file), 'utf8')
                );
                if (sessionData.status === 'active') {
                    sessions.push(sessionData);
                }
            } catch (error) {
                console.warn(`Failed to read session file ${file}:`, error.message);
            }
        }

        return sessions;
    }

    /**
     * Update session activity
     */
    updateSession(sessionName, updates) {
        const sessionFile = path.join(this.sessionsDir, `${sessionName}.json`);
        
        if (!fs.existsSync(sessionFile)) {
            throw new Error(`Session '${sessionName}' not found`);
        }

        const session = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
        Object.assign(session, updates, { last_active: new Date().toISOString() });
        
        fs.writeFileSync(sessionFile, JSON.stringify(session, null, 2));
        this.updateSessionsLock();
        return session;
    }

    /**
     * Check for file conflicts between sessions
     */
    checkConflicts() {
        const sessions = this.getActiveSessions();
        const conflicts = [];
        const fileMap = new Map();

        // Map files to sessions
        sessions.forEach(session => {
            session.active_files.forEach(file => {
                if (!fileMap.has(file)) {
                    fileMap.set(file, []);
                }
                fileMap.get(file).push(session.name);
            });
        });

        // Find conflicts
        fileMap.forEach((sessionNames, file) => {
            if (sessionNames.length > 1) {
                conflicts.push({
                    file,
                    sessions: sessionNames,
                    type: 'file_conflict'
                });
            }
        });

        return conflicts;
    }

    /**
     * Lock a file for a session
     */
    lockFile(sessionName, filePath) {
        const conflicts = this.checkConflicts();
        const existingConflict = conflicts.find(c => c.file === filePath);
        
        if (existingConflict) {
            return {
                success: false,
                reason: 'File already in use',
                conflicting_sessions: existingConflict.sessions
            };
        }

        // Add file to session's active files
        this.updateSession(sessionName, {
            active_files: [...this.getSession(sessionName).active_files, filePath]
        });

        return { success: true };
    }

    /**
     * Release a file lock
     */
    releaseFile(sessionName, filePath) {
        const session = this.getSession(sessionName);
        const updatedFiles = session.active_files.filter(f => f !== filePath);
        
        this.updateSession(sessionName, {
            active_files: updatedFiles
        });

        return { success: true };
    }

    /**
     * Get session by name
     */
    getSession(sessionName) {
        const sessionFile = path.join(this.sessionsDir, `${sessionName}.json`);
        if (!fs.existsSync(sessionFile)) {
            return null;
        }
        return JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
    }

    /**
     * Close a session
     */
    closeSession(sessionName) {
        const session = this.getSession(sessionName);
        if (!session) {
            throw new Error(`Session '${sessionName}' not found`);
        }

        this.updateSession(sessionName, {
            status: 'closed',
            closed: new Date().toISOString(),
            active_files: [],
            locked_files: []
        });

        console.log(`✅ Session '${sessionName}' closed`);
        return true;
    }

    /**
     * Get session status overview
     */
    getStatusOverview() {
        const sessions = this.getActiveSessions();
        const conflicts = this.checkConflicts();
        
        return {
            total_sessions: sessions.length,
            active_sessions: sessions.filter(s => s.status === 'active').length,
            conflicts: conflicts.length,
            sessions: sessions.map(s => ({
                name: s.name,
                focus: s.focus,
                active_files: s.active_files.length,
                current_task: s.current_task,
                last_active: s.last_active
            })),
            conflicts
        };
    }

    /**
     * Update the sessions lock file
     */
    updateSessionsLock() {
        const lockData = {
            updated: new Date().toISOString(),
            active_sessions: this.getActiveSessions().map(s => s.name),
            project_root: this.projectRoot
        };

        fs.writeFileSync(this.lockFile, JSON.stringify(lockData, null, 2));
    }

    /**
     * Suggest optimal task distribution
     */
    suggestTaskDistribution(tasks) {
        const sessions = this.getActiveSessions();
        const suggestions = [];

        tasks.forEach(task => {
            // Find best session based on focus areas and current workload
            const bestSession = sessions.reduce((best, session) => {
                const focusMatch = session.focus.some(focus => 
                    task.toLowerCase().includes(focus.toLowerCase())
                );
                const workload = session.active_files.length;
                const score = (focusMatch ? 10 : 0) - workload;

                return score > best.score ? { session, score } : best;
            }, { session: null, score: -Infinity });

            suggestions.push({
                task,
                recommended_session: bestSession.session?.name || 'any',
                reason: bestSession.score > 0 ? 'focus_match' : 'lowest_workload'
            });
        });

        return suggestions;
    }
}

module.exports = SessionManager;
