import { useGLTF, useTexture } from '@react-three/drei'
import { useRef } from 'react'
import { DoubleSide } from 'three'
import type { Group } from 'three'
import TargetedLighting from '../TargetedLighting'

interface MollyProps {
  position: [number, number, number]
  rotation?: [number, number, number]
}

export default function Molly({
  position,
  rotation = [0, 0, 0]
}: MollyProps) {
  const mollyRef = useRef<Group>(null)

  // Modèles 3D
  const { scene: catScene } = useGLTF('/models/animals/molly.glb')
  const { scene: nicheScene } = useGLTF('/models/animals/cats_house.glb')
  const { scene: signScene } = useGLTF('/models/minecraft_sign.glb')
  const headbandGltf = useGLTF('/models/christmas_reindeer_headband.glb')


  // Texture pour la photo
  const mollyTexture = useTexture('/images/cats/molly.png')

  return (
    <group ref={mollyRef} position={position} rotation={rotation}>
      {/* Chat Molly */}
      <primitive
        object={catScene.clone()}
        position={[1.2, 2.3, 2.5]}
        rotation={[0, -1.4, 0]}
        scale={[0.0035, 0.0035, 0.0035]}
      />

      {/* Niche */}
      <primitive
        object={nicheScene.clone()}
        position={[1.2, 0.1, 2.5]}
        rotation={[0, 3.7, 0]}
        scale={[0.015, 0.015, 0.015]}
      />

      {/* Panneau Minecraft avec photo */}
      <group position={[-0.1, 0.1, 1.3]} rotation={[0, 4, 0]}>
        <primitive
          object={signScene.clone()}
          scale={[1, 2, 1]}
        />

        {/* Photo de Molly sur le panneau */}
        <mesh position={[0.25, 0.835, 0.28]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshBasicMaterial
            map={mollyTexture}
            side={DoubleSide}
            transparent={true}
            alphaTest={0.1}
          />
        </mesh>

        <primitive
          object={headbandGltf.scene}
          position={[0, 4, -2]}
          rotation={[0, -0.3, 0]}
          scale={[12, 12, 12]}
        />

        {/* Illumination du headband */}
        <TargetedLighting
          modelPath="/models/christmas_reindeer_headband.glb"
          targetObjects={[
            { name: 'FocoVerde_blinn2_0', color: 0x00ff00, flicker: false, power: 1 },
            { name: 'FocoRojo1_blinn3_0', color: 0xff0000, flicker: false, power: 1 },
            { name: 'Orejas_de_reno_blinn1_0', color: 0xff0000, flicker: false, power: 0.3 },
          ]}
        />

      </group>
    </group>
  )
}
