import { useState, useRef, useCallback, lazy, Suspense, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiZap, FiMessageCircle, FiFileText, FiDownload, FiBookOpen } from 'react-icons/fi'
import Navbar from '../components/Navbar'
import LanguageSelector from '../components/LanguageSelector'
import CodeEditor from '../components/CodeEditor'
import ReviewPanel from '../components/ReviewPanel'
import ReviewProgress from '../components/ReviewProgress'
import MentorChat from '../components/MentorChat'
import CodeComparisonView from '../components/CodeComparisonView'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ErrorMessage from '../components/ErrorMessage'
import { reviewCode, fixCode, exportPDF, recommendLearning } from '../utils/api'

const LearningRoadmap = lazy(() => import('../components/LearningRoadmap'))

const defaultCodes = {
  javascript: '// Write your JavaScript code here\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
  python: '# Write your Python code here\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))',
  java: '// Write your Java code here\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  'c++': '// Write your C++ code here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
  c: '// Write your C code here\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
  typescript: '// Write your TypeScript code here\nfunction greet(name: string): string {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
}

const TABS = [
  { key: 'review', label: 'Review', icon: FiFileText },
  { key: 'chat', label: 'AI Mentor', icon: FiMessageCircle },
  { key: 'learning', label: 'Learning', icon: FiBookOpen },
]

