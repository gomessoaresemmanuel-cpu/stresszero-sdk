export type Language = 'fr' | 'en'

export interface StressZeroFrame {
  status: 'development'
  position: string
  boundaries: string[]
  roles: {
    Emmanuel: string
    Ingrid: string
  }
}

export interface WorkloadReflectionInput {
  openLoops?: string[]
  recoveryObservation?: string
  decisionLoad?: string
  language?: Language
}

export interface WorkloadReflectionResult {
  summary: {
    openLoops: string[]
    recovery: string
    decisions: string
  }
  questions: string[]
  frame: string[]
}

export const STRESSZERO_FRAME: StressZeroFrame = {
  status: 'development',
  position: 'Prévention non médicale de la surcharge et organisation du travail.',
  boundaries: [
    'Ni diagnostic, ni thérapie, ni dépistage, ni triage.',
    'Aucun score de burnout, aucune prédiction et aucune analyse individuelle ou d’équipe.',
    'Ne remplace pas un professionnel de santé.',
  ],
  roles: {
    Emmanuel: 'Fondateur — vision, méthode EGS et outils. Aucun accompagnement individuel.',
    Ingrid: 'Coach professionnelle — tous les accompagnements individuels.',
  },
}

export function reflectWorkload(input: WorkloadReflectionInput = {}): WorkloadReflectionResult {
  const language = input.language ?? 'fr'
  const openLoops = (input.openLoops ?? []).slice(0, 20).map(value => value.trim()).filter(Boolean)
  const recovery = input.recoveryObservation?.trim() || (language === 'fr' ? 'Non renseignée' : 'Not provided')
  const decisions = input.decisionLoad?.trim() || (language === 'fr' ? 'Non renseignée' : 'Not provided')
  const questions = language === 'fr'
    ? [
        'Quel sujet peut être fermé, délégué ou planifié aujourd’hui ?',
        'Quelle limite protégerait une vraie coupure cette semaine ?',
        'Quelle décision peut attendre plutôt que consommer ta marge maintenant ?',
      ]
    : [
        'Which item can be closed, delegated or scheduled today?',
        'Which boundary would protect a real break this week?',
        'Which decision can wait instead of consuming your margin now?',
      ]
  return {
    summary: { openLoops, recovery, decisions },
    questions,
    frame: [...STRESSZERO_FRAME.boundaries],
  }
}

export class StressZero {
  getStatus(): StressZeroFrame {
    return {
      ...STRESSZERO_FRAME,
      boundaries: [...STRESSZERO_FRAME.boundaries],
      roles: { ...STRESSZERO_FRAME.roles },
    }
  }

  reflectWorkload(input: WorkloadReflectionInput = {}): WorkloadReflectionResult {
    return reflectWorkload(input)
  }
}

export default StressZero
