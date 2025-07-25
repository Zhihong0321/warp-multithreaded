#!/usr/bin/env node

/**
 * Warp Multithreaded Framework - Version Detection & Update Enforcer
 * Prevents AI agents from working with outdated framework versions
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class VersionDetector {
    constructor() {
        this.currentVersion = '1.2.0';
        this.criticalFiles = [
            'core/intelligent-session-manager.js',
            'core/auto-session-integration.js',
            'warp-rules/enhanced-auto-session-coordination.md',
            'scripts/comprehensive-validation.js',
            'scripts/setup-tracker.js',
            'scripts/rules-checker.js',
            'CHANGELOG.md'
        ];
        this.frameworkRoot = this.findFrameworkRoot();
    }

    findFrameworkRoot() {
        // Try to find framework from current directory or common locations
        const possiblePaths = [
            process.cwd(),
            path.join(process.cwd(), 'warp-multithreaded'),
            path.join(process.cwd(), '.warp-framework'),
            path.join(require('os').homedir(), 'warp-multithreaded'),
            path.dirname(__dirname) // If running from within framework
        ];

        for (const testPath of possiblePaths) {
            const packagePath = path.join(testPath, 'package.json');
            if (fs.existsSync(packagePath)) {
                try {
                    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
                    if (pkg.name === 'warp-multithreaded') {
                        return testPath;
                    }
                } catch (error) {
                    // Continue checking other paths
                }
            }
        }
        return null;
    }

    analyzeInstallation() {
        console.log('🔍 CRITICAL: Analyzing Warp Multithreaded Framework Installation\n');

        if (!this.frameworkRoot) {
            return {
                status: 'NOT_FOUND',
                message: '❌ FRAMEWORK NOT FOUND: Warp Multithreaded Framework is not installed',
                action: 'INSTALL_REQUIRED',
                details: 'No valid framework installation detected in common locations'
            };
        }

        console.log(`📁 Framework location: ${this.frameworkRoot}`);

        // Check package.json version
        const packagePath = path.join(this.frameworkRoot, 'package.json');
        let installedVersion = 'unknown';
        
        try {
            const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            installedVersion = pkg.version;
        } catch (error) {
            return {
                status: 'CORRUPTED',
                message: '❌ CORRUPTED INSTALLATION: package.json is missing or corrupted',
                action: 'REINSTALL_REQUIRED',
                details: 'Framework package.json cannot be read'
            };
        }

        console.log(`📦 Installed version: ${installedVersion}`);
        console.log(`🎯 Current version: ${this.currentVersion}`);

        // Check if version is outdated
        if (this.isVersionOutdated(installedVersion)) {
            return {
                status: 'OUTDATED',
                message: `❌ OUTDATED VERSION: Framework v${installedVersion} is outdated (current: v${this.currentVersion})`,
                action: 'UPDATE_REQUIRED',
                installedVersion,
                currentVersion: this.currentVersion,
                details: 'Critical new features and bug fixes are missing'
            };
        }

        // Check for missing critical files
        const missingFiles = this.checkCriticalFiles();
        if (missingFiles.length > 0) {
            return {
                status: 'INCOMPLETE',
                message: `❌ INCOMPLETE INSTALLATION: ${missingFiles.length} critical files missing from v${this.currentVersion}`,
                action: 'UPDATE_REQUIRED',
                missingFiles,
                details: 'Installation is missing recent framework components'
            };
        }

        // Check if all systems are functional
        const functionalCheck = this.checkFunctionality();
        if (!functionalCheck.working) {
            return {
                status: 'BROKEN',
                message: '❌ BROKEN INSTALLATION: Framework components are not working properly',
                action: 'REINSTALL_REQUIRED',
                details: functionalCheck.error
            };
        }

        return {
            status: 'UP_TO_DATE',
            message: `✅ CURRENT: Framework v${installedVersion} is up-to-date and functional`,
            action: 'READY_TO_USE',
            version: installedVersion
        };
    }

    isVersionOutdated(installedVersion) {
        // Simple version comparison - in production, use semver
        const installedParts = installedVersion.split('.').map(n => parseInt(n));
        const currentParts = this.currentVersion.split('.').map(n => parseInt(n));

        for (let i = 0; i < 3; i++) {
            const installed = installedParts[i] || 0;
            const current = currentParts[i] || 0;
            
            if (installed < current) return true;
            if (installed > current) return false;
        }
        return false;
    }

    checkCriticalFiles() {
        const missing = [];
        
        for (const file of this.criticalFiles) {
            const filePath = path.join(this.frameworkRoot, file);
            if (!fs.existsSync(filePath)) {
                missing.push(file);
            }
        }
        
        return missing;
    }

    checkFunctionality() {
        try {
            // Test coordinator script
            const coordinatorPath = path.join(this.frameworkRoot, 'scripts', 'coordinator.js');
            if (!fs.existsSync(coordinatorPath)) {
                return { working: false, error: 'Coordinator script missing' };
            }

            // Quick functionality test
            const testOutput = execSync(`node "${coordinatorPath}" help`, { 
                encoding: 'utf8', 
                timeout: 10000,
                stdio: 'pipe'
            });

            if (!testOutput.includes('Warp AI Agent Framework')) {
                return { working: false, error: 'Coordinator not responding correctly' };
            }

            return { working: true };
        } catch (error) {
            return { working: false, error: error.message };
        }
    }

    generateUpdateInstructions(analysis) {
        switch (analysis.action) {
            case 'INSTALL_REQUIRED':
                return this.getInstallInstructions();
            case 'UPDATE_REQUIRED':
                return this.getUpdateInstructions(analysis);
            case 'REINSTALL_REQUIRED':
                return this.getReinstallInstructions();
            default:
                return '✅ No action required - framework is ready to use';
        }
    }

    getInstallInstructions() {
        return `
🚀 INSTALL WARP MULTITHREADED FRAMEWORK

1. Clone the repository:
   git clone https://github.com/Zhihong0321/warp-multithreaded.git
   cd warp-multithreaded

2. Install dependencies:
   npm install

3. Verify installation:
   npm run validate-comprehensive

4. Initialize your project:
   node scripts/coordinator.js init
`;
    }

    getUpdateInstructions(analysis) {
        return `
🔄 UPDATE WARP MULTITHREADED FRAMEWORK

Current installation is outdated or incomplete!

CRITICAL: You MUST update before proceeding:

1. Navigate to framework directory:
   cd "${this.frameworkRoot}"

2. Pull latest updates:
   git fetch origin
   git checkout main
   git pull origin main

3. Install new dependencies:
   npm install

4. Verify update:
   npm run validate-comprehensive

5. Check new version:
   node scripts/coordinator.js --version

Missing files (${analysis.missingFiles ? analysis.missingFiles.length : 'unknown'}):
${analysis.missingFiles ? analysis.missingFiles.map(f => `   - ${f}`).join('\n') : ''}

⚠️  DO NOT PROCEED until update is complete!
`;
    }

    getReinstallInstructions() {
        return `
🔧 REINSTALL WARP MULTITHREADED FRAMEWORK

Installation appears corrupted. Complete reinstall required:

1. Remove current installation:
   ${this.frameworkRoot ? `rm -rf "${this.frameworkRoot}"` : 'Locate and delete framework directory'}

2. Fresh install:
   git clone https://github.com/Zhihong0321/warp-multithreaded.git
   cd warp-multithreaded
   npm install

3. Verify installation:
   npm run validate-comprehensive

⚠️  CRITICAL: Do not use corrupted installation!
`;
    }

    generateAIWarning(analysis) {
        if (analysis.status === 'UP_TO_DATE') {
            return `
🤖 AI AGENT STATUS: Framework is current and ready for use
✅ Version ${analysis.version} detected
✅ All critical components present
✅ System functionality verified
`;
        }

        return `
🚨 CRITICAL WARNING FOR AI AGENTS 🚨

STATUS: ${analysis.status}
ACTION REQUIRED: ${analysis.action}

${analysis.message}

⚠️  AI AGENTS MUST NOT PROCEED until framework is updated!

🛑 DO NOT:
   - Initialize projects with outdated framework
   - Create sessions with missing components  
   - Proceed with development work
   - Ignore this warning

✅ REQUIRED ACTIONS:
   1. Update framework to v${this.currentVersion}
   2. Verify all components are present
   3. Run comprehensive validation
   4. Only then proceed with AI assistance

${this.generateUpdateInstructions(analysis)}
`;
    }

    runDetection() {
        const analysis = this.analyzeInstallation();
        const warning = this.generateAIWarning(analysis);
        
        console.log(warning);
        
        // Return exit code based on status
        if (analysis.status === 'UP_TO_DATE') {
            process.exit(0);
        } else {
            process.exit(1);
        }
    }
}

// Auto-run detection if called directly
if (require.main === module) {
    const detector = new VersionDetector();
    detector.runDetection();
}

module.exports = VersionDetector;
