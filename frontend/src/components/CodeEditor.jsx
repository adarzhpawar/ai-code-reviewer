import { useRef, useImperativeHandle, forwardRef, useCallback, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { FiCopy, FiTrash2 } from 'react-icons/fi'

const languageMap = {
  javascript: 'javascript',
  python: 'python',
  java: 'java',
  'c++': 'cpp',
  c: 'c',
  typescript: 'typescript',
}

const CodeEditor = forwardRef(function CodeEditor(
  { code, setCode, language, onCopy, onClear, onReview, loading, lineFeedback = [], focusedLine },
  ref
) {
  const editorRef = useRef(null)
  const decorationsRef = useRef([])

  useImperativeHandle(ref, () => ({
    scrollToLine: (lineNumber) => {
      if (editorRef.current) {
        editorRef.current.revealLineInCenter(lineNumber)
        editorRef.current.setPosition({ lineNumber, column: 1 })
        editorRef.current.focus()
      }
    },
    getEditor: () => editorRef.current,
  }))

  const applyDecorations = useCallback((editor, feedback) => {
    if (!editor) return
    const model = editor.getModel()
    if (!model) return
    const lineCount = model.getLineCount()
    const decorations = feedback
      .filter((fb) => fb.lineNumber >= 1 && fb.lineNumber <= lineCount)
      .map((fb) => {
        const cls = fb.severity === 'critical' ? 'line-decoration-critical' :
                    fb.severity === 'warning' ? 'line-decoration-warning' : 'line-decoration-suggestion'
        const glyphCls = fb.severity === 'critical' ? 'glyph-margin-critical' :
                         fb.severity === 'warning' ? 'glyph-margin-warning' : 'glyph-margin-suggestion'
        return {
          range: new window.monaco.Range(fb.lineNumber, 1, fb.lineNumber, 1),
          options: {
            isWholeLine: true,
            className: cls,
            glyphMarginClassName: glyphCls,
            glyphMarginHoverMessage: {
              value: `**${fb.severity.toUpperCase()}** — ${fb.issue}\n\n*${fb.suggestion || ''}*`,
            },
            hoverMessage: {
              value: [
                { value: `**${fb.severity.toUpperCase()}**`, isTrusted: true },
                { value: `\n\n${fb.issue}`, isTrusted: true },
                ...(fb.suggestion ? [{ value: `\n\n---\n**Fix:** ${fb.suggestion}`, isTrusted: true }] : []),
              ],
            },
            stickiness: window.monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          },
        }
      })
    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, decorations)
  }, [])

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor
  }

  useEffect(() => {
    if (editorRef.current && lineFeedback.length > 0) {
      applyDecorations(editorRef.current, lineFeedback)
    }
  }, [lineFeedback, applyDecorations])

  useEffect(() => {
    if (focusedLine && editorRef.current) {
      editorRef.current.revealLineInCenter(focusedLine)
      editorRef.current.setPosition({ lineNumber: focusedLine, column: 1 })
      editorRef.current.focus()
    }
  }, [focusedLine])

  useEffect(() => {
    return () => {
      if (editorRef.current && decorationsRef.current.length > 0) {
        editorRef.current.deltaDecorations(decorationsRef.current, [])
        decorationsRef.current = []
      }
    }
  }, [])

  const handleCopy = async () => {
    if (editorRef.current) {
      await navigator.clipboard.writeText(editorRef.current.getValue())
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border border-border rounded-t-lg bg-surface-light">
        <span className="text-xs font-mono text-zinc-500">&gt; code.{languageMap[language] || 'js'}</span>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded text-zinc-500 hover:text-lime-400 hover:bg-black/50 transition-all"
            title="Copy"
          >
            <FiCopy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClear}
            className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-black/50 transition-all"
            title="Clear"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden border-l border-r border-b border-border rounded-b-lg">
        <Editor
          height="100%"
          language={languageMap[language] || 'javascript'}
          theme="vs-dark"
          value={code}
          onChange={setCode}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 12 },
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            bracketPairColorization: { enabled: true },
            renderLineHighlight: 'line',
            cursorBlinking: 'solid',
            cursorColor: '#A3FF12',
            smoothScrolling: true,
            glyphMargin: true,
            folding: true,
            lineDecorationsWidth: 6,
            lineNumbersMinChars: 3,
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            scrollbar: {
              vertical: 'hidden',
              horizontal: 'hidden',
            },
          }}
        />
      </div>

      {/* Review Button */}
      <button
        onClick={onReview}
        disabled={loading || !code.trim()}
        className="mt-2 terminal-btn w-full py-2.5 rounded text-xs font-mono font-semibold flex items-center justify-center space-x-2"
      >
        {loading ? (
          <div className="typing-indicator"><span /><span /><span /></div>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Review Code</span>
          </>
        )}
      </button>
    </div>
  )
})

export default CodeEditor
