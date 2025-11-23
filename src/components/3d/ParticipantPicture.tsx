import { useTexture } from '@react-three/drei'
import { DoubleSide } from 'three'

interface ParticipantPictureProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  size?: [number, number] // [largeur, hauteur]
  imagePath?: string
}

export default function ParticipantPicture({
  position,
  rotation = [0, 0, 0],
  size = [1, 1.2], // Taille par défaut
  imagePath
}: ParticipantPictureProps) {
  const texture = imagePath ? useTexture(imagePath) : null

  return (
    <group position={position} rotation={rotation}>
      {/* Image de la personne */}
      {texture && (
        <mesh
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
        >
          <planeGeometry args={size} />
          <meshBasicMaterial
            map={texture}
            side={DoubleSide}
            transparent={true}
            alphaTest={0.1}
          />
        </mesh>
      )}

      {/* Fallback si pas d'image */}
      {!texture && (
        <mesh
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
        >
          <planeGeometry args={size} />
          <meshBasicMaterial
            color="#f0f0f0"
            side={DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}
