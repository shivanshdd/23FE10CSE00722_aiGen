import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [query, setQuery] = useState("AI");
  const [articles, setArticles] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);

  const [selectedNews, setSelectedNews] = useState([]);
  const [savedNews, setSavedNews] = useState([]);

  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");

  const [sortType, setSortType] = useState("latest");

  const API_KEY = "e2070eaa09a90187ab522d5b2546c963";

  // LOAD
  useEffect(() => {
    const saved = localStorage.getItem("savedNews");
    const chat = localStorage.getItem("chatHistory");
    const selected = localStorage.getItem("selectedNews");

    if (saved) setSavedNews(JSON.parse(saved));
    if (chat) setChatHistory(JSON.parse(chat));
    if (selected) setSelectedNews(JSON.parse(selected));
  }, []);

  // SAVE
  useEffect(() => {
    localStorage.setItem("savedNews", JSON.stringify(savedNews));
  }, [savedNews]);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem("selectedNews", JSON.stringify(selectedNews));
  }, [selectedNews]);

  // 🕒 TIME FORMAT
  const timeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMin = Math.floor((now - past) / (1000 * 60));

    if (diffMin < 60) return `${diffMin} min ago`;

    const hours = Math.floor(diffMin / 60);
    if (hours < 24) return `${hours} hr ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} d ago`;

    const weeks = Math.floor(days / 7);
    return `${weeks} wk ago`;
  };

  // 🔥 FETCH NEWS
  const fetchNews = async () => {
    const [enRes, hiRes] = await Promise.all([
      fetch(`https://gnews.io/api/v4/search?q=${query}&lang=en&max=10&token=${API_KEY}`),
      fetch(`https://gnews.io/api/v4/search?q=${query}&lang=hi&max=10&token=${API_KEY}`)
    ]);

    const enData = await enRes.json();
    const hiData = await hiRes.json();

    const combined = [...(enData.articles || []), ...(hiData.articles || [])];

    const unique = combined.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.title === item.title)
    );

    setArticles(unique);
    setVisibleCount(10); // reset
  };

  // 🔥 LOAD MORE (UNLIMITED UNTIL END)
  const loadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  // SORT
  const sortedArticles = [...articles].sort((a, b) => {
    if (sortType === "latest") {
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    } else {
      return new Date(a.publishedAt) - new Date(b.publishedAt);
    }
  });

  // BOOKMARK
  const toggleBookmark = (article) => {
    const exists = savedNews.find((a) => a.title === article.title);
    if (exists) {
      setSavedNews(savedNews.filter((a) => a.title !== article.title));
    } else {
      setSavedNews([...savedNews, article]);
    }
  };

  // REMOVE SAVED
  const removeSaved = (title) => {
    setSavedNews(savedNews.filter((a) => a.title !== title));
  };

  // SELECT
  const toggleSelect = (article) => {
    const exists = selectedNews.find((a) => a.title === article.title);
    if (exists) {
      setSelectedNews(selectedNews.filter((a) => a.title !== article.title));
    } else {
      setSelectedNews([...selectedNews, article]);
    }
  };

  // AI CHAT
  const askAI = async () => {
    if (!question) return;

    const combined = selectedNews
      .map((n) => `${n.title}\n${n.description}`)
      .join("\n\n");

    const userMsg = { role: "user", content: question };
    const aiMsg = { role: "assistant", content: "" };

    setChatHistory((prev) => [...prev, userMsg, aiMsg]);
    setQuestion("");

    const res = await fetch("/ollama/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: `Answer based on news:\n\n${combined}\n\nQuestion: ${question}`,
        stream: true,
      }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (let line of lines) {
        if (!line.trim()) continue;

        try {
          const json = JSON.parse(line);
          if (json.response) {
            fullText += json.response;

            setChatHistory((prev) => {
              const updated = [...prev];
              updated[updated.length - 1].content = fullText;
              return updated;
            });
          }
        } catch {}
      }
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* LEFT */}
      <div style={{ width: "60%", padding: "20px", overflowY: "auto" }}>
        <h1>📰 News Research AI</h1>

        <input 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && fetchNews()}
        />
        <button onClick={fetchNews}>⚡ Fetch News</button>

        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>

        {sortedArticles.slice(0, visibleCount).map((a, i) => {
          const isSelected = selectedNews.find(n => n.title === a.title);
          const isSaved = savedNews.find(n => n.title === a.title);

          return (
            <motion.div key={i} className="card">
              <h3>{a.title}</h3>
              <p>{a.description}</p>
              <small>
                📍 {a.source.name} • 🕒 {timeAgo(a.publishedAt)}
              </small>

              <div style={{ marginTop: "10px" }}>
                <button className="select" onClick={() => toggleSelect(a)}>
                  {isSelected ? "✔ Selected" : "+ Select"}
                </button>

                <button className="bookmark" onClick={() => toggleBookmark(a)}>
                  {isSaved ? "📌 Saved" : "📌 Bookmark"}
                </button>

                {/* 🔗 VISIT */}
                <a href={a.url} target="_blank" rel="noopener noreferrer">
                  <button style={{ marginLeft: "8px" }}>🌐</button>
                </a>
              </div>
            </motion.div>
          );
        })}

        {/* 🔥 LOAD MORE MULTIPLE TIMES */}
        {visibleCount < sortedArticles.length && (
          <div style={{ textAlign: "center", margin: "30px 0" }}>
            <button className="floating-load" onClick={loadMore}>⬇️</button>
          </div>
        )}

        <h2>📌 Saved News</h2>

        {savedNews.map((a, i) => (
          <div key={i} className="card" style={{ position: "relative" }}>
            <button
              onClick={() => removeSaved(a.title)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "#ef4444",
                borderRadius: "50%",
                width: "25px",
                height: "25px",
                padding: "0"
              }}
            >
              ✖
            </button>

            <h4>{a.title}</h4>
            <small>🕒 {timeAgo(a.publishedAt)}</small>

            {/* 🔗 VISIT IN SAVED */}
            <a href={a.url} target="_blank" rel="noopener noreferrer">
              <button style={{ marginTop: "8px" }}>🌐 Visit</button>
            </a>
          </div>
        ))}
      </div>

      {/* RIGHT CHAT */}
      <div className="chat-panel" style={{ width: "40%", display: "flex", flexDirection: "column" }}>
        <h2 style={{ padding: "10px" }}>🧠 AI Research Chat</h2>

        <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
          {chatHistory.map((msg, i) => (
            <div key={i} style={{
              textAlign: msg.role === "user" ? "right" : "left",
              marginBottom: "10px"
            }}>
              <div className={msg.role === "user" ? "user-msg" : "ai-msg"}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "10px" }}>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && askAI()}
            style={{ width: "75%" }}
          />
          <button onClick={askAI}>Send</button>
        </div>
      </div>
    </div>
  );
}