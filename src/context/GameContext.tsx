import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { generateGiftAttributions, getReceiverForGiver } from '../services/giftAttribution'
import { people } from '../data/people'
import type { GiftAttribution, Person } from '../types/person'

interface GameState {
    attributions: Array<GiftAttribution> | null
    cinematicActive: boolean
    cinematicStartTime: number | null
    targetPerson: Person | null
    giverPerson: Person | null
}

interface GameContextType extends GameState {
    startCinematic: (giverId: number) => void
    resetGame: () => void
    generateNewAttributions: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
    const [attributions, setAttributions] = useState<Array<GiftAttribution> | null>(null)
    const [cinematicActive, setCinematicActive] = useState(false)
    const [cinematicStartTime, setCinematicStartTime] = useState<number | null>(null)
    const [targetPerson, setTargetPerson] = useState<Person | null>(null)
    const [giverPerson, setGiverPerson] = useState<Person | null>(null)

    // Load attributions from localStorage or generate new ones
    useEffect(() => {
        try {
            const savedAttributions = localStorage.getItem('santasecret-attributions')
            if (savedAttributions) {
                const parsed = JSON.parse(savedAttributions)
                setAttributions(parsed)
            } else {
                const newAttributions = generateGiftAttributions(people)
                setAttributions(newAttributions)
                localStorage.setItem('santasecret-attributions', JSON.stringify(newAttributions))
            }
        } catch (error) {
            console.error('Error loading attributions from localStorage:', error)
            const newAttributions = generateGiftAttributions(people)
            setAttributions(newAttributions)
            localStorage.setItem('santasecret-attributions', JSON.stringify(newAttributions))
        }
    }, [])

    const startCinematic = useCallback((giverId: number) => {
        if (!attributions) return

        const receiverId = getReceiverForGiver(attributions, giverId)
        if (!receiverId) return

        const receiver = people.find(p => p.id === receiverId) || null
        const giver = people.find(p => p.id === giverId) || null


        setTargetPerson(receiver)
        setGiverPerson(giver)
        setCinematicActive(true)
        setCinematicStartTime(Date.now())
    }, [attributions])

    const resetGame = useCallback(() => {
        setCinematicActive(false)
        setCinematicStartTime(null)
        setTargetPerson(null)
        setGiverPerson(null)
    }, [])

    const generateNewAttributions = useCallback(() => {
        const newAttributions = generateGiftAttributions(people)
        setAttributions(newAttributions)
        localStorage.setItem('santasecret-attributions', JSON.stringify(newAttributions))
    }, [])

    return (
        <GameContext.Provider
            value={{
                attributions,
                cinematicActive,
                cinematicStartTime,
                targetPerson,
                giverPerson,
                startCinematic,
                resetGame,
                generateNewAttributions,
            }}
        >
            {children}
        </GameContext.Provider>
    )
}

export function useGame() {
    const context = useContext(GameContext)
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider')
    }
    return context
}
