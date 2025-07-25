/**
 * Auto-Session Integration Layer
 * Hooks the Intelligent Session Manager into the existing coordinator system
 */

const IntelligentSessionManager = require('./intelligent-session-manager');
const fs = require('fs');
const path = require('path');

class AutoSessionIntegration {
    constructor(projectRoot = process.cwd()) {
        this.projectRoot = projectRoot;
        this.intelligentSessionManager = new IntelligentSessionManager(projectRoot);
        this.isEnabled = this.checkAutoSessionEnabled();
        this.initializeIntegration();
    }

    checkAutoSessionEnabled() {
        const configPath = path.join(this.projectRoot, '.warp-config.json');
        try {
            if (fs.existsSync(configPath)) {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                return config.auto_session?.enabled !== false; // Default to true
            }
        } catch (error) {
            console.warn('Could not read auto-session config, defaulting to enabled:', error.message);
        }
        return true; // Default to enabled
    }

    initializeIntegration() {
        if (this.isEnabled) {
            this.setupAutoDetection();
            this.setupPeriodicMaintenance();
            console.log('🤖 Auto-session management enabled');
        }
    }

    /**
     * Main entry point for auto-session detection
     * Called when AI agent starts working
     */
    async handleAIAgentStart(userInput, options = {}) {
        if (!this.isEnabled) {
            return this.intelligentSessionManager.getOrCreateDefaultSession();
        }

        const currentFiles = options.currentFiles || this.detectCurrentFiles();
        
        try {
            // Auto-detect and create appropriate session
            const session = await this.intelligentSessionManager.autoDetectAndCreateSession(
                userInput, 
                currentFiles, 
                options.forceAnalysis || false
            );

            // Update coordination system
            this.updateCoordinationSystem(session);
            
            // Log the auto-session decision
            this.logAutoSessionDecision(session, userInput);

            return session;
        } catch (error) {
            console.error('Auto-session handling failed:', error.message);
            return this.intelligentSessionManager.getOrCreateDefaultSession();
        }
    }

    /**
     * Handle dynamic session switching during development
     */
    async handleContextChange(userInput, currentFiles = []) {
        if (!this.isEnabled) return null;

        try {
            const switchedSession = this.intelligentSessionManager.autoSwitchSession(userInput, currentFiles);
            
            if (switchedSession) {
                this.updateCoordinationSystem(switchedSession);
                this.logSessionSwitch(switchedSession, userInput);
                return switchedSession;
            }
        } catch (error) {
            console.warn('Auto-session switching failed:', error.message);
        }

        return null;
    }

    /**
     * Detect currently edited files from various sources
     */
    detectCurrentFiles() {
        const files = [];
        
        // Check recent git changes
        try {
            const { execSync } = require('child_process');
            const gitDiff = execSync('git diff --name-only HEAD~1 HEAD', { cwd: this.projectRoot, encoding: 'utf8' });
            files.push(...gitDiff.trim().split('\n').filter(f => f.length > 0));
        } catch (error) {
            // Git not available or no changes, ignore
        }

        // Check for common editor temp files, recent access patterns, etc.
        // This could be extended with editor-specific detection

        return files;
    }

    /**
     * Update the coordination system with session info
     */
    updateCoordinationSystem(session) {
        const coordPath = path.join(this.projectRoot, '.warp-coordination.md');
        
        try {
            let content = '';
            if (fs.existsSync(coordPath)) {
                content = fs.readFileSync(coordPath, 'utf8');
            }

            // Update or add current session info
            const sessionInfo = `\n## 🤖 Auto-Detected Session: ${session.name}\n\n` +
                `**Focus Areas:** ${session.focus.join(', ')}\n` +
                `**Directories:** ${session.directories.join(', ')}\n` +
                `**Confidence:** ${session.confidence ? (session.confidence * 100).toFixed(1) : 'N/A'}%\n` +
                `**Reasoning:** ${session.reasoning || 'Auto-created session'}\n` +
                `**Created:** ${new Date().toISOString()}\n\n`;

            // Replace existing auto-session info or append
            if (content.includes('## 🤖 Auto-Detected Session:')) {
                content = content.replace(/## 🤖 Auto-Detected Session:.*?(?=##|$)/s, sessionInfo.trim() + '\n\n');
            } else {
                content += sessionInfo;
            }

            fs.writeFileSync(coordPath, content);
        } catch (error) {
            console.warn('Could not update coordination file:', error.message);
        }
    }

    /**
     * Log auto-session decisions for debugging and user transparency
     */
    logAutoSessionDecision(session, userInput) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            action: 'auto_session_created',
            session_name: session.name,
            confidence: session.confidence,
            reasoning: session.reasoning,
            user_input_snippet: userInput.substring(0, 100) + (userInput.length > 100 ? '...' : ''),
            focus_areas: session.focus,
            auto_created: session.auto_created
        };

