import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Points} from 'three';

export default function SnowSystem() {
  const pointsRef = useRef<Points>(null)

  const particleCount = 2000

  // Créer les positions et vitesses des flocons
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      // Position initiale aléatoire
      positions[i3] = (Math.random() - 0.5) * 100 // x
      positions[i3 + 1] = Math.random() * 50 + 10 // y
      positions[i3 + 2] = (Math.random() - 0.5) * 100 // z

      // Vitesse de chute
      velocities[i3] = (Math.random() - 0.5) * 0.02 // drift x
      velocities[i3 + 1] = -(Math.random() * 0.05 + 0.02) // fall speed
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02 // drift z
    }

    return { positions, velocities }
  }, [])

  useFrame(() => {
    if (!pointsRef.current) return

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      // Mise à jour des positions
      positions[i3] += velocities[i3]
      positions[i3 + 1] += velocities[i3 + 1]
      positions[i3 + 2] += velocities[i3 + 2]

      // Reset si la particule sort de la zone
      if (positions[i3 + 1] < 0) {
        positions[i3] = (Math.random() - 0.5) * 100
        positions[i3 + 1] = 50
        positions[i3 + 2] = (Math.random() - 0.5) * 100
      }

      // Drift horizontal limité
      if (Math.abs(positions[i3]) > 50) {
        positions[i3] = (Math.random() - 0.5) * 100
      }
      if (Math.abs(positions[i3 + 2]) > 50) {
        positions[i3 + 2] = (Math.random() - 0.5) * 100
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.8}
        alphaTest={0.1}
        sizeAttenuation
      />
    </points>
  )
}
