import { prisma } from '@/lib/prisma'
import { createCampaign } from '@/app/actions/admin'
import { Megaphone, Link as LinkIcon, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default async function CampaignsPage() {
  const [campaigns, companies] = await Promise.all([
    prisma.campana.findMany({
      orderBy: { createdAt: 'desc' },
      include: { 
        empresa: true,
        _count: { select: { participantes: true } } 
      },
    }),
    prisma.empresa.findMany({
      orderBy: { name: 'asc' },
    }),
  ])

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Megaphone className="h-6 w-6" />
          Campañas
        </h1>
      </div>

      {/* Create Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Nueva Campaña</h2>
        <form action={async (formData) => {
          'use server'
          await createCampaign(formData)
        }} className="flex gap-4 items-end">
            <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
            <select
              name="empresaId"
              required
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="">Seleccionar empresa...</option>
                {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Campaña</label>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Evaluación 2024"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Crear Campaña
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaña</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token / Link</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participantes</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campaigns.map((campana) => {
                const link = `${process.env.NEXT_PUBLIC_APP_URL || ''}/?token=${campana.token}`
                return (
              <tr key={campana.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{campana.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{campana.empresa.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">{campana.token}</code>
                        {/* Copy button could be precise here, but simplifying */}
                        <Link href={`/?token=${campana.token}`} target="_blank" className="text-blue-600 hover:text-blue-800">
                            <ExternalLink className="h-4 w-4" />
                        </Link>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${campana.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {campana.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{campana._count.participantes}</td>
              </tr>
            )})}
             {campaigns.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No hay campañas registradas.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
