import { motion } from 'framer-motion'
import { FiArrowUp, FiChevronRight } from 'react-icons/fi'

const priorityConfig = {
  high: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: '!!' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: '!' },
  low: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '•' },
}

export default function ImprovementCard({ improvements, delay = 0 }) {
  if (!improvements || improvements.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-2xl p-5 border-l-2 border-primary/50"
    >
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <FiArrowUp className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Improvements</h3>
          <p className="text-xs text-gray-500">Actionable suggestions to enhance your code</p>
        </div>
      </div>
      <div className="space-y-2.5">
        {improvements.map((imp, i) => {
          const prio = priorityConfig.medium
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.05 * i }}
              className={`flex items-start space-x-3 p-3.5 rounded-xl ${prio.bg} ${prio.border} border`}
            >
              <span className={`flex-shrink-0 w-5 h-5 rounded-full ${prio.bg} flex items-center justify-center text-[10px] font-bold ${prio.color}`}>
                {prio.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300 leading-relaxed">{imp}</p>
              </div>
              <FiChevronRight className={`w-4 h-4 flex-shrink-0 mt-0.5 ${prio.color} opacity-50`} />
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
