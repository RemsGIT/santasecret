import { Stars, useGLTF, useAnimations, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Suspense, useRef, useState, useEffect } from 'react'
import { useGame } from '../../context/GameContext'
import type { Group } from 'three'

function EarthModel({ elapsed }: { elapsed: number }) {
    const earth = useGLTF('/models/earth.glb')
    const earthRef = useRef<Group>(null)

    useFrame(() => {
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.0005
        }
    })

    // Masquer earth.glb après 14s pour ne montrer que la boule
    if (elapsed >= 14) return null

    // N'apparaît qu'après 2.5s
    if (elapsed < 2.5) return null

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
            <primitive object={earth.scene} />
        </group>
    )
}

function GalaxyModel() {
    const galaxy = useGLTF('/models/galaxy.glb')
    const galaxyRef = useRef<Group>(null)

    useFrame(() => {
        if (galaxyRef.current) {
            galaxyRef.current.rotation.y += 0.0001 // Rotation très légère, plus lente que earth
        }
    })

    return (
        <group ref={galaxyRef} position={[-80, 80, 1000]} scale={[55, 55, 55]} rotation={[250, 0, 0]}>
            <primitive object={galaxy.scene} />
        </group>
    )
}

function SantaDanceModel({ elapsed }: { elapsed: number }) {
    const { scene, animations } = useGLTF('/models/santa-dance.glb')
    const santaRef = useRef<Group>(null)
    const { actions } = useAnimations(animations, santaRef)

    // Lancer l'animation en boucle dès que le modèle est prêt
    useEffect(() => {
        if (Object.keys(actions).length > 0) {
            const firstAction = Object.values(actions)[0]
            if (firstAction) {
                firstAction.reset().fadeIn(0.5).play()
                firstAction.setLoop(2201, Infinity) // Répétition infinie
                firstAction.timeScale = 1.5
            }
        }
    }, [actions])

    // Apparition après la traversée de galaxy (14s+)
    const shouldShow = elapsed >= 14

    if (!shouldShow) return null

    return (
        <group ref={santaRef} position={[0, 55, 75]} scale={[2, 2, 2]}>
            <primitive object={scene} />
        </group>
    )
}

function TurkeyLeft({ elapsed }: { elapsed: number }) {
    const { scene, animations } = useGLTF('/models/dancing_turkey.glb')
    const turkeyRef = useRef<Group>(null)
    const { actions } = useAnimations(animations, turkeyRef)

    useEffect(() => {
        if (Object.keys(actions).length > 0) {
            const chickenDanceAction = actions['chicken dance']
            if (chickenDanceAction) {
                chickenDanceAction.reset().fadeIn(0.5).play()
                chickenDanceAction.setLoop(2201, Infinity)
                chickenDanceAction.timeScale = 1.2
            }
        }
    }, [actions])

    const shouldShow = elapsed >= 14
    if (!shouldShow) return null

    return (
        <group ref={turkeyRef} position={[-20, 58, 65]} scale={[8, 8, 8]}>
            <primitive object={scene} />
        </group>
    )
}

function TurkeyRight({ elapsed }: { elapsed: number }) {
    const { scene, animations } = useGLTF('/models/dancing_turkey-2.glb')
    const turkeyRef = useRef<Group>(null)
    const { actions } = useAnimations(animations, turkeyRef)

    useEffect(() => {
        if (Object.keys(actions).length > 0) {
            const kickLegsAction = actions['kick legs']
            if (kickLegsAction) {
                kickLegsAction.reset().fadeIn(0.5).play()
                kickLegsAction.setLoop(2201, Infinity)
                kickLegsAction.timeScale = 1.2
            }
        }
    }, [actions])

    const shouldShow = elapsed >= 14
    if (!shouldShow) return null

    return (
        <group ref={turkeyRef} position={[24, 58, 65]} scale={[8, 8, 8]}>
            <primitive object={scene} />
        </group>
    )
}

function MagicTextReveal({ elapsed }: { elapsed: number }) {
    const [revealedText, setRevealedText] = useState('')
    const fullText = "SANTA SECRET 2025"

    useEffect(() => {
        if (elapsed >= 16) { // Commencer la révélation 2s après l'apparition de la boule
            const textStartTime = elapsed - 16
            const charDelay = 0.1 // 0.1s entre chaque lettre
            const revealedChars = Math.floor(textStartTime / charDelay)

            if (revealedChars <= fullText.length) {
                setRevealedText(fullText.substring(0, revealedChars))
            }
        }
    }, [elapsed, fullText])

    const shouldShow = elapsed >= 16
    if (!shouldShow) return null

    return (
        <Text
            position={[0, -12, 5]}
            fontSize={1}
            color="#FFD700"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#8B4513"
        >
            {revealedText}
        </Text>
    )
}

