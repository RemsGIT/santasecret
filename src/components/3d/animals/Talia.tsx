import { useGLTF, useTexture } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { DoubleSide } from 'three'
import type { Group } from 'three'

interface TaliaProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
}

export default function Talia({
  position,
  rotation = [0, 0, 0],
  scale = [0.02, 0.02, 0.02]
}: TaliaProps) {
  const taliaRef = useRef<Group>(null)

  // Modèles 3D
  const { scene: catScene } = useGLTF('/models/animals/talia.glb')
  const { scene: nicheScene } = useGLTF('/models/animals/niche-bois.glb')
  const { scene: signScene } = useGLTF('/models/minecraft_sign.glb')

  // Texture pour la photo
  const taliaTexture = useTexture('/images/cats/talia.png')


  return (
    <group ref={taliaRef} position={position} rotation={rotation}>
      {/* Chat Talia */}
      <primitive
        object={catScene.clone()}
        position={[0.6, 0.78, 0]}
        rotation={[0, 5.5, 0]}
        scale={[0.2, 0.2, 0.2]}
      />

      {/* Niche en bois */}
      <primitive
        object={nicheScene.clone()}
        position={[0, 0.4, 0]}
        rotation={[0, -0.3, 0]}
        scale={[0.03, 0.03, 0.03]}
      />

      {/* Panneau Minecraft avec photo */}
      <group position={[1.4, 0.1, -0.3]} rotation={[0, -0.3, 0]}>
        <primitive
          object={signScene.clone()}
          scale={[1, 2, 1]}
        />

        {/* Photo de Talia sur le panneau */}
        <mesh position={[0.25, 0.835, 0.28]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshBasicMaterial
            map={taliaTexture}
            side={DoubleSide}
            transparent={true}
            alphaTest={0.1}
          />
        </mesh>
      </group>
    </group>
  )
}
