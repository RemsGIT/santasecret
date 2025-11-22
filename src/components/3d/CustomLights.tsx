import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export interface LightPoint {
  position: [number, number, number]
  color: string
  intensity: number
  distance?: number
  flicker?: boolean
}

interface CustomLightsProps {
  lights: Array<LightPoint>
}

export default function CustomLights({ lights }: CustomLightsProps) {
  const spheresRef = useRef<Array<any>>([])

  // Animation de scintillement des sphères
  useFrame((state) => {
    const time = state.clock.elapsedTime

    spheresRef.current.forEach((sphere, index) => {
      if (!sphere || !lights[index]?.flicker) return

      const phase = (index * 0.7 + time * 2) % (Math.PI * 2)
      const opacity = 0.7 + Math.sin(phase) * 0.3

      sphere.material.opacity = Math.max(0.3, opacity)
    })
  })

  return (
    <>
      {lights.map((lightConfig, index) => (
        <group key={index}>
          {/* Sphère émissive */}
          {/*
          <mesh
            position={lightConfig.position}
            ref={(ref) => {
              if (ref) spheresRef.current[index] = ref
            }}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color={lightConfig.color}
              transparent={lightConfig.flicker}
              opacity={1}
              emissive={lightConfig.color}
              emissiveIntensity={5}
            />
          </mesh>
          */}


          {/* Lumière pour éclairer autour */}
          <pointLight
            position={lightConfig.position}
            color={lightConfig.color}
            intensity={lightConfig.intensity > 100 ? lightConfig.intensity * 0.1 : lightConfig.intensity * 0.01}
            distance={lightConfig.intensity > 100 ? 2 : 0.18}
            decay={lightConfig.intensity > 100 ? 1 : 3}
          />
        </group>
      ))}
    </>
  )
}
