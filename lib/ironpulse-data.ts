export type Macros = { kcal: number; protein: number; carbs: number; fat: number }

export type Meal = Macros & { id: string; name: string; time: string; source: 'manual' | 'scan' }

export type WorkoutSet = { weight: string; reps: string; done: boolean }

export type Exercise = {
  id: string
  name: string
  target: string
  muscles: string
  last: string
  sets: WorkoutSet[]
}

export const member = {
  firstName: 'Alex',
  fullName: 'Alex Morgan',
  memberId: 'APX-8492',
  gym: 'Apex Athletic Club',
  location: 'Downtown Flagship',
  plan: 'Gold All-Access',
  daysLeft: 24,
  renewalDate: 'Oct 22, 2026',
  monthlyRate: 89,
  memberSince: 'Mar 2024',
  streak: 11,
}

export const nutritionGoals: Macros = { kcal: 2600, protein: 180, carbs: 250, fat: 65 }

export const initialMeals: Meal[] = [
  { id: 'm1', name: 'Overnight Oats + Whey', time: '7:40 AM', kcal: 620, protein: 45, carbs: 78, fat: 14, source: 'manual' },
  { id: 'm2', name: 'Salmon Poke Bowl', time: '12:55 PM', kcal: 710, protein: 52, carbs: 74, fat: 22, source: 'scan' },
  { id: 'm3', name: 'Greek Yogurt + Berries', time: '3:30 PM', kcal: 280, protein: 28, carbs: 32, fat: 4, source: 'manual' },
  { id: 'm4', name: 'Lean Beef Wrap', time: '6:15 PM', kcal: 540, protein: 40, carbs: 36, fat: 15, source: 'scan' },
]

export const scannedFood: Macros & { name: string } = {
  name: 'Grilled Chicken Bowl + Brown Rice',
  kcal: 540,
  protein: 48,
  carbs: 52,
  fat: 12,
}

export const scannedEquipment = {
  name: 'Hack Squat Machine',
  muscles: ['Quads', 'Glutes'],
  cue: 'Keep heels planted, sit back into the pad and drive through mid-foot.',
  suggestion: '4 × 8–10 @ 100kg',
}

const blankSets = (count: number): WorkoutSet[] =>
  Array.from({ length: count }, () => ({ weight: '', reps: '', done: false }))

export const initialExercises: Exercise[] = [
  {
    id: 'incline-db',
    name: 'Incline Dumbbell Press',
    target: '3 × 8–10',
    muscles: 'Upper Chest · Front Delts',
    last: '32kg × 10',
    sets: [{ weight: '32', reps: '10', done: true }, { weight: '32', reps: '9', done: true }, { weight: '', reps: '', done: false }],
  },
  {
    id: 'hack-squat',
    name: 'Hack Squat / Leg Press',
    target: '3 × 10–12',
    muscles: 'Quads · Glutes',
    last: '100kg × 12',
    sets: blankSets(3),
  },
  {
    id: 'chest-row',
    name: 'Chest-Supported Row',
    target: '3 × 10–12',
    muscles: 'Lats · Rhomboids',
    last: '28kg × 12',
    sets: blankSets(3),
  },
  {
    id: 'lateral-raise',
    name: 'Lateral Raises',
    target: '3 × 12–15',
    muscles: 'Side Delts',
    last: '12kg × 15',
    sets: blankSets(3),
  },
]

export const checkIns = [
  { day: 'Today', time: '5:42 PM', location: 'Downtown Flagship' },
  { day: 'Yesterday', time: '6:10 AM', location: 'Downtown Flagship' },
  { day: 'Sat, Sep 26', time: '9:05 AM', location: 'Riverside Club' },
]

export function sumMacros(meals: Macros[]): Macros {
  return meals.reduce(
    (acc, m) => ({
      kcal: acc.kcal + m.kcal,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  )
}
