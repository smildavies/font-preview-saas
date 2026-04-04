'use client'

interface ContrastCheckerProps {
  textColor: string
  bgColor: string
}

function getLuminance(hex: string): number {
  if (!hex || hex.length !== 7 || hex[0] !== '#') return 0
  const rgb = [parseInt(hex.slice(1,3),16)/255, parseInt(hex.slice(3,5),16)/255, parseInt(hex.slice(5,7),16)/255]
  if (rgb.some(c => isNaN(c))) return 0
  const linear = rgb.map(c => c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4))
  return 0.2126*linear[0] + 0.7152*linear[1] + 0.0722*linear[2]
}

function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1)
  const l2 = getLuminance(hex2)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

export default function ContrastChecker({ textColor, bgColor }: ContrastCheckerProps) {
  const ratio = getContrastRatio(textColor, bgColor)
  let level: string, colorClass: string

  if (ratio >= 7) { level = 'AAA'; colorClass = 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' }
  else if (ratio >= 4.5) { level = 'AA'; colorClass = 'text-amber-400 bg-amber-400/10 border-amber-400/30' }
  else if (ratio >= 3) { level = 'AA Large'; colorClass = 'text-orange-400 bg-orange-400/10 border-orange-400/30' }
  else { level = 'Fail'; colorClass = 'text-red-400 bg-red-400/10 border-red-400/30' }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-zinc-500">Contrast</label>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold px-2 py-1 rounded border ${colorClass}`}>
          {ratio.toFixed(1)}:1
        </span>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${colorClass}`}>
          {level}
        </span>
      </div>
    </div>
  )
}
