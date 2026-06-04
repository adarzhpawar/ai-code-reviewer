import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const STEPS = [
  { key: 'reading', label: 'Parsing Code', duration: 500 },
  { key: 'issues', label: 'Detecting Issues', duration: 700 },
  { key: 'complexity', label: 'Analyzing Complexity', duration: 600 },
  { key: 'improvements', label: 'Generating Improvements', duration: 400 },
]

export default function ReviewProgress({ onComplete }) {
  const [activeStep, setActiveStep] = useState(0)
  const [completed, setCompleted] = useState(new Set())
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (activeStep >= STEPS.length) {
      onComplete?.()
      return
    }
    const timer = setTimeout(() => {
      setCompleted(prev => new Set([...prev, activeStep]))
      setActiveStep(prev => prev + 1)
      setProgress(((activeStep + 1) / STEPS.length) * 100)
    }, STEPS[activeStep].duration)
    return () => clearTimeout(timer)
  }, [activeStep, onComplete])

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 bg-surface-light">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-sm"
      >
        {/* Terminal header */}
        <div className="border border-border rounded-lg p-4 mb-6 bg-black/50">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-lime-400 font-mono text-sm">$</span>
            <span className="text-zinc-400 font-mono text-sm">analyze --code</span>
            <span className="terminal-cursor text-lime-400" />
          </div>

          <div className="space-y-2.5">
            {STEPS.map((step, i) => {
              const isActive = activeStep === i
              const isDone = completed.has(i)
              const isPending = !isActive && !isDone

              return (
                <div key={step.key} className="flex items-center gap-2.5 font-mono">
                  <span className={`w-4 text-xs ${isDone ? 'text-lime-400' : isActive ? 'text-lime-400' : 'text-zinc-700'}`}>
                    {isDone ? '>' : isActive ? '>' : ' '}
                  </span>
                  <span className={`text-xs transition-colors ${
                    isDone ? 'text-lime-400' : isActive ? 'text-lime-400' : 'text-zinc-700'
                  }`}>
                    {isDone ? '[OK]' : isActive ? '[..]' : '[  ]'}
                  </span>
                  <span className={`text-xs transition-colors ${
                    isDone ? 'text-lime-400' : isActive ? 'text-white' : 'text-zinc-700'
                  }`}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-black rounded-full overflow-hidden border border-border">
          <motion.div
            className="h-full bg-lime-400"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-xs text-zinc-600 font-mono text-center mt-3">
          Processing...
        </p>
      </motion.div>
    </div>
  )
}
