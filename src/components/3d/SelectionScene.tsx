import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls, Stars, useGLTF, KeyboardControls } from '@react-three/drei'
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier'
import { Vector3 } from 'three'
import { useRef, useState } from 'react'
import {
  InteractionContext,
  useInteraction,
} from '../../context/InteractionContext'
import { useGame } from '../../context/GameContext'
import Player from './Player'
import SceneMap from './SceneMap'
import SnowSystem from './SnowSystem'
import HouseSigns from './HouseSigns'
import TargetedLighting from './TargetedLighting'
import CollisionSystem from './CollisionSystem'
import Animals from './Animals'
import CinematicController from './CinematicController'
import SpaceEnvironment from './SpaceEnvironment'
import type { Mesh } from 'three'

// Précharger earth.glb dès le chargement du composant principal
useGLTF.preload('/models/earth.glb')

export default function SelectionScene() {
  const interactionContext = useInteraction()
  const { cinematicActive } = useGame()
  
  // Configuration des touches pour KeyboardControls
  const map = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD'] },
    { name: 'run', keys: ['Shift'] },
  ]

  return (
    <KeyboardControls map={map}>
      <Canvas
        camera={{
          position: [0, 3, 6],
          fov: 100,
          near: 0.5,
          far: 1000,
        }}
        shadows
        className="h-full w-full"
      >
        <InteractionContext.Provider value={interactionContext}>
        {/* Environnement sombre */}
        <Environment preset="night" environmentIntensity={0.2} />

        {/* Contrôles de caméra désactivés pour le jeu */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
          target={new Vector3(0, 0, 0)}
          enabled={!cinematicActive}
        />

        {/* Scène de jeu visible jusqu'à transition vers espace */}
        <GameSceneElements />

        <Stars
          radius={0}
          depth={200}
          count={5000}
          factor={10}
          saturation={0}
          fade
          speed={0.5}
        />

        {/* Éléments UI/décorations - cachés pendant cinématique */}
        {!cinematicActive && (
          <>
            {/* Effets de neige */}
            <SnowSystem />
          </>
        )}

        {/* Cinématique - toujours présente */}
        <SpaceEnvironment />
        <CinematicController />

        {/* Scène de jeu */}
        <GameScene />
      </InteractionContext.Provider>
    </Canvas>
    </KeyboardControls>
  )
}

function GameSceneElements() {
  const { cinematicActive, cinematicStartTime } = useGame()
  const [showScene, setShowScene] = useState(true)

  useFrame(() => {
    if (!cinematicActive || !cinematicStartTime) {
      if (!showScene) setShowScene(true)
      return
    }

    const elapsed = (Date.now() - cinematicStartTime) / 1000
    // Cacher la scène exactement quand earth.glb remplace scene.glb (fin de phase 2)
    const shouldShowScene = elapsed < 10

    if (shouldShowScene !== showScene) {
      setShowScene(shouldShowScene)
    }
  })

  if (!showScene && cinematicActive) return null

  return (
    <>
      {/* Map de Noël */}
      <SceneMap />

      {/* Illuminer les boules de Noël avec leurs couleurs */}
      <TargetedLighting
        modelPath="/models/scene.glb"
        targetObjects={[
          {
            name: 'Chrimah_Lights_3_Bulb_Blue_0',
            color: 0x0066ff,
            flicker: true,
          },
          {
            name: 'Chrimah_Lights_3_Bulb_Yeller1_0',
            color: 0xfbff00,
            flicker: true,
          },
          {
            name: 'Chrimah_Lights_3_Bulb_Green1_0',
            color: 0x00ff00,
            flicker: true,
          },
          {
            name: 'Chrimah_Lights_3_Bulb_red_0',
            color: 0xff0000,
            flicker: true,
          },
          { name: 'House_1_Window_Light_0', color: 0xe78d43, flicker: false },
          {
            name: 'polySurface4605_LP_set1_0',
            color: 0xfbff00,
            flicker: false,
            power: 6,
          },
          {
            name: 'base_big_LP_set2_0',
            color: 0x036a36,
            flicker: false,
            power: 0.04,
          },
        ]}
      />
    </>
  )
}

function GameScene() {
  const playerRef = useRef(null)
  const [houses, setHouses] = useState<Array<Mesh>>([])
  const { cinematicActive } = useGame()

  return (
    <>
      {/* Système de collision */}
      <CollisionSystem
        modelPath="/models/scene.glb"
        onCollisionDataReady={setHouses}
      />

      {/* Physique Rapier pour le joueur */}
      <Physics>
        <Player ref={playerRef} houses={houses} />
        
        {/* Sol invisible pour éviter de tomber */}
        <RigidBody type="fixed">
          <CuboidCollider args={[50, 0.5, 50]} position={[0, -2, 0]} />
        </RigidBody>
      </Physics>

      {/* Éléments visibles seulement quand pas en cinématique */}
      {!cinematicActive && (
        <>
          {/* Pancartes des maisons */}
          <HouseSigns />

          {/* Animaux et niches */}
          <Animals />
        </>
      )}
    </>
  )
}
