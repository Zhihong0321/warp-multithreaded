#!/usr/bin/env node

/**
 * WARP MULTITHREADED - DYNAMIC GOAL FILE MANAGEMENT
 * 
 * Manages real-time updates to project goals with automatic rule synchronization
 * Provides API endpoints for dashboard goal editing and history tracking
 */

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

class GoalManager extends EventEmitter {
    constructor() {
        super();
        this.projectRoot = process.cwd();
        this.goalPath = path.join(this.projectRoot, 'masterplan-goal.md');
        this.historyPath = path.join(this.projectRoot, '.warp-masterplan', 'goal-history.json');
        this.configPath = path.join(this.projectRoot, 'masterplan-config.json');
        this.rulesPath = path.join(this.projectRoot, '.warp-unified-rules.md');
        
        // Ensure directories exist
        this.ensureDirectories();
        
        // Initialize file watching for real-time updates
        this.setupFileWatching();
    }

    /**
     * Ensure required directories exist
     */
    ensureDirectories() {
        const masterplanDir = path.dirname(this.historyPath);
        if (!fs.existsSync(masterplanDir)) {
            fs.mkdirSync(masterplanDir, { recursive: true });
            console.log('Created .warp-masterplan directory');
        }
    }

    /**
     * Set up file watching for automatic synchronization
     */
    setupFileWatching() {
        if (fs.existsSync(this.goalPath)) {
            fs.watchFile(this.goalPath, (curr, prev) => {
                if (curr.mtime !== prev.mtime) {
                    console.log('Goal file changed externally, triggering sync...');
                    this.emit('goalChanged', this.getCurrentGoal());
                }
            });
        }
    }

    /**
     * Get current goal from file
     */
    getCurrentGoal() {
        try {
            if (!fs.existsSync(this.goalPath)) {
                return {
                    goal: 'No goal set',
                    lastUpdated: null,
                    source: 'none'
                };
            }

            const content = fs.readFileSync(this.goalPath, 'utf8');
            const lines = content.split('\n');
            
            let goal = '';
            let lastUpdated = null;
            let inGoalSection = false;

            for (const line of lines) {
                if (line.startsWith('## Current Goal')) {
                    inGoalSection = true;
                    continue;
                }
                if (line.startsWith('## Last Updated')) {
                    inGoalSection = false;
                    continue;
                }
                if (line.startsWith('## ') && inGoalSection) {
                    inGoalSection = false;
                }
                if (inGoalSection && line.trim() && !line.startsWith('#')) {
                    goal += line + '\n';
                }
                if (line.startsWith('## Last Updated')) {
                    const nextLine = lines[lines.indexOf(line) + 1];
                    if (nextLine) {
                        lastUpdated = nextLine.trim();
                    }
                }
            }

            return {
                goal: goal.trim(),
                lastUpdated,
                source: 'file'
            };

        } catch (error) {
            console.error('Error reading goal file:', error);
            return {
                goal: 'Error reading goal',
                lastUpdated: null,
                source: 'error',
                error: error.message
            };
        }
    }

