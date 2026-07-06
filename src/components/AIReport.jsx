import { Bot, Sparkles } from 'lucide-react'

export default function AIReport({ analysis }) {
  return (
    <section className="ai-panel">
      <div className="flex items-center gap-2 text-emerald-300">
        <Bot size={19} /><span className="text-xs font-bold tracking-widest">AI ECOLOGIST</span>
      </div>
      <div className="mt-3 flex gap-3">
        <Sparkles className="mt-0.5 shrink-0 text-lime-300" size={18} />
        <p className="text-sm leading-6 text-emerald-50/80">
          {analysis || '정책 실행 후 생태 변화에 대한 간단한 분석을 제공합니다.'}
        </p>
      </div>
    </section>
  )
}
