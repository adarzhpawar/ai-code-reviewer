import { motion } from 'framer-motion'
import { FiAlertTriangle, FiCode, FiZap, FiShield, FiBarChart2 } from 'react-icons/fi'

const severityStyle = {
  high: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', badge: 'bg-red-500/20' },
  medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', badge: 'bg-yellow-500/20' },
  low: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', badge: 'bg-blue-500/20' },
}

const typeConfig = {
  bug: { icon: FiAlertTriangle, label: 'Bug', color: 'text-red-400' },
  readability: { icon: FiCode, label: 'Readability', color: 'text-indigo-400' },
  best_practice: { icon: FiShield, label: 'Best Practice', color: 'text-green-400' },
  efficiency: { icon: FiZap, label: 'Efficiency', color: 'text-yellow-400' },
  edge_case: { icon: FiBarChart2, label: 'Edge Case', color: 'text-purple-400' },
}

export default function IssueCard({ issues, delay = 0 }) {
  if (!issues || issues.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-2xl p-5 border-l-2 border-red-500/50"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center">
            <FiAlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Issues Found</h3>
            <p className="text-xs text-gray-500">Problems detected in your code</p>
          </div>
        </div>
        <span className="text-xs font-medium text-gray-400 bg-surface-lighter px-2.5 py-1 rounded-lg">
          {issues.length} {issues.length === 1 ? 'issue' : 'issues'}
        </span>
      </div>
      <div className="space-y-3">
        {issues.map((issue, i) => {
          const sev = severityStyle[issue.severity] || severityStyle.medium
          const type = typeConfig[issue.type] || { icon: FiAlertTriangle, label: issue.type, color: 'text-gray-400' }
          const Icon = type.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.06 * i }}
              className={`p-4 rounded-xl ${sev.bg} border ${sev.border}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className={`flex items-center space-x-1 text-xs font-semibold ${type.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{type.label}</span>
                  </span>
                  {issue.line && (
                    <span className="text-xs font-mono text-gray-400 bg-surface-lighter px-1.5 py-0.5 rounded border border-gray-700/50">
                      Line {issue.line}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${sev.badge} ${sev.text}`}>
                  {issue.severity}
                </span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{issue.description}</p>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
