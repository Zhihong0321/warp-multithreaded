/**
 * Warp AI Agent Framework - Demo
 * Demonstrates how to use the framework for coordinating multiple sessions
 */

const SessionManager = require('../core/session-manager');
const fs = require('fs');
const path = require('path');

class FrameworkDemo {
    constructor() {
        this.demoDir = path.join(__dirname, 'demo-project');
        this.sessionManager = null;
    }

    async run() {
        console.log('🚀 Warp AI Agent Framework Demo\n');
        
        try {
            await this.setupDemoProject();
            await this.demonstrateBasicUsage();
            await this.demonstrateConflictDetection();
            await this.demonstrateTaskSuggestions();
            await this.cleanup();
            
            console.log('\n✅ Demo completed successfully!');
            console.log('🎯 Ready to use the framework in your own projects');
        } catch (error) {
            console.error('❌ Demo failed:', error.message);
            process.exit(1);
        }
    }

    async setupDemoProject() {
        console.log('📁 Setting up demo project...\n');
        
        // Create demo directory
        if (fs.existsSync(this.demoDir)) {
            fs.rmSync(this.demoDir, { recursive: true });
        }
        fs.mkdirSync(this.demoDir, { recursive: true });
        
        // Create sample project structure
        const structure = {
            'src/components': ['Button.tsx', 'Navbar.tsx', 'Modal.tsx'],
            'src/styles': ['main.css', 'components.css'],
            'src/api': ['auth.js', 'users.js', 'posts.js'],
            'tests': ['auth.test.js', 'components.test.js']
        };

        Object.entries(structure).forEach(([dir, files]) => {
            const fullDir = path.join(this.demoDir, dir);
            fs.mkdirSync(fullDir, { recursive: true });
            
            files.forEach(file => {
                const filePath = path.join(fullDir, file);
                fs.writeFileSync(filePath, `// Sample ${file} content\n`);
            });
        });

        // Initialize session manager with demo directory
        this.sessionManager = new SessionManager(this.demoDir);
        
        console.log('✅ Demo project structure created');
    }

    async demonstrateBasicUsage() {
        console.log('\n🔄 Demonstrating Basic Session Management...\n');
        
        // Create multiple sessions
        const sessions = [
            { name: 'frontend', focus: ['ui', 'components'], directories: ['src/components', 'src/styles'] },
            { name: 'backend', focus: ['api', 'database'], directories: ['src/api'] },
            { name: 'testing', focus: ['tests', 'quality'], directories: ['tests'] }
        ];

        sessions.forEach(config => {
            const session = this.sessionManager.createSession(config.name, config);
            console.log(`   Created session: ${session.name} (Focus: ${session.focus.join(', ')})`);
        });

        // Show active sessions
        console.log('\n📋 Active Sessions:');
        const activeSessions = this.sessionManager.getActiveSessions();
        activeSessions.forEach(session => {
            console.log(`   - ${session.name}: ${session.focus.join(', ')}`);
        });

        // Simulate file locking
        console.log('\n🔒 Simulating File Operations:');
        
        const lockResult1 = this.sessionManager.lockFile('frontend', 'src/components/Button.tsx');
        console.log(`   Frontend locked Button.tsx: ${lockResult1.success ? '✅' : '❌'}`);
        
        const lockResult2 = this.sessionManager.lockFile('backend', 'src/api/auth.js');
        console.log(`   Backend locked auth.js: ${lockResult2.success ? '✅' : '❌'}`);

        // Update session with current task
        this.sessionManager.updateSession('frontend', {
            current_task: 'Adding hover animations to Button component'
        });
        
        this.sessionManager.updateSession('backend', {
            current_task: 'Implementing JWT authentication'
        });

        console.log('   ✅ Sessions updated with current tasks');
    }

    async demonstrateConflictDetection() {
        console.log('\n⚠️  Demonstrating Conflict Detection...\n');
        
        // Create a conflict by having two sessions work on the same file
        this.sessionManager.lockFile('frontend', 'src/styles/main.css');
        const conflictResult = this.sessionManager.lockFile('testing', 'src/styles/main.css');
        
        console.log(`   Frontend locked main.css: ✅`);
        console.log(`   Testing tried to lock main.css: ${conflictResult.success ? '✅' : '❌'}`);
        
        if (!conflictResult.success) {
            console.log(`   🚨 Conflict detected! File in use by: ${conflictResult.conflicting_sessions.join(', ')}`);
        }

        // Check all conflicts
        const conflicts = this.sessionManager.checkConflicts();
        console.log(`\n📊 Total conflicts detected: ${conflicts.length}`);
        
        conflicts.forEach((conflict, index) => {
            console.log(`   ${index + 1}. ${conflict.file} (Sessions: ${conflict.sessions.join(', ')})`);
        });
    }

    async demonstrateTaskSuggestions() {
        console.log('\n🎯 Demonstrating Task Distribution Suggestions...\n');
        
        const sampleTasks = [
            'Fix navbar responsive design',
            'Add user authentication endpoint',
            'Write tests for login functionality',
            'Style the modal component',
            'Implement database migrations',
            'Add error handling to API calls'
        ];

        console.log('📝 Sample tasks to distribute:');
        sampleTasks.forEach((task, index) => {
            console.log(`   ${index + 1}. ${task}`);
        });

        const suggestions = this.sessionManager.suggestTaskDistribution(sampleTasks);
        
        console.log('\n💡 Recommended task distribution:');
        suggestions.forEach((suggestion, index) => {
            console.log(`   ${index + 1}. "${suggestion.task}"`);
            console.log(`      👉 Session: ${suggestion.recommended_session}`);
            console.log(`      📝 Reason: ${suggestion.reason}`);
        });
    }

    async cleanup() {
        console.log('\n🧹 Cleaning up demo...');
        
        // Close all sessions
        const activeSessions = this.sessionManager.getActiveSessions();
        activeSessions.forEach(session => {
            this.sessionManager.closeSession(session.name);
        });

        // Remove demo directory
        if (fs.existsSync(this.demoDir)) {
            fs.rmSync(this.demoDir, { recursive: true });
        }

        console.log('✅ Demo cleanup completed');
    }
}

// Run demo if called directly
if (require.main === module) {
    const demo = new FrameworkDemo();
    demo.run().catch(console.error);
}

module.exports = FrameworkDemo;
