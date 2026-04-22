import { prisma } from '@/lib/prisma'
import { Megaphone, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import CreateCampaignModal from './CreateCampaignModal';
import { CampaignActionsDropdown } from './CampaignActionsDropdown';

export const dynamic = 'force-dynamic';

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
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
          <Megaphone className="h-6 w-6" />
          Campañas
        </h1>
        <CreateCampaignModal companies={companies} />
      </div>

      {/* List */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto overflow-y-visible w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaña</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token / Link</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participantes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campaigns.map((campana) => {
                const evaluadorFirmaRaw = (campana as unknown as Record<string, unknown>).evaluadorFirma;
                const evaluadorFirma = typeof evaluadorFirmaRaw === 'string' ? evaluadorFirmaRaw : null;
                return (
              <tr key={campana.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{campana.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{campana.empresa.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">{campana.token}</code>
                        {/* Copy button could be precise here, but simplifying */}
                        <Link href={`/?token=${campana.token}`} target="_blank" className="text-[#dc9222] hover:text-[#c7831f]">
                            <ExternalLink className="h-4 w-4" />
                        </Link>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        campana.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {campana.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{campana._count.participantes}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <CampaignActionsDropdown
                    campaign={{
                      id: campana.id,
                      name: campana.name,
                      token: campana.token,
                      isActive: campana.isActive,
                      empresaName: campana.empresa.name,
                      evaluadorNombre: campana.evaluadorNombre,
                      evaluadorId: campana.evaluadorId,
                      evaluadorProfesion: campana.evaluadorProfesion,
                      evaluadorPostgrado: campana.evaluadorPostgrado,
                      evaluadorTarjeta: campana.evaluadorTarjeta,
                      evaluadorLicencia: campana.evaluadorLicencia,
                      evaluadorLicenciaFecha: campana.evaluadorLicenciaFecha,
                      evaluadorFirma,
                    }}
                  />
                </td>
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
