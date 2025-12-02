import { Stars, useGLTF } from '@react-three/drei'
import { useGame } from '../../context/GameContext'
import { useFrame } from '@react-three/fiber'
import { useRef, Suspense, useState } from 'react'
import type { Group } from 'three'

function EarthModel({ opacity = 1 }: { opacity?: number }) {
    const earth = useGLTF('/models/earth.glb')
    const earthRef = useRef<Group>(null)

    useFrame(() => {
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.01 // Rotation de la terre
            // Appliquer l'opacity aux matériaux
            earthRef.current.traverse((child: any) => {
                if (child.material) {
                    child.material.transparent = true
                    child.material.opacity = opacity
                }
            })
        }
    })

    return (
        <group ref={earthRef} position={[0, 0, 0]} scale={[0.5, 0.5, 0.5]}>
            <primitive object={earth.scene.clone()} />
        </group>
    )
}

function GalaxyModel() {
    const galaxy = useGLTF('/models/galaxy.glb')
    const galaxyRef = useRef<Group>(null)


    return (
        <group ref={galaxyRef} position={[0, 0, 1000]} scale={[30, 30, 30]}>
            <primitive object={galaxy.scene.clone()} />
        </group>
    )
}

// Précharger earth.glb pour une transition instantanée
useGLTF.preload('/models/earth.glb')

export default function SpaceEnvironment() {
    const { cinematicActive, cinematicStartTime } = useGame()
    const [spaceOpacity, setSpaceOpacity] = useState(0)

    useFrame(() => {
        if (!cinematicActive || !cinematicStartTime) return

        const elapsed = (Date.now() - cinematicStartTime) / 1000
        
        // Transition progressive entre 2.5s et 3.5s pour un fade smooth
        let targetOpacity = 0
        if (elapsed >= 2.5 && elapsed < 3.5) {
            targetOpacity = elapsed - 2.5 // Fade in sur 1 seconde
        } else if (elapsed >= 3.5) {
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
                        <EarthModel opacity={spaceOpacity} />
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
