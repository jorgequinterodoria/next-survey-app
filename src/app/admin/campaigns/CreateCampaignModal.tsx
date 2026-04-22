'use client';

import { useState } from 'react';
import { createCampaign } from '@/app/actions/admin';
import { Plus, X } from 'lucide-react';

export default function CreateCampaignModal({ companies }: { companies: { id: string; name: string }[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    await createCampaign(formData);
    setIsSubmitting(false);
    setIsOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#dc9222] text-white px-4 py-2 rounded-md hover:bg-[#c7831f] transition-colors flex items-center gap-2 text-sm font-medium"
      >
        <Plus className="h-4 w-4" />
        Nueva Campaña
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Crear Nueva Campaña</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Empresa *</label>
                  <select
                    name="empresaId"
                    required
                    className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 focus:ring-[#dc9222] focus:border-[#dc9222]"
                  >
                    <option value="">Seleccionar empresa...</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Nombre de Campaña *</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 focus:ring-[#dc9222] focus:border-[#dc9222]"
                    placeholder="Ej: Evaluación 2024"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-md font-medium text-gray-900 mb-4">Datos del Evaluador (Opcional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Nombre del Evaluador</label>
                    <input
                      name="evaluadorNombre"
                      type="text"
                      className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 focus:ring-[#dc9222] focus:border-[#dc9222]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Número de Identificación</label>
                    <input
                      name="evaluadorId"
                      type="text"
                      className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 focus:ring-[#dc9222] focus:border-[#dc9222]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Profesión</label>
                    <input
                      name="evaluadorProfesion"
                      type="text"
                      className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 focus:ring-[#dc9222] focus:border-[#dc9222]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Postgrado</label>
                    <input
                      name="evaluadorPostgrado"
                      type="text"
                      className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 focus:ring-[#dc9222] focus:border-[#dc9222]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">No. Tarjeta Profesional</label>
                    <input
                      name="evaluadorTarjeta"
                      type="text"
                      className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 focus:ring-[#dc9222] focus:border-[#dc9222]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">No. Licencia en Salud Ocupacional</label>
                    <input
                      name="evaluadorLicencia"
                      type="text"
                      className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 focus:ring-[#dc9222] focus:border-[#dc9222]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Fecha Expedición Licencia</label>
                    <input
                      name="evaluadorLicenciaFecha"
                      type="date"
                      className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 focus:ring-[#dc9222] focus:border-[#dc9222]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#dc9222] rounded-md hover:bg-[#c7831f] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Creando...' : 'Crear Campaña'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
