export interface Person {
  id: number
  name: string
  forbidden: number[]
  image?: string
}

export interface GiftAttribution {
  giverId: number
  receiverId: number
}