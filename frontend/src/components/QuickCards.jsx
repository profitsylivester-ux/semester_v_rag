import { Sigma, CircuitBoard, Radio, ShieldCheck } from 'lucide-react'
const CARDS = [
  { icon: Sigma, title: 'DSP: FIR vs IIR', prompt: 'Compare FIR vs IIR filters with a Markdown table, LaTeX transfer functions, and a Mermaid signal chain.' },
  { icon: Radio, title: 'EM: reflection', prompt: 'A 50-ohm line feeds a 100-ohm load. Compute Gamma and VSWR with LaTeX steps and a table of matched/short/open cases.' },
  { icon: CircuitBoard, title: 'PCB op-amp gain', prompt: 'Design a non-inverting op-amp with gain 11: give resistor values, LaTeX gain formula, and a Mermaid design flow.' },
  { icon: ShieldCheck, title: 'XSS fix', prompt: 'Explain reflected XSS with a code example of the vulnerable and fixed version, plus a Mermaid request flow.' }
]
export default function QuickCards({ onPick }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {CARDS.map((c) => (
        <button key={c.title} onClick={() => onPick(c.prompt)} className="flex flex-col gap-2 rounded-2xl border border-gemini-border bg-gemini-panel p-4 text-left hover:bg-gemini-bubble">
          <c.icon size={20} className="text-gemini-accent" />
          <span className="text-sm font-medium">{c.title}</span>
          <span className="line-clamp-2 text-xs text-gemini-muted">{c.prompt}</span>
        </button>
      ))}
    </div>
  )
}
