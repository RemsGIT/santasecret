import { useGLTF } from '@react-three/drei'
import { Suspense, useEffect } from 'react'
import { useGame } from '../../context/GameContext'

export default function SceneMap() {
  return (
    <Suspense>
      <GLBModel />
    </Suspense>
  )
}

function GLBModel() {
  const { scene } = useGLTF('/models/scene.glb')

  useEffect(() => {
    // Configurer les matériaux de la scène pour qu'ils réagissent bien à l'éclairage
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true

        // Garder les couleurs d'origine, juste réduire un peu l'émission pour l'ambiance nocturne
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat: any) => {
              if (mat.emissive) {
                mat.emissive.multiplyScalar(0.05)
              }
            })
          } else {
            if (child.material.emissive) {
              child.material.emissive.multiplyScalar(0.05)
            }
          }
        }
      }
    })
  }, [scene])

  return (
    <primitive
      object={scene}
      position={[0, 0, 0]}
      scale={[1, 1, 1]}
    />
  )
}

// Preload du modèle GLB
useGLTF.preload('/models/scene.glb')
