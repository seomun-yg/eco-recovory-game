import { ArrowDown, ArrowUp, Check, Leaf, RotateCcw, Trophy, X } from 'lucide-react'
import { metricLabels } from '../data/policies.js'
import { ECOSYSTEMS } from '../utils/gameLogic.js'

const metricKeys = ['biodiversity', 'carbon', 'water', 'satisfaction', 'endangered']

export default function FinalReport({ ecosystem, initialMetrics, metrics, result, policyHistory, eventHistory, report, onReset }) {
  return (
    <main className="result-shell min-h-screen px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between text-white">
          <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-lime-300 text-emerald-950"><Leaf size={20} /></span><strong className="font-display">생태계 복원 프로젝트</strong></div>
          <span className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/60">최종 보고서</span>
        </header>

        <section className="result-hero">
          <div className={`result-emblem ${result.success ? 'success' : 'failure'}`}>{result.success ? <Trophy size={34} /> : <Leaf size={34} />}</div>
          <span className="eyebrow">10-YEAR PROJECT COMPLETE</span>
          <h1 className="font-display mt-3 text-4xl font-bold text-slate-950 sm:text-5xl">{result.success ? '복원에 성공했습니다!' : '회복의 씨앗을 남겼습니다'}</h1>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-500">
            {result.success ? `${ECOSYSTEMS[ecosystem].name} 생태계가 다시 스스로 회복할 힘을 얻었습니다.` : '모든 목표에는 닿지 못했지만, 10년의 노력은 다음 복원을 위한 소중한 기반이 되었습니다.'}
          </p>
          <div className="mx-auto mt-6 flex max-w-sm items-center justify-center gap-5 rounded-2xl bg-emerald-950 px-6 py-4 text-white">
            <div><span className="text-xs text-white/50">최종 건강 점수</span><strong className="font-display block text-3xl text-lime-300">{result.health}</strong></div>
            <div className="h-10 w-px bg-white/15" />
            <div className="text-left text-xs leading-6 text-white/70"><p>생물다양성 {result.checks.biodiversity ? '달성' : '미달'}</p><p>위기종 감소 {result.checks.endangered ? '달성' : '미달'}</p></div>
          </div>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-5">
          {metricKeys.map((key) => {
            const delta = metrics[key] - initialMetrics[key]
            const good = key === 'endangered' ? delta < 0 : delta > 0
            return <article key={key} className="result-metric"><span>{metricLabels[key]}</span><strong>{metrics[key]}{key === 'endangered' ? '종' : ''}</strong><small className={delta === 0 ? 'neutral' : good ? 'positive' : 'negative'}>{delta > 0 ? <ArrowUp size={12} /> : delta < 0 ? <ArrowDown size={12} /> : null}{delta > 0 ? '+' : ''}{delta}</small></article>
          })}
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="panel">
            <div className="panel-heading"><div><span className="eyebrow">AI STRATEGY REVIEW</span><h2>당신의 복원 전략 평가</h2></div></div>
            <p className="rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">{report.summary}</p>
            <div className="mt-4 space-y-3">
              <div className="review-row"><Check size={18} /><div><span>전략 유형</span><strong>{report.style}</strong></div></div>
              <div className="review-row"><Check size={18} /><div><span>가장 큰 성과</span><strong>{report.strength}</strong></div></div>
              <div className="review-row review-warn"><X size={18} /><div><span>다음 도전 과제</span><strong>{report.improvement}</strong></div></div>
            </div>
          </section>
          <section className="panel">
            <div className="panel-heading"><div><span className="eyebrow">10 YEARS IN REVIEW</span><h2>프로젝트 연대기</h2></div></div>
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {policyHistory.map((item, index) => <div key={item.year} className="final-history"><span>{item.year}년</span><div><strong>{item.policy.name}</strong><p>{eventHistory[index]?.event.name}</p></div></div>)}
            </div>
          </section>
        </div>
        <button type="button" onClick={onReset} className="primary-button mx-auto mt-8"><RotateCcw size={18} /> 다시 시작하기</button>
      </div>
    </main>
  )
}
