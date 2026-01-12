interface MetricCardProps {
  icon: string
  label: string
  value: string | number
  subValue?: string
  trend?: {
    value: number
    label: string
  }
  color?: "blue" | "green" | "yellow" | "red" | "purple"
}

export function MetricCard({ icon, label, value, subValue, trend, color = "blue" }: MetricCardProps) {
  var colorClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600"
  }

  var trendColor = trend && trend.value >= 0 ? "text-green-500" : "text-red-500"
  var trendIcon = trend && trend.value >= 0 ? "+" : ""

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={"w-12 h-12 rounded-xl flex items-center justify-center text-2xl " + colorClasses[color]}>
          {icon}
        </div>
        {trend && (
          <div className={"text-sm font-medium " + trendColor}>
            {trendIcon}{trend.value}%
            <span className="text-slate-400 font-normal ml-1">{trend.label}</span>
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-slate-800 mb-1">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
      {subValue && (
        <div className="text-xs text-slate-400 mt-1">{subValue}</div>
      )}
    </div>
  )
}