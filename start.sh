#!/bin/bash

# Project Scope - Quick Start Script
# This script sets up the MySQL backend and starts the application

echo "🚀 Project Scope - Quick Start"
echo "=============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    exit 1
fi

echo "✅ Node.js and MySQL are installed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your MySQL credentials before continuing"
    echo "   DB_HOST=localhost"
    echo "   DB_PORT=3306"
    echo "   DB_USER=root"
    echo "   DB_PASSWORD=your_password_here"
    echo "   DB_NAME=project_scope"
    echo ""
    read -p "Press Enter after updating .env file..."
fi

# Initialize database
echo "🗄️  Initializing database..."
npm run init-db

if [ $? -eq 0 ]; then
    echo "✅ Database initialized successfully"
else
    echo "❌ Database initialization failed. Please check your MySQL credentials in .env"
    exit 1
fi

# Start the server
echo "🚀 Starting Project Scope API server..."
echo "   API will be available at: http://localhost:3000"
echo "   Health check: http://localhost:3000/api/health"
echo ""
echo "📱 To use the frontend:"
echo "   1. Open index.html in your browser"
echo "   2. The app will automatically connect to the API"
echo "   3. If API is not available, it will fallback to localStorage"
echo ""

npm start
