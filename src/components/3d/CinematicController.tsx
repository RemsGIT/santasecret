import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useGame } from '../../context/GameContext'
import { useEffect, useRef } from 'react'

export default function CinematicController() {
    const { cinematicActive, cinematicStartTime } = useGame()
    const { camera } = useThree()
    
    const startPosRef = useRef(new Vector3())

    useEffect(() => {
        if (cinematicActive) {
            // Sauvegarder la position du joueur
            startPosRef.current.copy(camera.position)
        }
    }, [cinematicActive, camera])

    useFrame(() => {
        if (!cinematicActive || !cinematicStartTime) return

        const elapsed = (Date.now() - cinematicStartTime) / 1000

        // Phase 1 (0-3s): Dézoom vertical accéléré pour rendre scene.glb très petite
        if (elapsed < 3) {
            const t = elapsed / 3
            const eased = easeInOutQuad(t)
            
            // Dézoom vertical progressif : monter très haut pour voir scene.glb comme une petite planète
            camera.position.lerpVectors(
                startPosRef.current,
                new Vector3(0, 200, 150), // Montée très haute pour rendre scene.glb minuscule
                eased
            )
            
            // Regarder vers le bas/centre progressivement
            const lookTarget = new Vector3()
            const playerLookTarget = startPosRef.current.clone().add(new Vector3(0, -2, 0))
            
            lookTarget.lerpVectors(
                playerLookTarget,
                new Vector3(0, 0, 0), // Regarder vers le centre
                eased
            )
            camera.lookAt(lookTarget)
        }
        // Phase 2 (3-4s): Transition et positionnement pour earth.glb
        else if (elapsed < 4) {
            camera.position.set(0, 200, 150) // Maintenir position haute
            camera.lookAt(0, 0, 0)
        }
        // Phase 3 (4-6s): Repositionnement plus distant pour voir earth.glb
        else if (elapsed < 6) {
            const t = Math.min((elapsed - 4) / 1, 1) // Transition rapide 1s puis pause
            const eased = easeInOutQuad(t)
            
            if (elapsed < 5) {
                camera.position.lerpVectors(
                    new Vector3(0, 200, 150),
                    new Vector3(0, 50, 120), // Position plus éloignée d'earth.glb
                    eased
                )
            } else {
                camera.position.set(0, 50, 120) // Pause à distance
            }
            camera.lookAt(0, 0, 0)
        }
        // Phase 4 (6-10s): Foncer vers galaxy.glb rapidement
        else if (elapsed < 10) {
            const t = (elapsed - 6) / 4
            const eased = easeInOutQuad(t)
            
            // Transition rapide vers la galaxie
            camera.position.lerpVectors(
                new Vector3(0, 50, 120),
                new Vector3(0, 0, 800),
                eased
            )
            
            // Transition du regard terre → galaxie
            const lookTarget = new Vector3()
            lookTarget.lerpVectors(
                new Vector3(0, 0, 0),     // Regarder earth.glb
                new Vector3(0, 0, 1000),  // Regarder galaxy.glb
                eased
            )
            camera.lookAt(lookTarget)
        }
        // Phase 5 (10-12s): Pause devant galaxy.glb
        else if (elapsed < 12) {
            camera.position.set(0, 0, 800)
            camera.lookAt(0, 0, 1000)
        }
        // Phase 6 (12-14s): Traverser galaxy.glb
        else if (elapsed < 14) {
            const t = (elapsed - 12) / 2
            const eased = easeInOutQuad(t)
            
            camera.position.lerpVectors(
                new Vector3(0, 0, 800),
                new Vector3(0, 0, 1200),
                eased
            )
            camera.lookAt(0, 0, 1300)
        }
        // Fin - Position finale
        else {
            camera.position.set(0, 0, 1200)
            camera.lookAt(0, 0, 1300)
        }
    })

    return null
}

// Fonction d'easing simple et fluide
function easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}