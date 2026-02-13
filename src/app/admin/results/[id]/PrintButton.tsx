'use client'

import { Printer } from 'lucide-react'

export default function PrintButton() {
  return (
    <button 
      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
      onClick={() => window.print()}
    >
      <Printer className="h-4 w-4" />
      Imprimir Informe
    </button>
  )
}
