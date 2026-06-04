import { motion } from 'framer-motion'
import { FiBookOpen, FiTrendingUp, FiTarget, FiCode, FiClock, FiStar } from 'react-icons/fi'

function diffStyle(d) {
  const m = { beginner: { label: 'Beginner' }, intermediate: { label: 'Intermediate' }, advanced: { label: 'Advanced' } }
  return m[d] || m.beginner
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-surface-light">
      <div className="text-center">
        <p className="text-sm font-mono text-lime-400 mb-1">&gt; Generating roadmap...</p>
        <p className="text-xs text-zinc-600 font-mono">Analyzing code and review data</p>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 bg-surface-light">
      <div className="w-14 h-14 border border-lime-400/20 rounded-lg flex items-center justify-center mb-3">
        <FiBookOpen className="w-7 h-7 text-zinc-600" />
      </div>
      <p className="text-xs text-zinc-500 font-mono text-center">Review your code first to get personalized learning recommendations.</p>
    </div>
  )
}

export default function LearningRoadmap({ learning, loading, error }) {
  if (loading) return <LoadingState />
  if (!learning && !error) return <EmptyState />
  if (error) return <div className="flex items-center justify-center h-full bg-surface-light"><p className="text-xs text-red-400 font-mono">{error}</p></div>

  const r = learning
  const baseDelay = 0.05

  return (
    <div className="h-full overflow-y-auto px-3 py-3 space-y-3 bg-surface-light">
      {/* Assessment */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="terminal-card rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 border border-lime-400/30 rounded flex items-center justify-center">
              <FiTrendingUp className="w-4 h-4 text-lime-400" />
            </div>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Assessment</span>
          </div>
          <span className="text-[10px] font-mono text-lime-400 border border-lime-400/30 px-2 py-0.5 rounded">
            {diffStyle(r.overallDifficulty).label}
          </span>
        </div>
        {r.motivationalMessage && (
          <p className="text-xs text-zinc-400 font-mono italic border-l-2 border-lime-400/40 pl-3">{r.motivationalMessage}</p>
        )}
      </motion.div>

      {/* Weak Areas */}
      {r.weakAreas?.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: baseDelay }} className="terminal-card rounded-lg p-4">
          <div className="flex items-center space-x-1.5 mb-3">
            <FiTarget className="w-3.5 h-3.5 text-lime-400" />
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Weak Areas</span>
          </div>
          <div className="space-y-2">
            {r.weakAreas.map((wa, i) => (
              <div key={i} className="bg-black/50 border border-border rounded-lg p-3">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-xs font-semibold text-white font-mono">{wa.area}</h4>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase border border-border px-1.5 py-0.5 rounded">{wa.severity}</span>
                </div>
                <p className="text-[11px] text-zinc-500 font-mono">{wa.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Topics */}
      {r.recommendedTopics?.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: baseDelay + 0.1 }} className="terminal-card rounded-lg p-4">
          <div className="flex items-center space-x-1.5 mb-3">
            <FiBookOpen className="w-3.5 h-3.5 text-lime-400" />
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Topics</span>
          </div>
          <div className="space-y-2">
            {r.recommendedTopics.map((topic, i) => (
              <div key={i} className="flex items-start space-x-2.5 p-3 bg-black/50 border border-border rounded-lg">
                <div className="w-7 h-7 border border-lime-400/20 rounded flex items-center justify-center flex-shrink-0">
                  <FiCode className="w-3.5 h-3.5 text-lime-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5 mb-0.5">
                    <h4 className="text-xs font-semibold text-white font-mono">{topic.topic}</h4>
                    <span className="text-[9px] font-mono text-zinc-500">{diffStyle(topic.difficulty).label}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-mono">{topic.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Practice */}
      {r.practiceQuestions?.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: baseDelay + 0.2 }} className="terminal-card rounded-lg p-4">
          <div className="flex items-center space-x-1.5 mb-3">
            <FiCode className="w-3.5 h-3.5 text-lime-400" />
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Practice</span>
          </div>
          <div className="space-y-2">
            {r.practiceQuestions.map((pq, i) => (
              <div key={i} className="bg-black/50 border border-border rounded-lg p-3">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-xs font-semibold text-white font-mono">{pq.title}</h4>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">{pq.difficulty}</span>
                </div>
                <p className="text-[11px] text-zinc-500 font-mono mb-1.5">{pq.description}</p>
                {pq.topics?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {pq.topics.map((t, j) => (
                      <span key={j} className="px-1.5 py-0.5 rounded text-[9px] font-mono border border-border text-zinc-600">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Learning Path */}
      {r.learningPath?.steps?.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: baseDelay + 0.3 }} className="terminal-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1.5">
              <FiClock className="w-3.5 h-3.5 text-lime-400" />
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Path</span>
            </div>
            {r.learningPath.totalEstimatedTime && (
              <span className="text-[10px] text-zinc-600 font-mono border border-border px-2 py-0.5 rounded">{r.learningPath.totalEstimatedTime}</span>
            )}
          </div>
          <div className="space-y-1 relative">
            <div className="absolute left-[9px] top-3 bottom-3 w-px bg-lime-400/20" />
            {r.learningPath.steps.map((step, i) => (
              <div key={i} className="flex items-start space-x-3 pl-0.5 py-2">
                <div className="relative z-10 flex-shrink-0 w-[18px] h-[18px] rounded-full bg-lime-400 flex items-center justify-center text-[9px] font-bold text-black font-mono">
                  {step.step}
                </div>
                <div className="flex-1 pt-px">
                  <div className="flex items-center space-x-1.5 mb-0.5">
                    <h4 className="text-xs font-semibold text-white font-mono">{step.title}</h4>
                    {step.estimatedTime && <span className="text-[9px] text-zinc-600 font-mono">{step.estimatedTime}</span>}
                  </div>
                  <p className="text-[11px] text-zinc-500 font-mono">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
