import { Text, useGLTF } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { people } from '../../data/people'
import ParticipantPicture from './ParticipantPicture'
import type { Mesh } from 'three'
import { useInteraction } from '../../context/InteractionContext'
import { useGame } from '../../context/GameContext'

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
  const { camera } = useThree()
  const { setInteraction } = useInteraction()
  const { startCinematic } = useGame()

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
  useFrame((_) => {
    // Position de la pancarte
    const signPosition = new Vector3(...position)
    // Position du joueur (caméra)
    const playerPosition = camera.position.clone()

    // Calculer la distance entre le joueur et la pancarte
    const distance = playerPosition.distanceTo(signPosition)

    // Définir la distance d'interaction (2 unités)
    const interactionDistance = 2
    const newIsNear = distance <= interactionDistance

    if (newIsNear !== isNear) {
      setIsNear(newIsNear)
    }
  })

  // Sync with global interaction context
  useEffect(() => {
    if (isNear) {
      setInteraction(true, personName, personId)
    } else {
      // Only clear if we were the one setting it?
      // Simpler: just clear. If we move from one to another instantly, the other will set it.
      // But to be safe, maybe we should only clear if the current interaction matches us?
      // The context is simple. Let's just clear.
      // Actually, if we walk away, we want to clear.
      // If we walk into another range, that other one will set it.
      // Since they are far apart, it's fine.
      // However, if we are not near, we shouldn't necessarily clear *someone else's* interaction?
      // But we only call this when `isNear` changes.
      // If `isNear` changes from true to false, we clear.
      setInteraction(false)
    }
  }, [isNear, personName, personId, setInteraction])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'e' && isNear) {
        // Libérer le pointeur pour l'interaction (optionnel si on veut cliquer)
        // Mais pour la cinématique on veut peut-être garder le lock ou pas.
        // On lance la cinématique
        startCinematic(personId)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isNear, personId, startCinematic])

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
      { position: [14.1, 1.5, 6.7], personIndex: 0, rotation: [0, -46.1, 0] },    // Rémy
      { position: [17.2, 1.5, 0.6], personIndex: 1, rotation: [0, -45.6, 0] },   // Aurélie
      { position: [-7.9, 1.5, 12.8], personIndex: 2, rotation: [0, 90.5, 0] },   // Alexis
      { position: [-14.9, 1.5, -4.7], personIndex: 3, rotation: [0, 45.2, 0] },  // Matteo
      { position: [5, 1.5, 14.35], personIndex: 4, rotation: [0, -90.7, 0] },   // Lea
      { position: [-14.2, 1.5, 5.2], personIndex: 5, rotation: [0, 90, 0] },  // Victoria
      { position: [4.1, 1.5, -14.7], personIndex: 6, rotation: [0, -0.2, 0] },   // Axelle
      { position: [-7.9, 1.5, -12.87], personIndex: 7, rotation: [0, 0.64, 0] },  // Marco
    ]

  return (
    <>
      {housePositions.map((house, index) => {
        const person = people[house.personIndex]
        const picturePosition: [number, number, number] = [
          house.position[0],
          house.position[1] + 0.65, // 0.8 unités plus haut
          house.position[2]
        ]

        return (
          <group key={index}>
            {/* Photo encadrée au-dessus de la pancarte */}
            <ParticipantPicture
              position={picturePosition}
              rotation={house.rotation}
              size={[0.5, 0.85]} // Facilement ajustable [largeur, hauteur]
              imagePath={person.image}
            />

            {/* Pancarte avec nom */}
            <HouseSign
              position={house.position}
              rotation={house.rotation}
              personName={person.name}
              personId={person.id}
            />
          </group>
        )
      })}
    </>
  )
}

// Preload du modèle
useGLTF.preload('/models/wooden-sign-enter.glb')
