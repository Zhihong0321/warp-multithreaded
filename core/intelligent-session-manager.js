/**
 * Warp AI Agent Framework - Intelligent Session Auto-Manager
 * Fully automated session handling based on context detection and AI analysis
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const SessionManager = require('./session-manager');

class IntelligentSessionManager extends SessionManager {
    constructor(projectRoot = process.cwd()) {
        super(projectRoot);
        this.contextAnalyzer = new ContextAnalyzer(projectRoot);
        this.sessionPredictor = new SessionPredictor();
        this.autoSessionConfig = this.loadAutoSessionConfig();
    }

    loadAutoSessionConfig() {
        return {
            enabled: true,
            minConfidence: 0.7,
            autoCreateThreshold: 0.8,
            maxSessions: 5,
            sessionLifetime: 24 * 60 * 60 * 1000, // 24 hours
            patterns: {
                frontend: {
                    keywords: ['ui', 'component', 'style', 'css', 'react', 'vue', 'angular', 'html', 'dom'],
                    directories: ['src/components', 'src/pages', 'src/styles', 'public', 'assets'],
                    filePatterns: ['*.tsx', '*.jsx', '*.vue', '*.css', '*.scss', '*.html', '*.svg'],
                    confidence: 0.9
                },
                backend: {
                    keywords: ['api', 'server', 'database', 'auth', 'endpoint', 'route', 'controller', 'model'],
                    directories: ['src/api', 'src/routes', 'src/controllers', 'src/models', 'src/middleware', 'server'],
                    filePatterns: ['*.js', '*.ts', '*.sql', '*.json', 'Dockerfile'],
                    confidence: 0.9
                },
                testing: {
                    keywords: ['test', 'spec', 'unit', 'integration', 'e2e', 'cypress', 'jest', 'mock'],
                    directories: ['tests', 'test', '__tests__', 'cypress', 'spec'],
                    filePatterns: ['*.test.js', '*.spec.js', '*.test.ts', '*.spec.ts', '*.cy.js'],
                    confidence: 0.95
                },
                database: {
                    keywords: ['database', 'migration', 'schema', 'sql', 'query', 'table', 'collection'],
                    directories: ['migrations', 'database', 'db', 'src/models', 'prisma'],
                    filePatterns: ['*.sql', '*.prisma', '*migration*', '*.schema.*'],
                    confidence: 0.9
                },
                devops: {
                    keywords: ['deploy', 'docker', 'ci', 'cd', 'pipeline', 'infrastructure', 'aws', 'kubernetes'],
                    directories: ['.github', '.gitlab-ci', 'docker', 'k8s', 'infrastructure', 'deploy'],
                    filePatterns: ['Dockerfile', '*.yml', '*.yaml', '*.tf', '*.json'],
                    confidence: 0.85
                }
            }
        };
    }

    /**
     * Auto-detect and create session based on user input and context
     */
    async autoDetectAndCreateSession(userInput, currentFiles = [], forceAnalysis = false) {
        try {
            const context = await this.contextAnalyzer.analyzeContext({
                userInput,
                currentFiles,
                projectStructure: this.contextAnalyzer.getProjectStructure(),
                existingSessions: this.getActiveSessions()
            });

            const sessionRecommendation = this.sessionPredictor.predictOptimalSession(context);
            
            if (sessionRecommendation.confidence >= this.autoSessionConfig.autoCreateThreshold || forceAnalysis) {
                return await this.autoCreateSession(sessionRecommendation);
            }

            return this.getOrCreateDefaultSession();
        } catch (error) {
            console.warn('Auto-session detection failed, using default:', error.message);
            return this.getOrCreateDefaultSession();
        }
    }

    /**
     * Automatically create session based on AI recommendation
     */
    async autoCreateSession(recommendation) {
        const { sessionType, confidence, suggestedName, focus, directories, filePatterns, reasoning } = recommendation;
        
        // Check if similar session already exists
        const existingSession = this.findSimilarSession(focus, directories);
        if (existingSession) {
            console.log(`🔄 Using existing session '${existingSession.name}' (${confidence.toFixed(2)} confidence)`);
            console.log(`💡 Reasoning: ${reasoning}`);
            return existingSession;
        }

        // Create new session
        const sessionName = this.generateUniqueSessionName(suggestedName || sessionType);
        const newSession = this.createSession(sessionName, {
            focus,
            directories,
            file_patterns: filePatterns,
            auto_created: true,
            confidence,
            reasoning,
            created_by: 'intelligent_auto_manager'
        });

        console.log(`🤖 Auto-created session '${sessionName}' (${confidence.toFixed(2)} confidence)`);
        console.log(`🎯 Focus: ${focus.join(', ')}`);
        console.log(`💡 Reasoning: ${reasoning}`);

        return newSession;
    }

    /**
     * Find similar existing session
     */
    findSimilarSession(targetFocus, targetDirectories) {
        const sessions = this.getActiveSessions();
        
        for (const session of sessions) {
            const focusOverlap = this.calculateOverlap(session.focus, targetFocus);
            const dirOverlap = this.calculateOverlap(session.directories, targetDirectories);
            
            if (focusOverlap >= 0.7 || dirOverlap >= 0.6) {
                return session;
            }
        }
        return null;
    }

    /**
     * Calculate overlap between two arrays
     */
    calculateOverlap(arr1, arr2) {
        if (!arr1.length || !arr2.length) return 0;
        const intersection = arr1.filter(item => arr2.some(item2 => 
            item.toLowerCase().includes(item2.toLowerCase()) ||
            item2.toLowerCase().includes(item.toLowerCase())
        ));
        return intersection.length / Math.max(arr1.length, arr2.length);
    }

    /**
     * Generate unique session name
     */
    generateUniqueSessionName(baseName) {
        const sessions = this.getActiveSessions();
        const existingNames = sessions.map(s => s.name);
        
        if (!existingNames.includes(baseName)) {
            return baseName;
        }
        
        let counter = 1;
        let uniqueName;
        do {
            uniqueName = `${baseName}-${counter}`;
            counter++;
        } while (existingNames.includes(uniqueName));
        
        return uniqueName;
    }

    /**
     * Get or create default session
     */
    getOrCreateDefaultSession() {
        let mainSession = this.getSession('main');
        if (!mainSession) {
            mainSession = this.createSession('main', {
                focus: ['general'],
                directories: ['src'],
                file_patterns: ['*'],
                auto_created: true,
                confidence: 1.0,
                reasoning: 'Default session for general development',
                created_by: 'intelligent_auto_manager'
            });
            console.log('🎯 Using default "main" session for general development');
        }
        return mainSession;
    }

    /**
     * Auto-manage session lifecycle
     */
    autoManageSessionLifecycle() {
        const sessions = this.getActiveSessions();
        const now = new Date();
        
        sessions.forEach(session => {
            const lastActive = new Date(session.last_active);
            const inactive = now - lastActive;
            
            // Auto-close inactive sessions
            if (inactive > this.autoSessionConfig.sessionLifetime && session.active_files.length === 0) {
                console.log(`🔄 Auto-closing inactive session '${session.name}'`);
                this.closeSession(session.name);
            }
        });

        // Clean up if too many sessions
        const activeSessions = this.getActiveSessions();
        if (activeSessions.length > this.autoSessionConfig.maxSessions) {
            this.consolidateSessions();
        }
    }

    /**
     * Consolidate similar sessions
     */
    consolidateSessions() {
        const sessions = this.getActiveSessions();
        const candidates = [];

        // Find consolidation candidates
        for (let i = 0; i < sessions.length; i++) {
            for (let j = i + 1; j < sessions.length; j++) {
                const overlap = this.calculateOverlap(sessions[i].focus, sessions[j].focus);
                if (overlap >= 0.8) {
                    candidates.push({ session1: sessions[i], session2: sessions[j], overlap });
                }
            }
        }

        // Consolidate highest overlap sessions
        candidates.sort((a, b) => b.overlap - a.overlap);
        if (candidates.length > 0) {
            const { session1, session2 } = candidates[0];
            this.mergeSessions(session1, session2);
        }
    }

    /**
     * Merge two similar sessions
     */
    mergeSessions(primarySession, secondarySession) {
        const mergedFocus = [...new Set([...primarySession.focus, ...secondarySession.focus])];
        const mergedDirectories = [...new Set([...primarySession.directories, ...secondarySession.directories])];
        const mergedPatterns = [...new Set([...primarySession.file_patterns, ...secondarySession.file_patterns])];
        
        this.updateSession(primarySession.name, {
            focus: mergedFocus,
            directories: mergedDirectories,
            file_patterns: mergedPatterns,
            active_files: [...new Set([...primarySession.active_files, ...secondarySession.active_files])],
            merged_from: secondarySession.name
        });

        this.closeSession(secondarySession.name);
        console.log(`🔄 Merged session '${secondarySession.name}' into '${primarySession.name}'`);
    }

    /**
     * Smart session switching based on current work
     */
    autoSwitchSession(userInput, currentFiles) {
        const currentContext = this.contextAnalyzer.analyzeCurrentContext({ userInput, currentFiles });
        const sessions = this.getActiveSessions();
        
        let bestSession = null;
        let bestScore = 0;

        sessions.forEach(session => {
            const score = this.calculateSessionFitScore(session, currentContext);
            if (score > bestScore) {
                bestScore = score;
                bestSession = session;
            }
        });

        if (bestScore > 0.8 && bestSession) {
            console.log(`🎯 Auto-switching to session '${bestSession.name}' (fit score: ${bestScore.toFixed(2)})`);
            return bestSession;
        }

        return null;
    }

    /**
     * Calculate how well a session fits current context
     */
    calculateSessionFitScore(session, context) {
        const focusMatch = this.calculateOverlap(session.focus, context.detectedFocus);
        const dirMatch = this.calculateOverlap(session.directories, context.involvedDirectories);
        const patternMatch = this.calculateOverlap(session.file_patterns, context.fileTypes);
        
        return (focusMatch * 0.4 + dirMatch * 0.3 + patternMatch * 0.3);
    }
}

