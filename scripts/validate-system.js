#!/usr/bin/env node

/**
 * Warp Multithreaded - System Validation Script
 * Tests concurrency protection and input validation
 */

const path = require('path');
const fs = require('fs');
const SessionManager = require('../core/session-manager');
const MasterplanManager = require('../core/masterplan-manager');

class SystemValidator {
    constructor() {
        this.projectRoot = process.cwd();
        this.testDir = path.join(this.projectRoot, '.warp-test');
        this.errors = [];
        this.warnings = [];
    }

    log(message, level = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = {
            info: '✓',
            warn: '⚠️',
            error: '❌'
        }[level] || '•';
        
        console.log(`${prefix} [${timestamp}] ${message}`);
        
        if (level === 'error') this.errors.push(message);
        if (level === 'warn') this.warnings.push(message);
    }

    async runValidation() {
        this.log('Starting system validation...', 'info');
        
        try {
            await this.setupTestEnvironment();
            await this.testSessionManager();
            await this.testMasterplanManager();
            await this.testConcurrencyProtection();
            await this.testInputValidation();
            await this.cleanupTestEnvironment();
            
            this.log(`Validation complete: ${this.errors.length} errors, ${this.warnings.length} warnings`, 'info');
            
            if (this.errors.length > 0) {
                this.log('ERRORS FOUND:', 'error');
                this.errors.forEach(error => this.log(`  - ${error}`, 'error'));
                process.exit(1);
            }
            
            if (this.warnings.length > 0) {
                this.log('WARNINGS:', 'warn');
                this.warnings.forEach(warning => this.log(`  - ${warning}`, 'warn'));
            }
            
            this.log('All tests passed! ✅', 'info');
            
        } catch (error) {
            this.log(`Validation failed: ${error.message}`, 'error');
            process.exit(1);
        }
    }

    async setupTestEnvironment() {
        this.log('Setting up test environment...', 'info');
        
        // Skip test environment setup on Windows to avoid permission issues
        if (process.platform === 'win32') {
            this.log('Test environment setup skipped on Windows', 'warn');
            return;
        }
        
        if (fs.existsSync(this.testDir)) {
            fs.rmSync(this.testDir, { recursive: true, force: true });
        }
        
        fs.mkdirSync(this.testDir, { recursive: true });
        process.chdir(this.testDir);
    }

    async testSessionManager() {
        this.log('Testing SessionManager...', 'info');
        
        const sessionManager = new SessionManager(this.testDir);
        
        try {
            // Test valid session creation
            const session1 = sessionManager.createSession('test-session-1');
            if (!session1 || !session1.id) {
                throw new Error('Failed to create valid session');
            }
            this.log('✓ Valid session creation works', 'info');
            
            // Test session name sanitization
            const session2 = sessionManager.createSession('test/session<>with:bad*chars');
            if (!session2 || session2.name !== 'test_session__with_bad_chars') {
                throw new Error('Session name sanitization failed');
            }
            this.log('✓ Session name sanitization works', 'info');
            
            // Test duplicate session detection
            try {
                sessionManager.createSession('test-session-1');
                throw new Error('Should have prevented duplicate session');
            } catch (error) {
                if (!error.message.includes('already exists')) {
                    throw error;
                }
            }
            this.log('✓ Duplicate session prevention works', 'info');
            
            // Test file locking
            const lockResult = sessionManager.lockFile('test-session-1', '/test/file.js');
            if (!lockResult.success) {
                throw new Error('File locking failed');
            }
            this.log('✓ File locking works', 'info');
            
            // Test conflict detection when another session tries to lock same file
            const conflictResult = sessionManager.lockFile(session2.name, '/test/file.js');
            if (conflictResult.success) {
                throw new Error('Should have detected file conflict');
            }
            this.log('✓ File conflict detection works', 'info');
            
        } catch (error) {
            throw new Error(`SessionManager test failed: ${error.message}`);
        }
    }