function ChristmasBallModel({ elapsed }: { elapsed: number }) {
    const { scene } = useGLTF('/models/christmas_ball-2.glb')
    const ballRef = useRef<Group>(null)

    // Apparition après la traversée de galaxy (14s+)
    const shouldShow = elapsed >= 14

    if (!shouldShow) return null

    return (
        <group ref={ballRef} position={[0, -3, 0]} scale={[0.05, 0.05, 0.05]}>
            <primitive object={scene} />
            {/* Santa qui danse à l'intérieur de la boule */}
            <SantaDanceModel elapsed={elapsed} />
            <TurkeyLeft elapsed={elapsed} />
            <TurkeyRight elapsed={elapsed} />
            {/* Texte magique qui se révèle */}
            <MagicTextReveal elapsed={elapsed} />
        </group>
    )
}

// Précharger tous les assets pour éviter les freezes
useGLTF.preload('/models/earth.glb')
useGLTF.preload('/models/galaxy.glb')
useGLTF.preload('/models/christmas_ball-2.glb')
useGLTF.preload('/models/santa-dance.glb')
useGLTF.preload('/models/dancing_turkey.glb')
useGLTF.preload('/models/dancing_turkey-2.glb')

export default function SpaceEnvironment() {
    const { cinematicActive, cinematicStartTime } = useGame()
    const [spaceOpacity, setSpaceOpacity] = useState(0)
    const [ballOpacity, setBallOpacity] = useState(0)
    const [elapsed, setElapsed] = useState(0)

    useFrame(() => {
        if (!cinematicActive || !cinematicStartTime) return

        const currentElapsed = (Date.now() - cinematicStartTime) / 1000
        setElapsed(currentElapsed)

        // Transition progressive entre 2.5s et 3.5s pour un fade smooth de l'espace
        let targetSpaceOpacity = 0
        if (currentElapsed >= 2.5 && currentElapsed < 3.5) {
            targetSpaceOpacity = currentElapsed - 2.5 // Fade in sur 1 seconde
        } else if (currentElapsed >= 3.5 && currentElapsed < 14) {
            targetSpaceOpacity = 1
        } else if (currentElapsed >= 14 && currentElapsed < 15) {
            // Fade out de l'espace entre 14s et 15s
            targetSpaceOpacity = 1 - (currentElapsed - 14)
        } else if (currentElapsed >= 15) {
            targetSpaceOpacity = 0
        }

        // Transition progressive pour la boule entre 14.5s et 15.5s
        let targetBallOpacity = 0
        if (currentElapsed >= 14.5 && currentElapsed < 15.5) {
            targetBallOpacity = currentElapsed - 14.5 // Fade in sur 1 seconde
        } else if (currentElapsed >= 15.5) {
            targetBallOpacity = 1
        }

        if (Math.abs(targetSpaceOpacity - spaceOpacity) > 0.01) {
            setSpaceOpacity(targetSpaceOpacity)
        }
        if (Math.abs(targetBallOpacity - ballOpacity) > 0.01) {
            setBallOpacity(targetBallOpacity)
        }
    })

    if (!cinematicActive) return null

    return (
        <group>
            {/* Fond étoilé pour l'espace avec transition progressive */}
            {spaceOpacity > 0 && (
                <group>
                    <Stars radius={0} depth={200} count={5000} factor={8} saturation={0} fade speed={0.5} />

                    {/* Chargement des modèles avec fade progressif */}
                    <Suspense fallback={null}>
                        <EarthModel elapsed={elapsed} />
                        <GalaxyModel />
                    </Suspense>x
                </group>
            )}

            {/* Scène finale : Christmas Ball avec fade séparé */}
            {ballOpacity > 0 && (
                <group>
                  <Stars radius={0} depth={100} count={5000} factor={8} saturation={0} fade speed={0.5} />

                  <Suspense fallback={null}>
                        <ChristmasBallModel elapsed={elapsed} />
                    </Suspense>


                    {/* Éclairage directionnel pour bien éclairer la boule */}
                    <directionalLight
                        position={[10, 10, 10]}
                        intensity={2 * ballOpacity}
                        color="#ffffff"
                    />
                </group>
            )}
        </group>
    )
}
