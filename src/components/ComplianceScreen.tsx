'use client';

import { useMemo, useState } from 'react';
import { FileText, Scale, X } from 'lucide-react';

interface ComplianceScreenProps {
  onAccept: () => void;
  showFooter?: boolean;
}

const COMPLIANCE_TITLE = 'EQUIVALENCIA FUNCIONAL Y SUSTENTO NORMATIVO DEL APLICATIVO';

const COMPLIANCE_PARAGRAPHS: Array<{ boldLead?: string; text: string }> = [
  {
    text:
      'Este aplicativo, desarrollado por MGA Consultor Empresarial S.A.S., entidad titular de la Licencia vigente de Seguridad y Salud en el Trabajo otorgada mediante Resolución No. 00133 del 09 de mayo de 2019, con vigencia hasta el 09 de mayo de 2029, opera exclusivamente como soporte tecnológico para la aplicación de la Batería de Instrumentos para la Evaluación de Factores de Riesgo Psicosocial adoptada mediante la Resolución 2764 de 2022 del Ministerio del Trabajo, preservando íntegramente su contenido, estructura, instrucciones, metodología, criterios de calificación, baremos y resultados, sin introducir modificaciones de forma ni de fondo que afecten su validez y confiabilidad.',
  },
  {
    text:
      'El aplicativo garantiza la integridad del instrumento, la trazabilidad del proceso de aplicación, la seguridad y confidencialidad de la información, así como la equivalencia funcional entre el medio tecnológico utilizado y el referente técnico adoptado por la autoridad competente, en concordancia con el principio de equivalencia funcional previsto en la Ley 527 de 1999.',
  },
  {
    text:
      'El tratamiento de la información derivada de la aplicación del instrumento se realiza en cumplimiento de las disposiciones sobre protección de datos personales previstas en la Ley 1581 de 2012 y el Decreto 1074 de 2015, especialmente respecto del tratamiento de información sensible.',
  },
  {
    text:
      'Cuando la aplicación, análisis o interpretación del instrumento involucre actuación profesional en psicología, se observarán adicionalmente las disposiciones sobre reserva profesional, confidencialidad, rigor técnico e integridad ética previstas en la Ley 1090 de 2006.',
  },
  {
    text:
      'La referencia contenida en el artículo 4 de la Resolución 2764 de 2022 respecto de la herramienta práctica publicada por el Ministerio del Trabajo se interpreta, para efectos del presente aplicativo, en armonía con el principio de equivalencia funcional previsto en la Ley 527 de 1999 y con la finalidad de la norma, entendiendo que la restricción allí prevista recae sobre la sustitución, alteración o uso de instrumentos o metodologías distintas al referente técnico oficial, supuesto que no se configura en el presente modelo, en la medida en que el aplicativo opera exclusivamente como soporte tecnológico para la aplicación del instrumento oficialmente adoptado, sin modificar su contenido, estructura, metodología ni resultados.',
  },
  {
    text:
      'En consecuencia, este aplicativo no constituye sustitución, modificación ni instrumento alternativo al oficialmente adoptado, sino una modalidad tecnológicamente soportada para su aplicación, jurídicamente sustentada en el principio de equivalencia funcional y en observancia de las disposiciones contenidas en la Resolución 2764 de 2022, la Resolución 2646 de 2008, la Ley 527 de 1999, la Ley 1581 de 2012, el Decreto 1074 de 2015, la Ley 1090 de 2006 y demás normas aplicables en materia de factores de riesgo psicosocial, protección de datos personales y reserva profesional.',
  },
  {
    text:
      'Se conceptúa, en consecuencia, que el presente modelo resulta jurídicamente defendible y técnicamente sustentable como modalidad de soporte tecnológico para la aplicación del instrumento oficial, sin que configure el supuesto de sustitución o herramienta alternativa restringido por el artículo 4 de la Resolución 2764 de 2022.',
  },
  {
    text:
      'La operación del aplicativo se realiza bajo criterios técnicos y metodológicos consistentes con las competencias autorizadas a MGA Consultor Empresarial S.A.S. en el marco de la Licencia de Seguridad y Salud en el Trabajo otorgada mediante Resolución No. 00133 del 09 de mayo de 2019.',
  },
];

function ComplianceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-[#dc9222] to-[#f39205] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Compliance</h3>
              <p className="text-xs text-white/80">{COMPLIANCE_TITLE}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1 min-h-0 overscroll-contain">
          <div className="bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 rounded-xl p-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 text-center">{COMPLIANCE_TITLE}</h4>
            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200 leading-relaxed text-justify">
              {COMPLIANCE_PARAGRAPHS.map((p, idx) => (
                <p key={idx}>{p.text}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-[#dc9222] text-white hover:bg-[#c7831f] transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

export function ComplianceScreen({ onAccept, showFooter = true }: ComplianceScreenProps) {
  const [open, setOpen] = useState(false);

  const footerPreview = useMemo(() => {
    const previewText = COMPLIANCE_PARAGRAPHS[0]?.text || '';
    return previewText;
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="bg-gradient-to-r from-[#dc9222] to-[#f39205] px-6 py-5">
          <div className="flex items-center gap-3">
            <FileText className="w-7 h-7 text-white" />
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Compliance</h2>
              <p className="text-white/85 text-xs mt-1">{COMPLIANCE_TITLE}</p>
            </div>
          </div>
          <p className="text-white/85 text-xs mt-2">
            Lee esta información antes de continuar con el Consentimiento Informado.
          </p>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
              {COMPLIANCE_TITLE}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {COMPLIANCE_PARAGRAPHS[0].text}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex-1 px-4 py-3 text-sm font-semibold rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Ver texto completo
            </button>
            <button
              type="button"
              onClick={onAccept}
              className="flex-1 px-4 py-3 text-sm font-semibold rounded-xl bg-[#dc9222] text-white hover:bg-[#c7831f] transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>

      {showFooter && (
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur border-t border-slate-200 dark:border-slate-700">
            <div className="max-w-2xl mx-auto px-4 py-3 flex items-start gap-3">
              <div className="mt-0.5 w-8 h-8 rounded-xl bg-[#dc9222]/15 dark:bg-[#dc9222]/15 flex items-center justify-center flex-shrink-0">
                <Scale className="w-4 h-4 text-[#dc9222] dark:text-[#f3c27b]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Compliance</div>
                <div className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {footerPreview}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="text-xs font-semibold text-[#dc9222] dark:text-[#f3c27b] hover:underline flex-shrink-0"
              >
                Ver más
              </button>
            </div>
          </div>
        </div>
      )}

      <ComplianceModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
