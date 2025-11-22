import { Link, createFileRoute } from '@tanstack/react-router'
import { RefreshCw, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { people } from '../data/people'
import { generateGiftAttributions, getReceiverForGiver } from '../services/giftAttribution'
import type { GiftAttribution } from '../types/person'

export const Route = createFileRoute('/')({ component: PersonSelection })

function PersonSelection() {
  const [attributions, setAttributions] = useState<Array<GiftAttribution> | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateAttributions = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const newAttributions = generateGiftAttributions(people)
      setAttributions(newAttributions)
      setIsGenerating(false)
    }, 500)
  }

  useEffect(() => {
    generateAttributions()
  }, [])

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
            <p className="text-xl text-gray-300 mb-4">
              Sélectionnez une personne pour voir son contexte
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={generateAttributions}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Génération...' : 'Nouvelle attribution'}
              </button>
              
              <Link 
                to="/select"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
              >
                🎮 Mode 3D
              </Link>
            </div>
          </div>

          {attributions === null ? (
            <div className="text-center text-red-400 mb-8">
              Impossible de générer une attribution valide. Vérifiez les contraintes.
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {people.map((person) => {
              const receiverId = attributions ? getReceiverForGiver(attributions, person.id) : null
              const receiver = receiverId ? people.find(p => p.id === receiverId) : null

              return (
                <Link
                  key={person.id}
                  to="/person/$personId"
                  params={{ personId: person.id.toString() }}
                  search={{ attributions: JSON.stringify(attributions) }}
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
                    {receiver && (
                      <p className="text-sm text-cyan-400">
                        → {receiver.name}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
