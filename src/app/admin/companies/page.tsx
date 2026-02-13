import { prisma } from '@/lib/prisma'
import { createCompany } from '@/app/actions/admin'
import { Building2 } from 'lucide-react'

export default async function CompaniesPage() {
  const companies = await prisma.empresa.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { campanas: true } } },
  })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          Empresas
        </h1>
      </div>

      {/* Create Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Nueva Empresa</h2>
        <form action={async (formData) => {
          'use server'
          await createCompany(formData)
        }} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Acme Corp"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">NIT (Opcional)</label>
            <input
              name="nit"
              type="text"
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: 900.123.456"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Crear Empresa
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
    </div>
  )
}