/**
 * Context Analyzer - Understands what user is working on
 */
class ContextAnalyzer {
    constructor(projectRoot) {
        this.projectRoot = projectRoot;
        this.projectStructure = this.analyzeProjectStructure();
    }

    async analyzeContext({ userInput, currentFiles, projectStructure, existingSessions }) {
        const analysis = {
            detectedFocus: [],
            involvedDirectories: [],
            fileTypes: [],
            technicalDomain: null,
            confidence: 0,
            keyIndicators: []
        };

        // Analyze user input for technical domain
        analysis.technicalDomain = this.detectTechnicalDomain(userInput);
        analysis.detectedFocus = this.extractFocusAreas(userInput);
        
        // Analyze current files
        if (currentFiles.length > 0) {
            analysis.involvedDirectories = this.extractDirectories(currentFiles);
            analysis.fileTypes = this.extractFileTypes(currentFiles);
        }

        // Calculate confidence
        analysis.confidence = this.calculateAnalysisConfidence(analysis);
        
        return analysis;
    }

    detectTechnicalDomain(userInput) {
        const input = userInput.toLowerCase();
        
        const domainKeywords = {
            frontend: ['ui', 'component', 'react', 'vue', 'angular', 'css', 'html', 'style', 'frontend', 'client'],
            backend: ['api', 'server', 'backend', 'database', 'auth', 'endpoint', 'route', 'controller'],
            testing: ['test', 'testing', 'spec', 'unit test', 'integration', 'e2e', 'cypress', 'jest'],
            database: ['database', 'db', 'migration', 'schema', 'sql', 'query', 'table'],
            devops: ['deploy', 'deployment', 'docker', 'ci/cd', 'pipeline', 'infrastructure']
        };

        let bestMatch = null;
        let bestScore = 0;

        Object.entries(domainKeywords).forEach(([domain, keywords]) => {
            const matches = keywords.filter(keyword => input.includes(keyword));
            const score = matches.length / keywords.length;
            if (score > bestScore) {
                bestScore = score;
                bestMatch = domain;
            }
        });

        return bestScore > 0.3 ? bestMatch : 'general';
    }

