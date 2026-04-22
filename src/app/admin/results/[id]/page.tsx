import { prisma } from '@/lib/prisma'
import { getRiskColor } from '@/lib/risk-levels'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import PrintButton from './PrintButton'
import { flattenResults } from '@/lib/psychometrics'
import { ReportNotesEditor } from './ReportNotesEditor'

export const dynamic = 'force-dynamic';

// Helper para renderizar una sección de resultados
function ResultSection({ title, results }: { title: string, results: Record<string, any> }) {
  if (!results || Object.keys(results).length === 0) return null

  // Filtramos para mostrar solo dimensiones o totales que no sean el "Dominio" general para no duplicar info en la misma grilla,
  // O podemos mostrar todo ordenado.
  // En este diseño de cuadritos, mostramos todo lo que se nos pase.
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-900">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(results).map(([key, res]: [string, any]) => {
          // Destacar los totales o dominios
          const isTotal = key.includes('Total') || key.includes('Dominio');
          
          return (
          <div key={key} className={`border rounded-lg p-4 flex flex-col justify-between ${isTotal ? 'bg-[#dc9222]/10 border-[#dc9222]/25' : ''}`}>
            <div>
                <h4 className={`text-sm mb-1 ${isTotal ? 'font-bold text-[#8a5400]' : 'font-medium text-gray-700'}`}>{res.dimension}</h4>
                <div className="text-2xl font-bold text-gray-900 mb-2">{res.score} <span className="text-xs text-gray-400 font-normal">/ 100</span></div>
            </div>
            <div className={`text-xs font-semibold px-2 py-1 rounded-full w-fit ${getRiskColor(res.level)}`}>
              {res.level}
            </div>
          </div>
        )})}
      </div>
    </div>
  )
}

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const response = await prisma.surveyResponse.findUnique({
    where: { id },
    include: {
      participante: {
        include: {
          campana: {
            include: { empresa: true }
          }
        }
      }
    }
  })

  if (!response) {
    return <div className="p-8">Informe no encontrado</div>
  }

  // Los resultados ahora están en formato detallado en la BD (response.results)
  // Usamos flattenResults para obtener el mismo formato plano que usaba esta vista
  const detailedResults = response.results as any;
  const flatResults = detailedResults ? flattenResults(detailedResults) : {};
  const hasResults = Object.keys(flatResults).length > 0;
  
  // Agrupar por dominio (Intra, Extra, Estrés)
  const intraResults = Object.entries(flatResults)
    .filter(([key]) => key.startsWith('Intra'))
    .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {})

  const extraResults = Object.entries(flatResults)
    .filter(([key]) => key.startsWith('Extra'))
    .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {})

  const stressResults = Object.entries(flatResults)
    .filter(([key]) => key.startsWith('Estrés'))
    .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {})

  const ficha = (response.fichaData as unknown as Record<string, string>) || {}
  const reportMeta = response.reportMeta as unknown

  const getReportBlock = (block: 'intralaboral' | 'extralaboral' | 'estres') => {
    if (!reportMeta || typeof reportMeta !== 'object') {
      return { observaciones: '', recomendaciones: '', fechaElaboracion: '' }
    }
    const b = (reportMeta as Record<string, unknown>)[block]
    if (!b || typeof b !== 'object') {
      return { observaciones: '', recomendaciones: '', fechaElaboracion: '' }
    }
    const obj = b as Record<string, unknown>
    return {
      observaciones: typeof obj.observaciones === 'string' ? obj.observaciones : '',
      recomendaciones: typeof obj.recomendaciones === 'string' ? obj.recomendaciones : '',
      fechaElaboracion: typeof obj.fechaElaboracion === 'string' ? obj.fechaElaboracion : '',
    }
  }
  const intraBlock = getReportBlock('intralaboral')
  const extraBlock = getReportBlock('extralaboral')
  const estresBlock = getReportBlock('estres')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center print:hidden">
        <Link href="/admin/results" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Resultados
        </Link>
        <PrintButton />
      </div>

      {/* Report Header */}
      <div className="bg-white rounded-lg shadow-sm p-8 border-t-4 border-[#dc9222]">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Informe de Riesgo Psicosocial</h1>
                <p className="text-gray-500">Batería de Instrumentos - Ministerio de Trabajo</p>
            </div>
            <div className="text-right">
                <div className="text-xl font-bold text-gray-900">{response.participante.campana.empresa.name}</div>
                <div className="text-sm text-gray-500">Campaña: {response.participante.campana.name}</div>
                <div className="text-sm text-gray-500">Fecha: {response.createdAt.toLocaleDateString()}</div>
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg text-sm">
            <div>
                <span className="block text-gray-500">Cédula</span>
                <span className="font-semibold text-gray-900">{response.participante.cedula}</span>
            </div>
            <div>
                <span className="block text-gray-500">Nombre</span>
                <span className="font-semibold text-gray-900">{ficha.ficha_1 || ficha.nombre_completo || 'Anónimo'}</span>
            </div>
            <div>
                <span className="block text-gray-500">Cargo</span>
                <span className="font-semibold text-gray-900">{ficha.ficha_12 || ficha.cargo || 'No especificado'}</span>
            </div>
            <div>
                <span className="block text-gray-500">Formulario</span>
                <span className="font-semibold text-gray-900">Forma {response.formType}</span>
            </div>
        </div>
      </div>

      {/* Sections */}
      {!hasResults && (
        <div className="bg-yellow-50 p-6 rounded-lg text-center text-yellow-800">
            Este informe no tiene resultados calculados. Es posible que sea una respuesta antigua antes de la actualización del sistema.
        </div>
      )}

      <ResultSection title="Factores Intralaborales" results={intraResults} />
      <ReportNotesEditor
        surveyResponseId={response.id}
        block="intralaboral"
        initialObservaciones={intraBlock.observaciones}
        initialRecomendaciones={intraBlock.recomendaciones}
        initialFechaElaboracion={intraBlock.fechaElaboracion}
      />

      <ResultSection title="Factores Extralaborales" results={extraResults} />
      <ReportNotesEditor
        surveyResponseId={response.id}
        block="extralaboral"
        initialObservaciones={extraBlock.observaciones}
        initialRecomendaciones={extraBlock.recomendaciones}
        initialFechaElaboracion={extraBlock.fechaElaboracion}
      />

      <ResultSection title="Evaluación de Estrés" results={stressResults} />
      <ReportNotesEditor
        surveyResponseId={response.id}
        block="estres"
        initialObservaciones={estresBlock.observaciones}
        initialRecomendaciones={estresBlock.recomendaciones}
        initialFechaElaboracion={estresBlock.fechaElaboracion}
      />
    </div>
  )
}
