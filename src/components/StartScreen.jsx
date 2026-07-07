import { ArrowRight, Droplets, Leaf, Mountain, Sparkles } from 'lucide-react'
import { DIFFICULTIES, ECOSYSTEMS } from '../utils/gameLogic.js'

const ecosystemIcons = { forest: Mountain, wetland: Leaf, river: Droplets }

export default function StartScreen({ ecosystem, difficulty, onEcosystemChange, onDifficultyChange, onStart }) {
  return (
    <main className="start-shell min-h-screen px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-center gap-3 text-white/80">
          <span className="grid size-10 place-items-center rounded-full bg-lime-300 text-emerald-950">
            <Leaf size={20} />
          </span>
          <span className="text-sm font-bold tracking-[0.2em]">ECO RESTORE LAB</span>
        </header>

        <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="text-white">
            <p className="mb-5 flex items-center gap-2 text-sm font-semibold text-lime-300">
              <Sparkles size={16} /> 10년의 선택, 되살아나는 자연
            </p>
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
              생태계 복원<br /><span className="text-lime-300">프로젝트</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-emerald-50/70 sm:text-lg">
              제한된 예산과 예측할 수 없는 자연 앞에서, 당신의 정책은 어떤 미래를 만들까요?
              생태계 관리자가 되어 훼손된 터전에 다시 생명을 불어넣으세요.
            </p>
            <div className="mt-9 grid max-w-lg grid-cols-3 gap-3 border-t border-white/10 pt-6">
              {[['10년', '프로젝트 기간'], ['100점', '생태 지표'], ['∞', '가능한 전략']].map(([value, label]) => (
                <div key={label}>
                  <strong className="font-display text-2xl text-white">{value}</strong>
                  <p className="mt-1 text-xs text-emerald-100/50">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/20 bg-white p-6 shadow-2xl shadow-emerald-950/30 sm:p-8">
            <div className="mb-7">
              <span className="eyebrow">STEP 01</span>
              <h2 className="font-display mt-2 text-2xl font-bold text-slate-900">복원할 생태계를 선택하세요</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(ECOSYSTEMS).map(([id, item]) => {
                const Icon = ecosystemIcons[id]
                const selected = ecosystem === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onEcosystemChange(id)}
                    className={`choice-card ${selected ? 'choice-card-selected' : ''}`}
                    aria-pressed={selected}
                  >
                    <Icon className={selected ? 'text-emerald-800' : 'text-slate-400'} size={25} />
                    <strong>{item.name}</strong>
                    <span>{item.subtitle.split(' ')[0]}</span>
                  </button>
                )
              })}
            </div>

            <div className="mb-4 mt-8">
              <span className="eyebrow">STEP 02</span>
              <h2 className="font-display mt-2 text-xl font-bold text-slate-900">난이도를 선택하세요</h2>
            </div>
            <div className="space-y-2">
              {Object.entries(DIFFICULTIES).map(([id, item]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onDifficultyChange(id)}
                  className={`difficulty-row ${difficulty === id ? 'difficulty-row-selected' : ''}`}
                  aria-pressed={difficulty === id}
                >
                  <span className="radio-dot" />
                  <strong>{item.name}</strong>
                  <span>{item.description}</span>
                  <b>{item.budget}억</b>
                </button>
              ))}
            </div>

            <button type="button" onClick={onStart} className="primary-button mt-7 w-full">
              프로젝트 시작하기 <ArrowRight size={19} />
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