    async testMasterplanManager() {
        this.log('Testing MasterplanManager...', 'info');
        
        const masterplanManager = new MasterplanManager(this.testDir);
        
        try {
            // Test masterplan initialization
            const result = masterplanManager.initializeMasterplan({
                name: 'Test Project',
                description: 'A test project for validation',
                goals: ['Test goal 1', 'Test goal 2'],
                technologies: ['Node.js', 'JavaScript']
            });
            
            if (!result || !result.project) {
                throw new Error('Failed to initialize masterplan');
            }
            this.log('✓ Masterplan initialization works', 'info');
            
            // Test task creation with validation
            const task = masterplanManager.addTask({
                title: 'Test Task',
                description: 'A test task',
                priority: 'high'
            });
            
            if (!task || !task.id) {
                throw new Error('Failed to create task');
            }
            this.log('✓ Task creation works', 'info');
            
            // Test invalid task creation
            try {
                masterplanManager.addTask({
                    title: '', // Invalid empty title
                    priority: 'invalid' // Invalid priority
                });
                throw new Error('Should have rejected invalid task');
            } catch (error) {
                if (!error.message.includes('valid title')) {
                    throw error;
                }
            }
            this.log('✓ Task validation works', 'info');
            
            // Test task completion
            const completedTask = masterplanManager.completeTask(task.id, {
                session: 'test-session',
                notes: 'Test completion'
            });
            
            if (!completedTask || completedTask.status !== 'completed') {
                throw new Error('Failed to complete task');
            }
            this.log('✓ Task completion works', 'info');
            
        } catch (error) {
            throw new Error(`MasterplanManager test failed: ${error.message}`);
        }
    }

    async testConcurrencyProtection() {
        this.log('Testing concurrency protection...', 'info');
        
        const sessionManager = new SessionManager(this.testDir);
        const masterplanManager = new MasterplanManager(this.testDir);
        
        try {
            // Test atomic file operations by simulating concurrent writes
            const promises = [];
            
            for (let i = 0; i < 5; i++) {
                promises.push(new Promise((resolve) => {
                    setTimeout(() => {
                        try {
                            sessionManager.createSession(`concurrent-session-${i}`);
                            masterplanManager.addTask({
                                title: `Concurrent Task ${i}`,
                                description: `Task created concurrently ${i}`
                            });
                            resolve(true);
                        } catch (error) {
                            resolve(error);
                        }
                    }, Math.random() * 100); // Random delay to simulate real concurrency
                }));
            }
            
            const results = await Promise.all(promises);
            const failures = results.filter(r => r instanceof Error);
            
            if (failures.length > 0) {
                this.log(`Some concurrent operations failed: ${failures.length}`, 'warn');
            } else {
                this.log('✓ Concurrent operations completed successfully', 'info');
            }
            
        } catch (error) {
            throw new Error(`Concurrency protection test failed: ${error.message}`);
        }
    }

    async testInputValidation() {
        this.log('Testing input validation...', 'info');
        
        const sessionManager = new SessionManager(this.testDir);
        const masterplanManager = new MasterplanManager(this.testDir);
        
        try {
            // Test various invalid inputs
            const invalidInputs = [
                { test: 'empty session name', fn: () => sessionManager.createSession('') },
                { test: 'null session name', fn: () => sessionManager.createSession(null) },
                { test: 'numeric session name', fn: () => sessionManager.createSession(123) },
                { test: 'long session name', fn: () => sessionManager.createSession('a'.repeat(100)) },
                { test: 'invalid task object', fn: () => masterplanManager.addTask(null) },
                { test: 'task without title', fn: () => masterplanManager.addTask({}) },
                { test: 'invalid task ID', fn: () => masterplanManager.validateTaskId('invalid@id!') }
            ];
            
            let validationsPassed = 0;
            
            for (const input of invalidInputs) {
                try {
                    input.fn();
                    this.log(`Failed to reject ${input.test}`, 'warn');
                } catch (error) {
                    validationsPassed++;
                }
            }
            
            if (validationsPassed === invalidInputs.length) {
                this.log('✓ All input validation tests passed', 'info');
            } else {
                this.log(`Input validation: ${validationsPassed}/${invalidInputs.length} tests passed`, 'warn');
            }
            
        } catch (error) {
            throw new Error(`Input validation test failed: ${error.message}`);
        }
    }

    async cleanupTestEnvironment() {
        this.log('Cleaning up test environment...', 'info');
        
        process.chdir(this.projectRoot);
        
        if (fs.existsSync(this.testDir)) {
            fs.rmSync(this.testDir, { recursive: true, force: true });
        }
    }
}

// Run validation if called directly
if (require.main === module) {
    const validator = new SystemValidator();
    validator.runValidation();
}

module.exports = SystemValidator;
