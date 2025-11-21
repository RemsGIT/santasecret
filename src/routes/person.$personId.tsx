import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, UserX } from 'lucide-react'

export const Route = createFileRoute('/person/$personId')({
  component: PersonContext,
})

const people = [
  { 
    id: 1, 
    name: 'Alice Martin', 
    forbidden: [2, 3]
  },
  { 
    id: 2, 
    name: 'Bob Dupont', 
    forbidden: [1]
  },
  { 
    id: 3, 
    name: 'Claire Rousseau', 
    forbidden: [4, 1]
  },
  { 
    id: 4, 
    name: 'David Bernard', 
    forbidden: [3, 5]
  },
  { 
    id: 5, 
    name: 'Emma Lefevre', 
    forbidden: [6]
  },
  { 
    id: 6, 
    name: 'François Moreau', 
    forbidden: [5]
  },
]

function PersonContext() {
  const { personId } = Route.useParams()
  const person = people.find(p => p.id === parseInt(personId))

  if (!person) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Personne non trouvée</h1>
          <Link 
            to="/"
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ← Retour à la sélection
          </Link>
        </div>
      </div>
    )
  }

  const forbiddenPeople = people.filter(p => person.forbidden.includes(p.id))

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la sélection
          </Link>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-3xl">
                  {person.name.charAt(0)}
                </span>
              </div>
              <h1 className="text-4xl font-black text-white mb-2">
                {person.name}
              </h1>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-slate-700/50 rounded-lg p-6">
                <h3 className="flex items-center gap-2 text-white text-xl font-semibold mb-4">
                  <UserX className="w-5 h-5 text-red-400" />
                  Paires interdites
                </h3>
                {forbiddenPeople.length > 0 ? (
                  <div className="space-y-2">
                    {forbiddenPeople.map((forbiddenPerson) => (
                      <span 
                        key={forbiddenPerson.id}
                        className="inline-block px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm mr-2"
                      >
                        {forbiddenPerson.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">Aucune paire interdite</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}