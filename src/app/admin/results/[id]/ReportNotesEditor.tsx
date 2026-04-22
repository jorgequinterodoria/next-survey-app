'use client';

import { useMemo, useState } from 'react';
import { updateSurveyReportMeta } from '@/app/actions/admin';
import { Save } from 'lucide-react';

type BlockType = 'intralaboral' | 'extralaboral' | 'estres';

export function ReportNotesEditor({
  surveyResponseId,
  block,
  initialObservaciones,
  initialRecomendaciones,
  initialFechaElaboracion,
}: {
  surveyResponseId: string;
  block: BlockType;
  initialObservaciones: string;
  initialRecomendaciones: string;
  initialFechaElaboracion: string;
}) {
  const [observaciones, setObservaciones] = useState(initialObservaciones);
  const [recomendaciones, setRecomendaciones] = useState(initialRecomendaciones);
  const [fechaElaboracion, setFechaElaboracion] = useState(initialFechaElaboracion);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const blockLabel = useMemo(() => {
    if (block === 'intralaboral') return 'Factores Intralaborales';
    if (block === 'extralaboral') return 'Factores Extralaborales';
    return 'Evaluación de Estrés';
  }, [block]);

  async function handleSave() {
    setStatus('saving');
    setError(null);
    try {
      const fd = new FormData();
      fd.set('surveyResponseId', surveyResponseId);
      fd.set('block', block);
      fd.set('observaciones', observaciones);
      fd.set('recomendaciones', recomendaciones);
      fd.set('fechaElaboracion', fechaElaboracion);

      const res = await updateSurveyReportMeta(fd);
      if (res?.error) {
        setStatus('error');
        setError(res.error);
        return;
      }
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 1500);
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e.message : 'Error guardando los campos');
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-slate-100 print:hidden">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Campos del informe</h4>
          <p className="text-xs text-slate-500 mt-1">Se guardan para el PDF: {blockLabel}</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={status === 'saving'}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {status === 'saving' ? 'Guardando...' : status === 'saved' ? 'Guardado' : 'Guardar'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Observaciones y comentarios del evaluador
          </label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-slate-300 p-3 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Escribe aquí las observaciones..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Recomendaciones particulares</label>
          <textarea
            value={recomendaciones}
            onChange={(e) => setRecomendaciones(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-slate-300 p-3 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Escribe aquí las recomendaciones..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Fecha de elaboración del informe</label>
            <input
              value={fechaElaboracion}
              onChange={(e) => setFechaElaboracion(e.target.value)}
              type="date"
              className="w-full rounded-md border border-slate-300 p-2 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {status === 'error' && error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
