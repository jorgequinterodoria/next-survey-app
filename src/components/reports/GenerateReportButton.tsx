'use client';
// ============================================================
// COMPONENT: GenerateReportButton
// Usage: <GenerateReportButton campanaId="..." campanaName="..." />
// ============================================================
import { useState } from 'react';

interface Props {
  campanaId: string;
  campanaName?: string;
  empresaName?: string;
  className?: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export function GenerateReportButton({
  campanaId,
  campanaName = 'Campaña',
  empresaName = 'Empresa',
  className = '',
}: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [progress, setProgress] = useState('');

  const handleGenerate = async () => {
    setStatus('loading');
    setErrorMsg('');
    setProgress('Procesando datos...');

    try {
      setProgress('Generando gráficos y tablas...');

      const response = await fetch(`/api/reports/${campanaId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al generar el informe');
      }

      setProgress('Preparando descarga...');

      // Get file blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Extract filename from Content-Disposition header
      const disposition = response.headers.get('Content-Disposition');
      const match = disposition?.match(/filename="(.+?)"/);
      a.download = match ? match[1] : `Informe_Psicosocial_${campanaId}.docx`;

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setStatus('success');
      setProgress('');
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error desconocido');
      setProgress('');
    }
  };

  const baseClasses = 'inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const stateClasses: Record<Status, string> = {
    idle: 'bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-500 cursor-pointer',
    loading: 'bg-blue-400 text-white cursor-not-allowed',
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white hover:bg-red-700 cursor-pointer',
  };

  return (
    <div className={`flex flex-col items-start gap-2 ${className}`}>
      <button
        onClick={handleGenerate}
        disabled={status === 'loading'}
        className={`${baseClasses} ${stateClasses[status]}`}
        title={`Generar informe de riesgo psicosocial para ${empresaName} - ${campanaName}`}
      >
        {status === 'loading' ? (
          <>
            <Spinner />
            {progress || 'Generando informe...'}
          </>
        ) : status === 'success' ? (
          <>
            <CheckIcon />
            Informe descargado
          </>
        ) : status === 'error' ? (
          <>
            <ErrorIcon />
            Reintentar
          </>
        ) : (
          <>
            <DocumentIcon />
            Generar Informe Word
          </>
        )}
      </button>

      {status === 'loading' && progress && (
        <p className="text-xs text-gray-500 ml-1">{progress}</p>
      )}

      {status === 'error' && errorMsg && (
        <p className="text-xs text-red-600 ml-1 max-w-xs">{errorMsg}</p>
      )}

      {status === 'success' && (
        <p className="text-xs text-green-600 ml-1">
          Informe generado correctamente. Revisa tu carpeta de descargas.
        </p>
      )}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default GenerateReportButton;