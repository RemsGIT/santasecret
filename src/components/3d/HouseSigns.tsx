import { Text, useGLTF } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useFrame, useThree } from '@react-three/fiber'
import { people } from '../../data/people'
import ParticipantPicture from './ParticipantPicture'
import type { Mesh } from 'three'
import { Vector3 } from 'three'

// Composant pour les particules scintillantes
function StarParticles() {
  const particlesRef = useRef<Array<Mesh>>(Array(6).fill(null))

  useFrame((state) => {
    const time = state.clock.elapsedTime

    particlesRef.current.forEach((particle, index) => {
      if (particle) {
        // Animation de rotation et de scintillement
        const phase = time * 2 + index * Math.PI / 3
        const radius = 0.8 + Math.sin(phase) * 0.2
        const angle = (index * Math.PI * 2) / 6 + time * 0.5

        particle.position.set(
          Math.cos(angle) * radius,
          0.1 + Math.sin(phase * 1.5) * 0.05,
          Math.sin(angle) * radius
        )

        // Scintillement de l'opacité
        const material = particle.material as any
        material.opacity = 0.3 + Math.sin(phase * 3) * 0.3

        // Rotation
        particle.rotation.z = time + index
      }
    })
  })

  return (
    <group position={[-0.08, 0, 0]}>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) particlesRef.current[i] = el
          }}
        >
          <planeGeometry args={[0.08, 0.08]} />
          <meshBasicMaterial
            color="#ffff00"
            transparent
            opacity={0.6}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

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
  const [opacity, setOpacity] = useState(0)
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

  // Détection de proximité avec le joueur et animation
  useFrame(() => {
    // Position de la pancarte
    const signPosition = new Vector3(...position)
    // Position du joueur (caméra)
    const playerPosition = camera.position.clone()

    // Calculer la distance entre le joueur et la pancarte
    const distance = playerPosition.distanceTo(signPosition)

    // Définir la distance d'interaction (2 unités)
    const interactionDistance = 2
    const wasNear = isNear
    const newIsNear = distance <= interactionDistance

    // Mettre à jour l'état de proximité
    setIsNear(newIsNear)

    // Animation fluide d'apparition/disparition
    if (newIsNear && !wasNear) {
      // Apparition
      setOpacity(0)
    }

    // Animer l'opacité vers la cible
    const targetOpacity = newIsNear ? 1 : 0
    setOpacity(prev => {
      const speed = 0.05
      const diff = targetOpacity - prev
      return Math.abs(diff) < 0.01 ? targetOpacity : prev + diff * speed
    })
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

      {/* Instruction "Press E" avec effet WOW */}
      {opacity > 0 && (
        <group scale={[0.8 + opacity * 0.2, 0.8 + opacity * 0.2, 1]}>
          {/* Effet de glow/halo derrière le texte */}
          <mesh position={[-0.08, 0.1, 0.11]}>
            <planeGeometry args={[1.5, 0.4]} />
            <meshBasicMaterial
              color="#ffff00"
              opacity={0.1 * opacity}
              transparent
              depthWrite={false}
            />
          </mesh>

          {/* Texte principal avec animation */}
          <Text
            position={[-0.08, 0.1, 0.12]}
            fontSize={0.18}
            color={`rgba(255, 255, 255, ${opacity})`}
            anchorX="center"
            anchorY="middle"
            maxWidth={2}
            textAlign="center"
            outlineWidth={0.02}
            outlineColor={`rgba(255, 255, 0, ${opacity})`}
            strokeWidth={0.01}
            strokeColor={`rgba(0, 0, 0, ${opacity * 0.8})`}
          >
            🔑 Press E to visit
          </Text>

          {/* Particules scintillantes autour du texte */}
          <group scale={[opacity, opacity, opacity]}>
            <StarParticles />
          </group>
        </group>
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
