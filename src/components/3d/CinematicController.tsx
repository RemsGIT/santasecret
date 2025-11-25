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

        // Phase 1 (0-4s): Dézoom du personnage pour voir earth.glb
        if (elapsed < 4) {
            const t = elapsed / 4
            const eased = easeInOutQuad(t)
            
            camera.position.lerpVectors(
                startPosRef.current,
                new Vector3(0, 5, 30), // Position plus proche pour voir earth.glb
                eased
            )
            camera.lookAt(0, 0, 0)
        }
        // Phase 2 (4-7s): Pause sur earth.glb
        else if (elapsed < 7) {
            camera.position.set(0, 5, 30)
            camera.lookAt(0, 0, 0)
        }
        // Phase 3 (7-12s): Voyage direct vers galaxy.glb
        else if (elapsed < 12) {
            const t = (elapsed - 7) / 5
            const eased = easeInOutQuad(t)
            
            // Transition fluide vers la galaxie
            camera.position.lerpVectors(
                new Vector3(0, 5, 30),
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
        // Phase 4 (12-14s): Pause devant galaxy.glb
        else if (elapsed < 14) {
            camera.position.set(0, 0, 800)
            camera.lookAt(0, 0, 1000)
        }
        // Phase 5 (14-16s): Traverser galaxy.glb
        else if (elapsed < 16) {
            const t = (elapsed - 14) / 2
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