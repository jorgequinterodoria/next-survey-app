'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Download, ArrowLeft, Search, User, Calendar } from 'lucide-react';

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
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <h1 className="text-lg md:text-xl font-semibold text-gray-900">Listado de habilitados</h1>
          <button
            onClick={handleExportPDF}
            disabled={exporting || loading || rows.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#dc9222] text-[#dc9222] hover:bg-[#dc9222] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-fit"
          >
            <Download className="h-3.5 w-3.5" />
            {exporting ? 'Generando...' : 'Exportar PDF'}
          </button>
        </div>
        <Link
          href="/admin/campaigns"
          className="text-sm text-[#dc9222] hover:text-[#c7831f] flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver a campañas
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por cédula o nombre..."
              className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm"
            />
          </div>

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

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-x-auto w-full border border-gray-200">
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500 text-sm">
            Cargando...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500 text-sm">
            No hay registros para mostrar.
          </div>
        ) : (
          <>
            <div className="text-xs text-gray-500 font-medium">
              {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
            </div>
            {filtered.map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
                {/* Name & Status Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400 shrink-0" />
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {p.nombresApellidos || 'Sin nombre'}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 ml-6">CC: {p.cedula}</p>
                  </div>
                  <span className={`shrink-0 px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wide ${
                    p.hasCompleted ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {p.hasCompleted ? 'Completada' : 'Pendiente'}
                  </span>
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <span className="inline-flex items-center gap-1">
                    <span className="font-medium text-gray-600">Forma:</span>
                    {p.cuestionarioAsignado === 'NO_APLICA' ? 'No aplica' : `${p.cuestionarioAsignado || '—'}`}
                  </span>
                  {p.completedAt && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(p.completedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