        this.appendToAutoSessionLog(logEntry);
        
        // User-friendly console output
        if (session.auto_created) {
            console.log(`\n🤖 I've automatically created a '${session.name}' session for you!`);
            console.log(`🎯 Focus: ${session.focus.join(', ')}`);
            console.log(`💡 Reason: ${session.reasoning}`);
            console.log(`📊 Confidence: ${(session.confidence * 100).toFixed(1)}%\n`);
        }
    }

    /**
     * Log session switches
     */
    logSessionSwitch(session, userInput) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            action: 'auto_session_switch',
            session_name: session.name,
            user_input_snippet: userInput.substring(0, 100) + (userInput.length > 100 ? '...' : ''),
            focus_areas: session.focus
        };

        this.appendToAutoSessionLog(logEntry);
        
        console.log(`\n🔄 Automatically switched to '${session.name}' session based on your request\n`);
    }

    /**
     * Append to auto-session log file
     */
    appendToAutoSessionLog(logEntry) {
        const logPath = path.join(this.projectRoot, '.warp-sessions', 'auto-session.log');
        
        try {
            const logLine = JSON.stringify(logEntry) + '\n';
            fs.appendFileSync(logPath, logLine);
        } catch (error) {
            console.warn('Could not write to auto-session log:', error.message);
        }
    }

    /**
     * Setup periodic session maintenance
     */
    setupPeriodicMaintenance() {
        // Run maintenance every 30 minutes
        setInterval(() => {
            try {
                this.intelligentSessionManager.autoManageSessionLifecycle();
            } catch (error) {
                console.warn('Auto-session maintenance failed:', error.message);
            }
        }, 30 * 60 * 1000);
    }

    /**
     * Setup auto-detection hooks
     */
    setupAutoDetection() {
        // This could be extended to hook into file system watchers,
        // editor plugins, or other development tools for real-time detection
    }

    /**
     * Get current auto-session status
     */
    getAutoSessionStatus() {
        const sessions = this.intelligentSessionManager.getActiveSessions();
        const autoSessions = sessions.filter(s => s.auto_created);
        
        return {
            enabled: this.isEnabled,
            total_sessions: sessions.length,
            auto_created_sessions: autoSessions.length,
            manual_sessions: sessions.length - autoSessions.length,
            sessions: sessions.map(s => ({
                name: s.name,
                auto_created: s.auto_created || false,
                confidence: s.confidence,
                focus: s.focus,
                last_active: s.last_active
            }))
        };
    }

    /**
     * Disable auto-session management
     */
    disable() {
        this.isEnabled = false;
        console.log('🚫 Auto-session management disabled');
    }

    /**
     * Enable auto-session management
     */
    enable() {
        this.isEnabled = true;
        this.initializeIntegration();
        console.log('✅ Auto-session management enabled');
    }

    /**
     * Force analyze current context and suggest session
     */
    async analyzeCurrentContext(userInput = '', currentFiles = []) {
        const session = await this.intelligentSessionManager.autoDetectAndCreateSession(
            userInput, 
            currentFiles, 
            true // force analysis
        );

        console.log('\n🔍 Context Analysis Results:');
        console.log(`📝 Detected Domain: ${session.sessionType || 'general'}`);
        console.log(`🎯 Focus Areas: ${session.focus.join(', ')}`);
        console.log(`📁 Recommended Directories: ${session.directories.join(', ')}`);
        console.log(`📊 Confidence: ${(session.confidence * 100).toFixed(1)}%`);
        console.log(`💡 Reasoning: ${session.reasoning}\n`);

        return session;
    }

    /**
     * Generate Warp Rules for AI agents that includes auto-session awareness
     */
    generateAutoSessionWarpRules() {
        return `
# 🤖 AUTO-SESSION AWARENESS RULES

## Critical Understanding
You are working with FULLY AUTOMATED session management. Sessions are created and managed automatically based on:
- Your conversation context
- Files you request to edit  
- Technical domains detected in your work
- Project structure analysis

## What This Means For You
1. **NO MANUAL SESSION CREATION NEEDED** - Sessions auto-create based on your work
2. **CONTEXT-AWARE SWITCHING** - System auto-switches sessions as your focus changes
3. **INTELLIGENT COORDINATION** - Conflict prevention works automatically
4. **TRANSPARENT OPERATION** - You'll be notified when sessions are created/switched

## Working with Auto-Sessions

### 🎯 When Auto-Sessions Trigger
Auto-sessions activate when you:
- Request frontend work (UI, components, styling) → Creates "frontend" session
- Request backend work (API, database, server) → Creates "backend" session  
- Request testing work (tests, specs, e2e) → Creates "testing" session
- Request DevOps work (deploy, docker, CI/CD) → Creates "devops" session
- Work on database (migrations, schema, SQL) → Creates "database" session

### 🔄 Session Auto-Switching
The system monitors your requests and automatically switches sessions when:
- You change from frontend to backend work
- You switch from coding to testing
- You move from development to deployment tasks
- Context analysis indicates better session fit

### 💡 How to Work With This System
1. **Just start working** - Describe what you want to do naturally
2. **Notice session notifications** - System will tell you which session was created/used
3. **Continue naturally** - Session coordination happens automatically
4. **Trust the automation** - Conflict prevention and file coordination work behind the scenes

### 🚨 Auto-Session Boundaries (Still Apply)
Even with automation, respect these boundaries:
- **Frontend sessions** avoid backend files (API, database, server config)
- **Backend sessions** avoid frontend files (components, styles, UI)
- **Testing sessions** focus on test files and quality assurance
- **Database sessions** handle schema, migrations, queries
- **DevOps sessions** manage deployment, CI/CD, infrastructure

### 🔍 Session Transparency
You can always check what's happening:
- Auto-session decisions are logged and explained
- Confidence levels are shown for all auto-creations
- Reasoning is provided for session choices
- Manual override is always possible if needed

### 🎯 Example Auto-Session Flow
**User:** "I need to create a login component with proper validation"
**System:** 🤖 Auto-created 'frontend-components' session (95% confidence)
          🎯 Focus: ui, components, validation
          💡 Reason: High confidence frontend work detected

**User:** "Now I need to create the authentication API endpoint"  
**System:** 🔄 Auto-switching to 'backend-api' session (92% confidence)
          🎯 Focus: api, auth, endpoints
          💡 Reason: Backend API work detected, switching context

## Key Benefits
- ✅ **Zero configuration** - Just start working
- ✅ **Intelligent adaptation** - System learns your patterns  
- ✅ **Automatic coordination** - No conflicts between sessions
- ✅ **Seamless switching** - Context changes handled automatically
- ✅ **Full transparency** - Always know why decisions were made

## Emergency Manual Override
If auto-sessions don't work correctly, you can always:
\`\`\`bash
# Disable auto-sessions temporarily
node scripts/coordinator.js auto-session disable

# Create manual session
node scripts/coordinator.js session create --name=manual-session

# Re-enable auto-sessions  
node scripts/coordinator.js auto-session enable
\`\`\`

**Bottom Line:** Focus on your development work. Let the intelligent session system handle coordination automatically! 🚀
`;
    }
}

module.exports = AutoSessionIntegration;
