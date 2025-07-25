#!/usr/bin/env node

/**
 * WARP MULTITHREADED - AUTO RULE GENERATION SCRIPT
 * 
 * Generates unified .warp-unified-rules.md from masterplan configuration
 * Output optimized for AI readability - clean, structured, no emojis
 */

const fs = require('fs');
const path = require('path');

class UnifiedRuleGenerator {
    constructor() {
        this.projectRoot = process.cwd();
        this.masterplanPath = path.join(this.projectRoot, 'masterplan-config.json');
        this.goalPath = path.join(this.projectRoot, 'masterplan-goal.md');
        this.outputPath = path.join(this.projectRoot, '.warp-unified-rules.md');
    }

    /**
     * Main generation function
     */
    async generate() {
        console.log('WARP MULTITHREADED - Generating Unified Rules');
        console.log('================================================');

        try {
            // Step 1: Load masterplan configuration
            const masterplan = await this.loadMasterplan();
            console.log('Loaded masterplan configuration');

            // Step 2: Generate goal file
            await this.generateGoalFile(masterplan.goal);
            console.log('Generated masterplan-goal.md');

            // Step 3: Generate unified rule
            const unifiedRule = await this.generateUnifiedRule(masterplan);
            console.log('Generated unified rule content');

            // Step 4: Write unified rule file
            await this.writeUnifiedRule(unifiedRule);
            console.log('Written .warp-unified-rules.md');

            console.log('\nSUCCESS: Unified rules generated');
            console.log(`Rule file: ${this.outputPath}`);
            console.log(`Goal file: ${this.goalPath}`);
            console.log('\nNext: Add this rule in Warp AI settings');
            
            return true;

        } catch (error) {
            console.error('ERROR generating unified rules:', error.message);
            return false;
        }
    }

    /**
     * Load masterplan configuration
     */
    async loadMasterplan() {
        if (!fs.existsSync(this.masterplanPath)) {
            // Create default masterplan if none exists
            const defaultMasterplan = {
                goal: "Build an amazing application that solves real problems for users",
                techStack: "ai_decide",
                hosting: "vercel",
                database: "postgresql",
                authentication: "clerk",
                styling: "tailwind",
                integrations: [],
                performance: {
                    targetResponseTime: "200ms",
                    expectedUsers: "1000"
                },
                features: [],
                timeline: "4 weeks",
                createdAt: new Date().toISOString()
            };

            fs.writeFileSync(this.masterplanPath, JSON.stringify(defaultMasterplan, null, 2));
            console.log('Created default masterplan configuration');
            return defaultMasterplan;
        }

        const content = fs.readFileSync(this.masterplanPath, 'utf8');
        return JSON.parse(content);
    }

    /**
     * Generate the goal file that rules will reference
     */
    async generateGoalFile(goal) {
        const goalContent = `# PROJECT GOAL

## Current Goal
${goal}

## Last Updated
${new Date().toISOString()}

## Key Objectives
- Align all development decisions with this goal
- Refer to this goal before starting any task
- Update this goal anytime via dashboard

---
This file is auto-updated when goal is changed in warp-multithreaded dashboard
`;

        fs.writeFileSync(this.goalPath, goalContent);
    }

