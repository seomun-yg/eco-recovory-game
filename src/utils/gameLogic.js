import { events } from '../data/events.js'

export const BASE_METRICS = {
  biodiversity: 50,
  carbon: 40,
  water: 45,
  satisfaction: 60,
  endangered: 12,
}

export const ECOSYSTEMS = {
  forest: { name: '산림', subtitle: '끊어진 녹색 축을 다시 잇습니다', bonus: { biodiversity: 5, carbon: 5 } },
  wetland: { name: '습지', subtitle: '생명의 물그릇을 되살립니다', bonus: { carbon: 5, water: 5 } },
  river: { name: '하천', subtitle: '도시와 자연이 만나는 물길을 회복합니다', bonus: { water: 8, satisfaction: 2 } },
}

export const DIFFICULTIES = {
  easy: { name: '쉬움', budget: 120, negativeChance: 0.4, description: '넉넉한 예산 · 안정적 기후' },
  normal: { name: '보통', budget: 100, negativeChance: 0.6, description: '표준 예산 · 예측 불가한 변수' },
  hard: { name: '어려움', budget: 85, negativeChance: 0.75, description: '빠듯한 예산 · 잦은 위기' },
}

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

// 변화량 객체를 기존 지표에 더하고 허용 범위를 벗어나지 않게 합니다.
export function applyEffects(metrics, effects) {
  const next = { ...metrics }
  Object.entries(effects).forEach(([key, amount]) => {
    const maximum = key === 'endangered' ? Number.POSITIVE_INFINITY : 100
    next[key] = clamp((next[key] ?? 0) + amount, 0, maximum)
  })
  return next
}

export function createInitialMetrics(ecosystem) {
  return applyEffects(BASE_METRICS, ECOSYSTEMS[ecosystem].bonus)
}

// 적합한 생태계에서는 좋은 효과만 20% 높입니다. 불이익은 그대로 유지합니다.
export function isPolicyInSeason(policy, year) {
  return !policy.timing || (year >= policy.timing.start && year <= policy.timing.end)
}

export function getPolicyEffects(policy, ecosystem, year = 1) {
  const isSuitable = policy.suitableFor.includes(ecosystem)
  const timingMultiplier = isPolicyInSeason(policy, year) ? 1.25 : 0.9
  return Object.fromEntries(
    Object.entries(policy.effects).map(([key, amount]) => [
      key,
      amount > 0 ? Math.round(amount * (isSuitable ? 1.2 : 1) * timingMultiplier) : amount,
    ]),
  )
}

export function applyPolicy(metrics, policy, ecosystem, year = 1) {
  return applyEffects(metrics, getPolicyEffects(policy, ecosystem, year))
}

// 먼저 긍정/부정 사건을 난이도 확률로 결정한 뒤 해당 그룹에서 하나를 뽑습니다.
export function drawEvent(negativeChance, random = Math.random) {
  const type = random() < negativeChance ? 'negative' : 'positive'
  const candidates = events.filter((event) => event.type === type)
  return candidates[Math.floor(random() * candidates.length)]
}

export function calculateHealth(metrics) {
  const endangeredScore = clamp(100 - metrics.endangered * 5, 0, 100)
  const total = metrics.biodiversity + metrics.carbon + metrics.water + metrics.satisfaction + endangeredScore
  return Math.round(total / 5)
}

export function getFinalResult(metrics, initialHealth) {
  const health = calculateHealth(metrics)
  const checks = {
    biodiversity: metrics.biodiversity >= 80,
    endangered: metrics.endangered < BASE_METRICS.endangered,
    health: health > initialHealth,
  }
  return { success: Object.values(checks).every(Boolean), health, checks }
}
