import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import Sidebar from './components/Sidebar.jsx'
import ChatCanvas from './components/ChatCanvas.jsx'
const API = 'http://localhost:8000'
const FALLBACK_MODULES = [
  { id: 'dsp', code: 'COU 07506', title: 'Digital Signal Processing' },
  { id: 'electromagnetics', code: 'ETU 07522', title: 'Engineering Electromagnetics' },
  { id: 'electronic_design', code: 'ETU 07521', title: 'Electronic Design and Fabrication' },
  { id: 'industrial_training', code: 'ETU 07523', title: 'Industrial Practical Training' },
  { id: 'business_management', code: 'GSU 07512', title: 'Business Management in ICT' },
  { id: 'probability_statistics', code: 'GSU 07504', title: 'Probability and Statistics' },
  { id: 'cybersecurity_web', code: 'COU 07503 / COU 07501', title: 'Web App Dev / Cybersecurity' }
]
export default function App() {
  const [modules, setModules] = useState(FALLBACK_MODULES)
  const [active, setActive] = useState('all')
  const [history, setHistory] = useState([])
  const [chatKey, setChatKey] = useState(0)
  useEffect(() => {
    fetch(`${API}/api/modules`).then((r) => r.json()).then((d) => { if (Array.isArray(d) && d.length) setModules(d) }).catch(() => {})
  }, [])
  const activeLabel = active === 'all' ? 'All Modules' : (modules.find((m) => m.id === active)?.code ?? active)
  return (
    <div className="flex h-screen overflow-hidden bg-gemini-bg text-gray-100">
      <Sidebar modules={modules} active={active} onSelect={setActive} onNew={() => setChatKey((k) => k + 1)} history={history} />
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-gemini-border px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles size={16} className="text-gemini-accent" />
            <span className="font-medium">Semester V</span>
            <span className="rounded-full bg-gemini-bubble px-2.5 py-0.5 text-xs text-gemini-muted">{activeLabel}</span>
          </div>
          <select value={active} onChange={(e) => setActive(e.target.value)} className="rounded-full border border-gemini-border bg-gemini-panel px-3 py-1.5 text-xs md:hidden">
            <option value="all">All Modules</option>
            {modules.map((m) => (<option key={m.id} value={m.id}>{m.code}</option>))}
          </select>
        </header>
        <ChatCanvas key={chatKey} module={active} pushHistory={(t) => setHistory((h) => [t, ...h].slice(0, 20))} />
      </main>
    </div>
  )
}
