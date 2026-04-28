import { prisma } from '@/lib/prisma'
import { createCompany } from '@/app/actions/admin'
import { Building2, Calendar, Hash } from 'lucide-react'

export const dynamic = 'force-dynamic';

export default async function CompaniesPage() {
  const companies = await prisma.empresa.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { campanas: true } } },
  })

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-gray-900">
          <Building2 className="h-5 w-5 md:h-6 md:w-6" />
          Empresas
        </h1>
      </div>

      {/* Create Form */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Nueva Empresa</h2>
        <form action={async (formData) => {
          'use server'
          await createCompany(formData)
        }} className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 focus:ring-[#dc9222] focus:border-[#dc9222]"
              placeholder="Ej: Acme Corp"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">NIT (Opcional)</label>
            <input
              name="nit"
              type="text"
              className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 focus:ring-[#dc9222] focus:border-[#dc9222]"
              placeholder="Ej: 900.123.456"
            />
          </div>
          <button
            type="submit"
            className="bg-[#dc9222] text-white px-4 py-2 rounded-md hover:bg-[#c7831f] transition-colors text-sm font-medium w-full sm:w-auto"
          >
            Crear Empresa
          </button>
        </form>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIT</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campañas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Registro</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.map((company) => (
              <tr key={company.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{company.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{company.nit || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{company._count.campanas}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{company.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
            {companies.length === 0 && (
                <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        No hay empresas registradas.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {companies.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
            No hay empresas registradas.
          </div>
        )}
        {companies.map((company) => (
          <div key={company.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">{company.name}</h3>
                {company.nit && (
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    NIT: {company.nit}
                  </p>
                )}
              </div>
              <div className="shrink-0 bg-[#dc9222]/10 text-[#dc9222] px-2.5 py-1 rounded-full text-xs font-bold">
                {company._count.campanas} campaña{company._count.campanas !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1 border-t border-gray-100">
              <Calendar className="h-3 w-3" />
              Registrada: {company.createdAt.toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
