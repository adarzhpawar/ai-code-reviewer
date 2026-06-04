import { motion } from 'framer-motion'
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'

export default function ErrorMessage({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full p-6 bg-surface-light"
    >
      <div className="w-12 h-12 border border-red-500/30 rounded-lg flex items-center justify-center mb-3">
        <FiAlertTriangle className="w-6 h-6 text-red-400" />
      </div>
      <p className="text-xs text-zinc-400 font-mono text-center max-w-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="terminal-btn px-4 py-2 rounded text-xs font-mono flex items-center space-x-1.5"
        >
          <FiRefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </motion.div>
  )
}
