import { Link } from 'react-router-dom'

export default function Navbar({ transparent = false }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-black/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-lg font-bold text-white font-mono tracking-tight group-hover:text-lime-400 transition-colors">
              &gt;_ CodeReview AI
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="terminal-btn px-5 py-2 rounded text-sm font-mono font-medium tracking-wide"
            >
              Launch App
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
