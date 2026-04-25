import { prisma } from '@/lib/prisma'
import { Users, Download } from 'lucide-react'
import Link from 'next/link'
import RiskDashboard from '@/components/analytics/RiskDashboard'
import { CampaignPicker } from './CampaignPicker'

export const dynamic = 'force-dynamic';

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ campanaId?: string }>;
}) {
  const { campanaId } = await searchParams;

  try {
    const campaigns = await prisma.campana.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        empresa: { select: { name: true } },
      },
    });

    if (!campanaId) {
      return (
        <div className="space-y-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" />
              Resultados
            </h1>
            <p className="text-sm text-slate-600">
              Selecciona una campaña para ver sus resultados globales y el listado de encuestas.
            </p>
          </div>

          <CampaignPicker
            campaigns={campaigns.map((c) => ({ id: c.id, name: c.name, empresaName: c.empresa.name }))}
            selectedId={null}
          />
        </div>
      );
    }

    const selectedCampaign = campaigns.find((c) => c.id === campanaId) ?? null;

    const participants = await prisma.participante.findMany({
      where: { campanaId },
      orderBy: { createdAt: 'desc' },
      include: {
        campana: { include: { empresa: true } },
        surveyResponse: {
          select: {
            id: true,
            createdAt: true,
            fichaData: true,
            results: true,
            formType: true,
          },
        },
      },
    });

    const participantsWithData = participants
      .filter((p) => p.surveyResponse)
      .map((p) => ({
        id: p.id,
        fichaData: p.surveyResponse!.fichaData,
        results: p.surveyResponse!.results,
      }));

    const total = participants.length;
    const completed = participantsWithData.length;
    const pending = total - completed;
    const completedA = participants.filter((p) => p.surveyResponse?.formType === 'A').length;
    const completedB = participants.filter((p) => p.surveyResponse?.formType === 'B').length;
    const pendingA = participants.filter((p) => !p.surveyResponse && p.cuestionarioAsignado === 'A').length;
    const pendingB = participants.filter((p) => !p.surveyResponse && p.cuestionarioAsignado === 'B').length;

    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" />
              Resultados
            </h1>
            <p className="text-sm text-slate-600">
              {selectedCampaign ? `${selectedCampaign.empresa.name} — ${selectedCampaign.name}` : 'Campaña seleccionada'}
            </p>
          </div>

          <CampaignPicker
            campaigns={campaigns.map((c) => ({ id: c.id, name: c.name, empresaName: c.empresa.name }))}
            selectedId={campanaId}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
            <div className="text-xs text-slate-500">Registrados</div>
            <div className="text-2xl font-bold text-slate-900">{total}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
            <div className="text-xs text-slate-500">Completados</div>
            <div className="text-2xl font-bold text-slate-900">{completed}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
            <div className="text-xs text-slate-500">Pendientes</div>
            <div className="text-2xl font-bold text-slate-900">{pending}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
            <div className="text-xs text-slate-500">Forma A</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-slate-900">{completedA}</div>
              <div className="text-xs text-slate-400">completados</div>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <div className="text-lg font-semibold text-amber-600">{pendingA}</div>
              <div className="text-xs text-amber-500">pendientes</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
            <div className="text-xs text-slate-500">Forma B</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-slate-900">{completedB}</div>
              <div className="text-xs text-slate-400">completados</div>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <div className="text-lg font-semibold text-amber-600">{pendingB}</div>
              <div className="text-xs text-amber-500">pendientes</div>
            </div>
          </div>
        </div>

        <RiskDashboard participants={participantsWithData} />

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cédula</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Registro</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participants.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{p.cedula}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {p.surveyResponse ? (
                      <div className="flex gap-2 items-center">
                        <Link
                          href={`/admin/results/${p.surveyResponse.id}`}
                          className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#dc9222]/15 text-[#8a5400] hover:bg-[#dc9222]/25 cursor-pointer"
                        >
                          Ver Informe Web
                        </Link>
                        <a
                          href={`/api/admin/participant/${p.id}/download-pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#7c7b7b]/15 text-[#4b4b4b] hover:bg-[#7c7b7b]/25 cursor-pointer"
                        >
                          <Download className="h-3 w-3 mr-1" /> PDF Físico
                        </a>
                      </div>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#dc9222]/15 text-[#8a5400]">
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{p.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
              {participants.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No hay participantes registrados para esta campaña.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error desconocido';
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          Resultados
        </h1>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <div className="text-sm font-semibold">No se pudo cargar la información</div>
          <div className="text-xs mt-1 break-words">{message}</div>
        </div>
      </div>
    );
  }
}
