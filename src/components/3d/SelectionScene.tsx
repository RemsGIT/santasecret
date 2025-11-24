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
import Animals from './Animals'
import NightSky from './NightSky'
import type { Mesh } from 'three'
import { InteractionContext, useInteraction } from '../../context/InteractionContext'

export default function SelectionScene() {
  const interactionContext = useInteraction()
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
      <InteractionContext.Provider value={interactionContext}>
        {/* Éclairage global très faible pour créer l'ambiance de nuit profonde */}

        <ambientLight intensity={1} color="#0a0a1a" />
        <hemisphereLight
          groundColor="#050510"
          intensity={0.002}
        />

        {/* Environnement sombre */}
        <Environment preset="night" environmentIntensity={0.2} />

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
            { name: 'Chrimah_Lights_3_Bulb_Blue_0', color: 0x0066ff, flicker: true }, // Guirlande bleue cabane
            { name: 'Chrimah_Lights_3_Bulb_Yeller1_0', color: 0xFBFF00, flicker: true }, // Guirlande jaune cabane
            { name: 'Chrimah_Lights_3_Bulb_Green1_0', color: 0x00ff00, flicker: true }, // Guirlande vert cabane
            { name: 'Chrimah_Lights_3_Bulb_red_0', color: 0xff0000, flicker: true }, // Guirlande rouge cabane
            { name: 'House_1_Window_Light_0', color: 0xE78D43, flicker: false }, // Lampadaire - fenetres orange chaud
            { name: 'polySurface4605_LP_set1_0', color: 0xFBFF00, flicker: false, power: 6 }, // Guirlandes sapin
            { name: 'base_big_LP_set2_0', color: 0x036A36, flicker: false, power: 0.04 }, // Sapin + base
          ]}
        />

        {/* Ciel étoilé avec lune */}
        <NightSky />

        {/* Effets de neige */}
        <SnowSystem />

        {/* Scène de jeu */}
        <GameScene />
      </InteractionContext.Provider>
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

      {/* Animaux et niches */}
      <Animals />
    </>
  )
}
