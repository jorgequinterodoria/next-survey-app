'use client';

import { useMemo, useRef, useState } from 'react';
import { FileSpreadsheet, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ImportResult = {
  success: boolean;
  sheetName: string;
  headerRow: number;
  dataRowStart: number;
  totalRead: number;
  imported: number;
  updated: number;
  rejected: Array<{ row: number; reason: string }>;
};

export default function ImportExcelModal({ campanaId }: { campanaId: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const rejectedPreview = useMemo(() => {
    if (!result?.rejected?.length) return [];
    return result.rejected.slice(0, 10);
  }, [result]);

  async function handleUpload() {
    if (!file) return;
    setIsSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`/api/admin/campaigns/${campanaId}/import-excel`, {
        method: 'POST',
        body: formData,
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || `No fue posible importar el archivo (HTTP ${res.status})`);
        }
        setResult(data);
      } else {
        const text = await res.text();
        const snippet = text.slice(0, 200);
        throw new Error(`Respuesta no-JSON (HTTP ${res.status}). ${snippet}`);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error importando el archivo');
    } finally {
      setIsSubmitting(false);
    }
  }

  function close() {
    setIsOpen(false);
    setFile(null);
    setError(null);
    setResult(null);
    setIsDragging(false);
  }

  function setExcelFile(next: File | null) {
    if (!next) {
      setFile(null);
      return;
    }
    const isExcel =
      next.name.toLowerCase().endsWith('.xlsx') || next.name.toLowerCase().endsWith('.xls');
    if (!isExcel) {
      setError('Archivo inválido. Solo se permite .xlsx o .xls');
      setFile(null);
      return;
    }
    setError(null);
    setFile(next);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const next = e.dataTransfer.files?.[0] ?? null;
    setExcelFile(next);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-3 py-1.5 rounded text-xs font-semibold hover:from-blue-700 hover:to-indigo-800 transition-colors inline-flex items-center gap-2 shadow-sm"
        title="Cargar listado de habilitados (Excel)"
      >
        <Upload className="h-4 w-4" />
        Cargar listado
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <FileSpreadsheet className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Cargar listado (Excel)</h2>
                  <p className="text-xs text-white/80">
                    Hoja Registro · Encabezados fila 8 · Datos desde fila 9
                  </p>
                </div>
              </div>
              <button
                onClick={close}
                className="text-white/80 hover:text-white transition-colors"
                type="button"
                aria-label="Cerrar"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(true);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(false);
                }}
                onDrop={onDrop}
                className={`rounded-2xl border-2 border-dashed p-6 transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : file
                      ? 'border-green-400 bg-green-50/40'
                      : 'border-slate-300 bg-slate-50'
                }`}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isDragging ? 'bg-blue-100' : file ? 'bg-green-100' : 'bg-white'
                    }`}
                  >
                    <Upload className={`${file ? 'text-green-700' : 'text-blue-700'} h-6 w-6`} />
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    Arrastra y suelta el Excel aquí
                  </div>
                  <div className="text-xs text-slate-600">
                    o selecciona el archivo manualmente (.xlsx / .xls)
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      Seleccionar archivo
                    </button>
                    {file && (
                      <button
                        type="button"
                        onClick={() => setExcelFile(null)}
                        className="px-4 py-2 text-sm font-semibold rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Quitar
                      </button>
                    )}
                  </div>

                  <input
                    ref={inputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => setExcelFile(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />

                  {file && (
                    <div className="mt-3 w-full rounded-xl border border-green-200 bg-white px-4 py-3 text-left">
                      <div className="text-xs text-slate-500">Archivo seleccionado</div>
                      <div className="text-sm font-semibold text-slate-900 truncate">{file.name}</div>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {result && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-900 text-sm space-y-3">
                  <div className="font-semibold">Importación completada</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="bg-white border border-green-200 rounded-lg p-2">
                      <div className="text-slate-500">Leídos</div>
                      <div className="text-base font-bold text-slate-900">{result.totalRead}</div>
                    </div>
                    <div className="bg-white border border-green-200 rounded-lg p-2">
                      <div className="text-slate-500">Insertados</div>
                      <div className="text-base font-bold text-slate-900">{result.imported}</div>
                    </div>
                    <div className="bg-white border border-green-200 rounded-lg p-2">
                      <div className="text-slate-500">Actualizados</div>
                      <div className="text-base font-bold text-slate-900">{result.updated}</div>
                    </div>
                    <div className="bg-white border border-green-200 rounded-lg p-2">
                      <div className="text-slate-500">Rechazados</div>
                      <div className="text-base font-bold text-slate-900">{result.rejected?.length ?? 0}</div>
                    </div>
                  </div>

                  {result.rejected?.length > 0 && (
                    <div className="pt-2">
                      <div className="text-xs font-semibold mb-2">Rechazados (primeros 10)</div>
                      <div className="max-h-48 overflow-auto border border-green-200 rounded-xl bg-white">
                        <table className="w-full text-xs">
                          <thead className="bg-green-100 sticky top-0">
                            <tr>
                              <th className="text-left px-2 py-1 w-16">Fila</th>
                              <th className="text-left px-2 py-1">Motivo</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rejectedPreview.map((r, idx) => (
                              <tr key={`${r.row}-${idx}`} className="border-t border-green-200">
                                <td className="px-2 py-1">{r.row}</td>
                                <td className="px-2 py-1">{r.reason}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-200 mt-2">
                <button
                  type="button"
                  onClick={close}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!file || isSubmitting}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Importando...' : 'Importar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
