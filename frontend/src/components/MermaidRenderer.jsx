import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'
mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' })
let counter = 0
export default function MermaidRenderer({ code }) {
  const ref = useRef(null)
  useEffect(() => {
    const render = async () => {
      try {
        const id = `mmd-${Date.now()}-${counter++}`
        const { svg } = await mermaid.render(id, code)
        if (ref.current) ref.current.innerHTML = svg
      } catch (e) {
        if (ref.current) ref.current.innerHTML = `<pre style="color:#f28b82">Mermaid error: ${String(e.message || e)}</pre>`
      }
    }
    render()
  }, [code])
  return <div ref={ref} className="my-3 overflow-x-auto rounded-xl border border-gemini-border bg-gemini-panel p-3" />
}
