import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import SelectionScene from '../components/3d/SelectionScene'
import { InteractionProvider } from '../context/InteractionContext'
import InteractionPopup from '../components/ui/InteractionPopup'

export const Route = createFileRoute('/select')({
  component: SelectPage,
})

function SelectPage() {
  return (
    <div className="h-screen w-screen bg-black">
      <InteractionProvider>
        <Suspense fallback={
          <div className="h-screen w-screen bg-black flex items-center justify-center">
            <div className="text-white text-xl">Chargement de la scène...</div>
          </div>
        }>
          <SelectionScene />
          <InteractionPopup />
        </Suspense>
      </InteractionProvider>
    </div>
  )
}
