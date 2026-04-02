import express from 'express';
import cors from 'cors';
import axios from 'axios';
import 'dotenv/config';

const app = express();
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

// Secure CORS – allow only specified origins
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173,https://yourdomain.com').split(',');

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Helper to call Ollama
async function callOllama(prompt, model, maxTokens = 512, temperature = 0.7) {
  const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
    model,
    prompt,
    stream: false,
    options: {
      num_predict: maxTokens,
      temperature
    }
  });
  return response.data.response;
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'online', ollama: OLLAMA_URL });
});

// List models
app.get('/models', async (req, res) => {
  try {
    const response = await axios.get(`${OLLAMA_URL}/api/tags`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate code (simple endpoint)
app.post('/generate', async (req, res) => {
  const { prompt, model = 'deepseek-coder:6.7b', max_tokens = 512, temperature = 0.7 } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  try {
    const output = await callOllama(prompt, model, max_tokens, temperature);
    res.json({ success: true, output, model });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// OpenAI‑compatible chat completions
app.post('/v1/chat/completions', async (req, res) => {
  const { messages, model = 'deepseek-coder:6.7b', max_tokens = 512, temperature = 0.7 } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }
  const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
  try {
    const output = await callOllama(prompt, model, max_tokens, temperature);
    res.json({
      choices: [{
        message: { role: 'assistant', content: output },
        index: 0
      }]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Static frontend
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
  console.log(`📡 Ollama endpoint: ${OLLAMA_URL}`);
  console.log(`🔗 CORS allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
});
