import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'
import { useRef, useState } from 'react'
import Player from './Player'
import SceneMap from './SceneMap'
import SnowSystem from './SnowSystem'
import HouseSigns from './HouseSigns'
import TargetedLighting from './TargetedLighting'
import CollisionSystem from './CollisionSystem'
import type { Mesh } from 'three'

export default function SelectionScene() {
  return (
    <Canvas
      camera={{
        position: [0, 3, 6],
        fov: 100,
        near: 0.5,
        far: 1000
      }}
      shadows
      className="h-full w-full"
    >
      {/* Éclairage global très faible pour créer l'ambiance de nuit profonde */}

      <ambientLight intensity={1} color="#0a0a1a" />
      <hemisphereLight
        groundColor="#050510"
        intensity={0.002}
      />

      {/* Environnement sombre */}
      <Environment preset="night" environmentIntensity={0.1} />

      {/* Contrôles de caméra désactivés pour le jeu */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
        target={new Vector3(0, 0, 0)}
      />

      {/* Map de Noël */}
      <SceneMap />

      {/* Illuminer les boules de Noël avec leurs couleurs */}
      <TargetedLighting
        modelPath="/models/scene.glb"
        targetObjects={[
          { name: 'polySurface231_Deco3_0', color: 0x00ff00, flicker: true }, // Vert
          { name: 'polySurface229_Deco2_0', color: 0x0066ff, flicker: true }, // Bleu
          { name: 'polySurface199_Deco1_0', color: 0xff0000, flicker: true }, // Rouge
          { name: 'polySurface228_Deco4_0', color: 0xFF00C7, flicker: true }, // Violet
          { name: 'Chrimah_Lights_3_Bulb_Blue_0', color: 0x0066ff, flicker: true }, // Guirlande bleue cabane
          { name: 'Chrimah_Lights_3_Bulb_Yeller1_0', color: 0xFBFF00, flicker: true }, // Guirlande jaune cabane
          { name: 'Chrimah_Lights_3_Bulb_Green1_0', color: 0x00ff00, flicker: true }, // Guirlande vert cabane
          { name: 'Chrimah_Lights_3_Bulb_red_0', color: 0xff0000, flicker: true }, // Guirlande rouge cabane
          { name: 'Lamp4_Window_Light_0', color: 0xE78D43, flicker: false }, // Lampadaire - fenetres orange chaud
          { name: 'Chrimas_Star_Star_Mat_0', color: 0xFBFF00, flicker: false }, // Étoile
        ]}
      />

      {/* Effets de neige */}
      <SnowSystem />

      {/* Scène de jeu */}
      <GameScene />
    </Canvas>
  )
}

function GameScene() {
  const playerRef = useRef(null)
  const [houses, setHouses] = useState<Mesh[]>([])

  return (
    <>
      {/* Système de collision */}
      <CollisionSystem
        modelPath="/models/scene.glb"
        onCollisionDataReady={setHouses}
      />

      {/* Joueur avec lampe torche et collision */}
      <Player ref={playerRef} houses={houses} />

      {/* Pancartes des maisons */}
      <HouseSigns />
    </>
  )
}
