import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { PointLight} from 'three';

interface ChristmasLightsProps {
  positions: Array<[number, number, number]>
  type?: 'tree' | 'house'
}

export default function ChristmasLights({ positions, type = 'tree' }: ChristmasLightsProps) {
  const lightsRef = useRef<Array<PointLight | null>>([])

  // Couleurs des guirlandes
  const colors = useMemo(() => [
    '#ff0000', // Rouge
    '#00ff00', // Vert
    '#0000ff', // Bleu
    '#ffff00', // Jaune
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
    '#ff8000', // Orange
    '#8000ff', // Violet
  ], [])

  // Animation des guirlandes
  useFrame((state) => {
    const time = state.clock.elapsedTime

    lightsRef.current.forEach((light, index) => {
      if (!light) return

      // Animation de scintillement
      const phase = (index * 0.5 + time * 2) % (Math.PI * 2)
      const intensity = type === 'tree'
        ? 0.5 + Math.sin(phase) * 0.3
        : 0.3 + Math.sin(phase) * 0.2

      light.intensity = Math.max(0.1, intensity)
    })
  })

  return (
    <>
      {positions.map((position, index) => (
        <pointLight
          key={index}
          ref={(ref) => {
            if (ref) lightsRef.current[index] = ref
          }}
          position={position}
          color={colors[index % colors.length]}
          intensity={type === 'tree' ? 0.5 : 0.3}
          distance={type === 'tree' ? 8 : 5}
          decay={2}
        />
      ))}
    </>
  )
}

// Composant pour générer automatiquement des guirlandes sur les arbres
export function TreeLights({ treePosition }: { treePosition: [number, number, number] }) {
  const lightPositions = useMemo(() => {
    const positions: Array<[number, number, number]> = []
    const [x, y, z] = treePosition

    // Guirlandes en spirale autour de l'arbre (réduites)
    for (let i = 0; i < 4; i++) {
      const height = 1 + (i / 8) * 3
      const angle = (i / 8) * Math.PI * 4
      const radius = 1.2 - (i / 8) * 0.8

      positions.push([
        x + Math.cos(angle) * radius,
        y + height,
        z + Math.sin(angle) * radius
      ])
    }

    return positions
  }, [treePosition])

  return <ChristmasLights positions={lightPositions} type="tree" />
}

// Composant pour générer des guirlandes sur les maisons
export function HouseLights({ housePosition }: { housePosition: [number, number, number] }) {
  const lightPositions = useMemo(() => {
    const [x, y, z] = housePosition

    // Guirlandes autour de la maison
    const corners = [
      [x - 1.5, y + 2, z - 1],
      [x + 1.5, y + 2, z - 1],
      [x + 1.5, y + 2, z + 1],
      [x - 1.5, y + 2, z + 1],
      [x, y + 3, z - 1], // Sommet du toit
      [x, y + 3, z + 1],
    ]

    return corners as Array<[number, number, number]>
  }, [housePosition])

  return <ChristmasLights positions={lightPositions} type="house" />
}
