import CustomLights from './CustomLights'
import type { LightPoint } from './CustomLights';

export default function SceneLights() {
  // Points lumineux personnalisés - place chaque lumière où tu veux
  const lightPoints = [
    { position: [1, 9.4, 0], color: '#ffd400', intensity: 600, flicker: true }, // Rouge - à gauche de la verte
    { position: [-1, 9.4, 0], color: '#ffd400', intensity: 600, flicker: true }, // Rouge - à gauche de la verte
  ]

  return <CustomLights lights={lightPoints as Array<LightPoint>} />
}
