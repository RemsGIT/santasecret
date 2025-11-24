import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import type { Group } from 'three'

export default function NightSky() {
  const moonRef = useRef<Group>(null)
  const { scene } = useGLTF('/models/moon.glb')

  return (
    <group ref={moonRef} position={[0, 20, -50]}>
      <primitive
        object={scene.clone()}
        scale={[1, 1, 1]}
      />
    </group>
  )
}
