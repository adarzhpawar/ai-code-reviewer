import { useState } from 'react'
import { motion } from 'framer-motion'
import { DiffEditor } from '@monaco-editor/react'
import { FiCopy, FiDownload, FiX, FiCheck, FiCode } from 'react-icons/fi'

const monacoLanguageMap = {
  javascript: 'javascript', python: 'python', java: 'java',
  'c++': 'cpp', c: 'c', typescript: 'typescript',
}

export default function CodeComparisonView({ original, improved, language, changes, summary, onClose }) {
  const [copied, setCopied] = useState(false)
  const [showOriginal, setShowOriginal] = useState(false)

  const handleCopy = async () => {
    const text = showOriginal ? original : improved
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    const exts = { javascript: 'js', python: 'py', java: 'java', 'c++': 'cpp', c: 'c', typescript: 'ts' }
    const ext = exts[language] || 'txt'
    const text = showOriginal ? original : improved
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = showOriginal ? `original.${ext}` : `improved.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <motion.div initial={{ scale: 0.97, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: 10 }}
        className="relative w-full max-w-6xl h-[85vh] border border-border rounded-xl overflow-hidden flex flex-col bg-surface-light"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-black/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 border border-lime-400/30 rounded flex items-center justify-center">
              <FiCode className="w-4 h-4 text-lime-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white font-mono">&gt; diff --compare</h2>
              <p className="text-[10px] text-zinc-500 font-mono">Original vs Improved</p>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            <button onClick={() => setShowOriginal(!showOriginal)}
              className={`px-2.5 py-1.5 rounded text-[10px] font-mono transition-all ${
                showOriginal ? 'terminal-btn' : 'text-zinc-500 hover:text-zinc-300'
              }`}>
              <span>{showOriginal ? 'Diff View' : 'Original'}</span>
            </button>
            <button onClick={handleCopy}
              className="px-2.5 py-1.5 rounded text-[10px] font-mono text-zinc-500 hover:text-lime-400 transition-all">
              {copied ? <FiCheck className="w-3 h-3" /> : <FiCopy className="w-3 h-3" />}
              <span className="ml-1">{copied ? 'Done' : 'Copy'}</span>
            </button>
            <button onClick={handleDownload}
              className="px-2.5 py-1.5 rounded text-[10px] font-mono text-zinc-500 hover:text-lime-400 transition-all">
              <FiDownload className="w-3 h-3" />
            </button>
            <button onClick={onClose}
              className="p-1.5 rounded text-zinc-500 hover:text-white hover:bg-black/50 transition-all">
              <FiX className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Diff Editor */}
        <div className="flex-1">
          <DiffEditor
            height="100%"
            language={monacoLanguageMap[language] || 'javascript'}
            theme="vs-dark"
            original={original}
            modified={showOriginal ? original : improved}
            options={{
              enableSplitViewResizing: false,
              renderSideBySide: !showOriginal,
              minimap: { enabled: false },
              fontSize: 12,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              renderOverviewRuler: true,
              overviewRulerLanes: 2,
              diffCodeLens: false,
              originalEditable: false,
              readOnly: true,
              padding: { top: 12 },
              renderIndicators: true,
              renderMarginRevertIcon: false,
              renderGutterMenu: false,
            }}
          />
        </div>

        {/* Changes */}
        {changes && changes.length > 0 && (
          <div className="border-t border-border bg-black/50">
            <div className="px-5 py-2.5 border-b border-border">
              <div className="flex items-center space-x-1.5">
                <FiCode className="w-3.5 h-3.5 text-lime-400" />
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Changes</span>
              </div>
              {summary && <p className="text-[10px] text-zinc-600 font-mono mt-0.5">{summary}</p>}
            </div>
            <div className="max-h-36 overflow-y-auto">
              {changes.map((change, i) => (
                <div key={i} className="px-5 py-2 flex items-start space-x-2.5 hover:bg-black/30 transition-colors">
                  <span className="flex-shrink-0 w-5 h-5 border border-lime-400/30 rounded flex items-center justify-center text-[9px] font-bold text-lime-400 font-mono mt-px">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-300 font-mono">{change.change}</p>
                    <p className="text-[10px] text-zinc-600 font-mono mt-0.5">{change.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
