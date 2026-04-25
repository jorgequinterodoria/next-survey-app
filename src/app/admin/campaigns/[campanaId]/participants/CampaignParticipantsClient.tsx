'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';

type ParticipantRow = {
  id: string;
  cedula: string;
  nombresApellidos: string | null;
  cuestionarioAsignado: 'A' | 'B' | 'NO_APLICA' | null;
  cargo: string | null;
  area: string | null;
  hasCompleted: boolean;
  completedAt: string | null;
};

export default function CampaignParticipantsClient({ campanaId }: { campanaId: string }) {
  const [rows, setRows] = useState<ParticipantRow[]>([]);
  const [query, setQuery] = useState('');
  const [filterForma, setFilterForma] = useState<'ALL' | 'A' | 'B' | 'NO_APLICA'>('ALL');
  const [filterEstado, setFilterEstado] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/campaigns/${campanaId}/participants`, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'No fue posible cargar el listado');
        if (!cancelled) setRows(data.participants || []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error cargando el listado');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [campanaId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filterForma !== 'ALL' && r.cuestionarioAsignado !== filterForma) return false;
      if (filterEstado !== 'ALL') {
        if (filterEstado === 'COMPLETED' && !r.hasCompleted) return false;
        if (filterEstado === 'PENDING' && r.hasCompleted) return false;
      }
      if (!q) return true;
      return (
        (r.cedula || '').toLowerCase().includes(q) ||
        (r.nombresApellidos || '').toLowerCase().includes(q)
      );
    });
  }, [rows, query, filterForma, filterEstado]);

  const handleExportPDF = useCallback(async () => {
    setExporting(true);
    try {
      const res = await fetch(`/api/admin/campaigns/${campanaId}/participants/export-pdf`);
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Error al generar el PDF');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Listado_Participantes.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error al exportar el PDF');
    } finally {
      setExporting(false);
    }
  }, [campanaId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">Listado de habilitados</h1>
          <button
            onClick={handleExportPDF}
            disabled={exporting || loading || rows.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#dc9222] text-[#dc9222] hover:bg-[#dc9222] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-3.5 w-3.5" />
            {exporting ? 'Generando...' : 'Exportar PDF'}
          </button>
        </div>
        <Link
          href="/admin/campaigns"
          className="text-sm text-[#dc9222] hover:text-[#c7831f]"
        >
          Volver a campañas
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por cédula o nombre..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />

          <select
            value={filterForma}
            onChange={(e) => setFilterForma(e.target.value as any)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="ALL">Todas las formas</option>
            <option value="A">Forma A</option>
            <option value="B">Forma B</option>
            <option value="NO_APLICA">No aplica</option>
          </select>

          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value as any)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="ALL">Todos los estados</option>
            <option value="PENDING">Pendiente</option>
            <option value="COMPLETED">Completada</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto w-full border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombres y apellidos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identificación</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forma</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">¿Diligenció?</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-sm">
                  Cargando...
                </td>
              </tr>
            ) : (
              <>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{p.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.nombresApellidos || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.cedula}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {p.cuestionarioAsignado === 'NO_APLICA' ? 'No aplica' : `Forma ${p.cuestionarioAsignado || ''}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.hasCompleted ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {p.hasCompleted ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {p.completedAt ? new Date(p.completedAt).toLocaleDateString() : ''}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-sm">
                      No hay registros para mostrar.
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
