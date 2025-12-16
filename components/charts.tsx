"use client"

interface ChartData {
  date?: string
  month?: string
  value: number
}

interface PieData {
  name: string
  value: number
  color: string
}

interface LineChartProps {
  data?: ChartData[]
}

interface BarChartProps {
  data?: ChartData[]
}

interface PieChartProps {
  data?: PieData[]
}

export function LineChart({ data }: LineChartProps) {
  const chartData = data || [
    { date: "Lun", value: 65 },
    { date: "Mar", value: 45 },
    { date: "Mer", value: 78 },
    { date: "Jeu", value: 55 },
    { date: "Ven", value: 88 },
    { date: "Sam", value: 72 },
    { date: "Dim", value: 90 },
  ]

  const maxValue = Math.max(...chartData.map((d) => d.value))

  return (
    <div className="glass rounded-xl border border-border/40 p-5 md:p-6">
      <h3 className="text-lg font-bold mb-6">Tendance Valeur Inventaire</h3>
      <div className="w-full h-64 flex items-end justify-between gap-1">
        {chartData.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-gradient-to-t from-primary to-accent rounded-t opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              style={{ height: `${(item.value / maxValue) * 100}%` }}
              title={`${item.date}: ${item.value.toLocaleString("fr-FR")}€`}
            />
            <span className="text-xs text-muted-foreground">{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BarChart({ data }: BarChartProps) {
  const chartData = data || [
    { month: "Jan", value: 120 },
    { month: "Fév", value: 150 },
    { month: "Mar", value: 100 },
    { month: "Avr", value: 180 },
    { month: "Mai", value: 140 },
    { month: "Juin", value: 200 },
  ]

  const maxValue = Math.max(...chartData.map((d) => d.value))

  return (
    <div className="glass rounded-xl border border-border/40 p-5 md:p-6">
      <h3 className="text-lg font-bold mb-6">Mouvements Stock Mensuels</h3>
      <div className="flex items-end justify-between gap-2 h-64">
        {chartData.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-gradient-to-t from-accent to-primary rounded opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              style={{ height: `${(item.value / maxValue) * 100}%` }}
              title={`${item.month}: ${item.value} mouvements`}
            />
            <span className="text-xs text-muted-foreground">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PieChart({ data }: PieChartProps) {
  const chartData = data || [
    { name: "Électronique", value: 25, color: "#3b82f6" },
    { name: "Accessoires", value: 15, color: "#8b5cf6" },
    { name: "Bureau", value: 30, color: "#f59e0b" },
    { name: "Câbles", value: 30, color: "#10b981" },
  ]

  // Calculate pie segments
  let currentOffset = 0
  const segments = chartData.map((item) => {
    const segment = {
      ...item,
      offset: currentOffset,
      dashArray: `${item.value} ${100 - item.value}`,
    }
    currentOffset -= item.value
    return segment
  })

  return (
    <div className="glass rounded-xl border border-border/40 p-5 md:p-6">
      <h3 className="text-lg font-bold mb-6">Mix Produits</h3>
      <div className="flex items-center justify-center h-64 relative">
        <svg viewBox="0 0 100 100" className="w-full h-full max-w-xs transform -rotate-90">
          {segments.map((segment, i) => (
            <circle
              key={i}
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={segment.color}
              strokeWidth="20"
              strokeDasharray={`${segment.value * 2.51} ${251.3 - segment.value * 2.51}`}
              strokeDashoffset={segment.offset * 2.51}
              opacity="0.8"
              className="hover:opacity-100 transition-opacity cursor-pointer"
            />
          ))}
        </svg>
        <div className="absolute text-center">
          <p className="text-2xl font-bold">{chartData.length}</p>
          <p className="text-xs text-muted-foreground">Catégories</p>
        </div>
      </div>
      <div className="mt-6 space-y-2">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm flex-1">{item.name}</span>
            <span className="text-sm font-medium">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
