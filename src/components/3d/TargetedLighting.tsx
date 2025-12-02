import { useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Material, Mesh } from 'three'

interface TargetedObject {
  name: string
  color: number // Couleur hex (ex: 0xff0000 pour rouge)
  flicker?: boolean // Scintillement optionnel (défaut: true)
  power?: number // Puissance de la lumière (défaut: 0.8)
}

interface TargetedLightingProps {
  modelPath: string
  targetObjects: Array<TargetedObject> // Objets avec leurs couleurs
}

export default function TargetedLighting({ modelPath, targetObjects: targets }: TargetedLightingProps) {
  const { scene } = useGLTF(modelPath)
  const targetMeshes = useRef<Array<{ mesh: Mesh; target: TargetedObject }>>([])

  useEffect(() => {
    // Rechercher les objets spécifiques par nom
    const foundObjects: Array<{ mesh: Mesh; target: TargetedObject }> = []

    scene.traverse((child) => {
      if ((child as any).isMesh) {
        const mesh = child as Mesh
        // Vérifier si le nom de l'objet correspond à un des objets ciblés
        targets.forEach(target => {
          if (mesh.name.includes(target.name)) {
            foundObjects.push({ mesh, target })

            // Modifier le matériau pour le rendre émissif avec la couleur spécifique
            if (mesh.material) {
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((mat: Material) => {
                  const material = mat as any
                  if (material.emissive && material.emissiveIntensity !== undefined) {
                    material.emissive.setHex(target.color)
                    material.emissiveIntensity = target.power ?? 0.8
                  }
                })
              } else {
                const material = mesh.material as any
                if (material.emissive && material.emissiveIntensity !== undefined) {
                  material.emissive.setHex(target.color)
                  material.emissiveIntensity = target.power ?? 0.8
                }
              }
            }
          }
        })
      }
    })

    targetMeshes.current = foundObjects
  }, [scene, targets])

  // Animation optionnelle de scintillement
  useFrame((state) => {
    const time = state.clock.elapsedTime

    targetMeshes.current.forEach(({ mesh, target }, index) => {
      // Vérifier si cet objet doit scintiller (défaut: true)
      const shouldFlicker = target.flicker ?? true
      if (!shouldFlicker) return

      if (mesh.material) {
        const phase = (index * 0.5 + time * 2) % (Math.PI * 2)
        const intensity = 0.3 + Math.sin(phase) * 0.4

        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat: any) => {
            if (mat.emissiveIntensity !== undefined) {
              mat.emissiveIntensity = Math.max(0.1, intensity)
            }
          })
        } else {
          const material = mesh.material as any
          if (material.emissiveIntensity !== undefined) {
            material.emissiveIntensity = Math.max(0.1, intensity)
          }
        }
      }
    })
  })

  return null // Ce composant ne rend rien, il modifie juste la scène existante
}
