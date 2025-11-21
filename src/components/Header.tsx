import { Link } from '@tanstack/react-router'
import { Users } from 'lucide-react'

export default function Header() {
  return (
    <header className="p-4 flex items-center bg-gray-800 text-white shadow-lg">
      <Link to="/" className="flex items-center gap-3">
        <Users className="w-8 h-8 text-cyan-400" />
        <h1 className="text-xl font-semibold">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Santa Secret
          </span>
        </h1>
      </Link>
    </header>
  )
}
