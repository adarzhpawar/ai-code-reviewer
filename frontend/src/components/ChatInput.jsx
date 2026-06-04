import { useState, useRef, useEffect } from 'react'
import { FiSend, FiTerminal } from 'react-icons/fi'

export default function ChatInput({ onSend, disabled, suggestedQuestions = [], onSelectSuggestion }) {
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (!disabled && inputRef.current) inputRef.current.focus()
  }, [disabled])

  const handleSubmit = () => {
    const trimmed = input.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() }
  }

  return (
    <div className="space-y-2.5">
      {suggestedQuestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => { onSelectSuggestion?.(q); setInput('') }}
              disabled={disabled}
              className="flex items-center space-x-1 px-2.5 py-1.5 border border-border rounded text-[10px] font-mono text-zinc-500 hover:border-lime-400/30 hover:text-lime-400 disabled:opacity-30 transition-all"
            >
              <FiTerminal className="w-2.5 h-2.5" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      )}
      <div className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="$ ask a question..."
            rows={1}
            className="w-full px-3 py-2.5 bg-black border border-border rounded text-xs font-mono text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-lime-400/30 focus:ring-0 resize-none transition-all disabled:opacity-50"
            style={{ minHeight: '36px', maxHeight: '100px' }}
            onInput={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'
            }}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || disabled}
          className="flex-shrink-0 w-9 h-9 border border-lime-400/30 rounded flex items-center justify-center text-lime-400 hover:bg-lime-400/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
        >
          <FiSend className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
