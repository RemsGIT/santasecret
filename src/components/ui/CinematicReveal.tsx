import { useGame } from '../../context/GameContext'
import { useEffect, useState } from 'react'

export default function CinematicReveal() {
    const { cinematicActive, cinematicStartTime, targetPerson, giverPerson } = useGame()
    const [showName, setShowName] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (!cinematicActive || !cinematicStartTime) {
            setIsVisible(false)
            setShowName(false)
            return
        }

        const interval = setInterval(() => {
            const elapsed = (Date.now() - cinematicStartTime) / 1000

            // Show container after 18s (fin de la cinématique)
            if (elapsed > 18) {
                setIsVisible(true)
            }

            // Show name shortly after
            if (elapsed > 19) {
                setShowName(true)
            }
        }, 100)

        return () => clearInterval(interval)
    }, [cinematicActive, cinematicStartTime])

    if (!isVisible) return null

    return (
        <div
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
        >
            {/* Background gradient overlay for readability */}
            <div className="absolute inset-0 bg-black/40 radial-gradient-center" />

            <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-light text-cyan-200 tracking-[0.2em] uppercase mb-8 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-fade-in-up">
                    Tu offres ton cadeau à
                </h2>

                {targetPerson && (
                    <div className={`transition-all duration-1000 transform ${showName ? 'scale-100 opacity-100 blur-0' : 'scale-50 opacity-0 blur-xl'}`}>
                        <h1 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-[0_0_30px_rgba(236,72,153,0.6)] animate-pulse-slow">
                            {targetPerson.name}
                        </h1>

                        {/* Decorative elements */}
                        <div className="mt-12 flex justify-center gap-4">
                            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
                        </div>

                        <div className="mt-8 text-white/80 text-xl font-light tracking-wider">
                            Joyeux Noël {giverPerson?.name} ! 🎄
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
