# StressZero SDK — v2

SDK JavaScript/TypeScript local pour une **réflexion qualitative sur la charge de travail**.

> **Statut : en développement.** Les anciennes fonctions réseau de scoring, rapport et prédiction sont retirées. Cette version ne fournit ni diagnostic, ni thérapie, ni dépistage, ni triage et ne remplace pas un professionnel de santé.

## Installation

```bash
npm install stresszero-sdk
```

## Exemple

```typescript
import { StressZero } from 'stresszero-sdk'

const stresszero = new StressZero()
const result = stresszero.reflectWorkload({
  openLoops: ['Répondre au client', 'Préparer la trésorerie'],
  recoveryObservation: 'Je décroche difficilement le soir',
  decisionLoad: 'Plusieurs arbitrages restent ouverts',
})

console.log(result.questions)
```

Le traitement est local : aucun appel réseau, aucun score, aucune classification.

## Rôles

- **Emmanuel Gomes Soares** : fondateur, méthode EGS et outils. Aucun accompagnement individuel.
- **Ingrid Averianov** : coach professionnelle. Tous les accompagnements individuels.

## Migration depuis la v1

La v2 est une rupture volontaire. Les méthodes `analyzeBurnout`, `generateReport`, `quickCheck` et `createApiKey` sont supprimées, car les endpoints correspondants sont suspendus pendant une revue de conformité.

MIT — [StressZero Entrepreneur](https://stresszeroentrepreneur.fr)