    /**
     * Generate the complete unified rule content
     */
    async generateUnifiedRule(masterplan) {
        const techStackGuidance = this.generateTechStackGuidance(masterplan.techStack);
        const integrationCommands = this.generateIntegrationCommands(masterplan);
        const sessionRules = this.generateSessionRules(masterplan);
        const performanceGuidelines = this.generatePerformanceGuidelines(masterplan.performance);

        return `# WARP MULTITHREADED UNIFIED DEVELOPMENT RULES

## PROJECT GOAL - ALWAYS CHECK FIRST

CRITICAL: Before any development work, read the current project goal from:
File: \`warp-multithreaded/masterplan-goal.md\`

This file contains the live, up-to-date project goal that can be edited anytime via dashboard.
ALL development decisions must align with the current goal.

## FULLY AUTOMATED SESSION MANAGEMENT

You are working in a multi-session development environment with FULLY AUTOMATED session management.

### Auto-Session Triggers
- Frontend work: UI components, styling, React/Vue creates "frontend" session
- Backend work: APIs, database, server logic creates "backend" session  
- Testing work: Tests, specs, QA creates "testing" session
- DevOps work: Deployment, Docker, CI/CD creates "devops" session

### What Happens Automatically
The system will:
1. Analyze your request and detect work type
2. Auto-create appropriate session with correct focus
3. Configure proper directories and file boundaries
4. Prevent conflicts between parallel sessions
5. Switch sessions when work context changes

CRITICAL: NEVER manually create sessions - the system handles everything automatically.

${sessionRules}

## TECH STACK CONFIGURATION

${techStackGuidance}

## HOSTING AND INTEGRATION SETUP

Hosting Choice: ${masterplan.hosting}
Database: ${masterplan.database}
Authentication: ${masterplan.authentication}
Styling: ${masterplan.styling}

${integrationCommands}

## PERFORMANCE GUIDELINES

${performanceGuidelines}

## ENVIRONMENT CONFIGURATION

Operating System: Windows
Shell: PowerShell (pwsh) version 5.1.22621.5624
Current Directory: D:\\warp-multithreaded\\warp-multithreaded

### PowerShell Command Equivalents
Always use PowerShell-compatible commands:
- Use \`Invoke-WebRequest\` or \`curl.exe\` instead of curl
- Use \`Get-Content\` instead of cat
- Use \`Set-Location\` or \`cd\` for directory navigation
- Use \`Get-ChildItem\` or \`ls\` for listing files
- Use \`Copy-Item\` instead of cp
- Use \`Move-Item\` instead of mv
- Use \`Remove-Item\` instead of rm
- Use \`New-Item\` instead of touch
- Use \`Select-String\` instead of grep

NEVER assume Unix/Linux commands will work. Always use PowerShell-native commands.

## MASTERPLAN INTEGRATION

### Always Check Project Context
Before starting any work:
1. Read the current goal from \`masterplan-goal.md\`
2. Check \`.warp-masterplan/\` for project status
3. Review completed tasks and current priorities
4. Align your work with the masterplan specifications

### Context Files to Reference
- \`masterplan-goal.md\` - Current project goal (ALWAYS CHECK)
- \`masterplan-config.json\` - Complete project configuration
- \`.warp-masterplan/masterplan.md\` - Project overview
- \`.warp-masterplan/tasks.json\` - Active task list
- \`.warp-masterplan/decisions.md\` - Technical decisions

## CRITICAL COORDINATION RULES

### Framework Version Check - MANDATORY FIRST STEP
\`\`\`bash
# ALWAYS run this BEFORE any work
node scripts/version-detector.js
\`\`\`

IF VERSION CHECK FAILS:
- STOP immediately - do not proceed
- Framework needs updating
- Follow update instructions
- Only proceed when status shows "UP_TO_DATE"

### Session Boundaries - Auto-Enforced

Frontend Sessions Handle:
- React/Vue/Angular components (\`src/components/**/*\`)
- Styling and CSS (\`src/styles/**/*\`)
- UI interactions and forms
- Client-side routing
- Static assets (\`public/**/*\`)

Backend Sessions Handle:
- API endpoints (\`src/api/**/*\`)
- Database models (\`src/models/**/*\`)
- Server middleware (\`src/middleware/**/*\`)
- Authentication logic
- Business logic and validation

Shared Files - Coordinate First:
- \`package.json\` - Dependencies
- \`.env\` files - Environment variables
- Configuration files
- \`docker-compose.yml\`

## DEVELOPMENT WORKFLOW

### Starting Work
1. Check framework version with \`node scripts/version-detector.js\`
2. Read current goal from \`masterplan-goal.md\`
3. Describe what you want to build naturally
4. System auto-creates appropriate session
5. Start development with full context

### During Development
- Stay within auto-created session boundaries
- Reference masterplan specifications
- Follow tech stack guidelines
- Use PowerShell-compatible commands
- Test changes align with project goal

### Quality Standards
- All work must align with project goal
- Follow tech stack best practices
- Meet performance targets
- Include appropriate testing
- Document significant changes

## SPEC-DRIVEN DEVELOPMENT

Your unified development environment is configured for:
- Goal-Driven Development: Always reference the current project goal
- Auto-Session Management: No manual session creation needed
- Tech Stack Consistency: Follow configured architecture
- High Performance: Meet specified performance targets
- Automated Integration: CLI tools and deployment ready

Just describe what you want to build - the system handles the rest.

---

Generated by Warp Multithreaded Auto-Rule Generator
Masterplan: ${masterplan.createdAt}
Rules Generated: ${new Date().toISOString()}
`;
    }

    /**
     * Generate tech stack specific guidance
     */
    generateTechStackGuidance(techStack) {
        const techStackMap = {
            ai_decide: `Strategy: Let AI Decide (Recommended)
Guidance: AI will analyze your project requirements and choose the optimal tech stack.

AI Decision Process:
1. Analyze project goal and requirements
2. Consider performance, scalability, and development speed
3. Choose modern, well-supported technologies
4. Prefer full-stack solutions when possible
5. Optimize for developer experience and deployment ease

Common AI Recommendations:
- Full-Stack: Next.js + TypeScript + tRPC + Prisma
- SaaS Applications: Next.js + Clerk + Stripe + Vercel
- Real-time Apps: Next.js + Socket.io + Redis
- AI/ML Apps: Python + FastAPI + PostgreSQL + React`,

            nextjs_fullstack: `Strategy: Next.js Full-Stack
Stack: React + TypeScript + tRPC + Prisma + PostgreSQL

Session Configuration:
- Frontend: Focus on React components, pages, and styling
- Backend: Focus on API routes, database, and server logic
- Use Next.js app router for modern development
- TypeScript for type safety across frontend and backend`,

            mern_stack: `Strategy: MERN Stack
Stack: MongoDB + Express + React + Node.js

Session Configuration:
- Frontend: React components and state management
- Backend: Express APIs and MongoDB operations
- Clear separation between client and server
- RESTful API design patterns`,

            vue_node: `Strategy: Vue.js + Node.js
Stack: Vue 3 + TypeScript + Express + PostgreSQL

Session Configuration:
- Frontend: Vue components with Composition API
- Backend: Express server with PostgreSQL database
- TypeScript for enhanced developer experience`,

            custom: `Strategy: Custom Tech Stack
Configuration: Based on masterplan specifications

Session Configuration:
- Boundaries defined by your custom architecture
- AI will adapt to your specific technology choices
- Follow your established patterns and conventions`
        };

        return techStackMap[techStack] || techStackMap.ai_decide;
    }

