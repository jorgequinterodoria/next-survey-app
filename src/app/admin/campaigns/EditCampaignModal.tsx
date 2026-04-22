'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateCampaign } from '@/app/actions/admin';
import { Image as ImageIcon, Pencil, Trash2, X } from 'lucide-react';

type CampaignForEdit = {
  id: string;
  name: string;
  evaluadorNombre: string | null;
  evaluadorId: string | null;
  evaluadorProfesion: string | null;
  evaluadorPostgrado: string | null;
  evaluadorTarjeta: string | null;
  evaluadorLicencia: string | null;
  evaluadorLicenciaFecha: string | null;
  evaluadorFirma: string | null;
};

export function EditCampaignModal({ campaign }: { campaign: CampaignForEdit }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removeFirma, setRemoveFirma] = useState(false);
  const [firmaFile, setFirmaFile] = useState<File | null>(null);

  const firmaPreview = useMemo(() => {
    if (removeFirma) return null;
    if (firmaFile) return URL.createObjectURL(firmaFile);
    return campaign.evaluadorFirma || null;
  }, [campaign.evaluadorFirma, firmaFile, removeFirma]);

  function close() {
    setIsOpen(false);
    setIsSubmitting(false);
    setError(null);
    setRemoveFirma(false);
    setFirmaFile(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      formData.set('id', campaign.id);
      if (removeFirma) {
        formData.set('removeFirma', '1');
      }
      if (firmaFile) {
        formData.set('evaluadorFirmaFile', firmaFile);
      }

      const res = await updateCampaign(formData);
      if (res?.error) {
        setError(res.error);
        setIsSubmitting(false);
        return;
      }
      router.refresh();
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando la campaña');
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
      >
        <Pencil className="h-4 w-4" />
        Editar campaña
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Editar campaña</h2>
                <p className="text-xs text-slate-500 mt-1">Actualiza el nombre, datos del evaluador y firma.</p>
              </div>
              <button type="button" onClick={close} className="text-slate-500 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <input type="hidden" name="id" value={campaign.id} />
              <input type="hidden" name="removeFirma" value={removeFirma ? '1' : '0'} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Nombre de Campaña *</label>
                  <input
                    name="name"
                    type="text"
                    required
                    defaultValue={campaign.name}
                    className="w-full rounded-md border border-slate-300 p-2 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-md font-semibold text-slate-900 mb-4">Datos del Evaluador</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Nombre del Evaluador</label>
                    <input
                      name="evaluadorNombre"
                      type="text"
                      defaultValue={campaign.evaluadorNombre || ''}
                      className="w-full rounded-md border border-slate-300 p-2 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Número de Identificación</label>
                    <input
                      name="evaluadorId"
                      type="text"
                      defaultValue={campaign.evaluadorId || ''}
                      className="w-full rounded-md border border-slate-300 p-2 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Profesión</label>
                    <input
                      name="evaluadorProfesion"
                      type="text"
                      defaultValue={campaign.evaluadorProfesion || ''}
                      className="w-full rounded-md border border-slate-300 p-2 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Postgrado</label>
                    <input
                      name="evaluadorPostgrado"
                      type="text"
                      defaultValue={campaign.evaluadorPostgrado || ''}
                      className="w-full rounded-md border border-slate-300 p-2 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">No. Tarjeta Profesional</label>
                    <input
                      name="evaluadorTarjeta"
                      type="text"
                      defaultValue={campaign.evaluadorTarjeta || ''}
                      className="w-full rounded-md border border-slate-300 p-2 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">No. Licencia en Salud Ocupacional</label>
                    <input
                      name="evaluadorLicencia"
                      type="text"
                      defaultValue={campaign.evaluadorLicencia || ''}
                      className="w-full rounded-md border border-slate-300 p-2 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Fecha Expedición Licencia</label>
                    <input
                      name="evaluadorLicenciaFecha"
                      type="date"
                      defaultValue={campaign.evaluadorLicenciaFecha || ''}
                      className="w-full rounded-md border border-slate-300 p-2 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-6 border-t pt-4">
                  <h4 className="text-sm font-semibold text-slate-900">Firma del evaluador</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Sube una imagen (PNG/JPG) o elimina la firma actual.
                  </p>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Archivo de firma</label>
                      <input
                        name="evaluadorFirmaFile"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const next = e.currentTarget.files?.[0] || null;
                          setFirmaFile(next);
                          setRemoveFirma(false);
                        }}
                        className="w-full rounded-md border border-slate-300 p-2 text-sm text-slate-900 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold hover:file:bg-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFirmaFile(null);
                          setRemoveFirma(true);
                        }}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Quitar firma
                      </button>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <ImageIcon className="h-4 w-4" />
                        Vista previa
                      </div>
                      <div className="mt-3 bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-center min-h-24">
                        {firmaPreview ? (
                          <img src={firmaPreview} alt="Firma" className="max-h-24 w-auto object-contain" />
                        ) : (
                          <p className="text-xs text-slate-500">Sin firma</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={close}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
