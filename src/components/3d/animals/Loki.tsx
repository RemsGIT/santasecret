import { Clone, useGLTF, useTexture } from '@react-three/drei'
import { useRef } from 'react'
import { DoubleSide } from 'three'
import type { Group } from 'three'

interface LokiProps {
  position: [number, number, number]
  rotation?: [number, number, number]
}

export default function Loki({ position, rotation = [0, 0, 0] }: LokiProps) {
  const lokiRef = useRef<Group>(null)

  // Modèles 3D
  const { scene: catScene } = useGLTF('/models/animals/loki.glb')
  const { scene: nicheScene } = useGLTF('/models/animals/cat-pillow.glb')
  const { scene: signScene } = useGLTF('/models/minecraft_sign.glb')

  const burgerGltf = useGLTF('/models/animals/cat_burger.glb')
  const conserveGltf = useGLTF('/models/animals/cat-food.glb')

  // Texture pour la photo
  const lokiTexture = useTexture('/images/cats/loki.png')

  return (
    <group ref={lokiRef} position={position} rotation={rotation}>
      {/* Chat Loki */}
      <primitive
        object={catScene.clone()}
        position={[-0.1, 0.65, -1.3]}
        rotation={[0, 1.7, 0]}
        scale={[0.3, 0.3, 0.3]}
      />


      {/* Niche*/}
      <primitive
        object={nicheScene.clone()}
        position={[0, 0, 0.85]}
        rotation={[-1.5, 0, 0]}
        scale={[0.8, 0.8, 0.8]}
      />

      {/* Panneau Minecraft avec photo */}
      <group position={[1.4, 0.1, -0.3]} rotation={[0, 0, 0]}>
        <primitive
          object={signScene.clone()}
          scale={[1.2, 2.2, 1.2]}
        />

        {/* Photo de Loki sur le panneau */}
        <mesh position={[0.3, 0.9, 0.33]}>
          <planeGeometry args={[0.6, 0.6]} />
          <meshBasicMaterial
            map={lokiTexture}
            side={DoubleSide}
            transparent={true}
            alphaTest={0.1}
          />
        </mesh>
      </group>

      {/* Burger */}

      <Clone
        object={burgerGltf.scene}
        position={[-1.5, 0, -2]}
        rotation={[0, 0.68, 0]}
        scale={[0.08, 0.08, 0.08]}
      />
      <Clone
        object={burgerGltf.scene}
        position={[-2.4, 0, -2.3]}
        rotation={[0, 0.68, 0]}
        scale={[0.08, 0.08, 0.08]}
      />

      <Clone
        object={burgerGltf.scene}
        position={[1.5, 0, -2]}
        rotation={[0, 0, 0]}
        scale={[0.08, 0.08, 0.08]}
      />

      <Clone
        object={burgerGltf.scene}
        position={[1.1, 0, -2.7]}
        rotation={[0, 0., 0]}
        scale={[0.08, 0.08, 0.08]}
      />

      {/* Patée */}
      <Clone
        object={conserveGltf.scene}
        position={[-0.68, 0.2, -0.2]}
        rotation={[0, 0.2, 0]}
        scale={[0.3, 0.3, 0.3]}
      />
      <Clone
        object={conserveGltf.scene}
        position={[-0.68, 0.4, -0.2]}
        rotation={[0, 0.2, 0]}
        scale={[0.3, 0.3, 0.3]}
      />
      <Clone
        object={conserveGltf.scene}
        position={[-0.68, 0.6, -0.2]}
        rotation={[0, 0.2, 0]}
        scale={[0.3, 0.3, 0.3]}
      />



    </group>
  )
}
