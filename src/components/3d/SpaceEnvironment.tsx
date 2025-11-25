import { Stars, useGLTF } from '@react-three/drei'
import { useGame } from '../../context/GameContext'
import { useFrame } from '@react-three/fiber'
import { useRef, Suspense } from 'react'
import type { Group } from 'three'

function EarthModel() {
    const earth = useGLTF('/models/earth.glb')
    const earthRef = useRef<Group>(null)

    useFrame(() => {
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.01 // Rotation de la terre
        }
    })

    return (
        <group ref={earthRef} position={[0, 0, 0]} scale={[0.1,0.1,0.1]}>
            <primitive object={earth.scene.clone()} />
        </group>
    )
}

function GalaxyModel() {
    const galaxy = useGLTF('/models/galaxy.glb')
    const galaxyRef = useRef<Group>(null)

    useFrame(() => {
        if (galaxyRef.current) {
            galaxyRef.current.rotation.y += 0.005 // Rotation lente de la galaxie
            galaxyRef.current.rotation.z += 0.002
        }
    })

    return (
        <group ref={galaxyRef} position={[0, 0, 1000]} scale={[30, 30, 30]}>
            <primitive object={galaxy.scene.clone()} />
        </group>
    )
}

export default function SpaceEnvironment() {
    const { cinematicActive } = useGame()

    if (!cinematicActive) return null

    return (
        <group>
            {/* Fond étoilé pour l'espace */}
            <Stars radius={1000} depth={200} count={5000} factor={8} saturation={0} fade speed={0.5} />

            {/* Chargement des modèles seulement en cinématique */}
            <Suspense fallback={null}>
                <EarthModel />
                <GalaxyModel />
            </Suspense>

            {/* Éclairage pour l'espace */}
            <ambientLight intensity={0.3} />
            <directionalLight
                position={[100, 100, 50]}
                intensity={1.5}
                color="#ffffff"
            />

            {/* Lumière pour la galaxie */}
            <pointLight
                position={[0, 0, 1000]}
                intensity={5}
                distance={500}
                color="#8b5cf6"
            />
        </group>
    )
}