    extractFocusAreas(userInput) {
        const focus = [];
        const input = userInput.toLowerCase();

        const focusMap = {
            'ui': ['ui', 'user interface', 'interface'],
            'components': ['component', 'components'],
            'styling': ['style', 'css', 'scss', 'styling'],
            'api': ['api', 'endpoint', 'rest'],
            'database': ['database', 'db', 'data'],
            'auth': ['auth', 'authentication', 'login'],
            'testing': ['test', 'testing', 'spec'],
            'deployment': ['deploy', 'deployment']
        };

        Object.entries(focusMap).forEach(([focusArea, keywords]) => {
            if (keywords.some(keyword => input.includes(keyword))) {
                focus.push(focusArea);
            }
        });

        return focus.length > 0 ? focus : ['general'];
    }

    extractDirectories(files) {
        return [...new Set(files.map(file => path.dirname(file)))];
    }

    extractFileTypes(files) {
        return [...new Set(files.map(file => path.extname(file)))];
    }

    calculateAnalysisConfidence(analysis) {
        let confidence = 0;
        
        if (analysis.technicalDomain !== 'general') confidence += 0.4;
        if (analysis.detectedFocus.length > 0) confidence += 0.3;
        if (analysis.involvedDirectories.length > 0) confidence += 0.2;
        if (analysis.fileTypes.length > 0) confidence += 0.1;
        
        return Math.min(confidence, 1.0);
    }

