import { Bird, CloudSun, Droplets, HeartHandshake, ShieldAlert } from 'lucide-react'

const cards = [
  { key: 'biodiversity', label: '생물다양성', icon: Bird, color: 'emerald', suffix: '' },
  { key: 'carbon', label: '탄소흡수', icon: CloudSun, color: 'sky', suffix: '' },
  { key: 'water', label: '수질', icon: Droplets, color: 'blue', suffix: '' },
  { key: 'satisfaction', label: '시민 만족도', icon: HeartHandshake, color: 'amber', suffix: '' },
  { key: 'endangered', label: '멸종위기종', icon: ShieldAlert, color: 'rose', suffix: '종' },
]

export default function StatusCards({ metrics }) {
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {cards.map(({ key, label, icon: Icon, color, suffix }) => {
        const inverse = key === 'endangered'
        const level = inverse ? Math.max(0, 100 - metrics[key] * 5) : metrics[key]
        return (
          <article key={key} className="metric-card">
            <div className={`metric-icon metric-${color}`}><Icon size={20} /></div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-500">{label}</p>
              <strong className="font-display text-2xl text-slate-900">{metrics[key]}<small>{suffix}</small></strong>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full bar-${color}`} style={{ width: `${level}%` }} />
              </div>
            </div>
          </article>
        )
      })}
    </section>
  )
}
