import { prisma } from '@/lib/prisma'
import { Users, Download } from 'lucide-react'
import Link from 'next/link'

export default async function ResultsPage() {
  const participants = await prisma.participante.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      campana: {
        include: { empresa: true }
      },
      surveyResponse: {
        select: { id: true, createdAt: true }
      }
    }
  })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          Resultados y Participantes
        </h1>
        <Link 
            href="/api/admin/export" 
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
            target="_blank"
        >
            <Download className="h-4 w-4" />
            Exportar CSV
        </Link>
      </div>

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
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completada
                        </span>
                    ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
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
