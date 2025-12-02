import { Stars, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Suspense, useRef, useState } from 'react'
import { useGame } from '../../context/GameContext'
import type { Group } from 'three'

function EarthModel({ opacity = 1, elapsed }: { opacity?: number, elapsed: number }) {
    const earth = useGLTF('/models/earth.glb')
    const earthRef = useRef<Group>(null)

    useFrame(() => {
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.005 // Rotation très douce de la terre
            // Appliquer l'opacity aux matériaux
            earthRef.current.traverse((child: any) => {
                if (child.material) {
                    child.material.transparent = true
                    child.material.opacity = opacity
                }
            })
        }
    })

    // Échelle fixe : earth.glb apparaît directement à une bonne taille, vue de l'extérieur
    let scale = 1.5 // Taille raisonnable pour être bien visible
    if (elapsed >= 4 && elapsed < 8) {
        // Léger dézoom progressif pour mieux voir
        const earthElapsed = elapsed - 4
        scale = 1.5 - (earthElapsed * 0.125) // De 1.5 à 1 en 4 secondes
    } else if (elapsed >= 8) {
        scale = 1 // Taille finale
    }

    return (
        <group ref={earthRef} position={[0, 0, 50]} scale={[scale, scale, scale]}>
            <primitive object={earth.scene.clone()} />
        </group>
    )
}

function GalaxyModel() {
    const galaxy = useGLTF('/models/galaxy.glb')
    const galaxyRef = useRef<Group>(null)

    useFrame(() => {
        if (galaxyRef.current) {
            galaxyRef.current.rotation.y += 0.002 // Rotation très légère, plus lente que earth
        }
    })

    return (
        <group ref={galaxyRef} position={[0, 0, 1000]} scale={[30, 30, 30]} rotation={[0, 0, 0]}>
            <primitive object={galaxy.scene.clone()} />
        </group>
    )
}

// Précharger tous les assets pour éviter les freezes
useGLTF.preload('/models/earth.glb')
useGLTF.preload('/models/galaxy.glb')

export default function SpaceEnvironment() {
    const { cinematicActive, cinematicStartTime } = useGame()
    const [spaceOpacity, setSpaceOpacity] = useState(0)
    const [elapsed, setElapsed] = useState(0)

    useFrame(() => {
        if (!cinematicActive || !cinematicStartTime) return

        const currentElapsed = (Date.now() - cinematicStartTime) / 1000
        setElapsed(currentElapsed)

        // Transition progressive entre 2.5s et 3.5s pour un fade smooth
        let targetOpacity = 0
        if (currentElapsed >= 2.5 && currentElapsed < 3.5) {
            targetOpacity = currentElapsed - 2.5 // Fade in sur 1 seconde
        } else if (currentElapsed >= 3.5) {
            targetOpacity = 1
        }

        if (Math.abs(targetOpacity - spaceOpacity) > 0.01) {
            setSpaceOpacity(targetOpacity)
        }
    })

    if (!cinematicActive) return null

    return (
        <group>
            {/* Fond étoilé pour l'espace avec transition progressive */}
            {spaceOpacity > 0 && (
                <group>
                    <Stars radius={1000} depth={200} count={5000} factor={8} saturation={0} fade speed={0.5} />

                    {/* Chargement des modèles avec fade progressif */}
                    <Suspense fallback={null}>
                        <EarthModel opacity={spaceOpacity} elapsed={elapsed} />
                        <GalaxyModel />
                    </Suspense>

                    {/* Éclairage pour l'espace avec intensité progressive */}
                    <ambientLight intensity={0.3 * spaceOpacity} />
                    <directionalLight
                        position={[100, 100, 50]}
                        intensity={1.5 * spaceOpacity}
                        color="#ffffff"
                    />

                    {/* Lumière pour la galaxie */}
                    <pointLight
                        position={[0, 0, 1000]}
                        intensity={5 * spaceOpacity}
                        distance={500}
                        color="#8b5cf6"
                    />
                </group>
            )}
        </group>
    )
}
