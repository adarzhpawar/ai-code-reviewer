const languages = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'c++', label: 'C++' },
  { id: 'c', label: 'C' },
  { id: 'typescript', label: 'TypeScript' },
]

export default function LanguageSelector({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-1">
      {languages.map((lang) => (
        <button
          key={lang.id}
          onClick={() => onSelect(lang.id)}
          className={`px-2.5 py-1.5 rounded text-xs font-mono transition-all ${
            selected === lang.id
              ? 'bg-lime-400 text-black font-semibold'
              : 'text-zinc-500 hover:text-zinc-300 border border-transparent hover:border-border'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
