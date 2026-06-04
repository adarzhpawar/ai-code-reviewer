import { useState } from 'react'
import { motion } from 'framer-motion'
import Editor from '@monaco-editor/react'
import { FiCopy, FiMaximize2, FiMinimize2, FiDownload, FiCode } from 'react-icons/fi'

const monacoLanguageMap = {
  javascript: 'javascript',
  python: 'python',
  java: 'java',
  'c++': 'cpp',
  c: 'c',
  typescript: 'typescript',
}

export default function ImprovedCodeViewer({ code, language, delay = 0 }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!code || code.trim().length === 0) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = code
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    const exts = {
      javascript: 'js', python: 'py', java: 'java',
      'c++': 'cpp', c: 'c', typescript: 'ts'
    }
    const ext = exts[language] || 'txt'
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `improved-code.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`glass rounded-2xl overflow-hidden transition-all duration-300 ${expanded ? 'fixed inset-4 z-50' : ''}`}
    >
      {expanded && (
        <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setExpanded(false)} />
      )}
      <div className={`relative z-50 flex flex-col h-full ${expanded ? '' : ''}`}>
        <div className="px-5 py-3 border-b border-gray-700/50 flex items-center justify-between bg-surface/80 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <FiCode className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Improved Code</h3>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-surface-lighter transition-all"
            >
              <FiCopy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface-lighter transition-all"
              title="Download code"
            >
              <FiDownload className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface-lighter transition-all"
              title={expanded ? 'Minimize' : 'Expand'}
            >
              {expanded ? <FiMinimize2 className="w-3.5 h-3.5" /> : <FiMaximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
        <div className={expanded ? 'flex-1' : 'h-64'}>
          <Editor
            height="100%"
            language={monacoLanguageMap[language] || 'javascript'}
            theme="vs-dark"
            value={code}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontFamily: "'Cascadia Code', 'Fira Code', monospace",
              renderLineHighlight: 'none',
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              overviewRulerBorder: false,
              scrollbar: { vertical: 'hidden', horizontal: 'auto' },
              padding: { top: expanded ? 16 : 12 },
              wordWrap: expanded ? 'on' : 'off',
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}
