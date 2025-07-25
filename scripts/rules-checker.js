#!/usr/bin/env node

/**
 * Warp Multithreaded - Rules Checker
 * Validates and guides setup of required Warp Rules for the framework
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

class WarpRulesChecker {
    constructor() {
        this.frameworkRoot = path.resolve(__dirname, '..');
        this.rulesDir = path.join(this.frameworkRoot, 'warp-rules');
        this.requiredRules = [
            'enhanced-multi-session-coordination.md',
            'enhanced-masterplan-session-rules.md',
            'enhanced-auto-session-coordination.md',
            'frontend-session-rules.md',
            'backend-session-rules.md'
        ];
    }

    /**
     * Check if Warp IDE has the required rules loaded
     */
    async checkWarpRules() {
        console.log('🔍 Checking Warp IDE Rules setup...\n');

        const results = {
            warp_detected: this.isWarpTerminal(),
            rules_available: this.checkRulesAvailable(),
            user_guidance_needed: false,
            missing_rules: [],
            installation_required: false
        };

        // Check if rules files exist in framework
        if (!results.rules_available) {
            console.log('❌ Required rule files not found in framework');
            results.installation_required = true;
            return results;
        }

        // Since we can't directly check Warp's internal rules,
        // we need to guide the user through manual verification
        console.log('⚠️  IMPORTANT: Warp Rules must be manually added to your Warp IDE');
        console.log('📝 The framework requires specific rules to coordinate AI sessions\n');

        results.user_guidance_needed = true;
        return results;
    }

    /**
     * Validate that all required rule files exist
     */
    checkRulesAvailable() {
        if (!fs.existsSync(this.rulesDir)) {
            return false;
        }

        const missingRules = [];
        for (const rule of this.requiredRules) {
            const rulePath = path.join(this.rulesDir, rule);
            if (!fs.existsSync(rulePath)) {
                missingRules.push(rule);
            }
        }

        return missingRules.length === 0;
    }

    /**
     * Check if running in Warp Terminal
     */
    isWarpTerminal() {
        return process.env.TERM_PROGRAM === 'WarpTerminal' || 
               process.env.WARP_TERMINAL === 'true';
    }

    /**
     * Generate step-by-step instructions for adding rules to Warp
     */
    generateSetupInstructions() {
        const instructions = `
# 🚀 CRITICAL: Warp Rules Setup Required

## ⚠️ SETUP STATUS
${this.isWarpTerminal() ? '✅ Warp Terminal detected' : '❌ Not running in Warp Terminal'}
${this.checkRulesAvailable() ? '✅ Rule files available' : '❌ Rule files missing'}

## 📋 MANDATORY SETUP STEPS

### Step 1: Add Rules to Your Warp IDE

You MUST manually add these rules to your Warp IDE for the framework to work:

1. **Open Warp IDE Settings**
   - Click the ⚙️ settings icon in Warp
   - Navigate to "Rules" section

2. **Add Required Rules (Copy & Paste Each)**

   **Rule 1: Multi-Session Coordination**
   \`\`\`
   Copy content from: ${path.join(this.rulesDir, 'enhanced-multi-session-coordination.md')}
   \`\`\`

   **Rule 2: Masterplan Integration** 
   \`\`\`
   Copy content from: ${path.join(this.rulesDir, 'enhanced-masterplan-session-rules.md')}
   \`\`\`

   **Rule 3: Frontend Session Rules**
   \`\`\`
   Copy content from: ${path.join(this.rulesDir, 'frontend-session-rules.md')}
   \`\`\`

   **Rule 4: Backend Session Rules**
   \`\`\`
   Copy content from: ${path.join(this.rulesDir, 'backend-session-rules.md')}
   \`\`\`

### Step 2: Verify Rules Are Active

After adding rules, test in a new Warp session:

\`\`\`
Use enhanced-multi-session-coordination and enhanced-masterplan-session-rules from my Warp Drive.
Show me the current project status and available sessions.
\`\`\`

If AI responds with session-aware behavior, rules are working! ✅

### Step 3: Test Multi-Session Coordination

Create a new session in the same project folder and verify rules are loaded.

## 🔧 AUTOMATION COMMANDS

Run this after manual setup:
\`\`\`powershell
# Verify setup
node "${path.join(__dirname, 'rules-checker.js')}" --verify

# Initialize project with rules verification
node "${path.join(__dirname, 'coordinator.js')}" init --verify-rules
\`\`\`

## ❌ TROUBLESHOOTING

**Rules not working in new sessions?**
- Rules must be added to Warp IDE settings, not just mentioned in chat
- Each new session needs to activate rules manually
- Verify rule names match exactly in Warp settings

**Framework not coordinating?**
- Check: \`node scripts/coordinator.js status\`
- Ensure project is initialized: \`node scripts/coordinator.js init\`
- Verify session files exist in \`.warp-sessions/\`

---
⚠️ **THE FRAMEWORK WILL NOT WORK WITHOUT THESE RULES IN WARP IDE** ⚠️
`;

        return instructions;
    }

    /**
     * Interactive setup verification
     */
    async runInteractiveSetup() {
        console.log('🔧 Warp Multithreaded - Rules Setup Assistant\n');

        const status = await this.checkWarpRules();
        
        if (!status.warp_detected) {
            console.log('⚠️  Warning: Not running in Warp Terminal');
            console.log('   The framework is designed for Warp Terminal specifically\n');
        }

        if (!status.rules_available) {
            console.log('❌ Rule files not found in framework directory');
            console.log('   Please ensure the framework is properly installed\n');
            return false;
        }

        // Generate and save setup instructions
        const instructions = this.generateSetupInstructions();
        const instructionsPath = path.join(process.cwd(), 'WARP_RULES_SETUP_REQUIRED.md');
        fs.writeFileSync(instructionsPath, instructions);

        console.log('📝 Setup instructions saved to: WARP_RULES_SETUP_REQUIRED.md');
        console.log('\n' + '='.repeat(60));
        console.log('🚨 CRITICAL: MANUAL SETUP REQUIRED');
        console.log('='.repeat(60));
        console.log('\n1. Open the generated file: WARP_RULES_SETUP_REQUIRED.md');
        console.log('2. Follow the step-by-step instructions');
        console.log('3. Add all 4 rules to your Warp IDE settings');
        console.log('4. Test in a new Warp session');
        console.log('\n⚠️  The framework CANNOT work without these rules!\n');

        return true;
    }

    /**
     * Verify rules are working (test function)
     */
    async verifyRulesWorking() {
        console.log('🧪 Testing Warp Rules integration...\n');
        
        console.log('📋 Manual Verification Required:');
        console.log('1. Open a new Warp session in this project');
        console.log('2. Type: "Use enhanced-multi-session-coordination from my Warp Drive"');
        console.log('3. AI should respond with session-aware behavior');
        console.log('4. Check if AI mentions checking session status\n');

        const testCommand = `node "${path.join(__dirname, 'coordinator.js')}" status`;
        console.log(`🔧 Run this command to test framework: ${testCommand}\n`);

        // Check if sessions directory exists (indicates framework is working)
        const sessionsDir = path.join(process.cwd(), '.warp-sessions');
        if (fs.existsSync(sessionsDir)) {
            console.log('✅ Framework files detected - basic setup working');
        } else {
            console.log('❌ Framework not initialized - run "init" command first');
        }

        return true;
    }

    /**
     * Display current rule files for copying
     */
    displayRuleFiles() {
        console.log('📋 Available Rule Files for Manual Setup:\n');
        
        this.requiredRules.forEach((ruleFile, index) => {
            const rulePath = path.join(this.rulesDir, ruleFile);
            if (fs.existsSync(rulePath)) {
                console.log(`${index + 1}. ${ruleFile}`);
                console.log(`   Path: ${rulePath}`);
                console.log(`   Size: ${fs.statSync(rulePath).size} bytes`);
            } else {
                console.log(`${index + 1}. ${ruleFile} - ❌ MISSING`);
            }
        });

        console.log('\n💡 Use these files to copy content into Warp IDE Rules section');
    }
}

// CLI Interface
async function main() {
    const checker = new WarpRulesChecker();
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case '--verify':
            await checker.verifyRulesWorking();
            break;
        case '--setup':
            await checker.runInteractiveSetup();
            break;
        case '--list':
            checker.displayRuleFiles();
            break;
        case '--status':
            const status = await checker.checkWarpRules();
            console.log('Status:', JSON.stringify(status, null, 2));
            break;
        default:
            await checker.runInteractiveSetup();
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = WarpRulesChecker;
