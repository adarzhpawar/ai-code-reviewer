import { motion } from 'framer-motion'
import { FiBarChart2, FiClock, FiHardDrive } from 'react-icons/fi'

export default function ComplexityCard({ complexity, delay = 0 }) {
  if (!complexity) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-cyan-500/20 flex items-center justify-center">
          <FiBarChart2 className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Complexity Analysis</h3>
          <p className="text-xs text-gray-500">Time and space complexity breakdown</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.1 }}
          className="p-4 rounded-xl bg-surface-light border border-gray-700/30"
        >
          <div className="flex items-center space-x-2 mb-2">
            <FiClock className="w-4 h-4 text-accent" />
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Time</span>
          </div>
          <span className="text-lg font-mono font-bold text-accent">{complexity.timeComplexity}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.15 }}
          className="p-4 rounded-xl bg-surface-light border border-gray-700/30"
        >
          <div className="flex items-center space-x-2 mb-2">
            <FiHardDrive className="w-4 h-4 text-secondary" />
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Space</span>
          </div>
          <span className="text-lg font-mono font-bold text-secondary">{complexity.spaceComplexity}</span>
        </motion.div>
      </div>
      {complexity.explanation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
          className="p-3 rounded-xl bg-gradient-to-r from-accent/5 to-transparent border border-accent/10"
        >
          <div className="flex items-start space-x-2">
            <span className="text-accent text-sm leading-relaxed">&#9432;</span>
            <p className="text-sm text-gray-400 leading-relaxed">{complexity.explanation}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
