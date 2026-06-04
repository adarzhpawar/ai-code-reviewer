import { VscCodeReview } from 'react-icons/vsc'

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-base font-bold text-white font-mono">&gt;_ CodeReview AI</span>
            </div>
            <p className="text-sm text-zinc-500 max-w-md font-mono leading-relaxed">
              AI-powered code review assistant. Analyze logic, detect bugs, and optimize performance.
            </p>
          </div>
          <div>
            <h3 className="text-xs text-lime-400 font-mono font-semibold mb-3 tracking-wider uppercase">Features</h3>
            <ul className="space-y-1.5 text-sm text-zinc-500 font-mono">
              <li className="hover:text-zinc-300 transition-colors cursor-default">Bug Detection</li>
              <li className="hover:text-zinc-300 transition-colors cursor-default">Code Optimization</li>
              <li className="hover:text-zinc-300 transition-colors cursor-default">AI Mentor Chat</li>
              <li className="hover:text-zinc-300 transition-colors cursor-default">PDF Reports</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs text-lime-400 font-mono font-semibold mb-3 tracking-wider uppercase">Languages</h3>
            <ul className="space-y-1.5 text-sm text-zinc-500 font-mono">
              <li className="hover:text-zinc-300 transition-colors cursor-default">JavaScript</li>
              <li className="hover:text-zinc-300 transition-colors cursor-default">Python</li>
              <li className="hover:text-zinc-300 transition-colors cursor-default">Java</li>
              <li className="hover:text-zinc-300 transition-colors cursor-default">C / C++</li>
              <li className="hover:text-zinc-300 transition-colors cursor-default">TypeScript</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-zinc-600 font-mono">
            &copy; {new Date().getFullYear()} CodeReview AI &mdash; Built with AI
          </p>
        </div>
      </div>
    </footer>
  )
}
