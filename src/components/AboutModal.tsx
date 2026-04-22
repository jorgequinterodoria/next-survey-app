'use client';

import { useState } from 'react';
import { HelpCircle, Scale, X } from 'lucide-react';

const ABOUT_DATA = {
  appName:
    'Sistema Digital para la Aplicación de la Batería de Instrumentos para la Evaluación de Factores de Riesgo Psicosocial – MGA',
  developedBy: 'MGA Consultor Empresarial S.A.S.',
  licenseTitle:
    'Licencia de Seguridad y Salud en el Trabajo otorgada mediante Resolución No. 00133 del 09 de mayo de 2019.',
  licenseValidUntil: 'Hasta el 09 de mayo de 2029.',
  technicalNorms: ['Resolución 2646 de 2008.', 'Resolución 2764 de 2022.'],
  functionalEquivalence: ['Ley 527 de 1999.'],
  dataProtection: ['Ley 1581 de 2012.', 'Decreto 1074 de 2015.'],
  professionalSecrecy: ['Ley 1090 de 2006.'],
  version: 'v1.0',
  validationDate: '13 / 03 /2026',
  validationStatus:
    'Modelo validado bajo criterio de equivalencia funcional, integridad del instrumento, trazabilidad del proceso y consistencia técnica.',
  technicalResponsible: 'Jorge Quintero Doria',
  technicalRole: 'Ingeniero de Sistemas',
  declaration:
    'Este aplicativo opera exclusivamente como soporte tecnológico para la aplicación del instrumento oficial adoptado mediante la Resolución 2764 de 2022, sin modificación de forma ni de fondo, bajo criterio de equivalencia funcional, integridad del instrumento, protección de datos, reserva profesional y sustento técnico-jurídico documentado.',
};

function AboutDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-[#dc9222] to-[#f39205] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-white text-center">Acerca de</h3>
              <p className="text-xs text-white/80 text-center truncate">Información del aplicativo</p>
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
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 text-center">
              Sistema Digital para la Aplicación de la Batería de Riesgo Psicosocial – MGA
            </h4>

            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">Nombre del aplicativo:</div>
                <div className="text-justify">{ABOUT_DATA.appName}</div>
              </div>

              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">Desarrollado por:</div>
                <div className="text-justify">{ABOUT_DATA.developedBy}</div>
              </div>

              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">Titular de Licencia SST:</div>
                <div className="text-justify">{ABOUT_DATA.licenseTitle}</div>
              </div>

              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">Vigencia de la licencia:</div>
                <div className="text-justify">{ABOUT_DATA.licenseValidUntil}</div>
              </div>

              <div className="pt-2">
                <div className="font-bold text-slate-900 dark:text-slate-100">Fundamento normativo aplicable</div>

                <div className="mt-3">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">Normatividad técnica y específica:</div>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    {ABOUT_DATA.technicalNorms.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">Equivalencia funcional y soporte electrónico:</div>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    {ABOUT_DATA.functionalEquivalence.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">Protección de datos personales:</div>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    {ABOUT_DATA.dataProtection.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    Reserva profesional (cuando aplique actuación profesional en psicología):
                  </div>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    {ABOUT_DATA.professionalSecrecy.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2">
                <div className="font-bold text-slate-900 dark:text-slate-100">Información técnica del sistema</div>

                <div className="mt-3 grid sm:grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Versión del aplicativo</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{ABOUT_DATA.version}</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Fecha de validación del modelo</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{ABOUT_DATA.validationDate}</div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">Estado de validación:</div>
                  <div className="text-justify">{ABOUT_DATA.validationStatus}</div>
                </div>

                <div className="mt-3">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">Responsable técnico:</div>
                  <div className="text-justify">{ABOUT_DATA.technicalResponsible}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Cargo: <span className="font-semibold">{ABOUT_DATA.technicalRole}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="font-bold text-slate-900 dark:text-slate-100">Declaración del sistema</div>
                <div className="mt-2 text-justify">{ABOUT_DATA.declaration}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            type="button"
            onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-[#dc9222] text-white hover:bg-[#c7831f] transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export function AboutModalButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        aria-label="Acerca de"
      >
        <HelpCircle className="w-4 h-4 text-[#dc9222] dark:text-[#f3c27b]" />
        <span className="text-xs font-bold">Acerca de</span>
      </button>

      <AboutDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
