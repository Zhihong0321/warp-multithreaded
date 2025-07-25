# Warp Rules Integration Setup

This guide shows how to integrate the Warp Multithreaded Framework with Warp Drive/Rules for automatic session coordination.

## 🎯 What Are Warp Rules?

Warp Rules automatically inform AI Agents about the framework capabilities, project context, and coordination protocols without you having to explain it every time.

## 📋 Single Framework Rule - Simplified Approach

The framework now uses **ONE unified rule** that teaches AI agents how to work with the framework:

### **Warp Multithreaded Framework Rule**
- **File**: `WARP_MULTITHREADED_FRAMEWORK_RULE.md`
- **Purpose**: Complete framework understanding for AI agents
- **Scope**: General framework operation (NOT project-specific)
- **Use**: Add to your Warp Drive for all projects using this framework

## 🚀 Integration Methods

### **Method 1: Warp Drive Integration (Recommended)**

Add the single framework rule to your Warp Drive:

1. **Copy the framework rule to your Warp Drive:**
   ```bash
   # Copy to your Warp Drive folder
   cp WARP_MULTITHREADED_FRAMEWORK_RULE.md ~/WarpDrive/
   ```

2. **Reference in any project using the framework:**
   ```
   Human: Use the WARP_MULTITHREADED_FRAMEWORK_RULE from my Warp Drive.
   I want to build a task management app.
   ```

### **Method 2: Direct Reference**

For immediate use without Warp Drive:

1. **Tell your AI Agent to follow the framework rule:**
   ```
   Human: Follow the Warp Multithreaded Framework rule in WARP_MULTITHREADED_FRAMEWORK_RULE.md.
   I need to create a real-time chat application.
   ```

### **Method 3: Masterplan Setup First**

For new projects - **RECOMMENDED WORKFLOW**:

1. **Set up the project with Masterplan Mode:**
   ```bash
   # Run masterplan wizard to generate project-specific setup
   node scripts/masterplan-wizard.js
   # This creates masterplan-goal.md and .warp-unified-rules.md
   ```

2. **Then tell your AI Agent:**
   ```
   Human: Follow the Warp Multithreaded Framework rule and use the project-specific 
   rules generated in .warp-unified-rules.md. Let's start building.
   ```

## 🛠️ Setup Workflow

### **Complete Project Setup:**

1. **Initialize framework in your project:**
   ```bash
   node /path/to/framework/scripts/coordinator.js init --project-type=web-app
   ```

2. **Create sessions:**
   ```bash
   node scripts/coordinator.js session create --name=frontend
   node scripts/coordinator.js session create --name=backend
   ```

3. **Set up Warp Rules** (choose one method above)

4. **Start coordinated development:**
   ```
   # Terminal 1 - Frontend Session
   Human: I'm following frontend-session-rules and multi-session-coordination. 
   Working on UI components for the user dashboard.

   # Terminal 2 - Backend Session  
   Human: I'm following backend-session-rules and multi-session-coordination.
   Working on API endpoints for user management.
   ```

## 📝 Rule Customization

### **Adding Your Own Rules**

Create custom rules for your specific project needs:

```markdown
# my-project-rules.md

## Project-Specific Context
- This is a React + Node.js e-commerce application
- We use TypeScript, Tailwind CSS, and PostgreSQL
- Authentication is handled via Auth0
- Payment processing uses Stripe

## Session Assignments
- Frontend: Focus on product catalog, shopping cart, checkout UI
- Backend: Focus on inventory management, order processing, payment APIs
- Testing: Focus on user journey tests, payment flow testing

## Special Considerations
- All payment-related code requires security review
- UI changes must be mobile-first
- Database changes require migration scripts
```

### **Session-Specific Customization**

Modify the provided rules for your technology stack:

```markdown
# frontend-session-rules-custom.md

## Technology Stack
- Framework: React 18 with TypeScript
- Styling: Tailwind CSS + shadcn/ui components
- State: Zustand for global state
- Forms: React Hook Form + Zod validation

## Custom Guidelines
- Use shadcn/ui components when possible
- Follow Tailwind utility-first approach
- Implement proper loading states for all async operations
- Ensure components work with both light/dark themes
```

## 🔄 Automatic Updates

### **Framework Updates the Rules**

When you run framework commands, it can update your project rules:

```bash
# Update coordination status
node scripts/coordinator.js status

# This updates .warp-coordination.md which your rules reference
```

### **Dynamic Session Information**

The rules automatically reference:
- `.warp-sessions/[session-name].json` - Your session configuration
- `.warp-coordination.md` - Current project coordination status
- Project-specific configuration from `.warp-config.json`

## 🎯 Usage Examples

### **Starting a Frontend Session**
```
Human: I'm starting work on this project. Please follow the multi-session-coordination 
and frontend-session-rules. I need to add a responsive navigation bar with dropdown menus.
```

**The AI Agent will:**
- Check `.warp-sessions/frontend.json` for session config
- Focus on UI/styling aspects only
- Avoid backend/API work
- Check for file conflicts before editing
- Communicate progress appropriately

### **Starting a Backend Session**  
```
Human: Following backend-session-rules and multi-session-coordination. 
I need to implement user authentication API endpoints with JWT tokens.
```

**The AI Agent will:**
- Focus on server-side logic and database operations
- Avoid frontend/UI work
- Implement proper security practices
- Create API documentation for frontend team
- Check for database migration conflicts

## 📊 Benefits

### **With Warp Rules Integration:**
✅ **Automatic coordination** - No need to explain session roles every time  
✅ **Consistent behavior** - All agents follow the same protocols  
✅ **Reduced conflicts** - Agents automatically avoid overlapping work  
✅ **Better communication** - Clear protocols for cross-session coordination  
✅ **Faster onboarding** - New sessions immediately understand their role  

### **Without Warp Rules:**
❌ Manual explanation needed every session  
❌ Inconsistent coordination approaches  
❌ More potential for conflicts  
❌ Slower session startup  
❌ Risk of agents working outside their expertise  

---

**The Warp Rules integration makes the framework truly seamless - your AI Agents automatically understand their roles and coordinate effectively!** 🚀
