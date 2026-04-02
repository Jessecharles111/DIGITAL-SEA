#!/bin/bash
set -e

# Start Ollama if not already running
if ! pgrep -x "ollama" > /dev/null; then
    echo "Starting Ollama..."
    ollama serve &
    sleep 3
fi

# Install dependencies if node_modules missing
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start API server
echo "Starting API server..."
npm start
