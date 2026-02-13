import { prisma } from '@/lib/prisma'
import { Users, Building2, Megaphone, ClipboardCheck } from 'lucide-react'

async function getStats() {
  const [companies, campaigns, participants, responses] = await Promise.all([
    prisma.empresa.count(),
    prisma.campana.count(),
    prisma.participante.count(),
    prisma.surveyResponse.count(),
  ])
  return { companies, campaigns, participants, responses }
}

export default async function DashboardPage() {
  const stats = await getStats()

  const cards = [
    { label: 'Empresas', value: stats.companies, icon: Building2, color: 'bg-blue-500' },
    { label: 'Campañas', value: stats.campaigns, icon: Megaphone, color: 'bg-green-500' },
    { label: 'Participantes', value: stats.participants, icon: Users, color: 'bg-purple-500' },
    { label: 'Respuestas', value: stats.responses, icon: ClipboardCheck, color: 'bg-orange-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard General</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
              <div className={`${card.color} p-4 rounded-lg text-white`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Actividad Reciente</h2>
        <p className="text-gray-500">No hay actividad reciente para mostrar.</p>
        {/* Placeholder for recent activity table */}
      </div>
    </div>
  )
}
