import * as React from 'react'
import { people } from '../../data/people'
import ParticipantLabel from './ParticipantLabel'
import type { Mesh } from 'three'

interface ParticipantLabelsProps {
  playerRef: React.RefObject<Mesh | null>
}

export default function ParticipantLabels({ playerRef }: ParticipantLabelsProps) {

  // Positionner les labels en cercle autour de la scène
  const radius = 12
  const labelPositions = people.map((_, index) => {
    const angle = (index / people.length) * Math.PI * 2
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    return [x, 2, z] as [number, number, number]
  })

  // Ajouter quelques positions supplémentaires pour plus de variété
  const extraPositions: Array<[number, number, number]> = [
    [-8, 1.5, -3],
    [6, 2.5, 4],
    [2, 1.8, -10],
    [-4, 2.2, 8],
    [10, 1.6, -6],
    [-12, 2.4, 2],
  ]

  // Mélanger les positions pour plus de randomisation
  const allPositions = [...labelPositions, ...extraPositions].slice(0, people.length)

  return (
    <>
      {/* Rendre tous les labels des participants */}
      {playerRef.current !== null && people.map((person, index) => (
        <ParticipantLabel
          key={person.id}
          person={person}
          position={allPositions[index]}
          playerRef={playerRef as React.RefObject<Mesh>}
        />
      ))}

      {/* Quelques éléments décoratifs pour rendre la scène plus vivante */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 15 + Math.random() * 5
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              0.5 + Math.random() * 2,
              Math.sin(angle) * radius
            ]}
          >
            <coneGeometry args={[0.3, 1.5 + Math.random()]} />
            <meshStandardMaterial color="#0f5132" />
          </mesh>
        )
      })}
    </>
  )
}
