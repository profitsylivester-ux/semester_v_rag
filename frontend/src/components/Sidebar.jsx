import { BookOpen, Layers, Plus } from 'lucide-react'
export default function Sidebar({ modules, active, onSelect, onNew, history }) {
  return (
    <aside className="hidden w-72 shrink-0 flex-col gap-4 border-r border-gemini-border bg-gemini-panel p-4 md:flex">
      <button onClick={onNew} className="flex items-center gap-2 rounded-full bg-gemini-bubble px-4 py-2.5 text-sm hover:bg-[#3c4043]">
        <Plus size={16} /> New chat
      </button>
      <div>
        <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-gemini-muted"><Layers size={14} /> Modules</p>
        <div className="flex flex-col gap-1">
          <button onClick={() => onSelect('all')} className={`rounded-xl px-3 py-2 text-left text-sm ${active === 'all' ? 'bg-gemini-bubble' : 'hover:bg-gemini-bubble/60'}`}>
            <span className="font-medium">All Modules</span>
          </button>
          {modules.map((m) => (
            <button key={m.id} onClick={() => onSelect(m.id)} className={`rounded-xl px-3 py-2 text-left text-sm ${active === m.id ? 'bg-gemini-bubble' : 'hover:bg-gemini-bubble/60'}`}>
              <span className="block font-medium">{m.code}</span>
              <span className="block truncate text-xs text-gemini-muted">{m.title}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-gemini-muted"><BookOpen size={14} /> Recent</p>
        <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
          {history.length === 0 && <p className="text-xs text-gemini-muted">No chats yet — ask something below.</p>}
          {history.map((h, i) => (<div key={i} className="truncate rounded-lg px-3 py-1.5 text-xs text-gemini-muted hover:bg-gemini-bubble">{h}</div>))}
        </div>
      </div>
      <p className="text-[11px] text-gemini-muted">Semester V RAG • Markdown + LaTeX + Mermaid</p>
    </aside>
  )
}
