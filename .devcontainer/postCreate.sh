#!/bin/bash
set -e

echo "🔄 Installing Ollama..."
curl -fsSL https://ollama.com/install.sh | sh

echo "🔄 Starting Ollama server in background..."
ollama serve &
sleep 5

echo "🔄 Pulling DeepSeek-Coder 6.7B model (this may take a few minutes)..."
ollama pull deepseek-coder:6.7b

echo "✅ Setup complete! Your API is ready."
echo "👉 Run 'npm install && npm start' to launch the API server."
