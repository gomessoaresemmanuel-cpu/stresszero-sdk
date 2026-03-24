# StressZero SDK

Official JavaScript/TypeScript SDK for the [StressZero Intelligence API](https://stresszeroentrepreneur.fr/intelligence-api).

Score burnout risk across 3 dimensions (physical, emotional, effectiveness) with typed responses and zero dependencies.

## Install

```bash
npm install stresszero-sdk
```

## Quick Start

```typescript
import { StressZero } from 'stresszero-sdk'

const sz = new StressZero('sz_live_your_key_here')

// Quick 3-score check
const result = await sz.quickCheck(40, 55, 35, {
  profession: 'entrepreneur',
  hours_per_week: 60,
})

if (result.success) {
  console.log(`Score: ${result.data.score.total}/100`)
  console.log(`Risk: ${result.data.risk.level}`)
  console.log(`Recommendations:`, result.data.recommendations)
}
```

## Full Analysis

```typescript
const result = await sz.analyzeBurnout({
  responses: [
    { dimension: 'physical', question_id: 'sleep', value: 40, weight: 3 },
    { dimension: 'physical', question_id: 'energy', value: 50, weight: 2 },
    { dimension: 'emotional', question_id: 'motivation', value: 55, weight: 2 },
    { dimension: 'emotional', question_id: 'stress', value: 30, weight: 3 },
    { dimension: 'effectiveness', question_id: 'productivity', value: 35, weight: 2 },
    { dimension: 'effectiveness', question_id: 'focus', value: 45, weight: 1 },
  ],
  context: {
    profession: 'startup founder',
    hours_per_week: 60,
    years_experience: 5,
  },
  options: { language: 'fr', include_recommendations: true },
})
```

## Detailed Report (Starter+ tier)

```typescript
const report = await sz.generateReport({
  responses: [/* same format */],
  context: {
    company_name: 'My Company',
    employee_name: 'John Doe',
  },
  language: 'en',
  format: 'json',
})

if (report.success) {
  console.log(report.data.action_plan.immediate)
}
```

## API Tiers

| Tier | Price | Calls/month |
|------|-------|-------------|
| Free | 0€ | 500 |
| Starter | 29€/mo | 5,000 |
| Pro | 99€/mo | 25,000 |
| Enterprise | 299€/mo | 100,000 |

[Get your free API key](https://stresszeroentrepreneur.fr/intelligence-api)

## License

MIT — [StressZero Entrepreneur](https://stresszeroentrepreneur.fr)
