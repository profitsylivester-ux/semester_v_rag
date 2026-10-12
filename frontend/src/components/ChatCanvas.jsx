import { useEffect, useRef, useState } from 'react'
import { ArrowUp, Loader2 } from 'lucide-react'
import MessageItem from './MessageItem.jsx'
import QuickCards from './QuickCards.jsx'
const API = 'http://localhost:8000'
export default function ChatCanvas({ module, pushHistory }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const bottomRef = useRef(null)
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  const send = async (text) => {
    const prompt = (text ?? input).trim()
    if (!prompt || busy) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: prompt }, { role: 'assistant', text: '' }])
    pushHistory(prompt)
    setBusy(true)
    try {
      const res = await fetch(`${API}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, module }) })
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)
      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let buf = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        const parts = buf.split('\n\n')
        buf = parts.pop() || ''
        for (const p of parts) {
          const line = p.trim()
          if (!line.startsWith('data:')) continue
          const payload = line.slice(5).trim()
          if (payload === '[DONE]') continue
          try {
            const { token } = JSON.parse(payload)
            setMessages((m) => { const c = [...m]; c[c.length - 1] = { role: 'assistant', text: c[c.length - 1].text + token }; return c })
          } catch { /* keep-alive */ }
        }
      }
    } catch (e) {
      try {
        const res = await fetch(`${API}/api/chat-sync`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, module }) })
        const data = await res.json()
        setMessages((m) => { const c = [...m]; c[c.length - 1] = { role: 'assistant', text: data.answer || `Error: ${e.message}` }; return c })
      } catch (e2) {
        setMessages((m) => { const c = [...m]; c[c.length - 1] = { role: 'assistant', text: `Backend unreachable. Start it with \`uvicorn app.main:app --reload --port 8000\` from \`semester_v_rag/backend\`. (${e2.message})` }; return c })
      }
    } finally { setBusy(false) }
  }
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-3xl min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pb-40 pt-6">
        {messages.length === 0 && (
          <div className="mt-10 flex flex-col gap-6">
            <div>
              <h1 className="bg-gradient-to-r from-blue-400 via-purple-300 to-pink-300 bg-clip-text text-4xl font-semibold text-transparent">Hello, Semester V</h1>
              <p className="mt-2 text-sm text-gemini-muted">Ask across all 7 modules — answers render tables, LaTeX math, code and Mermaid diagrams.</p>
            </div>
            <QuickCards onPick={send} />
          </div>
        )}
        {messages.map((m, i) => (<MessageItem key={i} role={m.role} text={m.text} />))}
        <div ref={bottomRef} />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-gemini-bg via-gemini-bg/95 to-transparent pb-6 pt-10">
        <div className="pointer-events-auto w-full max-w-3xl px-4">
          <div className="flex items-end gap-2 rounded-3xl border border-gemini-border bg-gemini-bubble p-2 pl-5 shadow-2xl">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={1}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Ask about DSP, electromagnetics, probability…" className="max-h-40 flex-1 resize-none bg-transparent text-[15px] outline-none placeholder:text-gemini-muted" />
            <button onClick={() => send()} disabled={busy || !input.trim()} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black disabled:opacity-40">
              {busy ? <Loader2 size={18} className="animate-spin" /> : <ArrowUp size={18} />}
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-gemini-muted">Streaming from FastAPI + ChromaDB • select a module in the sidebar to filter retrieval</p>
        </div>
      </div>
    </div>
  )
}
