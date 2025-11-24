import Molly from './animals/Molly'
import Talia from './animals/Talia'
import Charli from './animals/Charli'
import Loki from '@/components/3d/animals/Loki.tsx'

export default function Animals() {
  return (
    <group>
      {/* Animaux individuels - tu peux ajuster les positions comme tu veux */}
      <Molly position={[14.5, 0, 3]} rotation={[0, 0.5, 0]} />
      <Talia position={[-14, 0.2, 3.2]} rotation={[0, 1.8, 0]} />
      <Charli position={[-13, 0.4, -8]} rotation={[0, 0.9, 0]} />
      <Loki position={[-4, 0.2, -14.3]} rotation={[0, 0, 0]} />
    </group>
  )
}
