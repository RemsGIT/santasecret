import { createFileRoute, Link } from '@tanstack/react-router'
import { Users } from 'lucide-react'

export const Route = createFileRoute('/')({ component: PersonSelection })

const people = [
  { id: 1, name: 'Alice Martin', forbidden: [2, 3] },
  { id: 2, name: 'Bob Dupont', forbidden: [1] },
  { id: 3, name: 'Claire Rousseau', forbidden: [4, 1] },
  { id: 4, name: 'David Bernard', forbidden: [3, 5] },
  { id: 5, name: 'Emma Lefevre', forbidden: [6] },
  { id: 6, name: 'François Moreau', forbidden: [5] },
]

function PersonSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Users className="w-12 h-12 text-cyan-400" />
              <h1 className="text-5xl font-black text-white">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Santa Secret
                </span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-8">
              Sélectionnez une personne pour voir son contexte
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {people.map((person) => (
              <Link
                key={person.id}
                to="/person/$personId"
                params={{ personId: person.id.toString() }}
                className="block bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">
                      {person.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {person.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
