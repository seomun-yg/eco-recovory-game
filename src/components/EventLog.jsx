import { CloudLightning, Sparkles } from 'lucide-react'

export default function EventLog({ events }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div><span className="eyebrow">TIMELINE</span><h2>최근 발생 이벤트</h2></div>
        <CloudLightning size={22} className="text-slate-400" />
      </div>
      {events.length === 0 ? (
        <div className="empty-state"><Sparkles size={22} /><p>첫 정책을 실행하면<br />자연의 응답이 기록됩니다.</p></div>
      ) : (
        <div className="space-y-3">
          {[...events].reverse().slice(0, 4).map((item) => (
            <article key={item.year} className={`event-item event-${item.event.type}`}>
              <span>{item.year}년</span>
              <div><strong>{item.event.name}</strong><p>{item.event.description}</p></div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
