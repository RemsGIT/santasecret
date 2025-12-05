import { useEffect, useState } from 'react'
import { useGame } from '../../context/GameContext'

export default function CinematicEndPopup() {
    const { cinematicActive, cinematicStartTime } = useGame()
    const [visible, setVisible] = useState(false)
    const [shouldRender, setShouldRender] = useState(false)
    const [elapsed, setElapsed] = useState(0)

    // Update elapsed time every frame
    useEffect(() => {
        if (!cinematicActive || !cinematicStartTime) {
            setElapsed(0)
            return
        }

        const interval = setInterval(() => {
            const currentElapsed = (Date.now() - cinematicStartTime) / 1000
            setElapsed(currentElapsed)
        }, 16) // ~60fps

        return () => clearInterval(interval)
    }, [cinematicActive, cinematicStartTime])

    const shouldShow = cinematicActive && elapsed >= 17

    useEffect(() => {
        if (shouldShow) {
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
    }, [shouldShow])

    useEffect(() => {
        if (!shouldShow) return

        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.code === 'Space') {
                window.location.reload()
            }
        }

        document.addEventListener('keydown', handleKeyPress)
        return () => document.removeEventListener('keydown', handleKeyPress)
    }, [shouldShow])

    if (!shouldRender) return null

    return (
        <div
            className={`fixed bottom-2 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
        >
            <div className="flex items-center gap-4 px-6 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                {/* Animated Key */}
                <div className="relative flex items-center justify-center w-12 h-10 bg-white/20 rounded-lg border border-white/30 animate-pulse">
                    <span className="text-white font-bold text-sm">ESP</span>
                    <div className="absolute inset-0 rounded-lg bg-white/20 blur-sm animate-pulse" />
                </div>

                {/* Text Content */}
                <div className="flex flex-col">
                    <span className="text-white/90 text-sm font-medium uppercase tracking-wider">
                        Action
                    </span>
                    <span className="text-white font-bold text-lg leading-tight">
                        Appuie sur Espace avant de partir
                    </span>
                </div>
            </div>
        </div>
    )
}
