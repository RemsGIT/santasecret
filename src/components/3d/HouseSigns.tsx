import { Text, useGLTF } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { people } from '../../data/people'
import ParticipantPicture from './ParticipantPicture'
import type { Mesh } from 'three'

// Composant UI Gaming avec effet d'apparition épique
interface GameUIPromptProps {
  opacity: number
  animationProgress: number
  personName: string
  position: [number, number, number]
}

function GameUIPrompt({ opacity, animationProgress, personName, position }: GameUIPromptProps) {
  const groupRef = useRef<any>(null)

  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.elapsedTime

    // Animation de respiration douce
    const breathe = Math.sin(time * 1.5) * 0.01
    groupRef.current.scale.set(
      1 + breathe * 0.1,
      1 + breathe * 0.1,
      1
    )
  })

  // Animations basées sur le progress
  const slideDistance = (1 - animationProgress) * 0.2  // Slide depuis le haut
  const currentScale = animationProgress  // Linear pour plus de fluidité
  const textOpacity = Math.max(0, (animationProgress - 0.2) / 0.8)  // Texte apparaît plus tôt

  return (
    <group ref={groupRef} position={[position[0], position[1] - slideDistance, position[2]]}>
      {/* Fond principal arrondi style moderne */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[2.4, 0.5]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.95 * opacity * currentScale}
          depthWrite={false}
        />
      </mesh>

      {/* Bordure colorée */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2.5, 0.55]} />
        <meshBasicMaterial
          color="#4f46e5"  // Violet moderne
          transparent
          opacity={0.8 * opacity * currentScale}
          depthWrite={false}
        />
      </mesh>

      {/* Icône personnage à gauche */}
      <Text
        position={[-0.8, 0, 0.01]}
        fontSize={0.2}
        color={`rgba(79, 70, 229, ${opacity * textOpacity})`}
        anchorX="center"
        anchorY="middle"
      >
        🏠
      </Text>

      {/* Texte principal */}
      <Text
        position={[0.1, 0.08, 0.01]}
        fontSize={0.08}
        color={`rgba(79, 70, 229, ${opacity * textOpacity})`}
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
        textAlign="center"
        fontWeight={600}
      >
        Entrer chez {personName}
      </Text>

      {/* Sous-texte avec la touche */}
      <Text
        position={[0.1, -0.08, 0.01]}
        fontSize={0.06}
        color={`rgba(107, 114, 128, ${opacity * textOpacity * 0.8})`}
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
        textAlign="center"
      >
        Appuyer sur E
      </Text>

      {/* Flèche indicative */}
      <Text
        position={[0.9, 0, 0.01]}
        fontSize={0.15}
        color={`rgba(79, 70, 229, ${opacity * textOpacity})`}
        anchorX="center"
        anchorY="middle"
      >
        →
      </Text>
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
  const [animationProgress, setAnimationProgress] = useState(0)
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
  useFrame((state) => {
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

    // Animation dramatique d'apparition/disparition
    if (newIsNear && !wasNear) {
      // Reset de l'animation à l'apparition
      setAnimationProgress(0)
      setOpacity(0)
    }

    // Animation progressive pour l'effet WOW
    const targetOpacity = newIsNear ? 1 : 0
    const targetProgress = newIsNear ? 1 : 0

    setOpacity(prev => {
      const speed = newIsNear ? 0.08 : 0.06  // Plus rapide à l'apparition
      const diff = targetOpacity - prev
      return Math.abs(diff) < 0.01 ? targetOpacity : prev + diff * speed
    })

    setAnimationProgress(prev => {
      const speed = newIsNear ? 0.12 : 0.08  // Animation du progress plus dynamique
      const diff = targetProgress - prev
      return Math.abs(diff) < 0.01 ? targetProgress : prev + diff * speed
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

      {/* Interface Gaming avec effet WOW d'apparition */}
      {opacity > 0 && (
        <GameUIPrompt
          opacity={opacity}
          animationProgress={animationProgress}
          personName={personName}
          position={[-0.08, 0.15, 0.12]}
        />
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
