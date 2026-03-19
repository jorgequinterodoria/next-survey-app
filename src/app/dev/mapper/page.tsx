'use client';

import dynamic from 'next/dynamic'

const PdfMapper = dynamic(() => import('@/components/PdfMapper'), {
  ssr: false
})

export default function MapperPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <PdfMapper />
    </div>
  );
}
