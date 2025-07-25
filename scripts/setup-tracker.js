#!/usr/bin/env node

/**
 * Warp Multithreaded - Setup Status Tracker
 * Tracks setup completion status for self-check system
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

class SetupTracker {
    constructor() {
        this.setupFile = path.join(os.homedir(), '.warp-multithreaded-setup.json');
        this.frameworkRoot = path.resolve(__dirname, '..');
        this.loadStatus();
    }

    /**
     * Load current setup status
     */
    loadStatus() {
        try {
            if (fs.existsSync(this.setupFile)) {
                this.status = JSON.parse(fs.readFileSync(this.setupFile, 'utf8'));
            } else {
                this.status = this.getDefaultStatus();
                this.saveStatus();
            }
        } catch (error) {
            console.warn('Failed to load setup status, using defaults:', error.message);
            this.status = this.getDefaultStatus();
        }
    }

    /**
     * Get default setup status
     */
    getDefaultStatus() {
        return {
            setup_version: '1.0.0',
            created: new Date().toISOString(),
            last_updated: new Date().toISOString(),
            framework_downloaded: false,
            dependencies_installed: false,
            rules_generated: false,
            rules_added_to_warp: false,
            setup_verified: false,
            setup_complete: false,
            first_run: true,
            user_confirmed_rules: false,
            installation_path: null,
            setup_steps: {
                step1_download: { done: false, timestamp: null },
                step2_install_deps: { done: false, timestamp: null },
                step3_generate_instructions: { done: false, timestamp: null },
                step4_add_rules: { done: false, timestamp: null, user_action: true },
                step5_verify: { done: false, timestamp: null },
                step6_initialize: { done: false, timestamp: null }
            },
            issues: [],
            last_verification: null
        };
    }

    /**
     * Save status to file
     */
    saveStatus() {
        this.status.last_updated = new Date().toISOString();
        try {
            fs.writeFileSync(this.setupFile, JSON.stringify(this.status, null, 2));
        } catch (error) {
            console.error('Failed to save setup status:', error.message);
        }
    }

    /**
     * Mark a setup step as complete
     */
    markStepComplete(stepName, details = {}) {
        if (this.status.setup_steps[stepName]) {
            this.status.setup_steps[stepName].done = true;
            this.status.setup_steps[stepName].timestamp = new Date().toISOString();
            
            if (details) {
                this.status.setup_steps[stepName] = { 
                    ...this.status.setup_steps[stepName], 
                    ...details 
                };
            }
        }

        // Update high-level flags based on steps
        switch (stepName) {
            case 'step1_download':
                this.status.framework_downloaded = true;
                this.status.installation_path = details.path || process.cwd();
                break;
            case 'step2_install_deps':
                this.status.dependencies_installed = true;
                break;
            case 'step3_generate_instructions':
                this.status.rules_generated = true;
                this.status.first_run = false;
                break;
            case 'step4_add_rules':
                this.status.rules_added_to_warp = true;
                this.status.user_confirmed_rules = true;
                break;
            case 'step5_verify':
                this.status.setup_verified = true;
                this.status.last_verification = new Date().toISOString();
                break;
            case 'step6_initialize':
                this.status.setup_complete = true;
                break;
        }

        this.saveStatus();
        console.log(`✅ Setup step completed: ${stepName}`);
    }

    /**
     * Add an issue to track
     */
    addIssue(issue) {
        this.status.issues.push({
            issue,
            timestamp: new Date().toISOString(),
            resolved: false
        });
        this.saveStatus();
    }

    /**
     * Mark an issue as resolved
     */
    resolveIssue(issueText) {
        const issue = this.status.issues.find(i => i.issue.includes(issueText) && !i.resolved);
        if (issue) {
            issue.resolved = true;
            issue.resolved_timestamp = new Date().toISOString();
            this.saveStatus();
        }
    }

    /**
     * Check if setup is complete
     */
    isSetupComplete() {
        const requiredSteps = ['step1_download', 'step2_install_deps', 'step3_generate_instructions', 
                              'step4_add_rules', 'step5_verify'];
        
        return requiredSteps.every(step => this.status.setup_steps[step].done);
    }

    /**
     * Get setup progress percentage
     */
    getProgress() {
        const totalSteps = Object.keys(this.status.setup_steps).length;
        const completedSteps = Object.values(this.status.setup_steps).filter(step => step.done).length;
        return Math.round((completedSteps / totalSteps) * 100);
    }

    /**
     * Get current setup status for display
     */
    getStatusReport() {
        const progress = this.getProgress();
        const report = {
            overall_status: this.isSetupComplete() ? 'COMPLETE' : 'INCOMPLETE',
            progress_percentage: progress,
            setup_complete: this.status.setup_complete,
            first_time: this.status.first_run,
            issues_count: this.status.issues.filter(i => !i.resolved).length,
            last_updated: this.status.last_updated,
            step_details: {}
        };

        // Format step details for display
        Object.entries(this.status.setup_steps).forEach(([stepName, stepData]) => {
            report.step_details[stepName] = {
                status: stepData.done ? '✅ DONE' : '⏳ PENDING',
                completed: stepData.done,
                timestamp: stepData.timestamp,
                user_action_required: stepData.user_action || false
            };
        });

        return report;
    }

    /**
     * Generate AI-readable setup context
     */
    generateAIContext() {
        const report = this.getStatusReport();
        const isComplete = this.isSetupComplete();
        
        let context = `
# 🤖 WARP MULTITHREADED SETUP STATUS

## 📊 Current Status: ${report.overall_status} (${report.progress_percentage}%)

### Setup Progress:
${Object.entries(report.step_details).map(([step, details]) => 
    `- ${step.replace('step', 'Step ').replace('_', ': ')}: ${details.status}`
).join('\n')}

### Critical Information:
- First time setup: ${report.first_time ? 'YES' : 'NO'}
- Rules added to Warp IDE: ${this.status.rules_added_to_warp ? 'YES' : 'NO - REQUIRED'}
- Setup verified: ${this.status.setup_verified ? 'YES' : 'NO'}
- Active issues: ${report.issues_count}

### Next Actions Needed:
${this.getNextActions().map(action => `- ${action}`).join('\n')}

${isComplete ? 
    '✅ SETUP COMPLETE: Framework ready for use!' : 
    '⚠️ SETUP INCOMPLETE: Manual steps required before framework will work properly!'
}
`;

        return context;
    }

    /**
     * Get next actions needed
     */
    getNextActions() {
        const actions = [];
        const steps = this.status.setup_steps;

        if (!steps.step1_download.done) {
            actions.push('Download and install warp-multithreaded framework');
        }
        if (!steps.step2_install_deps.done) {
            actions.push('Run: npm install');
        }
        if (!steps.step3_generate_instructions.done) {
            actions.push('Generate setup instructions: node scripts/coordinator.js rules setup');
        }
        if (!steps.step4_add_rules.done) {
            actions.push('🚨 CRITICAL: Manually add 4 rules to Warp IDE Settings → Rules');
        }
        if (!steps.step5_verify.done) {
            actions.push('Verify setup: node scripts/coordinator.js rules verify');
        }
        if (!steps.step6_initialize.done) {
            actions.push('Initialize project: node scripts/coordinator.js init');
        }

        if (actions.length === 0) {
            actions.push('Setup complete! Test with new AI session using rules.');
        }

        return actions;
    }

    /**
     * Reset setup status
     */
    resetStatus() {
        this.status = this.getDefaultStatus();
        this.saveStatus();
        console.log('🔄 Setup status reset to defaults');
    }

    /**
     * Mark setup as complete (manual override)
     */
    markSetupComplete() {
        Object.keys(this.status.setup_steps).forEach(step => {
            this.markStepComplete(step);
        });
        this.status.setup_complete = true;
        this.saveStatus();
        console.log('✅ Setup marked as complete');
    }

    /**
     * Show detailed status
     */
    showDetailedStatus() {
        const report = this.getStatusReport();
        
        console.log('\n🔧 WARP MULTITHREADED SETUP STATUS\n');
        console.log(`📊 Overall: ${report.overall_status} (${report.progress_percentage}%)`);
        console.log(`⏰ Last Updated: ${new Date(report.last_updated).toLocaleString()}\n`);

        console.log('📋 Setup Steps:');
        Object.entries(report.step_details).forEach(([step, details]) => {
            const stepName = step.replace('step', 'Step ').replace('_', ': ');
            console.log(`   ${details.status} ${stepName}`);
            if (details.user_action_required) {
                console.log('      ⚠️  Requires manual user action');
            }
            if (details.timestamp) {
                console.log(`      📅 Completed: ${new Date(details.timestamp).toLocaleString()}`);
            }
        });

        if (report.issues_count > 0) {
            console.log('\n🚨 Active Issues:');
            this.status.issues.filter(i => !i.resolved).forEach(issue => {
                console.log(`   - ${issue.issue}`);
            });
        }

        console.log('\n💡 Next Actions:');
        this.getNextActions().forEach(action => {
            console.log(`   - ${action}`);
        });

        if (!this.isSetupComplete()) {
            console.log('\n⚠️  Framework will NOT work properly until setup is complete!');
        }
    }
}

// CLI Interface
async function main() {
    const tracker = new SetupTracker();
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'status':
            tracker.showDetailedStatus();
            break;
        case 'complete':
            tracker.markSetupComplete();
            break;
        case 'reset':
            tracker.resetStatus();
            break;
        case 'mark':
            const step = args[1];
            if (step) {
                tracker.markStepComplete(step);
            } else {
                console.log('Usage: node setup-tracker.js mark <step-name>');
            }
            break;
        case 'context':
            console.log(tracker.generateAIContext());
            break;
        case 'progress':
            console.log(`Setup Progress: ${tracker.getProgress()}%`);
            break;
        default:
            console.log('\n🔧 Warp Multithreaded Setup Tracker\n');
            console.log('Available commands:');
            console.log('  status     Show detailed setup status');
            console.log('  complete   Mark setup as complete');
            console.log('  reset      Reset setup status');
            console.log('  mark       Mark specific step as done');
            console.log('  context    Generate AI context');
            console.log('  progress   Show progress percentage');
            console.log('');
            console.log('Examples:');
            console.log('  node setup-tracker.js status');
            console.log('  node setup-tracker.js mark step4_add_rules');
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = SetupTracker;
