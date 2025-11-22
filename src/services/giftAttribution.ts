import type { GiftAttribution, Person } from '../types/person'

function shuffleArray<T>(array: Array<T>): Array<T> {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function canGiveTo(giver: Person, receiverId: number): boolean {
  return !giver.forbidden.includes(receiverId) && giver.id !== receiverId
}

function findValidReceiver(
  giver: Person,
  availableReceivers: Array<number>,
): number | null {
  const validReceivers = availableReceivers.filter(receiverId =>
    canGiveTo(giver, receiverId)
  )

  if (validReceivers.length === 0) {
    return null
  }

  return validReceivers[Math.floor(Math.random() * validReceivers.length)]
}

function isValidAttribution(attributions: Array<GiftAttribution>, people: Array<Person>): boolean {
  const givers = new Set<number>()
  const receivers = new Set<number>()

  for (const attribution of attributions) {
    if (givers.has(attribution.giverId) || receivers.has(attribution.receiverId)) {
      return false
    }

    const giver = people.find(p => p.id === attribution.giverId)
    if (!giver || !canGiveTo(giver, attribution.receiverId)) {
      return false
    }

    givers.add(attribution.giverId)
    receivers.add(attribution.receiverId)
  }

  return givers.size === people.length && receivers.size === people.length
}

export function generateGiftAttributions(people: Array<Person>): Array<GiftAttribution> | null {
  const maxAttempts = 1000

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const attributions: Array<GiftAttribution> = []
    const shuffledPeople = shuffleArray(people)
    const availableReceivers = [...people.map(p => p.id)]

    let success = true

    for (const giver of shuffledPeople) {
      const receiverId = findValidReceiver(giver, availableReceivers)

      if (receiverId === null) {
        success = false
        break
      }

      attributions.push({ giverId: giver.id, receiverId })
      availableReceivers.splice(availableReceivers.indexOf(receiverId), 1)
    }

    if (success && isValidAttribution(attributions, people)) {
      return attributions
    }
  }

  return null
}

export function getReceiverForGiver(attributions: Array<GiftAttribution>, giverId: number): number | null {
  const attribution = attributions.find(attr => attr.giverId === giverId)
  return attribution ? attribution.receiverId : null
}

export function getGiverForReceiver(attributions: Array<GiftAttribution>, receiverId: number): number | null {
  const attribution = attributions.find(attr => attr.receiverId === receiverId)
  return attribution ? attribution.giverId : null
}
