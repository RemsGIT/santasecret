import { useGLTF } from '@react-three/drei'

// Précharger tous les assets dès le début de l'app pour éviter les freezes
export function preloadAssets() {
  useGLTF.preload('/models/earth.glb')
  useGLTF.preload('/models/galaxy.glb')
  useGLTF.preload('/models/scene.glb')
}

// Exporter une fonction à appeler automatiquement
preloadAssets()