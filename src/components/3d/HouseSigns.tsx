import { Text, useGLTF } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useFrame, useThree } from '@react-three/fiber'
import { people } from '../../data/people'
import type { Mesh } from 'three'
import { Vector3 } from 'three'

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
  const { camera } = useThree()

  useEffect(() => {
    // Configurer le modèle
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  // Détection de proximité avec le joueur
  useFrame(() => {
    // Position de la pancarte
    const signPosition = new Vector3(...position)
    // Position du joueur (caméra)
    const playerPosition = camera.position.clone()

    // Calculer la distance entre le joueur et la pancarte
    const distance = playerPosition.distanceTo(signPosition)

    // Définir la distance d'interaction (2 unités)
    const interactionDistance = 2

    // Mettre à jour l'état de proximité
    setIsNear(distance <= interactionDistance)
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'e' && isNear) {
        // Libérer le pointeur avant la navigation
        if (document.pointerLockElement) {
          document.exitPointerLock()
        }
        navigate({ to: `/person/${personId}` })
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isNear, navigate, personId])

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
        position={[-0.04, 0.02, 0.07]}
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
    { position: [24.8, 1.5, -4.5], personIndex: 0, rotation: [0,89.5,0] },    // Rémy
    { position: [17.2, 1.5, 0.6], personIndex: 1, rotation: [0,-45.6,0] },   // Aurélie
    { position: [-7.9, 1.5, 12.8], personIndex: 2, rotation: [0,90.5,0] },   // Alexis
    { position: [-14.9, 1.5, -4.7], personIndex: 3, rotation: [0,45.2,0] },  // Matteo
    { position: [5, 1.5, 14.35], personIndex: 4, rotation: [0,-90.7,0] },   // Lea
    { position: [-14.2, 1.5, 5.2], personIndex: 5,rotation: [0,90,0] },  // Victoria
    { position: [4.1, 1.5, -14.7], personIndex: 6, rotation: [0,-0.2,0] },   // Axelle
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
