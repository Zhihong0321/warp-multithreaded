#!/usr/bin/env node

/**
 * Warp Multithreaded Framework - Interactive Masterplan Wizard
 * Guides users through complete project setup and goal definition
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class MasterplanWizard {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        this.projectData = {
            name: '',
            description: '',
            goal: '',
            type: '',
            techStack: {
                strategy: '',
                frontend: '',
                backend: '',
                database: '',
                deployment: ''
            },
            hosting: {
                platform: '',
                database: '',
                auth: '',
                styling: ''
            },
            performance: {
                apiResponseTime: '200ms',
                expectedUsers: '100',
                targets: []
            },
            features: [],
            environment: process.platform
        };
        
        this.frameworkRoot = this.findFrameworkRoot();
        this.currentDir = process.cwd();
    }

    findFrameworkRoot() {
        let current = __dirname;
        while (current !== path.dirname(current)) {
            const packagePath = path.join(current, 'package.json');
            if (fs.existsSync(packagePath)) {
                try {
                    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
                    if (pkg.name === 'warp-multithreaded') {
                        return current;
                    }
                } catch (error) {
                    // Continue searching
                }
            }
            current = path.dirname(current);
        }
        return path.dirname(__dirname);
    }

    async question(prompt) {
        return new Promise(resolve => {
            this.rl.question(prompt, resolve);
        });
    }

    async choice(prompt, options) {
        console.log(`\n${prompt}`);
        options.forEach((option, index) => {
            console.log(`  ${index + 1}. ${option}`);
        });
        
        while (true) {
            const answer = await this.question('\nEnter your choice (number): ');
            const choice = parseInt(answer) - 1;
            if (choice >= 0 && choice < options.length) {
                return options[choice];
            }
            console.log('❌ Invalid choice. Please try again.');
        }
    }

    async confirm(prompt) {
        const answer = await this.question(`${prompt} (y/n): `);
        return answer.toLowerCase().startsWith('y');
    }

    log(message, level = 'info') {
        const icons = { info: '✅', warn: '⚠️', error: '❌', step: '🎯', success: '🎉' };
        console.log(`${icons[level]} ${message}`);
    }

    async runWizard() {
        console.log('\n🚀 Warp Multithreaded Framework - Masterplan Wizard');
        console.log('====================================================\n');
        
        this.log('Welcome! Let\'s set up your project masterplan.', 'step');
        console.log('This wizard will create project specifications that AI agents will use to understand your project.\n');

        try {
            // Check if we're in the right place
            await this.checkEnvironment();
            
            // Gather project information
            await this.gatherProjectInfo();
            await this.selectProjectType();
            await this.configureTechStack();
            await this.configureHosting();
            await this.configurePerformance();
            await this.gatherFeatures();
            
            // Generate files
            await this.generateMasterplanFiles();
            
            // Success and next steps
            await this.showCompletionMessage();
            
        } catch (error) {
            this.log(`Wizard failed: ${error.message}`, 'error');
            process.exit(1);
        } finally {
            this.rl.close();
        }
    }

    async checkEnvironment() {
        this.log('Checking environment...', 'step');
        
        // Check if framework is available
        if (!this.frameworkRoot || !fs.existsSync(path.join(this.frameworkRoot, 'package.json'))) {
            throw new Error('Warp Multithreaded Framework not found. Please run this from a project with the framework installed.');
        }
        
        // Check if we're in a project directory (not the framework directory)
        if (this.currentDir === this.frameworkRoot) {
            console.log('⚠️  You\'re in the framework directory.');
            const shouldContinue = await this.confirm('Do you want to set up the framework directory as a project?');
            if (!shouldContinue) {
                console.log('Please navigate to your project directory and run the wizard again.');
                process.exit(0);
            }
        }
        
        this.log('Environment check passed!', 'info');
    }

    async gatherProjectInfo() {
        this.log('Project Information', 'step');
        
        // Project name
        const defaultName = path.basename(this.currentDir);
        this.projectData.name = await this.question(`Project name (${defaultName}): `) || defaultName;
        
        // Project description
        this.projectData.description = await this.question('Project description: ');
        
        // Project goal - the most important part
        console.log('\n🎯 Project Goal (CRITICAL):');
        console.log('This is the most important part - describe what you want to build.');
        console.log('Be specific and clear. AI agents will use this to guide all development decisions.\n');
        
        while (!this.projectData.goal.trim()) {
            this.projectData.goal = await this.question('What do you want to build? ');
            if (!this.projectData.goal.trim()) {
                console.log('❌ Project goal is required. Please describe what you want to build.');
            }
        }
    }

    async selectProjectType() {
        this.log('Project Type Selection', 'step');
        
        const types = [
            'Web Application (Frontend + Backend)',
            'Frontend Only (React/Vue/Angular)',
            'Backend API (REST/GraphQL)',
            'Full-Stack SaaS Application',
            'Mobile App (React Native/Flutter)',
            'Desktop Application (Electron)',
            'CLI Tool/Package',
            'Other/Custom'
        ];
        
        this.projectData.type = await this.choice('What type of project are you building?', types);
    }

    async configureTechStack() {
        this.log('Technology Stack Configuration', 'step');
        
        const strategies = [
            'Let AI Decide (Recommended) - AI will choose the best tech stack based on your project',
            'I\'ll specify the technologies - Choose specific frameworks and tools',
            'Use Project Defaults - Use common, proven technologies'
        ];
        
        const strategy = await this.choice('How would you like to handle technology choices?', strategies);
        
        if (strategy.includes('Let AI Decide')) {
            this.projectData.techStack.strategy = 'ai-decide';
            this.log('AI will analyze your project and choose optimal technologies!', 'info');
        } else if (strategy.includes('specify')) {
            this.projectData.techStack.strategy = 'manual';
            await this.specifyTechStack();
        } else {
            this.projectData.techStack.strategy = 'defaults';
            this.log('Will use proven, common technologies for your project type.', 'info');
        }
    }

    async specifyTechStack() {
        console.log('\n🔧 Specify Your Tech Stack:');
        
        if (this.projectData.type.includes('Frontend') || this.projectData.type.includes('Web') || this.projectData.type.includes('SaaS')) {
            const frontendOptions = ['React', 'Vue.js', 'Angular', 'Next.js', 'Svelte', 'Other'];
            this.projectData.techStack.frontend = await this.choice('Frontend framework:', frontendOptions);
        }
        
        if (this.projectData.type.includes('Backend') || this.projectData.type.includes('Web') || this.projectData.type.includes('SaaS') || this.projectData.type.includes('API')) {
            const backendOptions = ['Node.js/Express', 'Python/FastAPI', 'Python/Django', 'Java/Spring', 'C#/.NET', 'Go', 'Other'];
            this.projectData.techStack.backend = await this.choice('Backend framework:', backendOptions);
        }
        
        if (!this.projectData.type.includes('Frontend Only')) {
            const dbOptions = ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Redis', 'Supabase', 'Firebase', 'Other'];
            this.projectData.techStack.database = await this.choice('Database:', dbOptions);
        }
    }

    async configureHosting() {
        this.log('Hosting & Services Configuration', 'step');
        
        const hostingOptions = [
            'Vercel (Recommended for Next.js/React)',
            'Railway (Recommended for full-stack)',
            'Netlify (Frontend focus)',
            'Heroku (Traditional deployment)',
            'AWS/Azure/GCP (Cloud platforms)',
            'DigitalOcean/Linode (VPS)',
            'Docker/Self-hosted',
            'Not sure - Let AI decide'
        ];
        
        const hosting = await this.choice('Where do you plan to host your project?', hostingOptions);
        
        if (hosting.includes('Railway')) {
            this.projectData.hosting.platform = 'railway';
            this.projectData.hosting.database = 'postgresql';
        } else if (hosting.includes('Vercel')) {
            this.projectData.hosting.platform = 'vercel';
            this.projectData.hosting.database = 'postgresql';
        } else if (hosting.includes('Netlify')) {
            this.projectData.hosting.platform = 'netlify';
        } else {
            this.projectData.hosting.platform = hosting.toLowerCase().split('(')[0].trim().replace(/\s+/g, '-');
        }
        
        // Authentication service
        if (this.projectData.type.includes('SaaS') || this.projectData.type.includes('Web')) {
            const authOptions = [
                'Clerk (Recommended)',
                'Auth0',
                'Firebase Auth',
                'NextAuth.js',
                'Custom authentication',
                'No authentication needed'
            ];
            
            const auth = await this.choice('Authentication service:', authOptions);
            this.projectData.hosting.auth = auth.toLowerCase().split('(')[0].trim();
        }
    }

    async configurePerformance() {
        this.log('Performance Requirements', 'step');
        
        // API Response Time
        const responseOptions = ['100ms (High performance)', '200ms (Standard)', '500ms (Relaxed)', '1s+ (Basic)'];
        const responseTime = await this.choice('Target API response time:', responseOptions);
        this.projectData.performance.apiResponseTime = responseTime.split('(')[0].trim();
        
        // Expected Users
        const userOptions = ['10-100 (Small)', '100-1K (Medium)', '1K-10K (Large)', '10K+ (Enterprise)'];
        const users = await this.choice('Expected number of users:', userOptions);
        this.projectData.performance.expectedUsers = users.split('(')[0].trim();
        
        // Additional performance targets
        const performanceFeatures = [
            'Real-time updates (WebSockets)',
            'File upload/download',
            'Image/video processing',
            'Search functionality',
            'Caching requirements',
            'Mobile optimization',
            'SEO optimization'
        ];
        
        console.log('\n📊 Additional performance considerations (select multiple):');
        for (let i = 0; i < performanceFeatures.length; i++) {
            const feature = performanceFeatures[i];
            const include = await this.confirm(`Include ${feature}?`);
            if (include) {
                this.projectData.performance.targets.push(feature);
            }
        }
    }

    async gatherFeatures() {
        this.log('Key Features & Requirements', 'step');
        
        console.log('\n📋 Let\'s identify the key features of your project:');
        console.log('List the main features you want to build (one per line, empty line to finish):\n');
        
        const features = [];
        let featureIndex = 1;
        
        while (true) {
            const feature = await this.question(`Feature ${featureIndex}: `);
            if (!feature.trim()) break;
            features.push(feature.trim());
            featureIndex++;
        }
        
        this.projectData.features = features;
        
        if (features.length === 0) {
            console.log('ℹ️  No specific features listed. AI will infer features from your project goal.');
        }
    }

    async generateMasterplanFiles() {
        this.log('Generating masterplan files...', 'step');
        
        // Create .warp-masterplan directory
        const masterplanDir = path.join(this.currentDir, '.warp-masterplan');
        if (!fs.existsSync(masterplanDir)) {
            fs.mkdirSync(masterplanDir, { recursive: true });
        }
        
        // Generate masterplan-goal.md
        await this.generateGoalFile();
        
        // Generate masterplan-config.json
        await this.generateConfigFile();
        
        // Generate .warp-masterplan/masterplan.md
        await this.generateMasterplanOverview();
        
        // Generate .warp-masterplan/tasks.json
        await this.generateTasksFile();
        
        // Generate .warp-masterplan/decisions.md
        await this.generateDecisionsFile();
        
        // Generate unified rules using existing script
        await this.generateUnifiedRules();
        
        this.log('All masterplan files generated successfully!', 'success');
    }

    async generateGoalFile() {
        const goalContent = `# ${this.projectData.name} - Project Goal

## Current Project Goal

${this.projectData.goal}

## Project Description

${this.projectData.description || 'No description provided.'}

---

*This file contains the live project goal. AI agents will read this file to understand what you're building.*
*You can edit this file anytime to update your project direction.*

Last updated: ${new Date().toISOString()}
`;
        
        fs.writeFileSync(path.join(this.currentDir, 'masterplan-goal.md'), goalContent);
        this.log('Created masterplan-goal.md', 'info');
    }

    async generateConfigFile() {
        const config = {
            project: {
                name: this.projectData.name,
                description: this.projectData.description,
                type: this.projectData.type,
                goal: this.projectData.goal,
                created: new Date().toISOString()
            },
            techStack: this.projectData.techStack,
            hosting: this.projectData.hosting,
            performance: this.projectData.performance,
            features: this.projectData.features,
            environment: {
                platform: this.projectData.environment,
                frameworkVersion: '1.3.0'
            }
        };
        
        fs.writeFileSync(
            path.join(this.currentDir, 'masterplan-config.json'), 
            JSON.stringify(config, null, 2)
        );
        this.log('Created masterplan-config.json', 'info');
    }

    async generateMasterplanOverview() {
        const overviewContent = `# ${this.projectData.name} - Masterplan Overview

## Project Summary
${this.projectData.description}

## Goal
${this.projectData.goal}

## Project Type
${this.projectData.type}

## Technology Stack
- **Strategy**: ${this.projectData.techStack.strategy}
${this.projectData.techStack.frontend ? `- **Frontend**: ${this.projectData.techStack.frontend}` : ''}
${this.projectData.techStack.backend ? `- **Backend**: ${this.projectData.techStack.backend}` : ''}
${this.projectData.techStack.database ? `- **Database**: ${this.projectData.techStack.database}` : ''}

## Hosting & Services
- **Platform**: ${this.projectData.hosting.platform || 'TBD'}
${this.projectData.hosting.auth ? `- **Authentication**: ${this.projectData.hosting.auth}` : ''}

## Performance Requirements
- **API Response Time**: ${this.projectData.performance.apiResponseTime}
- **Expected Users**: ${this.projectData.performance.expectedUsers}
${this.projectData.performance.targets.length > 0 ? `- **Additional Requirements**: ${this.projectData.performance.targets.join(', ')}` : ''}

## Key Features
${this.projectData.features.length > 0 ? 
    this.projectData.features.map(f => `- ${f}`).join('\n') : 
    '- Features will be determined based on project goal'
}

## Development Notes
- Created with Warp Multithreaded Framework v1.3.0
- AI agents will use this masterplan to guide development
- Update masterplan-goal.md to change project direction

---
Generated: ${new Date().toISOString()}
`;
        
        const masterplanDir = path.join(this.currentDir, '.warp-masterplan');
        fs.writeFileSync(path.join(masterplanDir, 'masterplan.md'), overviewContent);
        this.log('Created .warp-masterplan/masterplan.md', 'info');
    }

    async generateTasksFile() {
        const initialTasks = {
            active: [],
            completed: [],
            backlog: this.projectData.features.map((feature, index) => ({
                id: `task-${index + 1}`,
                title: feature,
                description: `Implement ${feature}`,
                priority: 'medium',
                assignedSession: null,
                created: new Date().toISOString(),
                status: 'backlog'
            })),
            metadata: {
                created: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
                totalTasks: this.projectData.features.length
            }
        };
        
        const masterplanDir = path.join(this.currentDir, '.warp-masterplan');
        fs.writeFileSync(
            path.join(masterplanDir, 'tasks.json'), 
            JSON.stringify(initialTasks, null, 2)
        );
        this.log('Created .warp-masterplan/tasks.json', 'info');
    }

    async generateDecisionsFile() {
        const decisionsContent = `# Technical Decisions

## Architecture Decisions

### Technology Stack
- **Strategy**: ${this.projectData.techStack.strategy}
- **Reasoning**: ${this.getTechStackReasoning()}

### Hosting Platform
- **Choice**: ${this.projectData.hosting.platform || 'TBD'}
- **Reasoning**: ${this.getHostingReasoning()}

### Performance Targets
- **API Response**: ${this.projectData.performance.apiResponseTime}
- **User Scale**: ${this.projectData.performance.expectedUsers}
- **Reasoning**: Based on expected usage patterns and performance requirements

## Development Decisions

### Session Strategy
- Using Warp Multithreaded Framework for coordinated development
- Auto-session management enabled
- Session boundaries defined by technology stack

### Project Structure
- Following framework conventions
- Masterplan-driven development approach
- Goal-oriented task management

---

*This file tracks important technical decisions made during development.*
*Update this file when making significant architectural changes.*

Last updated: ${new Date().toISOString()}
`;
        
        const masterplanDir = path.join(this.currentDir, '.warp-masterplan');
        fs.writeFileSync(path.join(masterplanDir, 'decisions.md'), decisionsContent);
        this.log('Created .warp-masterplan/decisions.md', 'info');
    }

    getTechStackReasoning() {
        switch (this.projectData.techStack.strategy) {
            case 'ai-decide':
                return 'AI will analyze project requirements and choose optimal technologies for performance, developer experience, and project goals.';
            case 'manual':
                return 'Manual technology selection based on team preferences and specific requirements.';
            case 'defaults':
                return 'Using proven, industry-standard technologies for reliability and community support.';
            default:
                return 'Technology selection strategy not specified.';
        }
    }

    getHostingReasoning() {
        const platform = this.projectData.hosting.platform;
        if (platform === 'railway') return 'Railway chosen for excellent full-stack deployment experience and database integration.';
        if (platform === 'vercel') return 'Vercel chosen for optimal React/Next.js deployment and performance.';
        if (platform === 'netlify') return 'Netlify chosen for frontend deployment and JAMstack applications.';
        return 'Hosting platform chosen based on project requirements and deployment preferences.';
    }

    async generateUnifiedRules() {
        try {
            const generateRulesScript = path.join(this.frameworkRoot, 'scripts', 'generate-unified-rules.js');
            if (fs.existsSync(generateRulesScript)) {
                // Import and run the existing rules generator
                const { execSync } = require('child_process');
                execSync(`node "${generateRulesScript}"`, { cwd: this.currentDir, stdio: 'inherit' });
                this.log('Generated unified AI rules', 'info');
            } else {
                this.log('Rules generator not found, skipping unified rules generation', 'warn');
            }
        } catch (error) {
            this.log(`Could not generate unified rules: ${error.message}`, 'warn');
        }
    }

    async showCompletionMessage() {
        console.log('\n🎉 Masterplan Setup Complete!');
        console.log('================================\n');
        
        this.log('Files created:', 'info');
        console.log('  📄 masterplan-goal.md - Your project goal (edit anytime)');
        console.log('  ⚙️  masterplan-config.json - Project configuration');
        console.log('  📋 .warp-masterplan/masterplan.md - Complete project overview');
        console.log('  ✅ .warp-masterplan/tasks.json - Task management');
        console.log('  🎯 .warp-masterplan/decisions.md - Technical decisions');
        
        console.log('\n🚀 Next Steps:');
        console.log('  1. Ensure Warp Multithreaded Framework rule is in your Warp Drive');
        console.log('  2. Tell your AI agent: "Follow the Warp Multithreaded Framework rule"');
        console.log('  3. Start describing what you want to build!');
        
        console.log('\n💡 Pro Tips:');
        console.log('  • Edit masterplan-goal.md anytime to change direction');
        console.log('  • AI agents will automatically read your project specifications');
        console.log('  • Use "npm run goal" to manage your goal via CLI');
        console.log('  • Use "npm run dashboard" for web-based project management');
        
        console.log('\n🔧 Validation:');
        console.log('  Run "npm run health-check" to verify everything is working\n');
        
        this.log('Ready to start building! 🚀', 'success');
    }
}

// Run wizard if called directly
if (require.main === module) {
    const wizard = new MasterplanWizard();
    wizard.runWizard().catch(error => {
        console.error('❌ Wizard failed:', error.message);
        process.exit(1);
    });
}

module.exports = MasterplanWizard;
