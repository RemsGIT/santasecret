import type { Person } from '../types/person'

export const people: Array<Person> = [
  { id: 1, name: 'Rémy', forbidden: [2] },
  { id: 2, name: 'Aurélie', forbidden: [1] },
  { id: 3, name: 'Alexis', forbidden: [5] },
  { id: 4, name: 'Matteo', forbidden: [6] },
  { id: 5, name: 'Lea', forbidden: [3] },
  { id: 6, name: 'Victoria', forbidden: [4] },
  { id: 7, name: 'Axelle', forbidden: [8] },
  { id: 8, name: 'Marco', forbidden: [7] },
]
