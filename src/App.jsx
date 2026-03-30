import { useState } from "react";

export default function App() {
  const [topic, setTopic] = useState("AI");
  const [news, setNews] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    setNews("");

    try {
      const res = await fetch("/ollama/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.2",
          messages: [
            {
              role: "user",
              content: `Give me 5 latest news about ${topic}`,
            },
          ],
        }),
      });

      const data = await res.json();
      setNews(data.message.content);
    } catch (err) {
      setNews("Error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>📰 NewsRAG (Ollama)</h1>

      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={{ padding: 10, width: 300 }}
      />

      <button
        onClick={fetchNews}
        style={{ marginLeft: 10, padding: 10 }}
      >
        ⚡ Fetch News
      </button>

      {loading && <p>Loading...</p>}

      <pre style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
        {news}
      </pre>
    </div>
  );
}