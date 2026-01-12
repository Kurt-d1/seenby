interface ScoreRingProps {
  score: number
  size?: "sm" | "md" | "lg"
  label?: string
}

export function ScoreRing({ score, size = "md", label }: ScoreRingProps) {
  var sizes: Record<string, { ring: number; stroke: number; text: string; container: string }> = {
    sm: { ring: 80, stroke: 6, text: "text-xl", container: "w-20 h-20" },
    md: { ring: 120, stroke: 8, text: "text-3xl", container: "w-32 h-32" },
    lg: { ring: 160, stroke: 10, text: "text-5xl", container: "w-44 h-44" }
  }

  var config = sizes[size]
  var radius = (config.ring - config.stroke) / 2
  var circumference = radius * 2 * Math.PI
  var offset = circumference - (score / 100) * circumference

  var color = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : score >= 40 ? "#f97316" : "#ef4444"

  return (
    <div className="flex flex-col items-center">
      <div className={"relative " + config.container}>
        <svg className="transform -rotate-90" width={config.ring} height={config.ring}>
          <circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={config.stroke}
            fill="none"
          />
          <circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={radius}
            stroke={color}
            strokeWidth={config.stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={"font-bold " + config.text} style={{ color: color }}>{score}</span>
        </div>
      </div>
      {label && (
        <div className="mt-2 text-sm text-slate-500 font-medium">{label}</div>
      )}
    </div>
  )
}