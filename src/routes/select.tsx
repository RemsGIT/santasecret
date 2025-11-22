import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import SelectionScene from '../components/3d/SelectionScene'

export const Route = createFileRoute('/select')({
  component: SelectPage,
})

function SelectPage() {
  return (
    <div className="h-screen w-screen bg-black">
      <div className="absolute top-4 left-4 z-10 text-white bg-black/50 p-4 rounded-lg">
        <h1 className="text-xl font-bold mb-2">🎄 Santa Secret</h1>
        <p className="text-sm opacity-80">
          Utilisez les flèches pour vous déplacer et découvrir votre nom avec votre lampe torche
        </p>
        <p className="text-xs opacity-60 mt-1">
          Cliquez sur votre nom pour continuer
        </p>
      </div>
      
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