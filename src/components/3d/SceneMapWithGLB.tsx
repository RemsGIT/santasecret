import { useGLTF } from '@react-three/drei'
import { useEffect, Suspense } from 'react'

interface SceneMapWithGLBProps {
  modelPath?: string
}

export default function SceneMapWithGLB({ modelPath = '/models/scene.glb' }: SceneMapWithGLBProps) {
  return (
    <Suspense fallback={<FallbackScene />}>
      <GLBModel modelPath={modelPath} />
    </Suspense>
  )
}

function GLBModel({ modelPath }: { modelPath: string }) {
  try {
    const { scene } = useGLTF(modelPath)
    
    useEffect(() => {
      // Configurer les matériaux de la scène pour qu'ils réagissent bien à l'éclairage
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          
          // Réduire l'émission des matériaux pour renforcer l'effet de nuit
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                if (mat.emissive) {
                  mat.emissive.multiplyScalar(0.1)
                }
              })
            } else {
              if (child.material.emissive) {
                child.material.emissive.multiplyScalar(0.1)
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
  } catch (error) {
    console.warn('Could not load GLB model, using fallback scene')
    return <FallbackScene />
  }
}

function FallbackScene() {
  return (
    <>
      {/* Sol simple */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1a3a2e" />
      </mesh>

      {/* Quelques arbres de Noël simples */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const radius = 20 + Math.random() * 10
        return (
          <group key={i} position={[
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
          ]}>
            <mesh position={[0, 2, 0]} castShadow>
              <coneGeometry args={[1.5, 4]} />
              <meshStandardMaterial color="#0d4f3c" />
            </mesh>
            <mesh position={[0, 0.5, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.3, 1]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
          </group>
        )
      })}

      {/* Quelques maisons simples */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const radius = 15
        return (
          <group key={i} position={[
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
          ]}>
            {/* Base de la maison */}
            <mesh position={[0, 1, 0]} castShadow>
              <boxGeometry args={[3, 2, 2]} />
              <meshStandardMaterial color="#654321" />
            </mesh>
            {/* Toit */}
            <mesh position={[0, 2.5, 0]} castShadow>
              <coneGeometry args={[2, 1.5, 4]} />
              <meshStandardMaterial color="#8b0000" />
            </mesh>
          </group>
        )
      })}
    </>
  )
}