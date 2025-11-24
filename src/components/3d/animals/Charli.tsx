import { useGLTF, useTexture } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { DoubleSide } from 'three'
import type { Group } from 'three'

interface CharliProps {
  position: [number, number, number]
  rotation?: [number, number, number]
}

export default function Charli({
  position,
  rotation = [0, 0, 0]
}: CharliProps) {
  const charliRef = useRef<Group>(null)

  // Modèles 3D
  const { scene: catScene } = useGLTF('/models/animals/charli.glb')
  const { scene: nicheScene } = useGLTF('/models/animals/cat-house-elephant.glb')
  const { scene: signScene } = useGLTF('/models/minecraft_sign.glb')

  // Texture pour la photo
  const charliTexture = useTexture('/images/cats/charli.png')

  return (
    <group ref={charliRef} position={position} rotation={rotation}>
      {/* Chat Charli */}
      <primitive
        object={catScene.clone()}
        position={[-0.3, 0.4, 0.1]}
        rotation={[0, 5.2, 0]}
        scale={[0.5, 0.5, 0.5]}
      />

      {/* Niche en bois */}
      <primitive
        object={nicheScene.clone()}
        position={[0, 0.4, 0]}
        rotation={[0, -0.3, 0]}
        scale={[3, 3, 3]}
      />

      {/* Panneau Minecraft avec photo */}
      <group position={[1.1, 0.1, 0.2]} rotation={[0, -0.9, 0]}>
        <primitive
          object={signScene.clone()}
          scale={[1, 2, 1]}
        />

        {/* Photo de Charli sur le panneau */}
        <mesh position={[0.25, 0.835, 0.28]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshBasicMaterial
            map={charliTexture}
            side={DoubleSide}
            transparent={true}
            alphaTest={0.1}
          />
        </mesh>
      </group>
    </group>
  )
}
