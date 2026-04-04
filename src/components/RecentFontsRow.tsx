'use client'

interface RecentFontsRowProps {
  recentNames: string[]
  onSelect: (family: string) => void
  selectedFont?: string
}

export default function RecentFontsRow({ recentNames, onSelect, selectedFont }: RecentFontsRowProps) {
  if (recentNames.length === 0) return null

  return (
    <div className="mb-3">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1.5">Recently Used</div>
      <div className="flex gap-1.5 overflow-x-auto pb-1.5">
        {recentNames.map(name => (
          <button
            key={name}
            onClick={() => onSelect(name)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs transition ${
              selectedFont === name
                ? 'bg-violet-600/20 border border-violet-600/40 text-violet-400'
                : 'bg-violet-500/5 border border-violet-500/10 text-zinc-400 hover:border-violet-500/30'
            }`}
          >
            <span className="block text-sm leading-tight" style={{ fontFamily: `"${name}", sans-serif` }}>{name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
