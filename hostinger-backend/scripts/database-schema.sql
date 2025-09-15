-- Project Scope Database Schema
-- MySQL Database Creation Script

CREATE DATABASE IF NOT EXISTS project_scope CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE project_scope;

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default user
INSERT IGNORE INTO users (username, email, password_hash, full_name) VALUES
('lorena.alvarez', 'lorena.alvarez@projectscope.com', '$2a$10$gJTj9c0InDB8OFRelGwoWuvaz5JsN8t.../a0zl3A0Dc4QYXb5U2S', 'Lorena Alvarez');

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('active', 'completed', 'paused', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sprints table
CREATE TABLE IF NOT EXISTS sprints (
    id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('planning', 'active', 'completed') DEFAULT 'planning',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('todo', 'progress', 'blocked', 'done') DEFAULT 'todo',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    responsible VARCHAR(100),
    start_date DATE,
    end_date DATE,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Sprint Tasks junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS sprint_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sprint_id VARCHAR(50) NOT NULL,
    task_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sprint_id) REFERENCES sprints(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    UNIQUE KEY unique_sprint_task (sprint_id, task_id)
);

-- Kanban Columns table
CREATE TABLE IF NOT EXISTS kanban_columns (
    id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Risks table
CREATE TABLE IF NOT EXISTS risks (
    id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    impact INT NOT NULL CHECK (impact >= 1 AND impact <= 4),
    probability INT NOT NULL CHECK (probability >= 1 AND probability <= 4),
    risk_factor INT GENERATED ALWAYS AS (impact * probability) STORED,
    appetite ENUM('low', 'moderate', 'high', 'extreme') GENERATED ALWAYS AS (
        CASE 
            WHEN (impact * probability) <= 4 THEN 'low'
            WHEN (impact * probability) <= 8 THEN 'moderate'
            WHEN (impact * probability) <= 12 THEN 'high'
            ELSE 'extreme'
        END
    ) STORED,
    mitigation_plan TEXT,
    strategy ENUM('avoid', 'mitigate', 'transfer', 'accept') DEFAULT 'mitigate',
    status ENUM('open', 'closed', 'monitoring') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Meeting Minutes table
CREATE TABLE IF NOT EXISTS minutes (
    id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT,
    meeting_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_sprints_project ON sprints(project_id);
CREATE INDEX idx_sprints_status ON sprints(status);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_risks_project ON risks(project_id);
CREATE INDEX idx_risks_status ON risks(status);
CREATE INDEX idx_minutes_project ON minutes(project_id);
CREATE INDEX idx_minutes_date ON minutes(meeting_date);
CREATE INDEX idx_columns_project ON kanban_columns(project_id);

-- Insert default kanban columns for existing projects
INSERT IGNORE INTO kanban_columns (id, project_id, name, order_index, is_default) VALUES
('todo', 'default', 'Por Hacer', 0, TRUE),
('progress', 'default', 'En Progreso', 1, TRUE),
('blocked', 'default', 'Impedimento', 2, TRUE),
('done', 'default', 'Terminado', 3, TRUE);