    /**
     * Update goal with history tracking and automatic sync
     */
    async updateGoal(newGoal, source = 'dashboard', metadata = {}) {
        try {
            const previousGoal = this.getCurrentGoal();
            const timestamp = new Date().toISOString();

            // Create new goal content
            const goalContent = this.generateGoalContent(newGoal, timestamp, metadata);

            // Write goal file
            fs.writeFileSync(this.goalPath, goalContent);

            // Update history
            await this.addToHistory(previousGoal.goal, newGoal, source, timestamp, metadata);

            // Update masterplan config
            await this.updateMasterplanConfig(newGoal, timestamp);

            // Regenerate unified rules if they exist
            await this.regenerateUnifiedRules();

            // Emit change event
            this.emit('goalUpdated', {
                oldGoal: previousGoal.goal,
                newGoal,
                timestamp,
                source,
                metadata
            });

            console.log(`Goal updated from ${source} at ${timestamp}`);

            return {
                success: true,
                goal: newGoal,
                timestamp,
                source,
                previousGoal: previousGoal.goal
            };

        } catch (error) {
            console.error('Error updating goal:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate goal file content
     */
    generateGoalContent(goal, timestamp, metadata = {}) {
        return `# PROJECT GOAL

## Current Goal
${goal}

## Last Updated
${timestamp}

## Update Source
${metadata.source || 'dashboard'}

## Key Objectives
- Align all development decisions with this goal
- Refer to this goal before starting any task
- Update this goal anytime via dashboard

## Goal Evolution
This goal can be edited in real-time via the dashboard. 
All AI sessions will automatically reference the current goal.

---
This file is auto-updated when goal is changed in warp-multithreaded dashboard
Last updated by: ${metadata.updatedBy || 'system'}
Update reason: ${metadata.reason || 'Goal modification'}
`;
    }

    /**
     * Add goal change to history
     */
    async addToHistory(oldGoal, newGoal, source, timestamp, metadata) {
        try {
            let history = [];
            
            if (fs.existsSync(this.historyPath)) {
                const historyContent = fs.readFileSync(this.historyPath, 'utf8');
                history = JSON.parse(historyContent);
            }

            const historyEntry = {
                id: `goal_${Date.now()}`,
                oldGoal,
                newGoal,
                source,
                timestamp,
                metadata,
                changes: this.analyzeGoalChanges(oldGoal, newGoal)
            };

            history.unshift(historyEntry); // Add to beginning

            // Keep only last 50 entries
            if (history.length > 50) {
                history = history.slice(0, 50);
            }

            fs.writeFileSync(this.historyPath, JSON.stringify(history, null, 2));

        } catch (error) {
            console.error('Error updating goal history:', error);
        }
    }

    /**
     * Analyze changes between old and new goals
     */
    analyzeGoalChanges(oldGoal, newGoal) {
        const oldWords = oldGoal.toLowerCase().split(/\s+/);
        const newWords = newGoal.toLowerCase().split(/\s+/);
        
        const addedWords = newWords.filter(word => !oldWords.includes(word));
        const removedWords = oldWords.filter(word => !newWords.includes(word));
        
        return {
            lengthChange: newGoal.length - oldGoal.length,
            wordChange: newWords.length - oldWords.length,
            addedWords: addedWords.slice(0, 10), // Limit to prevent huge arrays
            removedWords: removedWords.slice(0, 10),
            similarity: this.calculateSimilarity(oldGoal, newGoal)
        };
    }

    /**
     * Calculate simple similarity score between two strings
     */
    calculateSimilarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) {
            return 1.0;
        }
        
        const distance = this.levenshteinDistance(longer, shorter);
        return (longer.length - distance) / longer.length;
    }

    /**
     * Calculate Levenshtein distance
     */
    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    /**
     * Update masterplan configuration with new goal
     */
    async updateMasterplanConfig(newGoal, timestamp) {
        try {
            if (fs.existsSync(this.configPath)) {
                const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
                config.goal = newGoal;
                config.lastGoalUpdate = timestamp;
                fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
            }
        } catch (error) {
            console.error('Error updating masterplan config:', error);
        }
    }

    /**
     * Regenerate unified rules to reflect new goal
     */
    async regenerateUnifiedRules() {
        try {
            if (fs.existsSync(this.rulesPath)) {
                const { UnifiedRuleGenerator } = require('./generate-unified-rules.js');
                const generator = new UnifiedRuleGenerator();
                await generator.generate();
                console.log('Unified rules regenerated with new goal');
            }
        } catch (error) {
            console.error('Error regenerating unified rules:', error);
        }
    }

    /**
     * Get goal history
     */
    getGoalHistory(limit = 10) {
        try {
            if (!fs.existsSync(this.historyPath)) {
                return [];
            }

            const history = JSON.parse(fs.readFileSync(this.historyPath, 'utf8'));
            return history.slice(0, limit);

        } catch (error) {
            console.error('Error reading goal history:', error);
            return [];
        }
    }

    /**
     * Revert to a previous goal version
     */
    async revertToGoal(historyId) {
        try {
            const history = this.getGoalHistory(50);
            const targetEntry = history.find(entry => entry.id === historyId);
            
            if (!targetEntry) {
                throw new Error('Goal version not found in history');
            }

            return await this.updateGoal(
                targetEntry.oldGoal, 
                'revert', 
                { 
                    revertedFrom: historyId,
                    revertedTo: targetEntry.timestamp,
                    reason: 'Reverted to previous goal version'
                }
            );

        } catch (error) {
            console.error('Error reverting goal:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get goal statistics
     */
    getGoalStatistics() {
        try {
            const currentGoal = this.getCurrentGoal();
            const history = this.getGoalHistory(50);
            
            const stats = {
                currentGoal: currentGoal.goal,
                lastUpdated: currentGoal.lastUpdated,
                goalLength: currentGoal.goal.length,
                wordCount: currentGoal.goal.split(/\s+/).length,
                totalUpdates: history.length,
                updateFrequency: this.calculateUpdateFrequency(history),
                averageGoalLength: this.calculateAverageGoalLength(history),
                mostActiveSource: this.getMostActiveSource(history)
            };

            return stats;

        } catch (error) {
            console.error('Error calculating goal statistics:', error);
            return null;
        }
    }

    /**
     * Calculate update frequency
     */
    calculateUpdateFrequency(history) {
        if (history.length < 2) return 0;
        
        const timeSpan = new Date(history[0].timestamp) - new Date(history[history.length - 1].timestamp);
        const days = timeSpan / (1000 * 60 * 60 * 24);
        
        return days > 0 ? history.length / days : 0;
    }

    /**
     * Calculate average goal length from history
     */
    calculateAverageGoalLength(history) {
        if (history.length === 0) return 0;
        
        const totalLength = history.reduce((sum, entry) => sum + entry.newGoal.length, 0);
        return Math.round(totalLength / history.length);
    }

    /**
     * Get most active update source
     */
    getMostActiveSource(history) {
        if (history.length === 0) return 'none';
        
        const sourceCounts = {};
        history.forEach(entry => {
            sourceCounts[entry.source] = (sourceCounts[entry.source] || 0) + 1;
        });
        
        return Object.keys(sourceCounts).reduce((a, b) => 
            sourceCounts[a] > sourceCounts[b] ? a : b
        );
    }

    /**
     * Validate goal content
     */
    validateGoal(goal) {
        const issues = [];
        
        if (!goal || typeof goal !== 'string') {
            issues.push('Goal must be a non-empty string');
        }
        
        if (goal && goal.length < 10) {
            issues.push('Goal should be at least 10 characters long');
        }
        
        if (goal && goal.length > 2000) {
            issues.push('Goal should be less than 2000 characters');
        }
        
        if (goal && !/[.!?]$/.test(goal.trim())) {
            issues.push('Goal should end with proper punctuation');
        }

        return {
            valid: issues.length === 0,
            issues
        };
    }

    /**
     * Clean up old history entries
     */
    cleanupHistory(keepEntries = 50) {
        try {
            const history = this.getGoalHistory(1000); // Get more entries for cleanup
            
            if (history.length > keepEntries) {
                const trimmedHistory = history.slice(0, keepEntries);
                fs.writeFileSync(this.historyPath, JSON.stringify(trimmedHistory, null, 2));
                console.log(`Cleaned up goal history, kept ${keepEntries} entries`);
            }

        } catch (error) {
            console.error('Error cleaning up history:', error);
        }
    }
}

// CLI execution
async function main() {
    const args = process.argv.slice(2);
    const goalManager = new GoalManager();

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
WARP MULTITHREADED - Dynamic Goal Manager

USAGE:
  node scripts/goal-manager.js [command] [options]

COMMANDS:
  get                    Show current goal
  set "goal text"        Set new goal
  history [limit]        Show goal history
  stats                  Show goal statistics
  revert [id]            Revert to previous goal
  validate "goal"        Validate goal content
  cleanup                Clean up old history

OPTIONS:
  --help, -h             Show this help message
  --format json|text     Output format (default: text)

EXAMPLES:
  node scripts/goal-manager.js get
  node scripts/goal-manager.js set "Build an amazing AI-powered app"
  node scripts/goal-manager.js history 5
  node scripts/goal-manager.js stats
  node scripts/goal-manager.js revert goal_1234567890
        `);
        return;
    }

    const command = args[0] || 'get';

    switch (command) {
        case 'get':
            const currentGoal = goalManager.getCurrentGoal();
            console.log('Current Goal:');
            console.log(currentGoal.goal);
            console.log(`\nLast Updated: ${currentGoal.lastUpdated || 'Never'}`);
            break;

        case 'set':
            const newGoal = args[1];
            if (!newGoal) {
                console.error('Error: Please provide a goal text');
                process.exit(1);
            }
            
            const validation = goalManager.validateGoal(newGoal);
            if (!validation.valid) {
                console.error('Goal validation failed:');
                validation.issues.forEach(issue => console.error(`- ${issue}`));
                process.exit(1);
            }
            
            const result = await goalManager.updateGoal(newGoal, 'cli', {
                updatedBy: 'CLI user',
                reason: 'Manual goal update via CLI'
            });
            
            if (result.success) {
                console.log('Goal updated successfully!');
                console.log(`New goal: ${result.goal}`);
            } else {
                console.error(`Error: ${result.error}`);
                process.exit(1);
            }
            break;

        case 'history':
            const limit = parseInt(args[1]) || 10;
            const history = goalManager.getGoalHistory(limit);
            
            if (history.length === 0) {
                console.log('No goal history found');
            } else {
                console.log(`Goal History (last ${history.length} entries):`);
                history.forEach((entry, index) => {
                    console.log(`\n${index + 1}. ${entry.timestamp} (${entry.source})`);
                    console.log(`   Goal: ${entry.newGoal.substring(0, 100)}${entry.newGoal.length > 100 ? '...' : ''}`);
                    if (entry.changes.similarity < 0.8) {
                        console.log(`   Major change (${Math.round(entry.changes.similarity * 100)}% similarity)`);
                    }
                });
            }
            break;

        case 'stats':
            const stats = goalManager.getGoalStatistics();
            if (stats) {
                console.log('Goal Statistics:');
                console.log(`Current goal length: ${stats.goalLength} characters`);
                console.log(`Word count: ${stats.wordCount} words`);
                console.log(`Total updates: ${stats.totalUpdates}`);
                console.log(`Most active source: ${stats.mostActiveSource}`);
                console.log(`Average goal length: ${stats.averageGoalLength} characters`);
                console.log(`Update frequency: ${stats.updateFrequency.toFixed(2)} updates/day`);
            }
            break;

        case 'validate':
            const goalToValidate = args[1];
            if (!goalToValidate) {
                console.error('Error: Please provide a goal to validate');
                process.exit(1);
            }
            
            const validationResult = goalManager.validateGoal(goalToValidate);
            if (validationResult.valid) {
                console.log('Goal is valid!');
            } else {
                console.log('Goal validation issues:');
                validationResult.issues.forEach(issue => console.log(`- ${issue}`));
            }
            break;

        case 'cleanup':
            goalManager.cleanupHistory();
            break;

        default:
            console.error(`Unknown command: ${command}`);
            console.error('Use --help for usage information');
            process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { GoalManager };
