import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiMessageCircle, FiTrash2 } from 'react-icons/fi'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import { sendChatMessage } from '../utils/api'

function buildSuggestedQuestions(review) {
  const questions = ['Explain the main issue in my code']
  if (review?.issues && review.issues.length > 0) {
    questions.push(`How do I fix "${review.issues[0].description?.slice(0, 40)}"?`)
  }
  if (review?.complexityAnalysis) {
    questions.push(`Explain ${review.complexityAnalysis.timeComplexity} complexity`)
  }
  questions.push('How can I improve my coding skills?')
  return questions.slice(0, 5)
}

export default function MentorChat({ code, language, review }) {
  const [messages, setMessages] = useState([])
  const [streaming, setStreaming] = useState(false)
  const [currentStreamText, setCurrentStreamText] = useState('')
  const messagesEndRef = useRef(null)
  const containerRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (!streaming) scrollToBottom()
  }, [messages, streaming, scrollToBottom])

  const handleSend = async (text) => {
    if (streaming) return
    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setStreaming(true)
    setCurrentStreamText('')
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      await sendChatMessage(
        { message: text, code, language, reviewContext: review || null, history },
        (accumulated) => setCurrentStreamText(accumulated)
      )
    } catch {
      setCurrentStreamText('Error. Please try again.')
    } finally {
      setMessages(prev => {
        if (prev.length > 0 && prev[prev.length - 1].role === 'assistant') return prev
        return [...prev, { role: 'assistant', content: currentStreamText }]
      })
      setCurrentStreamText('')
      setStreaming(false)
    }
  }

  const handleClear = () => { setMessages([]); setCurrentStreamText(''); setStreaming(false) }
  const suggestedQuestions = buildSuggestedQuestions(review)

  return (
    <div className="flex flex-col h-full bg-surface-light">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 border border-lime-400/30 rounded flex items-center justify-center">
            <FiMessageCircle className="w-3.5 h-3.5 text-lime-400" />
          </div>
          <div>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">AI Mentor</span>
            <p className="text-[10px] text-zinc-600 font-mono">{streaming ? 'typing...' : `${messages.length} msgs`}</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={handleClear} className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-black/50 transition-all">
            <FiTrash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && !streaming && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 border border-lime-400/20 rounded-lg flex items-center justify-center mb-3">
              <FiMessageCircle className="w-6 h-6 text-zinc-600" />
            </div>
            <p className="text-xs text-zinc-500 font-mono">Ask anything about your code</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg.content} isUser={msg.role === 'user'} />
        ))}
        {streaming && <ChatMessage message={currentStreamText} isUser={false} streaming />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-border">
        <ChatInput
          onSend={handleSend}
          disabled={streaming}
          suggestedQuestions={messages.length === 0 ? suggestedQuestions : []}
        />
      </div>
    </div>
  )
}
