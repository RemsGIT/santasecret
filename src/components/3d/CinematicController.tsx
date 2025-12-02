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
                new Vector3(0, 150, 100), // Montée très haute pour rendre scene.glb minuscule
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
        // Phase 2 (3-8s): Maintenir position pour voir earth.glb
        else if (elapsed < 8) {
            camera.position.set(0, 150, 100) // Position fixe pour voir earth.glb
            camera.lookAt(0, 0, 0)
        }
        // Phase 3 (8-10s): Avancement vers la galaxie (2s avant de la montrer)
        else if (elapsed < 10) {
            const t = (elapsed - 8) / 2
            const eased = easeInOutQuad(t)

            // Transition rapide vers la galaxie en 2 secondes
            camera.position.lerpVectors(
                new Vector3(0, 150, 100), // Partir de la position actuelle
                new Vector3(0, 0, 800),   // Arriver devant la galaxie
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
        // Phase 4 (10-12s): Pause devant galaxy.glb pour l'admirer
        else if (elapsed < 12) {
            camera.position.set(0, 0, 800)
            camera.lookAt(0, 0, 1000)
        }
        // Phase 5 (12-14s): Traverser galaxy.glb
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
        // Phase 6 (14s+): Scène finale - Christmas Ball en mode visualisateur 3D
        else {
            // Position de caméra optimale pour visualisateur 3D
            camera.position.set(0, 2, 8) // Légèrement au-dessus, assez près pour voir les détails
            camera.lookAt(0, 0, 0) // Regarder directement la boule au centre
        }
    })

    return null
}

// Fonction d'easing simple et fluide
function easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}
