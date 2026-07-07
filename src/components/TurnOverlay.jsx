import { ArrowRight, CalendarDays, ClipboardCheck, CloudLightning, Coins, Leaf, MessageCircle, Sparkles } from 'lucide-react'
import { metricLabels } from '../data/policies.js'

function DeltaChart({ deltas }) {
  const entries = Object.entries(deltas).filter(([, value]) => value !== 0)
  const max = Math.max(1, ...entries.map(([, value]) => Math.abs(value)))
  return (
    <div className="delta-chart" aria-label="연간 지표 변화 그래프">
      {entries.map(([key, value], index) => {
        const positiveOutcome = key === 'endangered' ? value < 0 : value > 0
        return (
          <div className="delta-row" key={key} style={{ '--delay': `${index * 90}ms` }}>
            <span className="delta-label">{metricLabels[key]}</span>
            <div className="delta-track">
              <i className="delta-zero" />
              <b
                className={`${value >= 0 ? 'delta-right' : 'delta-left'} ${positiveOutcome ? 'delta-benefit' : 'delta-loss'}`}
                style={{ '--bar-size': `${Math.max(8, Math.abs(value) / max * 50)}%` }}
              />
            </div>
            <strong className={positiveOutcome ? 'delta-good-text' : 'delta-bad-text'}>{value > 0 ? '+' : ''}{value}</strong>
          </div>
        )
      })}
    </div>
  )
}

export default function TurnOverlay({ phase, turn, onResume }) {
  if (phase === 'idle' || !turn) return null

  const isGood = turn.event.type === 'positive'
  const satisfactionChange = turn.deltas.satisfaction || 0
  const biodiversityChange = turn.deltas.biodiversity || 0
  const reactions = [
    {
      group: '지역 시민',
      tone: satisfactionChange >= 0 ? 'support' : 'concern',
      quote: satisfactionChange >= 5
        ? '우리 의견이 반영되는 것 같아 다음 사업도 기대돼요.'
        : satisfactionChange < 0
          ? '복원은 필요하지만 생활 불편에 대한 설명도 듣고 싶어요.'
          : '눈에 띄는 변화는 아직이지만 조금 더 지켜볼게요.',
    },
    {
      group: '환경단체',
      tone: biodiversityChange > 0 ? 'support' : 'concern',
      quote: biodiversityChange > 0
        ? `생물다양성 ${biodiversityChange > 0 ? '+' : ''}${biodiversityChange}, 생태적 효과가 분명하게 나타났습니다.`
        : '단기적인 편의보다 서식지 회복을 우선해야 합니다.',
    },
    {
      group: turn.policy.id === 'local-market' ? '지역 상인회' : '현장 관리팀',
      tone: isGood ? 'support' : 'neutral',
      quote: isGood
        ? '이번 변화가 주민 참여와 지역 활력으로 이어질 수 있겠어요.'
        : `‘${turn.event.name}’에 대응하려면 내년 관리 계획을 더 촘촘히 세워야 합니다.`,
    },
  ]
  const renderChanges = (changes) => Object.entries(changes)
    .filter(([, value]) => value !== 0)
    .map(([key, value]) => (
      <span key={key} className={value > 0 || key === 'endangered' && value < 0 ? 'change-good' : 'change-bad'}>
        {metricLabels[key]} {value > 0 ? '+' : ''}{value}
      </span>
    ))
  return (
    <div className={`turn-overlay phase-${phase}`} role="status" aria-live="polite">
      <div className="turn-stage">
        {phase === 'policy' && (
          <div className="played-card">
            <span className="card-seal"><Leaf size={24} /></span>
            <small>{turn.policy.id === 'skip' ? '전략적 휴식' : `${turn.year}년 정책`}</small>
            <h2>{turn.policy.name}</h2>
            <p>{turn.policy.cost ? `${turn.policy.cost}억 투자` : '예산을 비축합니다'}</p>
          </div>
        )}
        {phase === 'budget' && (
          <div className="token-burst">
            <Coins size={34} /><strong>{turn.policy.cost ? `-${turn.policy.cost}억` : '지출 없음'}</strong>
            <span>연말 지원금 +10억</span>
          </div>
        )}
        {phase === 'changes' && (
          <div className="change-board">
            <Sparkles size={28} /><h2>생태계 변화</h2>
            <div>{Object.entries(turn.deltas).filter(([, value]) => value !== 0).map(([key, value]) => (
              <span key={key} className={value > 0 || key === 'endangered' && value < 0 ? 'change-good' : 'change-bad'}>
                {metricLabels[key]} {value > 0 ? '+' : ''}{value}
              </span>
            ))}</div>
          </div>
        )}
        {phase === 'event' && (
          <div className="year-end-report">
            <header><span><ClipboardCheck size={22} /></span><div><small>YEAR {String(turn.year).padStart(2, '0')} COMPLETE</small><h2>{turn.year}년 연말 보고</h2></div></header>
            <div className="report-grid">
              <section className="report-section policy-report">
                <div className="report-title"><Leaf size={18} /><span>실행 정책</span></div>
                <strong>{turn.policy.name}</strong>
                <div className="report-changes">{renderChanges(turn.policyDeltas)}</div>
                {Object.values(turn.policyDeltas).every((value) => value === 0) && <p>정책 효과 없이 예산을 비축했습니다.</p>}
              </section>
              <section className={`report-section event-report ${isGood ? 'positive' : 'negative'}`}>
                <div className="report-title"><CloudLightning size={18} /><span>발생 이벤트</span></div>
                <strong>{turn.event.name}</strong><p>{turn.event.description}</p>
                <div className="report-changes">{renderChanges(turn.eventDeltas)}</div>
              </section>
            </div>
            <section className="report-total">
              <div className="report-chart-wrap"><span>연간 최종 변화</span><DeltaChart deltas={turn.deltas} /></div>
              <div className="report-budget"><Coins size={18} /><span>예산 결산</span><strong>{turn.policy.cost ? `-${turn.policy.cost}억 + 지원금 10억` : '지원금 +10억'}</strong></div>
            </section>
            <section className="reaction-panel">
              <div className="reaction-heading"><MessageCircle size={16} /><strong>현장 반응</strong><span>STAKEHOLDER VOICES</span></div>
              <div className="reaction-list">{reactions.map((reaction) => (
                <article key={reaction.group} className={`reaction-bubble reaction-${reaction.tone}`}>
                  <span>{reaction.group}</span><blockquote>“{reaction.quote}”</blockquote>
                </article>
              ))}</div>
            </section>
            <button type="button" className="event-continue" onClick={onResume}>보고서 닫고 다음 연도로 <ArrowRight size={17} /></button>
          </div>
        )}
        {phase === 'year' && (
          <div className="year-banner"><CalendarDays size={30} /><small>NEXT ROUND</small><strong>{turn.year === 10 ? '최종 평가' : `${turn.year + 1}년 차`}</strong></div>
        )}
      </div>
    </div>
  )
}
