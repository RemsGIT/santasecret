import { TreeLights, HouseLights } from './ChristmasLights'

export default function SceneLights() {
  // Positions réduites pour éviter la surcharge
  const treePositions: Array<[number, number, number]> = [
    [8, 0, 12],
    [-12, 0, 8],
    [15, 0, -5],
  ]

  const housePositions: Array<[number, number, number]> = [
    [10, 0, 5],
    [-10, 0, 10],
  ]

  return (
    <>
      {/* Guirlandes sur les arbres */}
      {treePositions.map((position, index) => (
        <TreeLights key={`tree-${index}`} treePosition={position} />
      ))}

      {/* Guirlandes sur les maisons */}
      {housePositions.map((position, index) => (
        <HouseLights key={`house-${index}`} housePosition={position} />
      ))}
    </>
  )
}