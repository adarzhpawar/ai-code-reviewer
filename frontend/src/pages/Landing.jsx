import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DotField from '../components/DotField'
import { FiArrowRight, FiTerminal, FiCode, FiCpu, FiMessageSquare, FiCheckCircle, FiZap, FiBarChart2, FiStar, FiShield, FiLayers, FiFileText, FiEye } from 'react-icons/fi'

const steps = [
  { icon: FiTerminal, title: 'Paste Your Code', description: 'Write or paste code in the Monaco editor. Choose from 6 supported languages.' },
  { icon: FiCpu, title: 'AI Reviews Your Code', description: 'Advanced AI analyzes logic, detects bugs, evaluates complexity, and suggests improvements.' },
  { icon: FiMessageSquare, title: 'Receive Feedback', description: 'Get structured reports with scores and line-level annotations. Chat with the AI mentor.' },
]

const features = [
  { icon: FiCheckCircle, title: 'Bug Detection', description: 'Catch syntax errors, runtime exceptions, and subtle bugs.' },
  { icon: FiZap, title: 'Code Optimization', description: 'Get performance improvements and cleaner patterns.' },
  { icon: FiBarChart2, title: 'Complexity Analysis', description: 'Time and space complexity with Big-O notation.' },
  { icon: FiStar, title: 'Best Practices', description: 'Industry standards and idiomatic code patterns.' },
  { icon: FiShield, title: 'Logic Analysis', description: 'Detect logical flaws and edge cases.' },
  { icon: FiMessageSquare, title: 'AI Mentor Chat', description: 'Ask questions and get explanations interactively.' },
  { icon: FiLayers, title: 'Line-by-Line Review', description: 'Feedback annotated directly on your code.' },
  { icon: FiFileText, title: 'PDF Reports', description: 'Export comprehensive review reports.' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface overflow-x-hidden">
      <Navbar transparent />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <DotField
            dotRadius={1.2}
            dotSpacing={18}
            cursorRadius={350}
            bulgeStrength={60}
            glowRadius={180}
            gradientFrom="rgba(163, 255, 18, 0.2)"
            gradientTo="rgba(0, 0, 0, 0)"
            glowColor="#A3FF12"
            className="w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] border border-lime-400/5 rounded-full" />
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] border border-lime-400/10 rounded-full" />
        </div>

        {/* Scan line */}
        <div className="absolute inset-0 pointer-events-none scan-line opacity-30" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center px-3 py-1.5 border border-lime-400/30 rounded text-xs font-mono text-lime-400 mb-8">
              <span className="mr-2">●</span>
              AI-Powered Code Review Engine
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-[1.05] tracking-tight font-mono"
          >
            <span className="text-lime-400">&gt;_</span> Get Instant
            <br />
            Feedback on Your Code
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-zinc-500 max-w-2xl mx-auto mb-10 font-mono leading-relaxed"
          >
            Analyze logic, detect bugs, improve readability, optimize performance,
            and learn best practices with advanced AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="terminal-btn px-8 py-3.5 rounded text-base font-mono font-semibold tracking-wide flex items-center space-x-2"
            >
              <span>Start Reviewing</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3.5 border border-border hover:border-zinc-600 text-zinc-400 hover:text-white rounded font-mono text-sm transition-all"
            >
              View Features
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-20 grid grid-cols-3 gap-8 max-w-md mx-auto"
          >
            {[
              { value: '6', label: 'Languages' },
              { value: 'AI', label: 'Powered' },
              { value: 'Free', label: 'To Use' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-lime-400 font-mono">{stat.value}</div>
                <div className="text-xs text-zinc-600 mt-1 font-mono">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="features" className="py-24 lg:py-32 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 border border-lime-400/30 rounded text-xs font-mono text-lime-400 mb-4">
              /workflow
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 font-mono">
              How It <span className="text-lime-400">Works</span>
            </h2>
            <p className="text-sm text-zinc-500 font-mono">Three simple steps from code to feedback.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="terminal-card rounded-lg p-6 group"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded border border-lime-400/20 flex items-center justify-center group-hover:border-lime-400/60 transition-colors">
                    <step.icon className="w-5 h-5 text-lime-400" />
                  </div>
                  <span className="text-lg font-bold text-lime-400/30 font-mono">0{i + 1}</span>
                </div>
                <h3 className="text-base font-semibold text-white mb-2 font-mono">{step.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-mono">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 lg:py-32 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 border border-lime-400/30 rounded text-xs font-mono text-lime-400 mb-4">
              /features
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 font-mono">
              Everything You <span className="text-lime-400">Need</span>
            </h2>
            <p className="text-sm text-zinc-500 font-mono">Comprehensive tools for code analysis and improvement.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -2 }}
                  className="terminal-card rounded-lg p-5 group cursor-default"
                >
                  <div className="w-9 h-9 rounded border border-lime-400/20 flex items-center justify-center mb-3 group-hover:border-lime-400/60 group-hover:bg-lime-400/5 transition-all">
                    <Icon className="w-4 h-4 text-lime-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1.5 font-mono">{feature.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed font-mono">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* PREVIEW */}
      <section className="py-24 lg:py-32 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 border border-lime-400/30 rounded text-xs font-mono text-lime-400 mb-4">
              /preview
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 font-mono">
              See It in <span className="text-lime-400">Action</span>
            </h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="terminal-card rounded-lg overflow-hidden border-border">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border bg-surface-light">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
              <span className="ml-3 text-xs text-zinc-600 font-mono">review.monaco</span>
            </div>
            <div className="flex flex-col lg:flex-row">
              <div className="w-full lg:w-1/2 p-4 border-b lg:border-b-0 lg:border-r border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-zinc-500 font-mono">main.js</span>
                  <span className="text-xs px-2 py-0.5 border border-lime-400/20 rounded text-lime-400 font-mono">javascript</span>
                </div>
                <pre className="text-xs font-mono leading-relaxed text-zinc-400 overflow-x-auto">
                  <code>{`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n-1) + fibonacci(n-2);
}

function findDuplicates(arr) {
  let seen = {};
  for (let i = 0; i < arr.length; i++) {
    if (seen[arr[i]]) return true;
    seen[arr[i]] = true;
  }
  return false;
}`}</code>
                </pre>
              </div>
              <div className="w-full lg:w-1/2 p-4 bg-surface-light/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">// Review Results</span>
                  <span className="text-xs px-2 py-0.5 border border-lime-400/30 rounded text-lime-400 font-mono">Score: 72/100</span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-2.5 border border-lime-400/20 rounded bg-lime-400/5">
                    <p className="text-xs text-lime-400 font-semibold mb-0.5 font-mono">! Critical</p>
                    <p className="text-xs text-zinc-500 font-mono">Recursion causes O(2^n). Use iteration.</p>
                  </div>
                  <div className="p-2.5 border border-border rounded">
                    <p className="text-xs text-zinc-400 font-semibold mb-0.5 font-mono">? Warning</p>
                    <p className="text-xs text-zinc-500 font-mono">Use Set instead of object for 'seen'.</p>
                  </div>
                  <div className="p-2.5 border border-border rounded">
                    <p className="text-xs text-zinc-400 font-semibold mb-0.5 font-mono">&gt; Suggestion</p>
                    <p className="text-xs text-zinc-500 font-mono">Add JSDoc comments for documentation.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="terminal-card rounded-xl p-10 lg:p-14 text-center border-lime-400/20"
          >
            <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 font-mono">
              Ready to Improve Your <span className="text-lime-400">Coding Skills?</span>
            </h2>
            <p className="text-sm text-zinc-500 max-w-md mx-auto mb-8 font-mono">
              Analyze code, learn best practices, and write better software.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="terminal-btn inline-flex items-center px-8 py-3.5 rounded text-sm font-mono font-semibold"
            >
              <span>Launch CodeReview AI</span>
              <FiArrowRight className="w-4 h-4 ml-2" />
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
