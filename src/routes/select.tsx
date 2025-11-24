import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import SelectionScene from '../components/3d/SelectionScene'

export const Route = createFileRoute('/select')({
  component: SelectPage,
})

function SelectPage() {
  return (
    <div className="h-screen w-screen bg-black">
      <Suspense fallback={
        <div className="h-screen w-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl">Chargement de la scène...</div>
        </div>
      }>
        <SelectionScene />
      </Suspense>
    </div>
  )
}
