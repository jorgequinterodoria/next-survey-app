import { prisma } from '@/lib/prisma'
import { Users, Building2, Megaphone, ClipboardCheck } from 'lucide-react'

export const dynamic = 'force-dynamic';

async function getStatsSafe() {
  try {
    const [companies, campaigns, participants, responses] = await Promise.all([
      prisma.empresa.count(),
      prisma.campana.count(),
      prisma.participante.count(),
      prisma.surveyResponse.count(),
    ])
    return { stats: { companies, campaigns, participants, responses }, error: null as string | null }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error desconocido'
    return { stats: null as null | { companies: number; campaigns: number; participants: number; responses: number }, error: message }
  }
}

export default async function DashboardPage() {
  const { stats, error } = await getStatsSafe()

  const cards = [
    { label: 'Empresas', value: stats?.companies ?? '—', icon: Building2, color: 'bg-[#7c7b7b]' },
    { label: 'Campañas', value: stats?.campaigns ?? '—', icon: Megaphone, color: 'bg-[#dc9222]' },
    { label: 'Participantes', value: stats?.participants ?? '—', icon: Users, color: 'bg-[#6a6a6a]' },
    { label: 'Respuestas', value: stats?.responses ?? '—', icon: ClipboardCheck, color: 'bg-[#f39205]' },
  ]

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Dashboard General</h1>

      {error && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <div className="text-sm font-semibold">Base de datos no disponible</div>
          <div className="text-xs mt-1 break-words">{error}</div>
        </div>
      )}
      
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
