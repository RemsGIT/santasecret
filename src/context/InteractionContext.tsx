import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react'

interface InteractionState {
    isNear: boolean
    personName: string | null
    personId: number | null
}

interface InteractionContextType extends InteractionState {
    setInteraction: (isNear: boolean, personName?: string, personId?: number) => void
    clearInteraction: () => void
}

export const InteractionContext = createContext<InteractionContextType | undefined>(undefined)

export function InteractionProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<InteractionState>({
        isNear: false,
        personName: null,
        personId: null,
    })

    const setInteraction = useCallback((isNear: boolean, personName?: string, personId?: number) => {
        setState((prev) => {
            // Avoid unnecessary updates
            if (
                prev.isNear === isNear &&
                prev.personName === (personName || null) &&
                prev.personId === (personId || null)
            ) {
                return prev
            }
            return {
                isNear,
                personName: personName || null,
                personId: personId || null,
            }
        })
    }, [])

    const clearInteraction = useCallback(() => {
        setState((prev) => {
            if (!prev.isNear && prev.personName === null && prev.personId === null) return prev
            return {
                isNear: false,
                personName: null,
                personId: null,
            }
        })
    }, [])

    const value = useMemo(
        () => ({ ...state, setInteraction, clearInteraction }),
        [state, setInteraction, clearInteraction]
    )

    return (
        <InteractionContext.Provider value={value}>
            {children}
        </InteractionContext.Provider>
    )
}

export function useInteraction() {
    const context = useContext(InteractionContext)
    if (context === undefined) {
        throw new Error('useInteraction must be used within an InteractionProvider')
    }
    return context
}
