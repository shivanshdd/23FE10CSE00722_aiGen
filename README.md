# 📰 News RAG Recommendation System

A modern **AI-powered News Recommendation Web App** that fetches live news and provides intelligent recommendations using **RAG (Retrieval-Augmented Generation)** with a local LLM via Ollama.

---

## 🚀 Features

* 🔴 **Live News Fetching** from internet (RSS / APIs)
* 🧠 **AI-Powered Recommendations** using semantic understanding
* ⚡ **Fast Local LLM (Ollama)** — no API key required
* 📊 **Similarity-based + AI hybrid recommendations**
* 🌐 **Modern React Frontend**
* 🔗 Clickable article links
* 📈 Load more functionality

---

## 🧠 How It Works (RAG Pipeline)

```
User selects news
        ↓
Relevant articles retrieved (TF-IDF / similarity)
        ↓
Context passed to LLM (Ollama)
        ↓
LLM generates intelligent recommendations
```

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* JavaScript
* CSS

### Backend / AI

* Ollama (Local LLM)
* Model: llama3.2 (can be changed)

### Data Source

* RSS Feeds / News APIs

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/news-rag.git
cd news-rag
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Install Ollama

Download and install:

👉 https://ollama.com

Run:

```bash
ollama serve
```

---

### 4️⃣ Pull LLM Model

```bash
ollama pull llama3.2
```

You can also use:

* mistral
* phi3
* gemma2

---

### 5️⃣ Run the Project

```bash
npm run dev
```

App runs at:

```
http://localhost:5173
```

---

## 🔌 Ollama Integration

The app connects to Ollama locally via:

```
http://localhost:11434
```

Proxy setup in Vite allows:

```
/ollama → http://localhost:11434
```

### Example API Call

Implemented in:


* Uses `/api/chat`
* Supports streaming & non-streaming responses
* No API key required

---

## 🧪 Core Functionality

### 🔹 News Fetching

* Fetches real-time articles from RSS feeds

### 🔹 Recommendation Logic

* Basic similarity (title/content matching)
* AI enhancement using LLM

### 🔹 RAG (Retrieval-Augmented Generation)

* Retrieves relevant articles
* Passes them as context to LLM
* Generates smarter recommendations

---

## 📁 Project Structure

```
news-rag/
│
├── src/
│   ├── App.jsx
│   ├── components/
│   ├── utils/
│   │   └── ollama.js
│
├── public/
├── package.json
└── README.md
```

---

## ⚡ Future Improvements

* 🔍 Personalized recommendations (user history)
* 🧠 Vector database (FAISS / Pinecone)
* 📱 Mobile responsive UI
* 🌍 Multi-language news support
* 📰 Category filtering (sports, tech, politics)

---

## 🎯 Use Cases

* News aggregation platforms
* AI-based content recommendation systems
* College ML / AI projects
* Portfolio projects

---

## 👨‍💻 Author

Shivansh Dhyani

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and share!

---
