import { motion } from 'framer-motion'
import { FiFileText } from 'react-icons/fi'

export default function ReviewSummary({ summary, delay = 0 }) {
  if (!summary) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <FiFileText className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">AI Summary</h3>
          <p className="text-xs text-gray-500">Detailed code analysis overview</p>
        </div>
      </div>
      <div className="pl-1">
        <p className="text-sm text-gray-300 leading-relaxed">{summary}</p>
      </div>
    </motion.div>
  )
}
