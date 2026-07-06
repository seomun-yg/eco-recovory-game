import { ArrowRight, CalendarDays, Coins, Leaf, RotateCcw, SkipForward } from 'lucide-react'
import { policies } from '../data/policies.js'
import { calculateHealth, DIFFICULTIES, ECOSYSTEMS } from '../utils/gameLogic.js'
import AIReport from './AIReport.jsx'
import EventLog from './EventLog.jsx'
import EnvironmentVisual from './EnvironmentVisual.jsx'
import PolicyCard from './PolicyCard.jsx'
import StatusCards from './StatusCards.jsx'

export default function GameDashboard({
  year, budget, metrics, ecosystem, difficulty, selectedPolicy,
  policyHistory, eventHistory, analysis, executing, onSelectPolicy, onExecute, onSkip, onReset,
}) {
  const progress = ((year - 1) / 10) * 100
  const affordable = policies.some((policy) => policy.cost <= budget)

  return (
    <main className="min-h-screen bg-[#f4f6f1]">
      <header className="game-header">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-lime-300 text-emerald-950"><Leaf size={18} /></span>
            <div><strong className="font-display block text-white">생태계 복원 프로젝트</strong><span className="text-xs text-emerald-100/50">{ECOSYSTEMS[ecosystem].name} · {DIFFICULTIES[difficulty].name}</span></div>
          </div>
          <button type="button" className="ghost-button" onClick={onReset}><RotateCcw size={15} /> 처음부터</button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 sm:py-8">
        <section className="mb-5 grid items-center gap-4 rounded-2xl bg-white p-5 shadow-sm sm:grid-cols-[1fr_auto_auto]">
          <div>
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-2"><CalendarDays size={18} className="text-emerald-700" /><strong className="font-display text-xl">{year}년 차</strong><span className="text-sm text-slate-400">/ 10년</span></div>
              <span className="text-xs font-semibold text-emerald-700 sm:hidden">{Math.round(progress)}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${progress}%` }} /></div>
          </div>
          <div className="stat-pill"><Coins size={20} /><div><span>남은 예산 · 매년 +10억</span><strong>{budget}억</strong></div></div>
          <div className="stat-pill stat-pill-dark"><Leaf size={20} /><div><span>건강 점수</span><strong>{calculateHealth(metrics)}점</strong></div></div>
        </section>

        <StatusCards metrics={metrics} />

        <div className="top-overview">
          <EnvironmentVisual ecosystem={ecosystem} metrics={metrics} year={year} />
          <aside className="overview-feed">
            <AIReport analysis={analysis} />
            <EventLog events={eventHistory} />
            <section className="panel compact-panel">
              <div className="panel-heading"><div><span className="eyebrow">HISTORY</span><h2>정책 기록</h2></div><span className="count-badge">{policyHistory.length}</span></div>
              {policyHistory.length === 0 ? <p className="text-sm text-slate-400">아직 실행한 정책이 없습니다.</p> : (
                <ol className="space-y-2">
                  {[...policyHistory].reverse().slice(0, 3).map((item) => <li key={item.year} className="history-row"><span>{item.year}</span><strong>{item.policy.name}</strong><b>{item.policy.cost ? `-${item.policy.cost}억 · +10억` : '+10억'}</b></li>)}
                </ol>
              )}
            </section>
          </aside>
        </div>

        <div className="mt-5">
          <section className="panel">
            <div className="panel-heading">
              <div><span className="eyebrow">YEAR {String(year).padStart(2, '0')}</span><h2>올해의 복원 정책을 선택하세요</h2></div>
              <p className="hidden text-xs text-slate-400 sm:block">정책은 매년 한 번 실행됩니다</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {policies.map((policy) => (
                <PolicyCard
                  key={policy.id}
                  policy={policy}
                  ecosystem={ecosystem}
                  selected={selectedPolicy?.id === policy.id}
                  disabled={policy.cost > budget || executing}
                  onSelect={onSelectPolicy}
                />
              ))}
            </div>

            {!affordable && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">현재 실행 가능한 정책이 없습니다. 올해를 건너뛰면 지원금 10억을 확보할 수 있습니다.</p>}
            <div className="mt-5 flex flex-col items-stretch justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
              <div className="text-sm text-slate-500">
                {selectedPolicy ? <><strong className="text-slate-900">{selectedPolicy.name}</strong> 선택 · 연말 지원금 반영 후 {budget - selectedPolicy.cost + 10}억</> : '정책을 선택하거나 올해를 건너뛸 수 있습니다.'}
              </div>
              <div className="year-actions">
                <button type="button" className="skip-button" onClick={onSkip} disabled={executing}>
                  <SkipForward size={17} /> 정책 건너뛰기
                </button>
                <button type="button" className="primary-button min-w-40" onClick={onExecute} disabled={!selectedPolicy || executing || !affordable}>
                  {executing ? '변화 분석 중…' : year === 10 ? '마지막 해 실행' : '올해 실행'} <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  )
}