    analyzeProjectStructure() {
        // Analyze project structure to understand technology stack
        const structure = {
            hasReact: fs.existsSync(path.join(this.projectRoot, 'package.json')),
            hasNodeJS: fs.existsSync(path.join(this.projectRoot, 'package.json')),
            hasDocker: fs.existsSync(path.join(this.projectRoot, 'Dockerfile')),
            hasTesting: fs.existsSync(path.join(this.projectRoot, 'jest.config.js')),
            directories: this.getDirectoryStructure()
        };

        return structure;
    }

    getDirectoryStructure() {
        const dirs = [];
        try {
            const items = fs.readdirSync(this.projectRoot);
            items.forEach(item => {
                const fullPath = path.join(this.projectRoot, item);
                if (fs.statSync(fullPath).isDirectory() && !item.startsWith('.')) {
                    dirs.push(item);
                }
            });
        } catch (error) {
            console.warn('Could not analyze directory structure:', error.message);
        }
        return dirs;
    }

    getProjectStructure() {
        return this.projectStructure;
    }

    analyzeCurrentContext({ userInput, currentFiles }) {
        return {
            detectedFocus: this.extractFocusAreas(userInput),
            involvedDirectories: this.extractDirectories(currentFiles),
            fileTypes: this.extractFileTypes(currentFiles)
        };
    }
}

/**
 * Session Predictor - AI-powered session recommendations
 */
class SessionPredictor {
    predictOptimalSession(context) {
        const { technicalDomain, detectedFocus, involvedDirectories, fileTypes, confidence } = context;
        
        const prediction = {
            sessionType: technicalDomain,
            confidence: confidence,
            suggestedName: this.generateSessionName(technicalDomain, detectedFocus),
            focus: detectedFocus,
            directories: this.recommendDirectories(technicalDomain, involvedDirectories),
            filePatterns: this.recommendFilePatterns(technicalDomain, fileTypes),
            reasoning: this.generateReasoning(context)
        };

        return prediction;
    }

    generateSessionName(domain, focus) {
        if (focus.length === 1) {
            return `${domain}-${focus[0]}`;
        }
        return domain;
    }

    recommendDirectories(domain, currentDirs) {
        const domainDirs = {
            frontend: ['src/components', 'src/pages', 'src/styles', 'public'],
            backend: ['src/api', 'src/routes', 'src/controllers', 'src/models'],
            testing: ['tests', 'test', '__tests__', 'cypress'],
            database: ['migrations', 'database', 'src/models'],
            devops: ['.github', 'docker', 'deploy']
        };

        const recommended = domainDirs[domain] || ['src'];
        return [...new Set([...recommended, ...currentDirs])];
    }

    recommendFilePatterns(domain, currentTypes) {
        const domainPatterns = {
            frontend: ['*.tsx', '*.jsx', '*.css', '*.scss', '*.html'],
            backend: ['*.js', '*.ts', '*.json'],
            testing: ['*.test.js', '*.spec.js', '*.cy.js'],
            database: ['*.sql', '*.prisma', '*migration*'],
            devops: ['*.yml', '*.yaml', 'Dockerfile']
        };

        const recommended = domainPatterns[domain] || ['*'];
        return [...new Set([...recommended, ...currentTypes])];
    }

    generateReasoning(context) {
        const { technicalDomain, detectedFocus, confidence } = context;
        
        if (confidence > 0.8) {
            return `High confidence ${technicalDomain} work detected. Focus areas: ${detectedFocus.join(', ')}`;
        } else if (confidence > 0.5) {
            return `Moderate confidence ${technicalDomain} work detected. May need adjustment.`;
        } else {
            return `Low confidence detection. Using general session with adaptive focus.`;
        }
    }
}

module.exports = IntelligentSessionManager;
