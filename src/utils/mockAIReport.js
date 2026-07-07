import { calculateHealth } from './gameLogic.js'
import { metricLabels } from '../data/policies.js'

export function createYearAnalysis(before, after, policy, event) {
  const changes = Object.keys(after)
    .map((key) => ({ key, amount: after[key] - before[key] }))
    .filter(({ amount }) => amount !== 0)
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))

  const strongest = changes[0]
  const direction = strongest?.amount > 0 ? '개선' : '악화'
  const detail = strongest
    ? `${metricLabels[strongest.key]}이(가) ${Math.abs(strongest.amount)}만큼 ${direction}되었습니다.`
    : '전체 지표가 안정적으로 유지되었습니다.'

  const action = policy.id === 'skip'
    ? '올해는 예산을 비축하고 자연 변화에 집중했습니다.'
    : `${policy.name}의 효과가 반영되었습니다.`
  return `${action} ‘${event.name}’의 영향도 함께 나타났습니다. ${detail}`
}

export function createFinalAnalysis(initialMetrics, finalMetrics, policyHistory) {
  const deltas = ['biodiversity', 'carbon', 'water', 'satisfaction'].map((key) => ({
    key,
    amount: finalMetrics[key] - initialMetrics[key],
  }))
  const best = [...deltas].sort((a, b) => b.amount - a.amount)[0]
  const weakest = [...deltas].sort((a, b) => a.amount - b.amount)[0]
  const counts = policyHistory.reduce((acc, item) => {
    acc[item.policy.id] = (acc[item.policy.id] || 0) + 1
    return acc
  }, {})
  const repeated = Math.max(0, ...Object.entries(counts).filter(([id]) => id !== 'skip').map(([, count]) => count))

  return {
    summary: `10년간 생태계 건강 점수를 ${calculateHealth(initialMetrics)}점에서 ${calculateHealth(finalMetrics)}점으로 변화시켰습니다.`,
    strength: `${metricLabels[best.key]} 분야에서 가장 큰 변화(${best.amount >= 0 ? '+' : ''}${best.amount})를 만들었습니다.`,
    improvement: `${metricLabels[weakest.key]} 지표가 상대적으로 취약합니다. 다음에는 이 분야에 직접 효과가 있는 정책을 더 일찍 배치해 보세요.`,
    style: repeated >= 4 ? '핵심 정책에 집중하는 전문형 전략' : '여러 수단을 조합하는 균형형 전략',
  }
}
