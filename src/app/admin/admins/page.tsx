import { prisma } from '@/lib/prisma'
import { createAdmin } from '@/app/actions/admin'
import { ShieldCheck } from 'lucide-react'

export default async function AdminsPage() {
  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
          <ShieldCheck className="h-6 w-6" />
          Administradores
        </h1>
      </div>

      {/* Create Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Nuevo Administrador</h2>
        <form action={async (formData) => {
          'use server'
          await createAdmin(formData)
        }} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              placeholder="admin@empresa.com"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Crear Admin
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
    </div>
  )
}
