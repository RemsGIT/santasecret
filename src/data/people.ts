import { Person } from '../types/person'

export const people: Person[] = [
  { id: 1, name: 'Alice Martin', forbidden: [2, 3] },
  { id: 2, name: 'Bob Dupont', forbidden: [1] },
  { id: 3, name: 'Claire Rousseau', forbidden: [4, 1] },
  { id: 4, name: 'David Bernard', forbidden: [3, 5] },
  { id: 5, name: 'Emma Lefevre', forbidden: [6] },
  { id: 6, name: 'François Moreau', forbidden: [5] },
]