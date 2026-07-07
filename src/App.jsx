import { useState } from 'react'
import FinalReport from './components/FinalReport.jsx'
import GameDashboard from './components/GameDashboard.jsx'
import StartScreen from './components/StartScreen.jsx'
import TurnOverlay from './components/TurnOverlay.jsx'
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
  const [animationPhase, setAnimationPhase] = useState('idle')
  const [lastTurn, setLastTurn] = useState(null)

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
    setAnimationPhase('idle')
    setLastTurn(null)
    setScreen('game')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const advanceYear = (policy) => {
    if ((policy && policy.cost > budget) || executing) return
    setExecuting(true)

    const playedPolicy = policy || {
      id: 'skip',
      name: '정책 건너뛰기',
      cost: 0,
      effects: {},
      suitableFor: [],
    }
    const afterPolicy = policy ? applyPolicy(metrics, policy, ecosystem, year) : metrics
    const event = drawEvent(DIFFICULTIES[difficulty].negativeChance)
    const afterEvent = applyEffects(afterPolicy, event.effects)
    const nextPolicies = [...policyHistory, { year, policy: playedPolicy }]
    const nextEvents = [...eventHistory, { year, event }]
    const yearAnalysis = createYearAnalysis(metrics, afterEvent, playedPolicy, event)
    const deltas = Object.fromEntries(Object.keys(afterEvent).map((key) => [key, afterEvent[key] - metrics[key]]))
    const policyDeltas = Object.fromEntries(Object.keys(afterPolicy).map((key) => [key, afterPolicy[key] - metrics[key]]))
    const eventDeltas = Object.fromEntries(Object.keys(afterEvent).map((key) => [key, afterEvent[key] - afterPolicy[key]]))

    setLastTurn({
      year,
      policy: playedPolicy,
      event,
      deltas,
      policyDeltas,
      eventDeltas,
      outcome: { afterEvent, nextPolicies, nextEvents, yearAnalysis },
    })
    setAnimationPhase('policy')

    window.setTimeout(() => {
      setBudget((current) => Math.max(0, current - playedPolicy.cost) + 10)
      setAnimationPhase('budget')
    }, 220)
    window.setTimeout(() => {
      setMetrics(afterEvent)
      setAnimationPhase('changes')
    }, 470)
    window.setTimeout(() => {
      setPolicyHistory(nextPolicies)
      setEventHistory(nextEvents)
      setAnalysis(yearAnalysis)
      setAnimationPhase('event')
    }, 720)
  }

  const resumeAfterEvent = () => {
    if (animationPhase !== 'event' || !lastTurn?.outcome) return
    const { afterEvent, nextPolicies } = lastTurn.outcome
    const completedYear = lastTurn.year

    setSelectedPolicy(null)
    setAnimationPhase('year')
    window.scrollTo({ top: 0, behavior: 'smooth' })

    window.setTimeout(() => {
      if (completedYear === 10) {
        setFinalData({
          result: getFinalResult(afterEvent, initialHealth),
          report: createFinalAnalysis(initialMetrics, afterEvent, nextPolicies),
        })
        setScreen('final')
      } else {
        setYear(completedYear + 1)
      }
      setExecuting(false)
      setAnimationPhase('idle')
    }, 360)
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
    setAnimationPhase('idle')
    setLastTurn(null)
  }

  if (screen === 'start') {
    return <StartScreen ecosystem={ecosystem} difficulty={difficulty} onEcosystemChange={setEcosystem} onDifficultyChange={setDifficulty} onStart={startGame} />
  }

  if (screen === 'final' && finalData) {
    return <FinalReport ecosystem={ecosystem} initialMetrics={initialMetrics} metrics={metrics} result={finalData.result} report={finalData.report} policyHistory={policyHistory} eventHistory={eventHistory} onReset={resetGame} />
  }

  return <><GameDashboard year={year} budget={budget} metrics={metrics} ecosystem={ecosystem} difficulty={difficulty} selectedPolicy={selectedPolicy} policyHistory={policyHistory} eventHistory={eventHistory} analysis={analysis} executing={executing} animationPhase={animationPhase} onSelectPolicy={setSelectedPolicy} onExecute={executeYear} onSkip={skipYear} onReset={resetGame} /><TurnOverlay phase={animationPhase} turn={lastTurn} onResume={resumeAfterEvent} /></>
}
