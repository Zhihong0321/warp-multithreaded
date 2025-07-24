# Warp Rules Integration Setup

This guide shows how to integrate the Warp AI Agent Framework with Warp Drive/Rules for automatic session coordination.

## 🎯 What Are Warp Rules?

Warp Rules automatically inform AI Agents about project context, coordination protocols, and session-specific guidelines without you having to explain it every time.

## 📋 Available Rule Files

The framework includes these pre-configured Warp Rules:

### **1. General Coordination Rules**
- **File**: `warp-rules/multi-session-coordination.md`
- **Purpose**: Basic multi-session awareness and coordination protocol
- **Use**: Add to any project using the framework

### **2. Frontend Session Rules**  
- **File**: `warp-rules/frontend-session-rules.md`
- **Purpose**: Specific guidelines for frontend-focused AI Agent sessions
- **Use**: Add to terminals/sessions working on UI, components, styling

### **3. Backend Session Rules**
- **File**: `warp-rules/backend-session-rules.md`  
- **Purpose**: Specific guidelines for backend-focused AI Agent sessions
- **Use**: Add to terminals/sessions working on APIs, database, server logic

## 🚀 Integration Methods

### **Method 1: Warp Drive Integration (Recommended)**

If your Warp supports Warp Drive, add these files to your drive:

1. **Copy the rule files to your Warp Drive:**
   ```bash
   # Copy to your Warp Drive folder
   cp warp-rules/multi-session-coordination.md ~/WarpDrive/
   cp warp-rules/frontend-session-rules.md ~/WarpDrive/
   cp warp-rules/backend-session-rules.md ~/WarpDrive/
   ```

2. **Reference in your Warp sessions:**
   ```
   Human: Use the multi-session-coordination and frontend-session-rules from my Warp Drive.
   ```

### **Method 2: Project-Local Rules**

For project-specific coordination:

1. **Copy rules to your project:**
   ```bash
   # In your project directory
   mkdir .warp-rules
   cp /path/to/framework/warp-rules/* .warp-rules/
   ```

2. **Tell your AI Agent:**
   ```
   Human: Follow the coordination rules in .warp-rules/multi-session-coordination.md 
   and the frontend-session-rules.md for this session.
   ```

### **Method 3: Direct Copy-Paste**

For immediate use:

1. **Copy rule content** from the markdown files
2. **Paste into Warp terminal:**
   ```
   Human: Please follow these coordination rules:

   [paste rule content here]

   I'm working in a frontend session on UI tasks.
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
