import type { Person } from '../types/person'

export const people: Array<Person> = [
  { id: 1, name: 'Rémy', forbidden: [2], image: '/images/people/remy.png' },
  { id: 2, name: 'Aurélie', forbidden: [1], image: '/images/people/aurelie.png' },
  { id: 3, name: 'Alexis', forbidden: [5], image: '/images/people/alexis.png' },
  { id: 4, name: 'Matteo', forbidden: [6], image: '/images/people/matteo.png' },
  { id: 5, name: 'Lea', forbidden: [3], image: '/images/people/lea.png' },
  { id: 6, name: 'Victoria', forbidden: [4], image: '/images/people/victoria.png' },
  { id: 7, name: 'Axelle', forbidden: [8], image: '/images/people/axelle.png' },
  { id: 8, name: 'Marco', forbidden: [7], image: '/images/people/marco.png' },
]
