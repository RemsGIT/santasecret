import { Text } from '@react-three/drei'
import { useRouter } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import * as React from 'react'
import type { Mesh} from 'three';
import type { Person } from '../../types/person'

interface ParticipantLabelProps {
  person: Person
  position: [number, number, number]
  playerRef?: React.RefObject<Mesh>
}

export default function ParticipantLabel({ person, position, playerRef }: ParticipantLabelProps) {
  const router = useRouter()
  const labelRef = useRef<Mesh>(null)
  const [isIlluminated, setIsIlluminated] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useFrame(() => {
    if (!playerRef?.current || !labelRef.current) return

    const playerPos = playerRef.current.position
    const labelPos = new Vector3(...position)
    const distance = playerPos.distanceTo(labelPos)

    // Vérifier si le label est dans le cône de la lampe torche
    // Distance maximale d'éclairage augmentée
    const maxLightDistance = 15
    const illuminated = distance < maxLightDistance

    setIsIlluminated(illuminated)
  })

  const handleClick = () => {
    if (isIlluminated) {
      // Naviguer vers la page de reveal avec l'ID du participant
      router.navigate({
        to: '/person/$personId',
        params: { personId: person.id.toString() }
      })
    }
  }

  return (
    <group position={position}>
      {/* Background du texte pour améliorer la lisibilité */}
      <mesh
        position={[0, 0, -0.01]}
        onClick={handleClick}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <planeGeometry args={[person.name.length * 0.3, 1]} />
        <meshStandardMaterial
          color={isIlluminated ? (isHovered ? "#4a90e2" : "#2c3e50") : "#1a1a1a"}
          opacity={isIlluminated ? 0.8 : 0.2}
          transparent
        />
      </mesh>

      {/* Texte du nom */}
      <Text
        ref={labelRef}
        fontSize={0.5}
        color={isIlluminated ? "#ffffff" : "#333333"}
        anchorX="center"
        anchorY="middle"
        onClick={handleClick}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        {person.name}
      </Text>

      {/* Indicateur visuel de sélection possible */}
      {isIlluminated && (
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.05]} />
          <meshStandardMaterial
            color="#4a90e2"
            emissive="#4a90e2"
            emissiveIntensity={isHovered ? 0.5 : 0.2}
          />
        </mesh>
      )}
    </group>
  )
}
