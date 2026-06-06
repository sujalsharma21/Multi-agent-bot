<div align="center">

# 🤖 Make Multi Bot
### A Local AI Chatbot Platform Powered by Ollama

**Build, customize, and chat with multiple AI bots — all running privately on your own machine.**

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Ollama](https://img.shields.io/badge/Ollama-Local_AI-black?style=for-the-badge)](https://ollama.com)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

![Multi-Bot Platform Demo](https://raw.githubusercontent.com/yourusername/make_multi_bot/main/docs/demo.png)

</div>

---

## 🌟 What is Make Multi Bot?

**Make Multi Bot** is a fully local, privacy-first AI chatbot platform that lets you create and manage multiple AI assistants — each with its own name, personality, purpose, and knowledge base. Think of it as your personal ChatGPT, but running entirely on your own hardware with zero data sent to any cloud service.

Built with **FastAPI** on the backend and **React + Vite** on the frontend, it connects to **Ollama** to run open-source large language models like Llama 3.2, Mixtral, and more — all offline, all private.

> 💡 **No subscriptions. No API keys. No data leaving your machine. Just AI.**

---

## ✨ Features

### 🤖 Multi-Bot Management
- Create **unlimited custom AI bots**, each with a unique name, purpose, personality, and system prompt
- Assign **custom avatars** — choose from built-in emojis or upload your own photo
- Select different **Ollama models** per bot (Llama 3.2 13B, Llama 3.2 3B, Mixtral 8x7B, or any custom model)
- **Edit and delete** bots anytime
- Upload **knowledge base files** (PDF, TXT, MD) per bot

### 💬 Smart Chat Interface
- **ChatGPT-style** conversation interface with dark/light theme
- Full **conversation history** — every chat is saved and can be resumed anytime
- **Markdown rendering** with bold, italic, headers, and bullet lists
- **Code blocks** with syntax highlighting and one-click copy button
- **Typing indicator** while the AI is generating a response
- Auto-scroll to latest message
- Send with `Enter`, newline with `Shift+Enter`

### 📊 Dashboard & Analytics
- Profile card with your name, bio, and avatar
- Stats showing total bots and bots with knowledge bases
- Quick-access bot grid to jump straight into any conversation

### 📋 Bots Management Page
- Table view of all bots with creation date, model, and file status
- Inline edit, delete, and chat actions per bot

### 🔐 User Authentication
- **Create Account** with username, password, display name, bio, and profile photo
- **Sign In** with username and password (SHA-256 hashed, stored locally)
- Session management — stay logged in while the browser is open
- Multi-account support on the same machine

### 🎨 UI & UX
- **Dark and Light theme** toggle
- Responsive, modern design inspired by ChatGPT and Claude
- Conversation history sidebar per bot (collapsible)
- Search bots in the sidebar
- One-click `START.bat` to launch everything on Windows

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **AI Engine** | [Ollama](https://ollama.com) — runs LLMs locally |
| **Backend** | [FastAPI](https://fastapi.tiangolo.com) + Python |
| **Database** | SQLite via [SQLAlchemy](https://sqlalchemy.org) |
| **Frontend** | [React 19](https://react.dev) + [Vite 8](https://vitejs.dev) |
| **Styling** | Pure CSS with CSS Variables (no Tailwind) |
| **Auth** | localStorage + SHA-256 password hashing via Web Crypto API |
| **State** | React Context API |

---

## 📁 Project Structure

```
make_multi_bot/
│
├── 🚀 START.bat                    # One-click launcher (Windows)
│
├── backend/
│   ├── main.py                     # FastAPI app entry point
│   ├── database.py                 # SQLAlchemy engine & session
│   ├── models.py                   # Database models (Bot, Chat, Message)
│   ├── schemas.py                  # Pydantic request schemas
│   ├── ollama_service.py           # Ollama API integration
│   ├── migrate.py                  # DB migration helper
│   ├── bots.db                     # SQLite database (auto-created)
│   └── routes/
│       ├── bots.py                 # Bot CRUD endpoints
│       └── chat.py                 # Chat & message endpoints
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx                # React entry point
│       ├── App.jsx                 # Root component
│       ├── AppContext.jsx          # Global state + auth
│       ├── globals.css             # All styles + dark/light themes
│       ├── api.js                  # Backend API calls
│       ├── botUtils.js             # Helper functions
│       ├── Sidebar.jsx             # Left sidebar + navigation
│       ├── BotCard.jsx             # Individual bot card
│       ├── ChatWindow.jsx          # Main chat interface
│       ├── ChatMessage.jsx         # Message bubble + markdown
│       ├── TypingIndicator.jsx     # Animated typing dots
│       ├── DashboardPage.jsx       # Dashboard view
│       ├── BotsPage.jsx            # Bots table view
│       ├── CreateBotModal.jsx      # Create bot form
│       ├── EditBotModal.jsx        # Edit bot form
│       ├── ProfileModal.jsx        # Edit profile form
│       ├── SetupScreen.jsx         # Login / Create account
│       └── WelcomeScreen.jsx       # Empty state screen
│
└── .venv/                          # Python virtual environment
```

---

## ⚙️ Requirements

### System Requirements
- **OS**: Windows 10/11 (macOS and Linux also work with minor path changes)
- **RAM**: Minimum 8GB (16GB recommended for larger models)
- **Storage**: 5GB+ free (for AI models)
- **GPU**: Optional but strongly recommended for faster responses (NVIDIA with CUDA, or Apple Silicon)

### Software Requirements

| Software | Version | Download |
|----------|---------|----------|
| **Python** | 3.10 or higher | [python.org](https://python.org/downloads) |
| **Node.js** | 20 or higher | [nodejs.org](https://nodejs.org) |
| **Ollama** | Latest | [ollama.com/download](https://ollama.com/download) |
| **Git** | Any | [git-scm.com](https://git-scm.com) |

### Python Dependencies
```
fastapi
uvicorn
sqlalchemy
requests
pydantic
```

### Node.js Dependencies
```
react ^19.2.6
react-dom ^19.2.6
@heroicons/react ^2.2.0
vite ^8.0.14
@vitejs/plugin-react ^6.0.1
```

---

## 🚀 Getting Started

### Step 1 — Clone the Repository
```bash
git clone https://github.com/yourusername/make_multi_bot.git
cd make_multi_bot
```

### Step 2 — Install Ollama & Pull a Model
Download Ollama from [ollama.com/download](https://ollama.com/download) and install it.

Then pull your preferred model:
```bash
# Recommended — good balance of speed and quality
ollama pull llama3.2

# Smaller & faster — good for low-RAM machines
ollama pull llama3.2:3b

# Powerful — needs 16GB+ RAM
ollama pull mixtral:8x7b
```

### Step 3 — Set Up Python Backend
```powershell
# Create virtual environment
python -m venv .venv

# Activate it (Windows)
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install fastapi uvicorn sqlalchemy requests pydantic
```

### Step 4 — Set Up React Frontend
```powershell
cd frontend
npm install
cd ..
```

### Step 5 — Launch Everything

**Option A — One double-click (Windows)**
```
Double-click START.bat
```
This starts Ollama, the backend, and the frontend automatically, then opens your browser.

**Option B — Manual (all platforms)**

Open 3 separate terminals:

```bash
# Terminal 1 — Ollama
ollama serve

# Terminal 2 — Backend
cd backend
python -m uvicorn main:app --reload

# Terminal 3 — Frontend
cd frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 📡 API Reference

The backend runs on `http://127.0.0.1:8000`. Full interactive docs available at `http://127.0.0.1:8000/docs`.

### Bot Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/bots` | Get all bots |
| `POST` | `/create-bot` | Create a new bot |
| `PUT` | `/bots/{id}` | Update a bot |
| `DELETE` | `/bots/{id}` | Delete a bot |
| `DELETE` | `/bots` | Delete all bots |

### Chat Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/create-chat` | Start a new conversation |
| `POST` | `/chat` | Send a message and get AI reply |
| `GET` | `/chat/{chat_id}` | Get conversation history |
| `GET` | `/bots/{id}/chats` | Get all chats for a bot |
| `DELETE` | `/bots/{id}/chats` | Delete all chats for a bot |
| `DELETE` | `/chats/{chat_id}` | Delete a single conversation |

---

## 🗺️ Roadmap

Here's what's planned for future development — contributions welcome!

- [ ] **RAG (Retrieval Augmented Generation)** — actually process uploaded PDF/TXT files and inject relevant content into prompts using ChromaDB or FAISS
- [ ] **Streaming responses** — show AI output word by word as it generates instead of waiting for the full response
- [ ] **Multi-turn memory** — pass full conversation history to Ollama so the bot remembers earlier messages in the same chat
- [ ] **Bot templates** — pre-built bot configurations for common use cases (coding assistant, writing coach, study buddy, etc.)
- [ ] **Export conversations** — download chat history as PDF, Markdown, or JSON
- [ ] **Voice input/output** — speak to your bots and hear responses using Web Speech API + TTS
- [ ] **Electron desktop app** — bundle everything into a `.exe` installer that sets up automatically
- [ ] **Bot sharing** — export a bot config as a JSON file and import it on another machine
- [ ] **Model management UI** — pull, delete, and switch Ollama models from inside the app
- [ ] **Prompt history** — navigate through previous messages with up/down arrows like a terminal
- [ ] **Dark/light themes** — additional theme options (Solarized, Nord, Catppuccin)
- [ ] **macOS/Linux** — native launcher scripts for non-Windows platforms

---

## 🐛 Common Issues & Fixes

### "Unable to open database file"
The `data/` folder is missing. Fix it by editing `backend/database.py`:
```python
# Change this:
DATABASE_URL = "sqlite:///./data/bots.db"

# To this (no subfolder needed):
DATABASE_URL = "sqlite:///./bots.db"
```

### "Could not reach backend. Is the server running on port 8000?"
The FastAPI backend isn't running. Start it:
```powershell
cd backend
python -m uvicorn main:app --reload
```

### "Ollama connection refused on port 11434"
Ollama isn't running. Start it in a separate terminal:
```bash
ollama serve
```

### "uvicorn is not recognized"
You're running outside the virtual environment. Activate it first:
```powershell
.\.venv\Scripts\Activate.ps1
```

### Bot was created but chat doesn't work
Make sure all 3 services are running simultaneously — Ollama (port 11434), Backend (port 8000), and Frontend (port 5173).

---

## 🤝 Contributing

Contributions are very welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test that the backend starts cleanly and the frontend builds without errors
5. Commit: `git commit -m "feat: add your feature description"`
6. Push: `git push origin feature/your-feature-name`
7. Open a Pull Request

Please follow the existing code style — Python files use snake_case, React components use PascalCase, and CSS uses kebab-case with CSS variables for theming.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this project for personal or commercial purposes.

---

## 🙏 Acknowledgements

- [Ollama](https://ollama.com) — for making local LLM inference dead simple
- [Meta](https://ai.meta.com) — for the open-source Llama models
- [FastAPI](https://fastapi.tiangolo.com) — for the cleanest Python API framework
- [Vite](https://vitejs.dev) — for the fastest frontend build tool
- Inspired by the UX of [ChatGPT](https://chat.openai.com) and [Claude](https://claude.ai)

---

<div align="center">

**Built with ❤️ for the open-source AI community**

⭐ Star this repo if you found it useful!

</div>
