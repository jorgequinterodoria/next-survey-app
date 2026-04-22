'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toggleCampaignStatus } from '@/app/actions/admin';
import { Download, ExternalLink, FileSpreadsheet, MoreVertical, Power, Users } from 'lucide-react';
import ImportExcelModal from './ImportExcelModal';
import { EditCampaignModal } from './EditCampaignModal';

type CampaignRow = {
  id: string;
  name: string;
  token: string;
  isActive: boolean;
  empresaName: string;
  evaluadorNombre: string | null;
  evaluadorId: string | null;
  evaluadorProfesion: string | null;
  evaluadorPostgrado: string | null;
  evaluadorTarjeta: string | null;
  evaluadorLicencia: string | null;
  evaluadorLicenciaFecha: string | null;
  evaluadorFirma: string | null;
};

export function CampaignActionsDropdown({ campaign }: { campaign: CampaignRow }) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [isGeneratingWord, setIsGeneratingWord] = useState(false);
  const [wordError, setWordError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  async function handleToggleActive() {
    await toggleCampaignStatus(campaign.id, !campaign.isActive);
    router.refresh();
    setOpen(false);
  }

  async function handleGenerateWord() {
    setIsGeneratingWord(true);
    setWordError(null);
    try {
      const response = await fetch(`/api/reports/${campaign.id}`, { method: 'POST' });
      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await response.json();
          throw new Error(data?.error || 'Error al generar el informe');
        }
        throw new Error(`Error al generar el informe (HTTP ${response.status})`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const disposition = response.headers.get('Content-Disposition');
      const match = disposition?.match(/filename="(.+?)"/);
      a.download = match ? match[1] : `Informe_Psicosocial_${campaign.id}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setWordError(err instanceof Error ? err.message : 'Error generando el informe');
    } finally {
      setIsGeneratingWord(false);
      setOpen(false);
    }
  }

  return (
    <div className="relative inline-block" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
        aria-label="Acciones"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreVertical className="h-4 w-4" />
        Acciones
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden z-30"
          role="menu"
        >
          <div className="py-1">
            <EditCampaignModal campaign={campaign} />

            <button
              type="button"
              onClick={handleToggleActive}
              className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              role="menuitem"
            >
              <Power className="h-4 w-4" />
              {campaign.isActive ? 'Inactivar' : 'Activar'}
            </button>

            <ImportExcelModal campanaId={campaign.id} triggerVariant="menu" />

            <Link
              href={`/admin/campaigns/${campaign.id}/participants`}
              className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <Users className="h-4 w-4" />
              Ver listado
            </Link>

            <Link
              href={`/api/admin/export?campanaId=${campaign.id}`}
              target="_blank"
              className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Exportar Excel
            </Link>

            <button
              type="button"
              onClick={handleGenerateWord}
              disabled={isGeneratingWord}
              className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50"
              role="menuitem"
            >
              <Download className="h-4 w-4" />
              {isGeneratingWord ? 'Generando Word...' : 'Generar Word'}
            </button>

            <Link
              href={`/?token=${campaign.token}`}
              target="_blank"
              className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <ExternalLink className="h-4 w-4" />
              Abrir encuesta
            </Link>
          </div>

          {wordError && (
            <div className="border-t border-slate-200 px-3 py-2 text-xs text-red-600">
              {wordError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
