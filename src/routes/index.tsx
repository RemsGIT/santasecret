import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import SelectionScene from '../components/3d/SelectionScene'
import { InteractionProvider } from '../context/InteractionContext'
import InteractionPopup from '../components/ui/InteractionPopup'
import CinematicReveal from '../components/ui/CinematicReveal'
import { GameProvider } from '../context/GameContext'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <GameProvider>
      <InteractionProvider>
        <div className="h-screen w-screen bg-black overflow-hidden">
          <Suspense
            fallback={
              <div className="h-screen w-screen bg-black flex items-center justify-center">
                <div className="text-white text-xl font-light tracking-widest animate-pulse">
                  CHARGEMENT DU PÔLE NORD...
                </div>
              </div>
            }
          >
            <SelectionScene />
            <InteractionPopup />
            <CinematicReveal />
          </Suspense>
        </div>
      </InteractionProvider>
    </GameProvider>
  )
}
