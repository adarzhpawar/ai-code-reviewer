import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { FiUser, FiCpu } from 'react-icons/fi'

function TypingDots() {
  return (
    <div className="flex space-x-1 py-1">
      <span className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

export default function ChatMessage({ message, isUser, streaming = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
    >
      <div className={`flex-shrink-0 w-7 h-7 rounded flex items-center justify-center border ${
        isUser ? 'border-lime-400/30 bg-lime-400/10' : 'border-lime-400/30 bg-lime-400/10'
      }`}>
        {isUser ? <FiUser className="w-3.5 h-3.5 text-lime-400" /> : <FiCpu className="w-3.5 h-3.5 text-lime-400" />}
      </div>

      <div className={`max-w-[85%] px-3.5 py-2.5 ${
        isUser
          ? 'border border-lime-400/20 rounded-lg bg-lime-400/5'
          : 'border border-border rounded-lg bg-black/30'
      }`}>
        {isUser ? (
          <p className="text-xs text-zinc-300 font-mono whitespace-pre-wrap">{message}</p>
        ) : streaming && !message ? (
          <TypingDots />
        ) : (
          <div className="prose-terminal">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-sm font-bold text-lime-400 mt-3 mb-1.5 font-mono">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xs font-bold text-lime-400 mt-2 mb-1 font-mono">{children}</h2>,
                p: ({ children }) => <p className="text-xs text-zinc-300 leading-relaxed mb-1.5 last:mb-0 font-mono">{children}</p>,
                code: ({ children, inline }) =>
                  inline ? (
                    <code className="px-1 py-0.5 bg-black rounded text-xs text-lime-400 font-mono border border-border">{children}</code>
                  ) : (
                    <pre className="p-2.5 bg-black rounded border border-border overflow-x-auto my-1.5">
                      <code className="text-xs text-zinc-300 font-mono">{children}</code>
                    </pre>
                  ),
                pre: ({ children }) => <>{children}</>,
                strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                ul: ({ children }) => <div className="space-y-0.5 my-1">{children}</div>,
                li: ({ children }) => (
                  <div className="flex items-start gap-1.5 text-xs text-zinc-300 font-mono">
                    <span className="text-lime-400 flex-shrink-0">&gt;</span>
                    <span>{children}</span>
                  </div>
                ),
              }}
            >
              {message}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  )
}
