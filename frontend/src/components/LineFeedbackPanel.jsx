import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiAlertTriangle, FiAlertCircle, FiInfo, FiChevronRight, FiFilter } from 'react-icons/fi'

const severityConfig = {
  critical: {
    icon: FiAlertTriangle,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    dot: 'bg-red-400',
    label: 'Critical',
  },
  warning: {
    icon: FiAlertCircle,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    dot: 'bg-yellow-400',
    label: 'Warning',
  },
  suggestion: {
    icon: FiInfo,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    dot: 'bg-blue-400',
    label: 'Suggestion',
  },
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'critical', label: 'Critical' },
  { key: 'warning', label: 'Warnings' },
  { key: 'suggestion', label: 'Suggestions' },
]

export default function LineFeedbackPanel({ lineFeedback = [], onLineClick }) {
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return lineFeedback
    return lineFeedback.filter((fb) => fb.severity === activeFilter)
  }, [lineFeedback, activeFilter])

  const counts = useMemo(() => {
    const c = { all: lineFeedback.length, critical: 0, warning: 0, suggestion: 0 }
    lineFeedback.forEach((fb) => {
      if (c[fb.severity] !== undefined) c[fb.severity]++
    })
    return c
  }, [lineFeedback])

  if (!lineFeedback || lineFeedback.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <FiFilter className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Line Feedback</h3>
              <p className="text-xs text-gray-500">Issues detected per line</p>
            </div>
          </div>
          <span className="text-xs font-medium text-gray-400 bg-surface-lighter px-2.5 py-1 rounded-lg">
            {lineFeedback.length}
          </span>
        </div>
        <div className="flex space-x-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === f.key
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-gray-400 hover:text-white hover:bg-surface-lighter'
              }`}
            >
              {f.label}
              <span className="ml-1.5 opacity-60">({counts[f.key]})</span>
            </button>
          ))}
        </div>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {filtered.map((fb, i) => {
          const sev = severityConfig[fb.severity] || severityConfig.suggestion
          const Icon = sev.icon
          return (
            <motion.button
              key={`${fb.lineNumber}-${i}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => onLineClick?.(fb.lineNumber)}
              className={`w-full flex items-start space-x-3 p-4 text-left border-b border-gray-800/50 hover:bg-surface-light transition-all group cursor-pointer`}
            >
              <div className="flex-shrink-0 flex flex-col items-center">
                <span className={`w-2 h-2 rounded-full ${sev.dot}`} />
                <span className="text-[10px] font-mono text-gray-500 mt-1 w-6 text-center">
                  {fb.lineNumber}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-0.5">
                  <Icon className={`w-3.5 h-3.5 ${sev.color} flex-shrink-0`} />
                  <span className={`text-[11px] font-semibold uppercase tracking-wider ${sev.color}`}>
                    {sev.label}
                  </span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{fb.issue}</p>
                {fb.suggestion && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 group-hover:text-gray-400 transition-colors">
                    {fb.suggestion}
                  </p>
                )}
              </div>
              <FiChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
