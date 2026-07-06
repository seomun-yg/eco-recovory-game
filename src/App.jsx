import { useState } from 'react'
import FinalReport from './components/FinalReport.jsx'
import GameDashboard from './components/GameDashboard.jsx'
import StartScreen from './components/StartScreen.jsx'
import { applyEffects, applyPolicy, calculateHealth, createInitialMetrics, DIFFICULTIES, drawEvent, getFinalResult } from './utils/gameLogic.js'
import { createFinalAnalysis, createYearAnalysis } from './utils/mockAIReport.js'

export default function App() {
  const [screen, setScreen] = useState('start')
  const [ecosystem, setEcosystem] = useState('forest')
  const [difficulty, setDifficulty] = useState('normal')
  const [year, setYear] = useState(1)
  const [budget, setBudget] = useState(DIFFICULTIES.normal.budget)
  const [metrics, setMetrics] = useState(createInitialMetrics('forest'))
  const [initialMetrics, setInitialMetrics] = useState(createInitialMetrics('forest'))
  const [initialHealth, setInitialHealth] = useState(calculateHealth(createInitialMetrics('forest')))
  const [selectedPolicy, setSelectedPolicy] = useState(null)
  const [policyHistory, setPolicyHistory] = useState([])
  const [eventHistory, setEventHistory] = useState([])
  const [analysis, setAnalysis] = useState('')
  const [finalData, setFinalData] = useState(null)
  const [executing, setExecuting] = useState(false)

  const startGame = () => {
    const startingMetrics = createInitialMetrics(ecosystem)
    setYear(1)
    setBudget(DIFFICULTIES[difficulty].budget)
    setMetrics(startingMetrics)
    setInitialMetrics(startingMetrics)
    setInitialHealth(calculateHealth(startingMetrics))
    setSelectedPolicy(null)
    setPolicyHistory([])
    setEventHistory([])
    setAnalysis('')
    setFinalData(null)
    setScreen('game')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const advanceYear = (policy) => {
    if (policy && policy.cost > budget || executing) return
    setExecuting(true)

    const playedPolicy = policy || {
      id: 'skip',
      name: '정책 건너뛰기',
      cost: 0,
      effects: {},
      suitableFor: [],
    }
    const afterPolicy = policy ? applyPolicy(metrics, policy, ecosystem) : metrics
    const event = drawEvent(DIFFICULTIES[difficulty].negativeChance)
    const afterEvent = applyEffects(afterPolicy, event.effects)
    const nextPolicies = [...policyHistory, { year, policy: playedPolicy }]
    const nextEvents = [...eventHistory, { year, event }]
    const yearAnalysis = createYearAnalysis(metrics, afterEvent, playedPolicy, event)

    // 정책 비용을 지불한 뒤 매년 운영 지원금 10억을 회복합니다.
    setBudget((current) => Math.max(0, current - playedPolicy.cost) + 10)
    setMetrics(afterEvent)
    setPolicyHistory(nextPolicies)
    setEventHistory(nextEvents)
    setAnalysis(yearAnalysis)
    setSelectedPolicy(null)

    // 짧은 지연은 버튼 연타를 막고 결과가 갱신되는 느낌을 줍니다.
    window.setTimeout(() => {
      // 다음 연도 또는 최종 결과가 항상 페이지 최상단에서 시작되게 합니다.
      window.scrollTo({ top: 0, behavior: 'smooth' })
      if (year === 10) {
        setFinalData({
          result: getFinalResult(afterEvent, initialHealth),
          report: createFinalAnalysis(initialMetrics, afterEvent, nextPolicies),
        })
        setScreen('final')
      } else {
        setYear((current) => current + 1)
      }
      setExecuting(false)
    }, 350)
  }

  const executeYear = () => {
    if (!selectedPolicy) return
    advanceYear(selectedPolicy)
  }

  const skipYear = () => advanceYear(null)

  const resetGame = () => {
    setScreen('start')
    setExecuting(false)
    setFinalData(null)
  }

  if (screen === 'start') {
    return <StartScreen ecosystem={ecosystem} difficulty={difficulty} onEcosystemChange={setEcosystem} onDifficultyChange={setDifficulty} onStart={startGame} />
  }

  if (screen === 'final' && finalData) {
    return <FinalReport ecosystem={ecosystem} initialMetrics={initialMetrics} metrics={metrics} result={finalData.result} report={finalData.report} policyHistory={policyHistory} eventHistory={eventHistory} onReset={resetGame} />
  }

  return <GameDashboard year={year} budget={budget} metrics={metrics} ecosystem={ecosystem} difficulty={difficulty} selectedPolicy={selectedPolicy} policyHistory={policyHistory} eventHistory={eventHistory} analysis={analysis} executing={executing} onSelectPolicy={setSelectedPolicy} onExecute={executeYear} onSkip={skipYear} onReset={resetGame} />
}
