import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Gift, UserX } from 'lucide-react'
import { z } from 'zod'
import { people } from '../data/people'
import { getReceiverForGiver } from '../services/giftAttribution'
import type { GiftAttribution } from '../types/person'

const PersonSearchSchema = z.object({
  attributions: z.string().optional(),
})

export const Route = createFileRoute('/person/$personId')({
  component: PersonContext,
  validateSearch: PersonSearchSchema,
})

function PersonContext() {
  const { personId } = Route.useParams()
  const search = Route.useSearch()
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

  const attributions: Array<GiftAttribution> | null = search.attributions 
    ? JSON.parse(search.attributions) 
    : null

  const forbiddenPeople = people.filter(p => person.forbidden.includes(p.id))
  const receiverId = attributions ? getReceiverForGiver(attributions, person.id) : null
  const receiver = receiverId ? people.find(p => p.id === receiverId) : null

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {receiver && (
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h3 className="flex items-center gap-2 text-white text-xl font-semibold mb-4">
                    <Gift className="w-5 h-5 text-yellow-400" />
                    Cadeau à offrir
                  </h3>
                  <div className="flex items-center gap-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {receiver.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{receiver.name}</p>
                      <p className="text-green-400 text-sm">Destinataire de votre cadeau</p>
                    </div>
                  </div>
                </div>
              )}

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