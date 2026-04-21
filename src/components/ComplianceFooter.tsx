'use client';

import { useMemo, useState } from 'react';
import { Scale, X } from 'lucide-react';

const COMPLIANCE_TITLE = 'EQUIVALENCIA FUNCIONAL Y SUSTENTO NORMATIVO DEL APLICATIVO';

const COMPLIANCE_PARAGRAPHS: string[] = [
  'Este aplicativo, desarrollado por MGA Consultor Empresarial S.A.S., entidad titular de la Licencia vigente de Seguridad y Salud en el Trabajo otorgada mediante Resolución No. 00133 del 09 de mayo de 2019, con vigencia hasta el 09 de mayo de 2029, opera exclusivamente como soporte tecnológico para la aplicación de la Batería de Instrumentos para la Evaluación de Factores de Riesgo Psicosocial adoptada mediante la Resolución 2764 de 2022 del Ministerio del Trabajo, preservando íntegramente su contenido, estructura, instrucciones, metodología, criterios de calificación, baremos y resultados, sin introducir modificaciones de forma ni de fondo que afecten su validez y confiabilidad.',
  'El aplicativo garantiza la integridad del instrumento, la trazabilidad del proceso de aplicación, la seguridad y confidencialidad de la información, así como la equivalencia funcional entre el medio tecnológico utilizado y el referente técnico adoptado por la autoridad competente, en concordancia con el principio de equivalencia funcional previsto en la Ley 527 de 1999.',
  'El tratamiento de la información derivada de la aplicación del instrumento se realiza en cumplimiento de las disposiciones sobre protección de datos personales previstas en la Ley 1581 de 2012 y el Decreto 1074 de 2015, especialmente respecto del tratamiento de información sensible.',
  'Cuando la aplicación, análisis o interpretación del instrumento involucre actuación profesional en psicología, se observarán adicionalmente las disposiciones sobre reserva profesional, confidencialidad, rigor técnico e integridad ética previstas en la Ley 1090 de 2006.',
  'La referencia contenida en el artículo 4 de la Resolución 2764 de 2022 respecto de la herramienta práctica publicada por el Ministerio del Trabajo se interpreta, para efectos del presente aplicativo, en armonía con el principio de equivalencia funcional previsto en la Ley 527 de 1999 y con la finalidad de la norma, entendiendo que la restricción allí prevista recae sobre la sustitución, alteración o uso de instrumentos o metodologías distintas al referente técnico oficial, supuesto que no se configura en el presente modelo, en la medida en que el aplicativo opera exclusivamente como soporte tecnológico para la aplicación del instrumento oficialmente adoptado, sin modificar su contenido, estructura, metodología ni resultados.',
  'En consecuencia, este aplicativo no constituye sustitución, modificación ni instrumento alternativo al oficialmente adoptado, sino una modalidad tecnológicamente soportada para su aplicación, jurídicamente sustentada en el principio de equivalencia funcional y en observancia de las disposiciones contenidas en la Resolución 2764 de 2022, la Resolución 2646 de 2008, la Ley 527 de 1999, la Ley 1581 de 2012, el Decreto 1074 de 2015, la Ley 1090 de 2006 y demás normas aplicables en materia de factores de riesgo psicosocial, protección de datos personales y reserva profesional.',
  'Se conceptúa, en consecuencia, que el presente modelo resulta jurídicamente defendible y técnicamente sustentable como modalidad de soporte tecnológico para la aplicación del instrumento oficial, sin que configure el supuesto de sustitución o herramienta alternativa restringido por el artículo 4 de la Resolución 2764 de 2022.',
  'La operación del aplicativo se realiza bajo criterios técnicos y metodológicos consistentes con las competencias autorizadas a MGA Consultor Empresarial S.A.S. en el marco de la Licencia de Seguridad y Salud en el Trabajo otorgada mediante Resolución No. 00133 del 09 de mayo de 2019.',
];

function ComplianceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white text-center">Compliance</h3>
              <p className="text-xs text-white/80 text-center">{COMPLIANCE_TITLE}</p>
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
              {COMPLIANCE_PARAGRAPHS.map((t, idx) => (
                <p key={idx}>{t}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

export function ComplianceFooter() {
  const [open, setOpen] = useState(false);

  const preview = useMemo(() => COMPLIANCE_PARAGRAPHS[0] || '', []);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur border-t border-slate-200 dark:border-slate-700">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-start gap-3">
            <div className="mt-0.5 w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
              <Scale className="w-4 h-4 text-indigo-700 dark:text-indigo-300" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Compliance</div>
              <div className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                {preview}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:underline flex-shrink-0"
            >
              Ver más
            </button>
          </div>
        </div>
      </div>

      <ComplianceModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
