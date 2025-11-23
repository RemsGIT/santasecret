import { forwardRef, useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Euler, Vector3 } from 'three'
import useKeyboardControls from '../../hooks/useKeyboardControls'
import { checkHousesCollision } from './CollisionSystem'
import type { Mesh, SpotLight} from 'three';

interface PlayerProps {
  houses?: Mesh[]
}

const Player = forwardRef<Mesh, PlayerProps>(({ houses = [] }, ref) => {
  const playerRef = ref as React.RefObject<Mesh>
  const spotLightRef = useRef<SpotLight>(null)
  const { getMovementVector } = useKeyboardControls()
  const { camera } = useThree()

  // Vitesse de déplacement (réduite pour éviter la téléportation)
  const speed = 0.02

  // Rotation de la caméra avec la souris
  const mouseRotationX = useRef(0)
  const mouseRotationY = useRef(0)
  const isPointerLocked = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleMouseMove = (event: MouseEvent) => {
      if (!isPointerLocked.current) return

      const sensitivity = 0.002
      mouseRotationY.current -= event.movementX * sensitivity
      mouseRotationX.current -= event.movementY * sensitivity

      // Limiter la rotation verticale
      mouseRotationX.current = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, mouseRotationX.current),
      )
    }

    // Verrouiller le pointeur au clic
    const handleClick = async () => {
      await document.body.requestPointerLock()
    }

    const handlePointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === document.body
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('click', handleClick)
    document.addEventListener('pointerlockchange', handlePointerLockChange)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('pointerlockchange', handlePointerLockChange)
    }
  }, [])

  useFrame(() => {
    if (!spotLightRef.current) return

    const { x, z } = getMovementVector()

    // Déplacement relatif à la direction de la caméra avec vérification de collision
    if (x !== 0 || z !== 0) {
      // Calculer les directions avant/droite basées sur la rotation Y de la caméra
      const forward = new Vector3(0, 0, -1)
      const right = new Vector3(1, 0, 0)

      // Appliquer seulement la rotation horizontale (Y) pour le déplacement
      forward.applyAxisAngle(new Vector3(0, 1, 0), mouseRotationY.current)
      right.applyAxisAngle(new Vector3(0, 1, 0), mouseRotationY.current)

      // Calculer le vecteur de mouvement final
      const movement = new Vector3()
      movement.add(forward.multiplyScalar(-z * speed)) // Inverser z pour un contrôle plus naturel
      movement.add(right.multiplyScalar(x * speed))

      // Calculer la nouvelle position potentielle
      const currentPos = playerRef.current.position.clone()
      const newPos = currentPos.clone().add(movement)

      // Vérifier la collision avec toutes les maisons
      const hasCollision = checkHousesCollision(newPos, houses)

      // Ne bouger que s'il n'y a pas de collision
      if (!hasCollision) {
        playerRef.current.position.copy(newPos)
      }
    }

    // Caméra en première personne - suit simplement le joueur
    const playerPos = playerRef.current.position
    camera.position.set(playerPos.x, playerPos.y + 1.6, playerPos.z)

    // Rotation de la caméra avec la souris
    camera.rotation.order = 'YXZ'
    camera.rotation.y = mouseRotationY.current
    camera.rotation.x = mouseRotationX.current

    // Lampe torche suit la caméra
    spotLightRef.current.position.set(
      camera.position.x,
      camera.position.y - 0.2,
      camera.position.z,
    )

    // Calculer la direction de la lampe torche basée sur la rotation de la caméra
    const direction = new Vector3(0, 0, -1)
    direction.applyEuler(
      new Euler(mouseRotationX.current, mouseRotationY.current, 0, 'YXZ'),
    )

    const targetPosition = camera.position
      .clone()
      .add(direction.multiplyScalar(20))
    spotLightRef.current.target.position.copy(targetPosition)
    spotLightRef.current.target.updateMatrixWorld()
  })

  return (
    <group>
      {/* Le joueur (invisible en première personne) */}
      <mesh ref={playerRef} position={[0, 0, 0]} castShadow visible={false}>
        <capsuleGeometry args={[0.5, 1]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>

      {/* Lampe torche - SpotLight avec plus de portée */}
      <spotLight
        ref={spotLightRef}
        intensity={30}
        angle={Math.PI / 8} // Cône légèrement plus large
        penumbra={0.4} // Transition douce des bords
        distance={40} // Portée plus importante
        decay={1.8} // Atténuation moins agressive
        color="#fff8dc" // Couleur blanc chaud
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
        shadow-bias={-0.0001}
      />

      {/* Target invisible pour la direction de la lampe */}
      <mesh position={[0, 0, -5]} visible={false}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
      </mesh>
    </group>
  )
})

Player.displayName = 'Player'

export default Player
