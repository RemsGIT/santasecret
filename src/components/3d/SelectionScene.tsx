import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'
import { useRef } from 'react'
import Player from './Player'
import SceneMap from './SceneMap'
import ParticipantLabels from './ParticipantLabels'
import SnowSystem from './SnowSystem'
import SceneLights from '@/components/3d/SceneLights.tsx'

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

      {/* Effets de neige */}
      <SnowSystem />

      <SceneLights />

      {/* Scène de jeu */}
      <GameScene />
    </Canvas>
  )
}

function GameScene() {
  const playerRef = useRef(null)

  return (
    <>
      {/* Joueur avec lampe torche */}
      <Player ref={playerRef} />

      {/* Labels des participants dans la scène */}
      <ParticipantLabels playerRef={playerRef} />
    </>
  )
}
