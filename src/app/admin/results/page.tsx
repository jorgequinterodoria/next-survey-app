import { prisma } from '@/lib/prisma'
import { Users, Download } from 'lucide-react'
import Link from 'next/link'
import RiskDashboard from '@/components/analytics/RiskDashboard'

export default async function ResultsPage() {
  const participants = await prisma.participante.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      campana: {
        include: { empresa: true }
      },
      surveyResponse: {
        select: { 
            id: true, 
            createdAt: true,
            fichaData: true,
            results: true
        }
      }
    }
  })

  // Filter participants who have a survey response for the dashboard
  const participantsWithData = participants
    .filter(p => p.surveyResponse)
    .map(p => ({
        id: p.id,
        fichaData: p.surveyResponse!.fichaData,
        results: p.surveyResponse!.results
    }));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          Resultados y Participantes
        </h1>
      </div>

      {/* Dashboard de Análisis */}
      <RiskDashboard participants={participantsWithData} />

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cédula</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaña</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Registro</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {participants.map((p) => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{p.cedula}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{p.campana.empresa.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{p.campana.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    {p.surveyResponse ? (
                        <div className="flex gap-2 items-center">
                          <Link href={`/admin/results/${p.surveyResponse.id}`} className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer">
                              Ver Informe Web
                          </Link>
                          <a 
                            href={`/api/admin/participant/${p.id}/download-pdf`} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer"
                          >
                            <Download className="h-3 w-3 mr-1" /> PDF Físico
                          </a>
                        </div>
                    ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pendiente
                        </span>
                    )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{p.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
            {participants.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No hay participantes registrados.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
