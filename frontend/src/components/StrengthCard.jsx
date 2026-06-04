import { motion } from 'framer-motion'
import { FiCheckCircle } from 'react-icons/fi'

export default function StrengthCard({ strengths, delay = 0 }) {
  if (!strengths || strengths.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-2xl p-5 border-l-2 border-green-500/50"
    >
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
          <FiCheckCircle className="w-4 h-4 text-green-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Strengths</h3>
          <p className="text-xs text-gray-500">What your code does well</p>
        </div>
      </div>
      <div className="grid gap-3">
        {strengths.map((strength, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.05 * i }}
            className="flex items-start space-x-3 p-3 rounded-xl bg-gradient-to-r from-green-500/5 to-transparent border border-green-500/10"
          >
            <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            </span>
            <p className="text-sm text-gray-300 leading-relaxed">{strength}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
