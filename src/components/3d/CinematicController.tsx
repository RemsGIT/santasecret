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

        // Phase 1 (0-5s): Dézoom du personnage pour voir earth.glb à la place de la scène
        if (elapsed < 5) {
            const t = elapsed / 5
            const eased = easeInOutQuad(t)
            
            camera.position.lerpVectors(
                startPosRef.current,
                new Vector3(0, 10, 50), // Position pour voir earth.glb en entier
                eased
            )
            camera.lookAt(0, 0, 0) // Regarder earth.glb au centre
        }
        // Phase 2 (5-8s): Pause pour voir earth.glb qui rotate à la place de la scène
        else if (elapsed < 8) {
            camera.position.set(0, 10, 50)
            camera.lookAt(0, 0, 0) // Regarder earth.glb
        }
        // Phase 3 (8-12s): Avancer en passant derrière earth.glb
        else if (elapsed < 12) {
            const t = (elapsed - 8) / 4
            const eased = easeInOutQuad(t)
            
            camera.position.lerpVectors(
                new Vector3(0, 10, 50),
                new Vector3(0, 0, -30), // Passer derrière earth.glb
                eased
            )
            camera.lookAt(0, 0, 0) // Continuer à regarder earth.glb
        }
        // Phase 4 (12-15s): Voyage vers galaxy.glb
        else if (elapsed < 15) {
            const t = (elapsed - 12) / 3
            const eased = easeInOutQuad(t)
            
            camera.position.lerpVectors(
                new Vector3(0, 0, -30),
                new Vector3(0, 0, 800), // Devant galaxy.glb
                eased
            )
            camera.lookAt(0, 0, 1000) // Regarder galaxy.glb
        }
        // Phase 5 (15-17s): Pause devant galaxy.glb
        else if (elapsed < 17) {
            camera.position.set(0, 0, 800)
            camera.lookAt(0, 0, 1000) // Regarder galaxy.glb
        }
        // Phase 6 (17-20s): Traverser galaxy.glb au centre
        else if (elapsed < 20) {
            const t = (elapsed - 17) / 3
            const eased = easeInOutQuad(t)
            
            camera.position.lerpVectors(
                new Vector3(0, 0, 800),
                new Vector3(0, 0, 1200), // Traverser au centre
                eased
            )
            camera.lookAt(0, 0, 1300) // Regarder vers l'avant
        }
        // Fin - Position finale pour le reveal
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