# 🧠 Local LLM API – GitHub Codespace Ready

Run a powerful code generation API **inside your GitHub Codespace** using Ollama + DeepSeek-Coder 6.7B.  
Zero cost, fully local, CORS‑secure, and accessible from anywhere via port forwarding.

## 🚀 Quick Start (One‑click)

1. **Open this repository in a Codespace** (GitHub web → Code → Codespaces → Create codespace on main).
2. Wait for the automatic setup (installs Ollama, pulls the model – about 2‑3 minutes).
3. In the terminal, run:
   ```bash
   npm install
   npm start
Open the Ports tab (next to terminal), find port 3000, and make it public.

Click the forwarded address – you'll see the web UI. Or use the API directly.

📡 API Endpoints
Method	Endpoint	Description
GET	/health	Health check
GET	/models	List available models
POST	/generate	Generate code from a prompt
POST	/v1/chat/completions	OpenAI‑compatible chat
Example /generate request
bash
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Write a Python function that returns fibonacci numbers","max_tokens":200}'
🔐 Security & CORS
Only origins listed in ALLOWED_ORIGINS can call the API.

Credentials are not allowed with wildcard origins.

Modify .env to add your frontend domain.

🧠 Changing the Model
To use a different model (e.g., Qwen2.5‑Coder, CodeLlama):

bash
ollama pull qwen2.5-coder:7b
Then in your request, set "model": "qwen2.5-coder:7b".

🌍 Making Your API Public
In the Codespace Ports tab, right‑click port 3000 → "Port Visibility" → "Public".

Copy the generated URL (e.g., https://your-codespace-3000.preview.app.github.dev).

Use that URL as your API endpoint from any external app.

📦 Repository Structure
server.js – Express API with Ollama integration

public/index.html – Simple frontend test page

.devcontainer/ – Codespace configuration & auto‑setup

start.sh – One‑command startup
