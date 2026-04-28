import { prisma } from '@/lib/prisma'
import { createAdmin } from '@/app/actions/admin'
import { ShieldCheck, Calendar, Mail } from 'lucide-react'

export const dynamic = 'force-dynamic';

export default async function AdminsPage() {
  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-gray-900">
          <ShieldCheck className="h-5 w-5 md:h-6 md:w-6" />
          Administradores
        </h1>
      </div>

      {/* Create Form */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Nuevo Administrador</h2>
        <form action={async (formData) => {
          'use server'
          await createAdmin(formData)
        }} className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 focus:ring-[#dc9222] focus:border-[#dc9222]"
              placeholder="admin@empresa.com"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 focus:ring-[#dc9222] focus:border-[#dc9222]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="bg-[#dc9222] text-white px-4 py-2 rounded-md hover:bg-[#c7831f] transition-colors text-sm font-medium w-full sm:w-auto"
          >
            Crear Admin
          </button>
        </form>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado el</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{admin.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{admin.createdAt.toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs font-mono">{admin.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {admins.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
            No hay administradores registrados.
          </div>
        )}
        {admins.map((admin) => (
          <div key={admin.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="bg-[#dc9222]/10 p-2 rounded-lg">
                <Mail className="h-4 w-4 text-[#dc9222]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 text-sm truncate">{admin.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Calendar className="h-3 w-3" />
                {admin.createdAt.toLocaleDateString()}
              </div>
              <code className="text-[10px] text-gray-400 font-mono truncate max-w-[140px]">{admin.id}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
