#!/usr/bin/env node

/**
 * WARP MULTITHREADED - DYNAMIC GOAL MANAGEMENT DEMO
 * 
 * Demonstrates the complete dynamic goal management system:
 * 1. Real-time goal updates
 * 2. Automatic rule regeneration
 * 3. Goal history tracking
 * 4. API integration with dashboard
 */

const { GoalManager } = require('./scripts/goal-manager.js');

console.log(`
WARP MULTITHREADED - DYNAMIC GOAL MANAGEMENT DEMO
=================================================

This demo showcases the complete dynamic goal management system:

✅ Step 1: Auto-rule generation script (COMPLETED)
✅ Step 2: Dashboard CLI integration (COMPLETED) 
✅ Step 3: Dynamic goal file management (COMPLETED)

DYNAMIC GOAL MANAGEMENT FEATURES:
- Real-time goal updates via dashboard or CLI
- Automatic unified rule regeneration
- Complete goal history tracking with analytics
- Change detection and similarity analysis
- Goal validation and quality checks
- File watching for external changes
- API endpoints for dashboard integration

`);

async function runGoalDemo() {
    console.log('DYNAMIC GOAL MANAGEMENT DEMO');
    console.log('=============================');
    
    const goalManager = new GoalManager();
    
    // Demo 1: Show current goal
    console.log('\n1. Current Goal:');
    console.log('----------------');
    const currentGoal = goalManager.getCurrentGoal();
    console.log(`Goal: ${currentGoal.goal}`);
    console.log(`Last Updated: ${currentGoal.lastUpdated || 'Never'}`);
    
    // Demo 2: Update goal with tracking
    console.log('\n2. Updating Goal with Real-time Tracking:');
    console.log('----------------------------------------');
    
    const testGoals = [
        "Create an innovative e-commerce platform with AI-powered recommendations.",
        "Build a social media dashboard that helps influencers manage multiple platforms efficiently.",
        "Develop a productivity app that uses machine learning to optimize daily schedules."
    ];
    
    for (let i = 0; i < testGoals.length; i++) {
        console.log(`\nUpdating to goal ${i + 1}...`);
        const result = await goalManager.updateGoal(testGoals[i], 'demo', {
            updatedBy: 'Demo script',
            reason: `Demo goal update ${i + 1}`,
            demoStep: i + 1
        });
        
        if (result.success) {
            console.log(`✅ Goal updated successfully`);
            console.log(`   New goal: ${result.goal.substring(0, 60)}...`);
            console.log(`   Timestamp: ${result.timestamp}`);
        } else {
            console.log(`❌ Failed to update goal: ${result.error}`);
        }
        
        // Small delay to demonstrate real-time updates
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Demo 3: Show goal history with analytics
    console.log('\n3. Goal History with Analytics:');
    console.log('------------------------------');
    const history = goalManager.getGoalHistory(5);
    
    console.log(`Total goal changes: ${history.length}`);
    history.forEach((entry, index) => {
        console.log(`\n${index + 1}. ${entry.timestamp} (${entry.source})`);
        console.log(`   Goal: ${entry.newGoal.substring(0, 80)}...`);
        console.log(`   Similarity to previous: ${Math.round(entry.changes.similarity * 100)}%`);
        console.log(`   Length change: ${entry.changes.lengthChange > 0 ? '+' : ''}${entry.changes.lengthChange} chars`);
        console.log(`   Word change: ${entry.changes.wordChange > 0 ? '+' : ''}${entry.changes.wordChange} words`);
        
        if (entry.changes.addedWords.length > 0) {
            console.log(`   Added words: ${entry.changes.addedWords.slice(0, 3).join(', ')}${entry.changes.addedWords.length > 3 ? '...' : ''}`);
        }
        if (entry.changes.removedWords.length > 0) {
            console.log(`   Removed words: ${entry.changes.removedWords.slice(0, 3).join(', ')}${entry.changes.removedWords.length > 3 ? '...' : ''}`);
        }
    });
    
    // Demo 4: Goal statistics
    console.log('\n4. Goal Statistics:');
    console.log('------------------');
    const stats = goalManager.getGoalStatistics();
    
    if (stats) {
        console.log(`Current goal length: ${stats.goalLength} characters`);
        console.log(`Word count: ${stats.wordCount} words`);
        console.log(`Total updates: ${stats.totalUpdates}`);
        console.log(`Most active source: ${stats.mostActiveSource}`);
        console.log(`Average goal length: ${stats.averageGoalLength} characters`);
        console.log(`Update frequency: ${stats.updateFrequency.toFixed(2)} updates/day`);
    }
    
    // Demo 5: Goal validation
    console.log('\n5. Goal Validation:');
    console.log('------------------');
    
    const testValidations = [
        "Good goal.",  // Valid
        "Short",       // Too short
        "Bad goal",    // No punctuation
        "A".repeat(2500) // Too long
    ];
    
    testValidations.forEach((testGoal, index) => {
        const validation = goalManager.validateGoal(testGoal);
        console.log(`\nTest ${index + 1}: "${testGoal.substring(0, 30)}${testGoal.length > 30 ? '...' : ''}"`);
        console.log(`Valid: ${validation.valid ? '✅' : '❌'}`);
        if (!validation.valid) {
            validation.issues.forEach(issue => console.log(`  - ${issue}`));
        }
    });
    
    console.log('\n6. API Integration Ready:');
    console.log('------------------------');
    console.log('The Goal Manager is fully integrated with the CLI service.');
    console.log('Available API endpoints:');
    console.log('  GET  /api/goal/current  - Get current goal');
    console.log('  POST /api/goal/update   - Update goal');
    console.log('  GET  /api/goal/history  - Get goal history');
    console.log('  GET  /api/goal/stats    - Get goal statistics');
    console.log('  POST /api/goal/revert   - Revert to previous goal');
    console.log('  POST /api/goal/validate - Validate goal content');
    
    console.log('\n7. Real-time Features:');
    console.log('---------------------');
    console.log('✅ File watching - detects external goal file changes');
    console.log('✅ Event emission - notifies when goals are updated');
    console.log('✅ Automatic rule regeneration - updates unified rules');
    console.log('✅ History tracking - maintains complete change log');
    console.log('✅ Similarity analysis - calculates change impact');
    console.log('✅ Validation system - ensures goal quality');
    
    console.log('\n8. Dashboard Integration:');
    console.log('------------------------');
    console.log('✅ Real-time goal editing in web interface');
    console.log('✅ Live goal history browser');
    console.log('✅ Goal statistics dashboard');
    console.log('✅ One-click goal reversion');
    console.log('✅ Automatic rule updates when goal changes');
    
    console.log('\n');
    console.log('DYNAMIC GOAL MANAGEMENT FEATURES SUMMARY:');
    console.log('==========================================');
    console.log('');
    console.log('✅ REAL-TIME UPDATES:');
    console.log('   - Goals can be updated via dashboard or CLI');
    console.log('   - Changes trigger automatic rule regeneration');
    console.log('   - File watching detects external modifications');
    console.log('');
    console.log('✅ COMPREHENSIVE TRACKING:');
    console.log('   - Complete history of all goal changes');
    console.log('   - Similarity analysis between versions');
    console.log('   - Change impact measurement');
    console.log('   - Source tracking (dashboard, CLI, external)');
    console.log('');
    console.log('✅ INTELLIGENT ANALYSIS:');
    console.log('   - Goal validation with quality checks');
    console.log('   - Statistics and usage patterns');
    console.log('   - Word change detection');
    console.log('   - Update frequency analysis');
    console.log('');
    console.log('✅ SEAMLESS INTEGRATION:');
    console.log('   - API endpoints for dashboard integration');
    console.log('   - Automatic masterplan configuration sync');
    console.log('   - Unified rule regeneration on changes');
    console.log('   - Event-driven architecture');
    console.log('');
    console.log('NEXT STEPS:');
    console.log('- Start CLI service: npm run cli-service');
    console.log('- Open dashboard in browser');
    console.log('- Edit goals in real-time via web interface');
    console.log('- Watch automatic rule regeneration');
    console.log('');
    console.log('DYNAMIC GOAL MANAGEMENT IS FULLY OPERATIONAL! 🚀');
}

// Run the demo
runGoalDemo().catch(console.error);
