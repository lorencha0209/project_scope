# Project Scope - Backend API

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp env.example .env
# Edit .env with your database credentials
```

3. **Initialize database:**
```bash
npm run init-db
```

4. **Start the server:**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📊 Database Schema

The application uses MySQL with the following main tables:

- **projects** - Project information
- **sprints** - Sprint management
- **tasks** - Task management
- **risks** - Risk assessment
- **minutes** - Meeting minutes
- **kanban_columns** - Kanban board columns
- **sprint_tasks** - Many-to-many relationship between sprints and tasks

## 🔌 API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks?project_id=:id` - Get all tasks for a project
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/sprint` - Add task to sprint
- `DELETE /api/tasks/:id/sprint/:sprint_id` - Remove task from sprint

### Sprints
- `GET /api/sprints?project_id=:id` - Get all sprints for a project
- `GET /api/sprints/:id` - Get sprint by ID with tasks
- `POST /api/sprints` - Create new sprint
- `PUT /api/sprints/:id` - Update sprint
- `DELETE /api/sprints/:id` - Delete sprint
- `POST /api/sprints/:id/tasks` - Add multiple tasks to sprint
- `DELETE /api/sprints/:id/tasks/:task_id` - Remove task from sprint

### Risks
- `GET /api/risks?project_id=:id` - Get all risks for a project
- `GET /api/risks/:id` - Get risk by ID
- `POST /api/risks` - Create new risk
- `PUT /api/risks/:id` - Update risk
- `DELETE /api/risks/:id` - Delete risk
- `GET /api/risks/stats/:project_id` - Get risk statistics

### Minutes
- `GET /api/minutes?project_id=:id` - Get all minutes for a project
- `GET /api/minutes/:id` - Get minutes by ID
- `POST /api/minutes` - Create new minutes
- `PUT /api/minutes/:id` - Update minutes
- `DELETE /api/minutes/:id` - Delete minutes

### Columns
- `GET /api/columns?project_id=:id` - Get all columns for a project
- `GET /api/columns/:id` - Get column by ID
- `POST /api/columns` - Create new column
- `PUT /api/columns/:id` - Update column
- `DELETE /api/columns/:id` - Delete column
- `PUT /api/columns/reorder` - Reorder columns

## 🔧 Configuration

### Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=project_scope

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:8080
```

## 🛠️ Development

### Project Structure
```
backend/
├── config/
│   └── database.js          # Database connection
├── routes/
│   ├── projects.js         # Project routes
│   ├── tasks.js            # Task routes
│   ├── sprints.js          # Sprint routes
│   ├── risks.js            # Risk routes
│   ├── minutes.js          # Minutes routes
│   └── columns.js          # Column routes
├── scripts/
│   ├── database-schema.sql # Database schema
│   └── init-database.js   # Database initialization
├── server.js               # Main server file
├── package.json            # Dependencies
└── env.example             # Environment template
```

### Database Features

- **Auto-generated fields**: `risk_factor` and `appetite` are calculated automatically
- **Foreign key constraints**: Ensures data integrity
- **Indexes**: Optimized for common queries
- **Transactions**: Used for complex operations
- **Cascade deletes**: Maintains referential integrity

## 🚀 Deployment

### Production Setup

1. **Configure production environment:**
```bash
NODE_ENV=production
DB_HOST=your_production_host
DB_PASSWORD=your_secure_password
```

2. **Initialize production database:**
```bash
npm run init-db
```

3. **Start production server:**
```bash
npm start
```

### Docker Support (Optional)

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 Notes

- The API uses JSON for all requests and responses
- All timestamps are in UTC
- Error responses include detailed error messages
- The server includes CORS support for frontend integration
- Database connections are managed automatically
- All routes include proper error handling
