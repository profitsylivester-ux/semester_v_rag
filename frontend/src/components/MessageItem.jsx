import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Bot, User } from 'lucide-react'
import MermaidRenderer from './MermaidRenderer.jsx'
export default function MessageItem({ role, text }) {
  const isUser = role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (<div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500"><Bot size={18} /></div>)}
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${isUser ? 'bg-[#303134] text-white' : 'bg-gemini-panel text-gray-100'}`}>
        {isUser ? (<p className="whitespace-pre-wrap text-[15px]">{text}</p>) : (
          <div className="md text-[15px] leading-7">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}
              components={{ code({ className, children, ...props }) {
                const lang = /language-(\w+)/.exec(className || '')?.[1]
                const raw = String(children ?? '').replace(/\n$/, '')
                if (lang === 'mermaid') return <MermaidRenderer code={raw} />
                return <code className={className} {...props}>{children}</code>
              } }}>{text || '…'}</ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && (<div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gemini-bubble"><User size={18} /></div>)}
    </div>
  )
}
