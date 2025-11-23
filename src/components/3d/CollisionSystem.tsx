import { useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { Vector3, Raycaster } from 'three'
import type { Mesh } from 'three'

interface CollisionSystemProps {
  modelPath: string
  onCollisionDataReady?: (colliders: Mesh[]) => void
}

const collisionElements = ['House_1_Wood_1_0', 'House_2_Wood_1_0', 'House_3_Wood_1_0', 'House_4_Wood_1_0', 'House_5_Wood_1_0', 'house_6_Wood_1_0', 'House_7_Wood_1_0', 'House_8_Wood_1_0']

export default function CollisionSystem({
  modelPath,
  onCollisionDataReady
}: CollisionSystemProps) {
  const { scene } = useGLTF(modelPath)
  const housesRef = useRef<Mesh[]>([])

  useEffect(() => {
    const foundHouses: Mesh[] = []

    scene.traverse((child) => {
      if ((child as any).isMesh) {
        const mesh = child as Mesh
        if (collisionElements.includes(mesh.name)) {
          console.log(`Maison trouvée: ${mesh.name}`)
          foundHouses.push(mesh)
        }
      }
    })

    housesRef.current = foundHouses
    console.log(`${foundHouses.length} maisons trouvées pour collision`)

    if (onCollisionDataReady) {
      onCollisionDataReady(foundHouses)
    }
  }, [scene, onCollisionDataReady])

  return null
}

export function checkHousesCollision(
  position: Vector3,
  houses: Mesh[],
  playerRadius: number = 0.8
): boolean {
  if (!houses || houses.length === 0) return false

  const raycaster = new Raycaster()
  const directions = [
    new Vector3(1, 0, 0),    // droite
    new Vector3(-1, 0, 0),   // gauche
    new Vector3(0, 0, 1),    // avant
    new Vector3(0, 0, -1),   // arrière
    new Vector3(0.7, 0, 0.7),   // diagonale
    new Vector3(-0.7, 0, 0.7),  // diagonale
    new Vector3(0.7, 0, -0.7),  // diagonale
    new Vector3(-0.7, 0, -0.7), // diagonale
  ]

  for (const house of houses) {
    for (const direction of directions) {
      raycaster.set(position, direction.normalize())
      const intersects = raycaster.intersectObject(house, true)

      if (intersects.length > 0 && intersects[0].distance < playerRadius) {
        return true
      }
    }
  }

  return false
}
