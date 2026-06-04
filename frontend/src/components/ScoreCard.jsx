import { motion } from 'framer-motion'

function getScoreColor(score) {
  if (score >= 90) return { stroke: '#A3FF12', label: 'Excellent' }
  if (score >= 80) return { stroke: '#A3FF12', label: 'Great' }
  if (score >= 70) return { stroke: '#7DFF00', label: 'Good' }
  if (score >= 60) return { stroke: '#A3FF12', label: 'Fair' }
  if (score >= 40) return { stroke: '#A3FF12', label: 'Needs Work' }
  return { stroke: '#A3FF12', label: 'Poor' }
}

export default function ScoreCard({ label, score, size = 'lg', delay = 0 }) {
  const color = getScoreColor(score)
  const radius = size === 'lg' ? 44 : 32
  const circumference = 2 * Math.PI * radius
  const strokeWidth = size === 'lg' ? 5 : 3
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: (radius + 8) * 2, height: (radius + 8) * 2 }}>
        <svg className="transform -rotate-90" width="100%" height="100%">
          <circle cx={radius + 8} cy={radius + 8} r={radius} fill="none" stroke="#1a1a1a" strokeWidth={strokeWidth} />
          <motion.circle
            cx={radius + 8} cy={radius + 8} r={radius}
            fill="none" stroke={color.stroke} strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut', delay: delay + 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.5 }}
            className={`font-bold font-mono ${size === 'lg' ? 'text-xl' : 'text-sm'} text-white`}
          >
            {score}
          </motion.span>
          {size === 'lg' && (
            <motion.span
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.6 }}
              className="text-[9px] font-mono text-lime-400 mt-0.5"
            >
              {color.label}
            </motion.span>
          )}
        </div>
      </div>
      <span className={`${size === 'lg' ? 'text-xs' : 'text-[10px]'} text-zinc-500 mt-2 font-mono uppercase tracking-wider`}>
        {label}
      </span>
    </div>
  )
}
