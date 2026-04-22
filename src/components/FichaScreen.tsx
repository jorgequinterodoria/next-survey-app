'use client';

import { useMemo } from 'react';
import { ChevronRight, AlertCircle, ClipboardList } from 'lucide-react';
import { fichaQuestions } from '@/data/surveyData';
import { FieldStatus, SectionProgress } from './FieldStatus';
import municipiosData from '@/data/municipios.json';

interface FichaScreenProps {
  fichaAnswers: Record<string, string>;
  onAnswer: (key: string, value: string) => void;
  onNext: () => void;
  errors: string[];
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function isQuestionAnswered(q: typeof fichaQuestions[0], answers: Record<string, string>): boolean {
  if (q.subfields) {
    return q.subfields.every(sf => {
      const value = answers[sf.key];
      return value !== undefined && value !== null && value.trim() !== '';
    });
  }
  const value = answers[`ficha_${q.id}`];
  return value !== undefined && value !== null && value.trim() !== '';
}

export function FichaScreen({ fichaAnswers, onAnswer, onNext, errors }: FichaScreenProps) {
  const { municipiosUnicos, deptosByMunicipioKey } = useMemo(() => {
    const deptosMap = new Map<string, Set<string>>();
    const muniCanonical = new Map<string, string>();
    for (const row of municipiosData as Array<{ muni: string; depto: string }>) {
      const muni = String(row.muni ?? '').trim();
      const depto = String(row.depto ?? '').trim();
      if (!muni || !depto) continue;
      const key = normalizeText(muni);
      if (!muniCanonical.has(key)) muniCanonical.set(key, muni);
      const set = deptosMap.get(key) ?? new Set<string>();
      set.add(depto);
      deptosMap.set(key, set);
    }
    const municipiosUnicos = Array.from(muniCanonical.entries())
      .map(([, muni]) => muni)
      .sort((a, b) => a.localeCompare(b, 'es'));
    return { municipiosUnicos, deptosByMunicipioKey: deptosMap };
  }, []);

  const answeredCount = fichaQuestions.filter(q => isQuestionAnswered(q, fichaAnswers)).length;
  const totalQuestions = fichaQuestions.length;
  const progressPercentage = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="bg-linear-to-r from-emerald-600 to-teal-700 px-6 py-5">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-7 h-7 text-white" />
            <h2 className="text-lg font-bold text-white">Ficha de Datos Generales</h2>
          </div>
          <p className="text-emerald-100 text-xs mt-2">
            Las siguientes preguntas se refieren a información general de usted o su ocupación. Por
            favor seleccione una sola respuesta para cada pregunta.
          </p>
        </div>

        <div className="p-5 space-y-5">
          <SectionProgress
            current={answeredCount}
            total={totalQuestions}
            label={`${progressPercentage}% completado`}
          />

          {errors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-sm font-semibold text-red-700 dark:text-red-300">Campos obligatorios sin completar:</p>
              </div>
              <ul className="text-xs text-red-600 dark:text-red-400 space-y-1 list-disc list-inside">
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          {fichaQuestions.map((q) => {
            const isAnswered = isQuestionAnswered(q, fichaAnswers);

            return (
              <div key={q.id} className={`space-y-1.5 p-3 rounded-lg border transition-all ${isAnswered
                  ? 'border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/10'
                  : 'border-transparent'
                }`}>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {q.id}. {q.texto} <span className="text-red-500">*</span>
                  </label>
                  <FieldStatus isValid={isAnswered} showWhenInvalid={true} />
                </div>

                {q.helpText && (
                  <div className="flex items-start gap-1.5 text-xs text-[#dc9222] dark:text-[#dc9222] bg-[#dc9222]/10 dark:bg-[#dc9222]/15 p-2 rounded-md mt-1">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{q.helpText}</p>
                  </div>
                )}

                {q.subfields ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(() => {
                      const muniField =
                        q.subfields?.find((sf) => sf.key === 'ciudad_residencia') ||
                        q.subfields?.find((sf) => sf.key === 'ciudad_trabajo');
                      const deptoField =
                        q.subfields?.find((sf) => sf.key === 'departamento_residencia') ||
                        q.subfields?.find((sf) => sf.key === 'departamento_trabajo');

                      if (!muniField || !deptoField) {
                        return q.subfields.map((sf) => (
                          <div key={sf.key}>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">{sf.label}</label>
                            <input
                              type="text"
                              value={fichaAnswers[sf.key] || ''}
                              onChange={(e) => onAnswer(sf.key, e.target.value)}
                              className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder-slate-400 dark:placeholder-slate-500 ${fichaAnswers[sf.key]?.trim()
                                  ? 'border-green-400 dark:border-green-600'
                                  : 'border-slate-300 dark:border-slate-600'
                                }`}
                              placeholder={sf.label}
                            />
                          </div>
                        ));
                      }

                      const muniValue = fichaAnswers[muniField.key] || '';
                      const muniKey = normalizeText(muniValue);
                      const deptos = muniValue && deptosByMunicipioKey.has(muniKey)
                        ? Array.from(deptosByMunicipioKey.get(muniKey) ?? [])
                        : [];
                      deptos.sort((a, b) => a.localeCompare(b, 'es'));

                      const deptoValue = fichaAnswers[deptoField.key] || '';
                      const deptoValidForMunicipio = deptos.length ? deptos.includes(deptoValue) : true;

                      const onMunicipioChange = (value: string) => {
                        onAnswer(muniField.key, value);
                        const key = normalizeText(value);
                        const options = value && deptosByMunicipioKey.has(key)
                          ? Array.from(deptosByMunicipioKey.get(key) ?? [])
                          : [];
                        if (!options.length) return;
                        if (options.length === 1) {
                          onAnswer(deptoField.key, options[0] ?? '');
                          return;
                        }
                        const current = fichaAnswers[deptoField.key] || '';
                        if (!options.includes(current)) onAnswer(deptoField.key, '');
                      };

                      return (
                        <>
                          <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">{muniField.label}</label>
                            <input
                              type="text"
                              value={muniValue}
                              onChange={(e) => onMunicipioChange(e.target.value)}
                              list="municipios_datalist"
                              className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder-slate-400 dark:placeholder-slate-500 ${muniValue.trim()
                                  ? 'border-green-400 dark:border-green-600'
                                  : 'border-slate-300 dark:border-slate-600'
                                }`}
                              placeholder={muniField.label}
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">{deptoField.label}</label>
                            {deptos.length > 1 ? (
                              <select
                                value={deptoValidForMunicipio ? deptoValue : ''}
                                onChange={(e) => onAnswer(deptoField.key, e.target.value)}
                                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 ${deptoValue.trim()
                                    ? 'border-green-400 dark:border-green-600'
                                    : 'border-slate-300 dark:border-slate-600'
                                  }`}
                              >
                                <option value="">-- Seleccione --</option>
                                {deptos.map((d) => (
                                  <option key={d} value={d}>
                                    {d}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={deptos.length === 1 ? deptos[0] : deptoValue}
                                onChange={(e) => onAnswer(deptoField.key, e.target.value)}
                                disabled={deptos.length === 1}
                                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder-slate-400 dark:placeholder-slate-500 ${((deptos.length === 1 ? deptos[0] : deptoValue) || '').trim()
                                    ? 'border-green-400 dark:border-green-600'
                                    : 'border-slate-300 dark:border-slate-600'
                                  } ${deptos.length === 1 ? 'opacity-80 cursor-not-allowed' : ''}`}
                                placeholder={deptoField.label}
                              />
                            )}
                          </div>

                          <datalist id="municipios_datalist">
                            {municipiosUnicos.map((m) => (
                              <option key={m} value={m} />
                            ))}
                          </datalist>
                        </>
                      );
                    })()}
                  </div>
                ) : q.tipo === 'text' ? (
                  <input
                    type="text"
                    value={fichaAnswers[`ficha_${q.id}`] || ''}
                    onChange={(e) => onAnswer(`ficha_${q.id}`, e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder-slate-400 dark:placeholder-slate-500 ${fichaAnswers[`ficha_${q.id}`]?.trim()
                        ? 'border-green-400 dark:border-green-600'
                        : 'border-slate-300 dark:border-slate-600'
                      }`}
                  />
                ) : q.tipo === 'number' ? (
                  <input
                    type="number"
                    value={fichaAnswers[`ficha_${q.id}`] || ''}
                    onChange={(e) => onAnswer(`ficha_${q.id}`, e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder-slate-400 dark:placeholder-slate-500 ${fichaAnswers[`ficha_${q.id}`]?.trim()
                        ? 'border-green-400 dark:border-green-600'
                        : 'border-slate-300 dark:border-slate-600'
                      }`}
                  />
                ) : q.tipo === 'select' ? (
                  <select
                    value={fichaAnswers[`ficha_${q.id}`] || ''}
                    onChange={(e) => onAnswer(`ficha_${q.id}`, e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 ${fichaAnswers[`ficha_${q.id}`]?.trim()
                        ? 'border-green-400 dark:border-green-600'
                        : 'border-slate-300 dark:border-slate-600'
                      }`}
                  >
                    <option value="">-- Seleccione --</option>
                    {q.opciones?.map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                ) : q.tipo === 'radio' ? (
                  <div className="space-y-2">
                    {q.opciones?.map((op) => (
                      <label
                        key={op}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${fichaAnswers[`ficha_${q.id}`] === op
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 ring-1 ring-emerald-500'
                            : 'border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                          }`}
                      >
                        <input
                          type="radio"
                          name={`ficha_${q.id}`}
                          value={op}
                          checked={fichaAnswers[`ficha_${q.id}`] === op}
                          onChange={(e) => onAnswer(`ficha_${q.id}`, e.target.value)}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-200">{op}</span>
                      </label>
                    ))}
                  </div>
                ) : q.tipo === 'years' ? (
                  <div className="space-y-3">
                    <label
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${fichaAnswers[`ficha_${q.id}`] === 'Menos de 1 año'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 ring-1 ring-emerald-500'
                          : 'border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                    >
                      <input
                        type="radio"
                        name={`ficha_${q.id}_type`}
                        checked={fichaAnswers[`ficha_${q.id}`] === 'Menos de 1 año'}
                        onChange={() => onAnswer(`ficha_${q.id}`, 'Menos de 1 año')}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-200">Si lleva menos de un año marque esta opción</span>
                    </label>

                    <label
                      className={`flex flex-col gap-2 p-3 rounded-lg border cursor-pointer transition-all ${fichaAnswers[`ficha_${q.id}`] !== 'Menos de 1 año' && fichaAnswers[`ficha_${q.id}`] !== undefined && fichaAnswers[`ficha_${q.id}`] !== ''
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 ring-1 ring-emerald-500'
                          : 'border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={`ficha_${q.id}_type`}
                          checked={fichaAnswers[`ficha_${q.id}`] !== 'Menos de 1 año' && fichaAnswers[`ficha_${q.id}`] !== undefined && fichaAnswers[`ficha_${q.id}`] !== ''}
                          onChange={() => {
                            // Solo ponemos un string numérico inicial si venían de 'Menos de 1 año'
                            if (fichaAnswers[`ficha_${q.id}`] === 'Menos de 1 año' || !fichaAnswers[`ficha_${q.id}`]) {
                              onAnswer(`ficha_${q.id}`, '1');
                            }
                          }}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-200">Si lleva más de un año, anote cuántos años:</span>
                      </div>
                      {fichaAnswers[`ficha_${q.id}`] !== 'Menos de 1 año' && fichaAnswers[`ficha_${q.id}`] !== undefined && fichaAnswers[`ficha_${q.id}`] !== '' && (
                        <div className="ml-7">
                          <input
                            type="number"
                            min="1"
                            value={fichaAnswers[`ficha_${q.id}`]}
                            onChange={(e) => onAnswer(`ficha_${q.id}`, e.target.value)}
                            className="w-full sm:w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder-slate-400 dark:placeholder-slate-500 border-green-400 dark:border-green-600"
                            placeholder="Ej. 2"
                          />
                        </div>
                      )}
                    </label>
                  </div>
                ) : null}
              </div>
            );
          })}

          <button
            onClick={onNext}
            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 flex items-center justify-center gap-2"
          >
            Continuar
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
