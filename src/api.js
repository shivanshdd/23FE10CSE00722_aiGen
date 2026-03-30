// Ollama runs locally on port 11434 — no API key needed
// Vite proxies /ollama → http://localhost:11434

const MODEL = 'llama3.2' // change to any model you have pulled e.g. mistral, phi3, gemma2

export async function callOllama(messages, system) {
  const res = await fetch('/ollama/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      stream: false,
      messages: [
        { role: 'system', content: system },
        ...messages,
      ],
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || 'Ollama error ' + res.status + ' — is Ollama running? Run: ollama serve')
  }

  const data = await res.json()
  return data.message?.content || ''
}

export async function callOllamaStream(messages, system, onToken) {
  const res = await fetch('/ollama/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      stream: true,
      messages: [
        { role: 'system', content: system },
        ...messages,
      ],
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || 'Ollama error ' + res.status + ' — is Ollama running? Run: ollama serve')
  }

  const reader = res.body.getReader()
  const dec = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = dec.decode(value, { stream: true })
    for (const line of chunk.split('\n')) {
      if (!line.trim()) continue
      try {
        const p = JSON.parse(line)
        const tok = p.message?.content
        if (tok) onToken(tok)
        if (p.done) return
      } catch (_) {}
    }
  }
}
