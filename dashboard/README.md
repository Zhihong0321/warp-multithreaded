# Warp Multithreaded Dashboard

A real-time web interface for monitoring and managing AI agent sessions in the warp-multithreaded framework.

## 🚀 Features

- **Real-time Session Monitoring**: Live updates of all active AI agent sessions
- **Visual Status Overview**: Comprehensive stats and health metrics
- **Session Management**: Create, close, and modify sessions through the web interface
- **Conflict Detection**: Visual alerts for file conflicts between sessions
- **Task Management**: Update and track current tasks for each session
- **Project Information**: View project configuration and framework status
- **Activity Timeline**: Real-time log of session activities and changes

## 📊 Dashboard Sections

### Overview Cards
- **Active Sessions**: Number of currently running sessions
- **Files in Use**: Total files being worked on across all sessions
- **Conflicts**: Number of detected file conflicts
- **Health Score**: Overall project health percentage

### Session Grid
- Visual cards for each active session
- Session status (Working/Idle)
- Focus areas and current tasks
- File usage statistics
- Quick action buttons

### Conflict Management
- Real-time conflict detection
- File-level conflict details
- Session overlap identification

### Activity Log
- Recent session activities
- File operations
- Conflict alerts
- System events

## 🛠️ Installation & Setup

### 1. Install Dependencies
```powershell
# From the project root
npm install
```

### 2. Start the Dashboard
```powershell
# Using npm script
npm run dashboard

# Or directly with Node.js
node dashboard/server.js

# With custom port
node dashboard/server.js --port=4000

# With custom project path
node dashboard/server.js --project=C:\path\to\your\project
```

### 3. Using the CLI
```powershell
# Start dashboard via coordinator
node scripts/coordinator.js dashboard

# With options
node scripts/coordinator.js dashboard --port=4000 --project=C:\path\to\project
```

## 🌐 Accessing the Dashboard

Once started, access the dashboard at:
- **Default**: http://localhost:3000/warp-dashboard
- **Custom Port**: http://localhost:YOUR_PORT/warp-dashboard

## 🔧 API Endpoints

The dashboard provides a REST API for programmatic access:

### Session Management
- `GET /api/sessions` - List all active sessions
- `POST /api/sessions` - Create a new session
- `DELETE /api/sessions/:name` - Close a session
- `POST /api/sessions/:name/task` - Update session task

### Status & Monitoring
- `GET /api/status` - Get framework status overview
- `GET /api/conflicts` - Check for file conflicts
- `GET /api/project-info` - Get project information

### File Operations
- `POST /api/sessions/:name/lock-file` - Lock a file for a session
- `POST /api/sessions/:name/release-file` - Release file lock

## 🚀 Usage Examples

### Creating a Session
1. Click "New Session" button
2. Fill in session details:
   - **Name**: `frontend`
   - **Focus Areas**: `ui, components, styling`
   - **Directories**: `src/components, src/styles`
   - **File Patterns**: `*.tsx, *.jsx, *.css`
3. Click "Create Session"

### Managing Tasks
1. Click "Task" button on any session card
2. Enter task description
3. Click "Update Task"

### Monitoring Conflicts
- Conflicts appear automatically in red alert boxes
- Shows which sessions are conflicting
- Provides resolution recommendations

## 🔄 Real-time Updates

The dashboard uses WebSocket connections for real-time updates:
- Session status changes
- New conflicts detection
- File lock/unlock events
- Task updates
- Activity logging

Updates occur every 5 seconds automatically, plus instant updates for user actions.

## 📱 Mobile Responsive

The dashboard is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

## 🛡️ Security Notes

- Dashboard is designed for local development use
- No authentication required (localhost only)
- CORS enabled for development flexibility
- All data stored locally in project directory

## 🎨 Customization

### Styling
Modify `dashboard/public/style.css` to customize appearance.

### Functionality
Extend `dashboard/public/dashboard.js` for additional features.

### Server Configuration
Edit `dashboard/server.js` for API modifications.

## 🐛 Troubleshooting

### Dashboard Won't Start
```powershell
# Check dependencies
npm install

# Verify Node.js version (requires >=14.0.0)
node --version

# Check port availability
netstat -an | Select-String ":3000"
```

### Connection Issues
- Ensure firewall allows localhost connections
- Try different port: `--port=4000`
- Check browser console for errors

### Session Data Not Loading
- Verify `.warp-sessions` directory exists
- Check project is initialized: `node scripts/coordinator.js status`
- Ensure proper permissions on project directory

## 🔮 Future Enhancements

- Session performance metrics
- Visual file dependency graphs
- Team collaboration features
- Integration with version control systems
- Advanced conflict resolution tools
- Session templates and presets

---

**The dashboard provides a powerful visual interface for managing your multithreaded AI development workflow!** 🎉
