import { useEffect, useRef } from 'react'

interface KeyState {
  ArrowUp: boolean
  ArrowDown: boolean
  ArrowLeft: boolean
  ArrowRight: boolean
}

export default function useKeyboardControls() {
  const keysRef = useRef<KeyState>({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  })

  useEffect(() => {
    // Protection SSR
    if (typeof window === 'undefined') return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code in keysRef.current) {
        keysRef.current[event.code as keyof KeyState] = true
        event.preventDefault()
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code in keysRef.current) {
        keysRef.current[event.code as keyof KeyState] = false
        event.preventDefault()
      }
    }

    const handleBlur = () => {
      // Reset toutes les touches quand la fenêtre perd le focus
      Object.keys(keysRef.current).forEach(key => {
        keysRef.current[key as keyof KeyState] = false
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  const getMovementVector = () => {
    const keys = keysRef.current
    let x = 0
    let z = 0

    if (keys.ArrowLeft) x -= 1
    if (keys.ArrowRight) x += 1
    if (keys.ArrowUp) z -= 1
    if (keys.ArrowDown) z += 1

    // Normaliser pour déplacement diagonal
    if (x !== 0 && z !== 0) {
      const length = Math.sqrt(x * x + z * z)
      x /= length
      z /= length
    }

    return { x, z }
  }

  return { getMovementVector, keysRef }
}