import { BugOff, Leaf, Megaphone, Route, ShieldCheck, Trees, Waves } from 'lucide-react'
import { metricLabels } from '../data/policies.js'
import { getPolicyEffects } from '../utils/gameLogic.js'

export default function PolicyCard({ policy, ecosystem, selected, disabled, onSelect }) {
  // 필요한 아이콘만 명시적으로 연결해 최종 번들 크기를 작게 유지합니다.
  const iconMap = { BugOff, Megaphone, Route, ShieldCheck, Trees, Waves }
  const Icon = iconMap[policy.icon] || Leaf
  const effects = getPolicyEffects(policy, ecosystem)
  const suitable = policy.suitableFor.includes(ecosystem)

  return (
    <button
      type="button"
      onClick={() => onSelect(policy)}
      disabled={disabled}
      aria-pressed={selected}
      className={`policy-card ${selected ? 'policy-card-selected' : ''} ${disabled ? 'policy-card-disabled' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="policy-icon"><Icon size={23} /></span>
        <span className="cost-chip">{policy.cost}억</span>
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-lg font-bold text-slate-900">{policy.name}</h3>
          {suitable && <span className="bonus-chip">효과 +20%</span>}
        </div>
        <p className="mt-1.5 min-h-10 text-left text-xs leading-5 text-slate-500">{policy.description}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {Object.entries(effects).map(([key, value]) => (
          <span key={key} className={`effect-chip ${value > 0 || key === 'endangered' && value < 0 ? 'effect-good' : 'effect-bad'}`}>
            {metricLabels[key]} {value > 0 ? '+' : ''}{value}
          </span>
        ))}
      </div>
    </button>
  )
}
