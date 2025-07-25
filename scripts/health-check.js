#!/usr/bin/env node

/**
 * Warp Multithreaded Framework - Health Check Script
 * Diagnoses installation and configuration issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class HealthChecker {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.frameworkRoot = path.dirname(__dirname);
        this.currentDir = process.cwd();
    }

    log(message, level = 'info') {
        const icons = {
            info: '✅',
            warn: '⚠️',
            error: '❌',
            step: '🔍'
        };
        
        const colors = {
            info: '\x1b[32m',  // Green
            warn: '\x1b[33m',  // Yellow
            error: '\x1b[31m', // Red
            step: '\x1b[36m',  // Cyan
            reset: '\x1b[0m'
        };
        
        console.log(`${colors[level]}${icons[level]} ${message}${colors.reset}`);
        
        if (level === 'error') this.errors.push(message);
        if (level === 'warn') this.warnings.push(message);
    }

    async runHealthCheck() {
        console.log('\n🔍 Warp Multithreaded Framework - Health Check');
        console.log('===============================================\n');

        try {
            await this.checkSystemRequirements();
            await this.checkFrameworkInstallation();
            await this.checkProjectSetup();
            await this.checkFrameworkFunctionality();
            await this.provideSummary();
        } catch (error) {
            this.log(`Health check failed: ${error.message}`, 'error');
            process.exit(1);
        }
    }

    async checkSystemRequirements() {
        this.log('Checking system requirements...', 'step');

        // Check Node.js version
        try {
            const nodeVersion = process.version;
            const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
            
            if (majorVersion >= 14) {
                this.log(`Node.js: ${nodeVersion}`, 'info');
            } else {
                this.log(`Node.js version too old: ${nodeVersion} (required: >=14.0.0)`, 'error');
            }
        } catch (error) {
            this.log('Node.js: Not available', 'error');
        }

        // Check npm
        try {
            const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
            this.log(`npm: ${npmVersion}`, 'info');
        } catch (error) {
            this.log('npm: Not available', 'error');
        }

        // Check Git (optional but recommended)
        try {
            const gitVersion = execSync('git --version', { encoding: 'utf8' }).trim();
            this.log(`Git: ${gitVersion}`, 'info');
        } catch (error) {
            this.log('Git: Not available (optional)', 'warn');
        }

        // Check operating system
        const platform = process.platform;
        const arch = process.arch;
        this.log(`Platform: ${platform} ${arch}`, 'info');

        // Check if running in Warp terminal
        if (process.env.TERM_PROGRAM === 'WarpTerminal') {
            this.log('Warp Terminal: Detected', 'info');
        } else {
            this.log('Warp Terminal: Not detected (that\'s okay)', 'warn');
        }
    }

    async checkFrameworkInstallation() {
        this.log('Checking framework installation...', 'step');

        // Check if we're in the framework directory
        const packageJsonPath = path.join(this.frameworkRoot, 'package.json');
        
        if (fs.existsSync(packageJsonPath)) {
            try {
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                this.log(`Framework: ${packageJson.name} v${packageJson.version}`, 'info');
            } catch (error) {
                this.log('Framework: package.json corrupted', 'error');
            }
        } else {
            this.log('Framework: package.json not found', 'error');
        }

        // Check core files
        const coreFiles = [
            'core/session-manager.js',
            'core/masterplan-manager.js',
            'scripts/coordinator.js',
            'scripts/validate-system.js'
        ];

        for (const file of coreFiles) {
            const filePath = path.join(this.frameworkRoot, file);
            if (fs.existsSync(filePath)) {
                this.log(`Core file: ${file}`, 'info');
            } else {
                this.log(`Core file missing: ${file}`, 'error');
            }
        }

        // Check Warp Rules
        const warpRulesDir = path.join(this.frameworkRoot, 'warp-rules');
        if (fs.existsSync(warpRulesDir)) {
            const ruleFiles = fs.readdirSync(warpRulesDir).filter(f => f.endsWith('.md'));
            this.log(`Warp Rules: ${ruleFiles.length} files found`, 'info');
            
            const requiredRules = [
                'enhanced-multi-session-coordination.md',
                'enhanced-masterplan-session-rules.md'
            ];
            
            for (const rule of requiredRules) {
                if (ruleFiles.includes(rule)) {
                    this.log(`Required rule: ${rule}`, 'info');
                } else {
                    this.log(`Missing rule: ${rule}`, 'error');
                }
            }
        } else {
            this.log('Warp Rules directory: Not found', 'error');
        }

        // Check node_modules
        const nodeModulesPath = path.join(this.frameworkRoot, 'node_modules');
        if (fs.existsSync(nodeModulesPath)) {
            this.log('Dependencies: Installed', 'info');
        } else {
            this.log('Dependencies: Not installed (run: npm install)', 'error');
        }
    }

    async checkProjectSetup() {
        this.log('Checking current project setup...', 'step');

        // Check if we're in a project with framework initialized
        const configFiles = [
            '.warp-config.json',
            '.warp-coordination.md'
        ];

        let hasFrameworkFiles = false;
        for (const file of configFiles) {
            const filePath = path.join(this.currentDir, file);
            if (fs.existsSync(filePath)) {
                this.log(`Project file: ${file}`, 'info');
                hasFrameworkFiles = true;
            }
        }

        if (!hasFrameworkFiles) {
            this.log('Project: Framework not initialized (run: init command)', 'warn');
        }

        // Check session directory
        const sessionsDir = path.join(this.currentDir, '.warp-sessions');
        if (fs.existsSync(sessionsDir)) {
            const sessionFiles = fs.readdirSync(sessionsDir).filter(f => f.endsWith('.json'));
            if (sessionFiles.length > 0) {
                this.log(`Active sessions: ${sessionFiles.length}`, 'info');
            } else {
                this.log('Active sessions: None', 'warn');
            }
        } else {
            this.log('Sessions directory: Not found', 'warn');
        }

        // Check masterplan directory
        const masterplanDir = path.join(this.currentDir, '.warp-masterplan');
        if (fs.existsSync(masterplanDir)) {
            const masterplanFiles = [
                'masterplan.md',
                'tasks.json',
                'session-log.md',
                'decisions.md',
                'context.json'
            ];
            
            let masterplanFilesExist = 0;
            for (const file of masterplanFiles) {
                if (fs.existsSync(path.join(masterplanDir, file))) {
                    masterplanFilesExist++;
                }
            }
            
            if (masterplanFilesExist === masterplanFiles.length) {
                this.log('Masterplan: Fully initialized', 'info');
            } else {
                this.log(`Masterplan: Partially initialized (${masterplanFilesExist}/${masterplanFiles.length} files)`, 'warn');
            }
        } else {
            this.log('Masterplan: Not initialized', 'warn');
        }
    }

    async checkFrameworkFunctionality() {
        this.log('Testing framework functionality...', 'step');

        const coordinatorPath = path.join(this.frameworkRoot, 'scripts', 'coordinator.js');
        
        // Test coordinator help
        try {
            const helpOutput = execSync(`node "${coordinatorPath}" --help`, { 
                encoding: 'utf8',
                timeout: 10000 
            });
            
            if (helpOutput.includes('Warp AI Agent Framework')) {
                this.log('Coordinator CLI: Working', 'info');
            } else {
                this.log('Coordinator CLI: Unexpected output', 'warn');
            }
        } catch (error) {
            this.log(`Coordinator CLI: Failed (${error.message})`, 'error');
        }

        // Test validation script
        try {
            const validatePath = path.join(this.frameworkRoot, 'scripts', 'validate-system.js');
            if (fs.existsSync(validatePath)) {
                this.log('Validation script: Available', 'info');
            } else {
                this.log('Validation script: Missing', 'warn');
            }
        } catch (error) {
            this.log('Validation script: Error checking', 'warn');
        }

        // Test dashboard server (check if dependencies exist)
        try {
            const dashboardPath = path.join(this.frameworkRoot, 'dashboard', 'server.js');
            if (fs.existsSync(dashboardPath)) {
                this.log('Dashboard: Available', 'info');
            } else {
                this.log('Dashboard: Not available', 'warn');
            }
        } catch (error) {
            this.log('Dashboard: Error checking', 'warn');
        }
    }

    async provideSummary() {
        console.log('\n📊 Health Check Summary');
        console.log('=======================\n');

        if (this.errors.length === 0 && this.warnings.length === 0) {
            this.log('Perfect health! All systems operational.', 'info');
        } else {
            if (this.errors.length > 0) {
                console.log('\x1b[31m❌ ERRORS FOUND:\x1b[0m');
                this.errors.forEach(error => console.log(`   - ${error}`));
                console.log('');
            }

            if (this.warnings.length > 0) {
                console.log('\x1b[33m⚠️  WARNINGS:\x1b[0m');
                this.warnings.forEach(warning => console.log(`   - ${warning}`));
                console.log('');
            }
        }

        // Provide recommendations
        this.provideRecommendations();
    }

    provideRecommendations() {
        console.log('💡 Recommendations:\n');

        if (this.errors.some(e => e.includes('Node.js'))) {
            console.log('📥 Install Node.js 14+ from: https://nodejs.org/');
        }

        if (this.errors.some(e => e.includes('package.json'))) {
            console.log('🔧 Reinstall framework: Delete directory and run setup script again');
        }

        if (this.errors.some(e => e.includes('Dependencies'))) {
            console.log(`📦 Install dependencies: cd "${this.frameworkRoot}" && npm install`);
        }

        if (this.warnings.some(w => w.includes('Framework not initialized'))) {
            console.log(`🚀 Initialize project: node "${path.join(this.frameworkRoot, 'scripts', 'coordinator.js')}" init`);
        }

        if (this.warnings.some(w => w.includes('Masterplan: Not initialized'))) {
            console.log(`🧠 Initialize masterplan: node "${path.join(this.frameworkRoot, 'scripts', 'coordinator.js')}" masterplan init`);
        }

        console.log('\n📚 For detailed setup instructions, see:');
        console.log(`   ${path.join(this.frameworkRoot, 'INSTALLATION.md')}`);
        console.log('\n🎯 For quick start, see:');
        console.log(`   ${path.join(this.frameworkRoot, 'QUICK_START_RULES.md')}`);

        console.log('\n🆘 If problems persist:');
        console.log('   1. Check the troubleshooting section in INSTALLATION.md');
        console.log('   2. Run this health check again after fixes');
        console.log('   3. Create an issue with the output above');

        // Exit with appropriate code
        if (this.errors.length > 0) {
            console.log('\n❌ Health check failed due to errors.');
            process.exit(1);
        } else if (this.warnings.length > 0) {
            console.log('\n⚠️  Health check completed with warnings.');
            process.exit(0);
        } else {
            console.log('\n✅ Health check passed! Framework is ready to use.');
            process.exit(0);
        }
    }
}

// Run health check if called directly
if (require.main === module) {
    const checker = new HealthChecker();
    checker.runHealthCheck().catch(error => {
        console.error('❌ Health check crashed:', error.message);
        process.exit(1);
    });
}

module.exports = HealthChecker;
