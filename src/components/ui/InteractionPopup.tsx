import { useEffect, useState } from 'react'
import { useInteraction } from '../../context/InteractionContext'
import { useGame } from '../../context/GameContext'

export default function InteractionPopup() {
    const { isNear, personName } = useInteraction()
    const { cinematicActive } = useGame()
    const [visible, setVisible] = useState(false)
    const [shouldRender, setShouldRender] = useState(false)

    useEffect(() => {
        if (isNear) {
            setShouldRender(true)
            // Small delay to ensure the DOM is mounted with the initial state before animating
            const timer = setTimeout(() => setVisible(true), 50)
            return () => clearTimeout(timer)
        } else {
            setVisible(false)
            // Wait for animation to finish before unmounting
            const timer = setTimeout(() => setShouldRender(false), 300)
            return () => clearTimeout(timer)
        }
    }, [isNear])

    // Masquer le popup pendant la cinématique
    if (!shouldRender || cinematicActive) return null

    return (
        <div
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
        >
            <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                {/* Animated Key */}
                <div className="relative flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg border border-white/30 animate-pulse">
                    <span className="text-white font-bold text-lg">E</span>
                    <div className="absolute inset-0 rounded-lg bg-white/20 blur-sm animate-pulse" />
                </div>

                {/* Text Content */}
                <div className="flex flex-col">
                    <span className="text-white/90 text-sm font-medium uppercase tracking-wider">
                        Sélectionner
                    </span>
                    <span className="text-white font-bold text-lg leading-tight">
                        {personName}
                    </span>
                </div>
            </div>
        </div>
    )
}
