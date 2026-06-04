import { motion } from 'framer-motion'
import { FiCode } from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-5 px-6 bg-surface-light">
      <div className="w-14 h-14 border border-lime-400/20 rounded-lg flex items-center justify-center">
        <FiCode className="w-7 h-7 text-zinc-600" />
      </div>
      <div className="text-center max-w-xs">
        <h3 className="text-sm font-mono font-semibold text-zinc-400 mb-1">// ready</h3>
        <p className="text-xs text-zinc-600 font-mono leading-relaxed">
          Paste code and click <span className="text-lime-400">Review Code</span> to get AI analysis.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
        {['Bug Detection', 'Optimization', 'Complexity', 'Best Practices'].map((label) => (
          <div key={label} className="flex items-center space-x-1.5 px-2.5 py-2 border border-border rounded bg-black/30">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400/50" />
            <span className="text-[10px] text-zinc-600 font-mono">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ErrorState({ error }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-surface-light">
      <div className="w-12 h-12 border border-red-500/30 rounded-lg flex items-center justify-center mb-3">
        <FiCode className="w-6 h-6 text-red-400" />
      </div>
      <p className="text-xs text-zinc-400 font-mono text-center max-w-sm">{error}</p>
    </div>
  )
}

export default function ReviewPanel({ review, loading, error, language = 'javascript', onLineClick }) {
  if (loading) return null
  if (error) return <ErrorState error={error} />
  if (!review) return <EmptyState />

  const markdown = review.markdown || ''

  return (
    <div className="h-full overflow-y-auto bg-surface-light">
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="prose prose-invert prose-xs max-w-none"
        >
          <div className="review-markdown">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-lg font-bold text-lime-400 font-mono mb-3 mt-4 first:mt-0 border-b border-border pb-2">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base font-bold text-lime-400 font-mono mb-2 mt-5">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-bold text-zinc-300 font-mono mb-2 mt-4">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-xs text-zinc-400 font-mono leading-relaxed mb-3">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-1.5 mb-3 ml-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="space-y-1.5 mb-3 ml-2">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-xs text-zinc-400 font-mono leading-relaxed list-disc list-inside">{children}</li>
                ),
                code: ({ inline, children }) => {
                  if (inline) {
                    return (
                      <code className="px-1.5 py-0.5 bg-black/50 border border-border rounded text-[11px] text-lime-300 font-mono">
                        {children}
                      </code>
                    )
                  }
                  return (
                    <div className="my-3 bg-black/60 border border-border rounded-lg overflow-x-auto">
                      <pre className="p-3">
                        <code className="text-xs text-zinc-300 font-mono leading-relaxed">{children}</code>
                      </pre>
                    </div>
                  )
                },
                pre: ({ children }) => <>{children}</>,
                strong: ({ children }) => (
                  <strong className="font-semibold text-zinc-200">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="text-zinc-300 italic">{children}</em>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-lime-400/30 pl-3 py-1 my-3 text-xs text-zinc-500 font-mono italic">
                    {children}
                  </blockquote>
                ),
                hr: () => <hr className="border-border my-4" />,
              }}
            >
              {markdown || '*No review content available.*'}
            </ReactMarkdown>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
