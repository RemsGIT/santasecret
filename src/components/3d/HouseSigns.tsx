import { useGLTF, Text } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { people } from '../../data/people'
import type { Mesh } from 'three'

interface HouseSignProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  personName: string
  personId: number
}

function HouseSign({ position, rotation = [0, 0, 0], personName, personId }: HouseSignProps) {
  const { scene } = useGLTF('/models/wooden-sign-enter.glb')
  const signRef = useRef<Mesh>(null)
  const [isNear, setIsNear] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Configurer le modèle
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'e' && isNear) {
        navigate({ to: `/person/${personId}` })
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isNear, navigate, personId])

  // TODO: Ajouter logique de détection de proximité avec le joueur
  // Pour l'instant, on peut simuler l'interaction

  return (
    <group position={position} rotation={rotation}>
      {/* Pancarte en bois */}
      <primitive
        ref={signRef}
        object={scene.clone()}
        scale={[0.02, 0.02, 0.02]}
      />

      {/* Nom de la personne sur la pancarte */}
      <Text
        position={[-0.04, 0.02, 0.1]}
        fontSize={0.1}
        color="black"
        anchorX="center"
        anchorY="middle"
        rotation={[0, 0, 0]}
        maxWidth={0.8}
        textAlign="center"
        fontWeight={1000}
      >
        {personName}
      </Text>

      {/* Instruction "Press E" quand proche */}
      {isNear && (
        <Text
          position={[-0.08, 0.1, 0.12]}
          fontSize={0.2}
          color="#ffff00"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
          textAlign="center"
        >
          Press E to visit
        </Text>
      )}
    </group>
  )
}

export default function HouseSigns() {
  // Positions approximatives au-dessus des portes des cabanes
  // Tu devras ajuster ces coordonnées selon la disposition de tes cabanes
  const housePositions: Array<{
    position: [number, number, number]
    rotation?: [number, number, number]
    personIndex: number
  }> = [
    { position: [5, 3, 8], personIndex: 0 },    // Rémy
    { position: [-5, 3, 8], personIndex: 1 },   // Aurélie
    { position: [8, 3, -2], personIndex: 2 },   // Alexis
    { position: [-8, 3, -2], personIndex: 3 },  // Matteo
    { position: [10, 3, 5], personIndex: 4 },   // Lea
    { position: [-10, 3, 5], personIndex: 5 },  // Victoria
    { position: [3, 3, -8], personIndex: 6 },   // Axelle
    { position: [-7.9, 1.5, -12.87], personIndex: 7, rotation: [0,0.64,0] },  // Marco
  ]

  return (
    <>
      {housePositions.map((house, index) => (
        <HouseSign
          key={index}
          position={house.position}
          rotation={house.rotation}
          personName={people[house.personIndex].name}
          personId={people[house.personIndex].id}
        />
      ))}
    </>
  )
}

// Preload du modèle
useGLTF.preload('/models/wooden-sign-enter.glb')
