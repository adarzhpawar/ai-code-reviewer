import { motion } from 'framer-motion'

export default function FloatingCard({ icon: Icon, title, value, color = 'primary', delay = 0, x = 0, y = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className="absolute hidden lg:block"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut' }}
        className="glass rounded-2xl p-4 min-w-[180px] backdrop-blur-xl border border-white/10 shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl bg-${color}/20 flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 text-${color}`} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{title}</p>
            <p className={`text-lg font-bold text-white mt-0.5 ${value && value.includes('/') ? 'gradient-text' : ''}`}>
              {value}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
