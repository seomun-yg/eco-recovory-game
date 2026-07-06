import { AlertTriangle, CheckCircle2, Sprout } from 'lucide-react'
import { calculateHealth, ECOSYSTEMS } from '../utils/gameLogic.js'

const sceneNames = { forest: '산림 생태 전경', wetland: '습지 생태 전경', river: '하천 생태 전경' }

function getCondition(metrics) {
  const health = calculateHealth(metrics)
  if (health >= 75) return { level: 'healthy', label: '건강하게 회복 중', note: '생태계의 자생력이 뚜렷하게 돌아오고 있습니다.' }
  if (health >= 55) return { level: 'recovering', label: '회복 기반 형성 중', note: '긍정적인 변화가 보이지만 꾸준한 관리가 필요합니다.' }
  return { level: 'fragile', label: '집중 관리 필요', note: '생태계 회복력이 낮아 우선순위 정책이 필요합니다.' }
}

// 외부 이미지 없이 지표에 따라 색상과 생물의 수가 변하는 작은 생태 풍경입니다.
function EcosystemScene({ ecosystem, metrics, condition }) {
  const wildlifeCount = Math.max(1, Math.round(metrics.biodiversity / 20))
  const treeOpacity = 0.35 + metrics.carbon / 155
  const waterOpacity = 0.35 + metrics.water / 155

  return (
    <svg viewBox="0 0 760 240" role="img" aria-label={`${sceneNames[ecosystem]}, 현재 상태 ${condition.label}`} className="ecosystem-scene">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor={condition.level === 'fragile' ? '#d9d6c5' : '#cceadf'} /><stop offset="1" stopColor="#f5f7df" /></linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#38bdf8" /><stop offset="1" stopColor="#0ea5e9" /></linearGradient>
      </defs>
      <rect width="760" height="240" rx="24" fill="url(#sky)" />
      <circle cx="650" cy="48" r="25" fill="#facc15" opacity=".75" />
      <path d="M0 168 Q115 92 225 158 T445 145 T760 145 V240 H0Z" fill="#6b8f62" opacity={treeOpacity} />
      <path d="M0 188 Q120 144 245 180 T490 171 T760 179 V240 H0Z" fill="#3f6f4d" opacity={treeOpacity} />

      {ecosystem === 'forest' && (
        <g fill="#164e3a">
          {[85, 145, 215, 520, 590, 680].map((x, index) => <g key={x} opacity={treeOpacity}><rect x={x - 4} y={120 + index % 2 * 10} width="8" height="74" fill="#6b4f32" /><path d={`M${x} ${62 + index % 2 * 10} L${x - 34} 142 L${x + 34} 142Z`} /><path d={`M${x} ${88 + index % 2 * 8} L${x - 27} 158 L${x + 27} 158Z`} /></g>)}
        </g>
      )}
      {ecosystem === 'wetland' && (
        <g><ellipse cx="390" cy="196" rx="280" ry="35" fill="url(#water)" opacity={waterOpacity} />{[115, 152, 620, 655].map((x) => <g key={x} stroke="#4d7c0f" strokeWidth="4"><path d={`M${x} 205 Q${x - 4} 160 ${x + 3} 130`} /><path d={`M${x + 8} 205 Q${x + 15} 168 ${x + 12} 145`} /></g>)}</g>
      )}
      {ecosystem === 'river' && <path d="M760 164 C620 142 545 214 385 183 C255 157 165 214 0 189 V240 H760Z" fill="url(#water)" opacity={waterOpacity} />}

      {Array.from({ length: wildlifeCount }).map((_, index) => (
        <path key={index} d={`M${285 + index * 42} ${64 + (index % 2) * 18} q8 -8 16 0 q8 -8 16 0`} fill="none" stroke="#14532d" strokeWidth="3" strokeLinecap="round" opacity=".75" />
      ))}
      {metrics.endangered <= 10 && <g transform="translate(485 142)" fill="#f8fafc"><ellipse cx="0" cy="0" rx="13" ry="7" /><circle cx="12" cy="-5" r="5" /><path d="M16 -5 l9 3 -9 3Z" fill="#f59e0b" /></g>}
      <path d="M0 215 Q170 194 330 218 T760 207 V240 H0Z" fill="#254f36" opacity=".9" />
    </svg>
  )
}

export default function EnvironmentVisual({ ecosystem, metrics, year }) {
  const health = calculateHealth(metrics)
  const condition = getCondition(metrics)
  const Icon = condition.level === 'fragile' ? AlertTriangle : condition.level === 'healthy' ? CheckCircle2 : Sprout
  const circumference = 2 * Math.PI * 32

  return (
    <section className={`environment-visual env-${condition.level}`}>
      <div className="environment-copy">
        <span className="eyebrow">LIVE ECOSYSTEM · YEAR {String(year).padStart(2, '0')}</span>
        <h2 className="font-display">현재 {ECOSYSTEMS[ecosystem].name}의 모습</h2>
        <div className="condition-label"><Icon size={17} /><strong>{condition.label}</strong></div>
        <p>{condition.note}</p>
        <div className="environment-signals">
          <span><i className={metrics.water >= 60 ? 'good' : 'warn'} />수질 {metrics.water >= 60 ? '안정' : '관찰 필요'}</span>
          <span><i className={metrics.biodiversity >= 70 ? 'good' : 'warn'} />서식지 {metrics.biodiversity >= 70 ? '활발' : '회복 중'}</span>
          <span><i className={metrics.endangered < 12 ? 'good' : 'warn'} />위기종 {metrics.endangered < 12 ? '감소' : '주의'}</span>
        </div>
      </div>
      <div className="scene-wrap"><EcosystemScene ecosystem={ecosystem} metrics={metrics} condition={condition} /></div>
      <div className="health-ring" aria-label={`생태계 건강 점수 ${health}점`}>
        <svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="32" /><circle className="ring-value" cx="40" cy="40" r="32" style={{ strokeDasharray: circumference, strokeDashoffset: circumference * (1 - health / 100) }} /></svg>
        <div><strong>{health}</strong><span>건강 점수</span></div>
      </div>
    </section>
  )
}