    /**
     * Generate integration and CLI commands based on hosting choice
     */
    generateIntegrationCommands(masterplan) {
        const commands = [];

        // Hosting-specific commands
        if (masterplan.hosting === 'vercel') {
            commands.push(`### Vercel Integration - Highly Recommended
\`\`\`bash
# Install and setup Vercel CLI
npm install -g vercel
vercel login
vercel init
\`\`\``);
        }

        if (masterplan.hosting === 'railway') {
            commands.push(`### Railway Integration - Highly Recommended
\`\`\`bash
# Install and setup Railway CLI
npm install -g @railway/cli
railway login
railway init
\`\`\``);
        }

        if (masterplan.hosting === 'netlify') {
            commands.push(`### Netlify Integration - Highly Recommended
\`\`\`bash
# Install and setup Netlify CLI
npm install -g netlify-cli
netlify login
netlify init
\`\`\``);
        }

        // Database-specific commands
        if (masterplan.database === 'postgresql') {
            commands.push(`### PostgreSQL Setup
\`\`\`bash
# For local development
# Install PostgreSQL locally or use cloud service
# Consider PlanetScale or Supabase for managed PostgreSQL
\`\`\``);
        }

        // Authentication-specific commands
        if (masterplan.authentication === 'clerk') {
            commands.push(`### Clerk Authentication Setup
\`\`\`bash
# Install Clerk
npm install @clerk/nextjs
# Add environment variables for Clerk keys
\`\`\``);
        }

        return commands.length > 0 ? commands.join('\n\n') : '### No specific integrations configured';
    }

    /**
     * Generate session-specific rules
     */
    generateSessionRules(masterplan) {
        return `## SESSION-SPECIFIC RULES

### Frontend Session Boundaries
YOU SHOULD HANDLE:
- UI components and user interfaces
- Styling and responsive design
- Client-side interactions and forms
- Frontend routing and navigation
- Static assets and media files

AVOID - Let Backend Handle:
- API endpoints and server routes
- Database operations and models
- Server-side authentication logic
- Business logic and data processing

### Backend Session Boundaries
YOU SHOULD HANDLE:
- API endpoints and routes
- Database models and operations
- Server-side business logic
- Authentication and authorization
- Data validation and processing

AVOID - Let Frontend Handle:
- UI components and styling
- Client-side interactions
- Frontend state management
- User interface design

### Coordination Protocol
Before touching shared files:
1. Check if other sessions are working on them
2. Coordinate changes to avoid conflicts
3. Focus on your session's specialization area
4. Communicate significant changes`;
    }

    /**
     * Generate performance guidelines
     */
    generatePerformanceGuidelines(performance) {
        return `### Performance Targets
- API Response Time: ${performance.targetResponseTime || '200ms'}
- Expected Users: ${performance.expectedUsers || '1000'}
- Database Queries: Optimize for efficiency
- Frontend Bundle: Keep minimal and fast-loading
- Caching: Implement appropriate caching strategies

### Performance Best Practices
- Database: Use indexes, avoid N+1 queries
- API: Implement response caching where appropriate
- Frontend: Code splitting and lazy loading
- Images: Optimize and compress all media
- Monitoring: Track Core Web Vitals and API performance`;
    }

    /**
     * Write the unified rule to file
     */
    async writeUnifiedRule(content) {
        fs.writeFileSync(this.outputPath, content);
    }
}

// CLI execution
async function main() {
    const args = process.argv.slice(2);
    const generator = new UnifiedRuleGenerator();

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
WARP MULTITHREADED - Unified Rule Generator

USAGE:
  node scripts/generate-unified-rules.js [options]

OPTIONS:
  --help, -h     Show this help message
  --force        Overwrite existing rule file
  --dry-run      Show what would be generated without writing

EXAMPLES:
  node scripts/generate-unified-rules.js
  node scripts/generate-unified-rules.js --force
  node scripts/generate-unified-rules.js --dry-run

The script reads from masterplan-config.json and generates:
- masterplan-goal.md (dynamic goal file)
- .warp-unified-rules.md (unified rule file)
        `);
        return;
    }

    const success = await generator.generate();
    process.exit(success ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { UnifiedRuleGenerator };
