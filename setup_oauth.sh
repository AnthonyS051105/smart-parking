#!/bin/bash

# Quick setup script untuk Google OAuth Multi-Platform

echo "🚀 SmartParking Google OAuth Multi-Platform Setup"
echo "=================================================="
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js not found! Please install Node.js"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm: $NPM_VERSION"
else
    echo "❌ npm not found!"
    exit 1
fi

# Check Python
if command_exists python; then
    PYTHON_VERSION=$(python --version)
    echo "✅ Python: $PYTHON_VERSION"
elif command_exists python3; then
    PYTHON_VERSION=$(python3 --version)
    echo "✅ Python: $PYTHON_VERSION"
else
    echo "❌ Python not found! Please install Python"
    exit 1
fi

# Check Expo CLI
if command_exists expo; then
    EXPO_VERSION=$(expo --version)
    echo "✅ Expo CLI: $EXPO_VERSION"
else
    echo "⚠️  Expo CLI not found. Installing..."
    npm install -g @expo/cli
fi

echo ""
echo "🔧 Setting up project..."

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pip install -r requirements.txt
cd ..

echo ""
echo "📱 Generating Android SHA-1..."
./generate_sha1.sh

echo ""
echo "✅ Setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Follow GOOGLE_MULTIPLATFORM_SETUP.md to configure Google Cloud Console"
echo "2. Update app.json dengan your Google Client IDs"
echo "3. Update backend/.env dengan your Google Client IDs"
echo "4. Test dengan MULTIPLATFORM_TESTING_GUIDE.md"
echo ""
echo "🌐 Quick start commands:"
echo ""
echo "# Start backend:"
echo "cd backend && python app.py"
echo ""
echo "# Start frontend (new terminal):"
echo "npm start"
echo ""
echo "Happy coding! 🎉"