export default function Dashboard() {
  const [code, setCode] = useState(defaultCodes.javascript)
  const [language, setLanguage] = useState('javascript')
  const [review, setReview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [error, setError] = useState(null)
  const [focusedLine, setFocusedLine] = useState(null)
  const [fixing, setFixing] = useState(false)
  const [fixResult, setFixResult] = useState(null)
  const [fixLoading, setFixLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('review')
  const [learning, setLearning] = useState(null)
  const [learningLoading, setLearningLoading] = useState(false)

  const editorRef = useRef(null)

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    setCode(defaultCodes[lang])
    setReview(null)
    setError(null)
    setFixResult(null)
    setLearning(null)
  }

  const handleClear = () => {
    setCode('')
    setReview(null)
    setError(null)
    setFixResult(null)
    setLearning(null)
  }

  const handleReview = async () => {
    if (!code.trim()) return
    setLoading(true)
    setShowProgress(true)
    setError(null)
    setReview(null)
    setFixResult(null)
    setLearning(null)

    console.log('[Dashboard] handleReview called - starting API request')
    console.log('[Dashboard] Code length:', code.length)
    console.log('[Dashboard] Language:', language)

    try {
      const result = await reviewCode(code, language)
      console.log('[Dashboard] Review result received:', result ? 'success' : 'null')
      setReview(result)
    } catch (err) {
      console.error('[Dashboard] Review failed:', err.message)
      setError(err.message || 'Review failed. Please try again.')
    } finally {
      setLoading(false)
      setShowProgress(false)
    }
  }

  const handleLineClick = useCallback((lineNumber) => {
    setFocusedLine(lineNumber)
    if (editorRef.current) editorRef.current.scrollToLine(lineNumber)
    setTimeout(() => setFocusedLine(null), 300)
  }, [])

  const handleFixCode = async () => {
    if (!code.trim()) return
    setFixLoading(true)
    setFixResult(null)
    try {
      setFixing(true)
      const result = await fixCode(code, language)
      setFixResult(result)
    } catch (err) {
      setError(err.message || 'Failed to fix code.')
      setFixing(false)
    } finally {
      setFixLoading(false)
    }
  }

  const handleExport = async () => {
    if (!review) return
    setExportLoading(true)
    try {
      await exportPDF(review, code, language)
    } catch (err) {
      setError(err.message || 'PDF export failed.')
    } finally {
      setExportLoading(false)
    }
  }

  const handleLearning = async () => {
    if (!code.trim() || !review) return
    setLearningLoading(true)
    setError(null)
    try {
      const result = await recommendLearning(code, language, review)
      setLearning(result)
    } catch (err) {
      setError(err.message || 'Failed to generate learning recommendations.')
    } finally {
      setLearningLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="pt-14 h-screen flex flex-col">
        <div className="px-3 sm:px-4 py-2 border-b border-border bg-surface-light">
          <div className="flex items-center justify-between">
            <LanguageSelector selected={language} onSelect={handleLanguageChange} />
            {review && code.trim() && (
              <button
                onClick={handleFixCode}
                disabled={fixLoading}
                className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 terminal-btn rounded text-xs font-mono"
              >
                {fixLoading ? (
                  <div className="w-3 h-3 border border-lime-400/30 border-t-lime-400 rounded-full animate-spin" />
                ) : (
                  <FiZap className="w-3.5 h-3.5" />
                )}
                <span>Fix My Code</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col lg:flex-row gap-0">
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full p-2 flex flex-col">
              <CodeEditor
                ref={editorRef}
                code={code}
                setCode={setCode}
                language={language}
                onClear={handleClear}
                onReview={handleReview}
                loading={loading}
                lineFeedback={[]}
                focusedLine={focusedLine}
              />
              {review && code.trim() && (
                <button
                  onClick={handleFixCode}
                  disabled={fixLoading}
                  className="lg:hidden mt-2 terminal-btn w-full py-2.5 rounded text-xs font-mono flex items-center justify-center space-x-2"
                >
                  {fixLoading ? (
                    <div className="w-3 h-3 border border-lime-400/30 border-t-lime-400 rounded-full animate-spin" />
                  ) : (
                    <FiZap className="w-3.5 h-3.5" />
                  )}
                  <span>Fix My Code</span>
                </button>
              )}
            </div>

            <div className="hidden lg:block w-px bg-border" />

            <div className="w-full lg:w-1/2 h-1/2 lg:h-full p-2">
              <div className="h-full border border-border rounded-lg overflow-hidden flex flex-col bg-surface-light">
                {/* Tabs */}
                <div className="flex border-b border-border flex-shrink-0 items-center pr-3 bg-black/50">
                  {TABS.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.key
                    const hasReview = !!review
                    const disabled = (tab.key === 'chat' || tab.key === 'learning') && !hasReview && !loading
                    return (
                      <button
                        key={tab.key}
                        onClick={() => {
                          if (!disabled) {
                            setActiveTab(tab.key)
                            if (tab.key === 'learning' && !learning && !learningLoading) handleLearning()
                          }
                        }}
                        disabled={disabled}
                        className={`flex items-center space-x-1.5 px-4 py-2.5 text-xs font-mono transition-all relative ${
                          isActive
                            ? 'text-lime-400'
                            : disabled
                              ? 'text-zinc-700 cursor-not-allowed'
                              : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                        {isActive && (
                          <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-2 right-2 h-0.5 bg-lime-400" />
                        )}
                      </button>
                    )
                  })}
                  {review && (
                    <div className="ml-auto">
                      <button
                        onClick={handleExport}
                        disabled={exportLoading}
                        className="flex items-center space-x-1 px-2 py-1 rounded text-xs font-mono text-zinc-500 hover:text-lime-400 disabled:opacity-30 transition-all"
                      >
                        {exportLoading ? (
                          <div className="w-3 h-3 border border-lime-400/30 border-t-lime-400 rounded-full animate-spin" />
                        ) : (
                          <FiDownload className="w-3.5 h-3.5" />
                        )}
                        <span>Export</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                  {activeTab === 'review' ? (
                    loading && showProgress ? (
                      <ReviewProgress />
                    ) : loading ? (
                      <LoadingSkeleton type="review" />
                    ) : error ? (
                      <ErrorMessage message={error} onRetry={handleReview} />
                    ) : (
                      <ReviewPanel
                        review={review}
                        loading={loading}
                        error={error}
                        language={language}
                        onLineClick={handleLineClick}
                      />
                    )
                  ) : activeTab === 'chat' ? (
                    review ? (
                      <MentorChat code={code} language={language} review={review} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-zinc-600 font-mono">
                        Review your code first
                      </div>
                    )
                  ) : (
                    <Suspense fallback={<LoadingSkeleton type="learning" />}>
                      {learningLoading ? (
                        <LoadingSkeleton type="learning" />
                      ) : error ? (
                        <ErrorMessage message={error} onRetry={handleLearning} />
                      ) : (
                        <LearningRoadmap learning={learning} loading={learningLoading} error={error} />
                      )}
                    </Suspense>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {fixing && fixResult && (
          <CodeComparisonView
            original={code}
            improved={fixResult.improvedCode}
            language={language}
            changes={fixResult.changes}
            summary={fixResult.summary}
            onClose={() => { setFixing(false); setFixResult(null) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
