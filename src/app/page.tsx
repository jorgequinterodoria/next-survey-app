'use client';

import { useSurvey } from '@/hooks/useSurvey';
import { ConsentScreen } from '@/components/ConsentScreen'
import { FichaScreen } from '@/components/FichaScreen'
import { LikertSection } from '@/components/LikertSection'
import { SuccessScreen } from '@/components/SuccessScreen'
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { Brain, Shield } from 'lucide-react';
import {
  LIKERT_OPTIONS_INTRALABORAL,
  LIKERT_OPTIONS_EXTRALABORAL,
  LIKERT_OPTIONS_ESTRES,
  estresQuestions,
} from '@/data/surveyData';

export default function Home() {
  const {
    phase,
    consentName,
    consentDoc,
    consentAccepted,
    fichaAnswers,
    intralaboralAnswers,
    extralaboralAnswers,
    estresAnswers,
    currentSectionIndex,
    formType,
    errors,
    filterClientes,
    progressSteps,
    getCurrentSections,
    setConsentName,
    setConsentDoc,
    setConsentAccepted,
    setFichaAnswers,
    setIntralaboralAnswers,
    setExtralaboralAnswers,
    setEstresAnswers,
    handleConsentNext,
    handleFichaNext,
    handleSectionNext,
    handleSectionPrev,
    handleEstresNext,
    goBackFromEstres,
    getFilterValueForSection,
    getFilterSetterForSection,
  } = useSurvey();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-slate-800 truncate">
              Batería de Riesgo Psicosocial
            </h1>
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Resolución 2764 de 2022
            </p>
          </div>
          {phase !== 'consent' && phase !== 'success' && (
            <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-full">
              Forma {formType}
            </span>
          )}
        </div>
      </header>

      <main className="px-4 py-6 pb-24">
        {phase !== 'success' && <ProgressIndicator steps={progressSteps} />}

        {phase === 'consent' && (
          <ConsentScreen
            consentName={consentName}
            consentDoc={consentDoc}
            consentAccepted={consentAccepted}
            onNameChange={setConsentName}
            onDocChange={setConsentDoc}
            onAccept={setConsentAccepted}
            onNext={handleConsentNext}
          />
        )}

        {phase === 'ficha' && (
          <FichaScreen
            fichaAnswers={fichaAnswers}
            onAnswer={(k: string, v: string) =>
              setFichaAnswers((p: Record<string, string>) => ({ ...p, [k]: v }))
            }
            onNext={handleFichaNext}
            errors={errors}
          />
        )}

        {(phase === 'intralaboral' || phase === 'extralaboral') && (() => {
          const sections = getCurrentSections();
          const section = sections[currentSectionIndex];
          if (!section) return null;
          const answersMap = phase === 'intralaboral' ? intralaboralAnswers : extralaboralAnswers;
          const setAnswers = phase === 'intralaboral' ? setIntralaboralAnswers : setExtralaboralAnswers;
          const color = phase === 'intralaboral' ? (formType === 'A' ? 'blue' : 'purple') : 'amber';
          const options = phase === 'intralaboral' ? LIKERT_OPTIONS_INTRALABORAL : LIKERT_OPTIONS_EXTRALABORAL;

          return (
            <LikertSection
              key={`${phase}_${currentSectionIndex}`}
              section={section}
              sectionIndex={currentSectionIndex}
              totalSections={sections.length}
              answers={answersMap}
              onAnswer={(k: string, v: string) =>
                setAnswers((p: Record<string, string>) => ({ ...p, [k]: v }))
              }
              onNext={handleSectionNext}
              onPrev={handleSectionPrev}
              likertOptions={options}
              formLabel={
                phase === 'intralaboral'
                  ? `Cuestionario Intralaboral - Forma ${formType}`
                  : 'Cuestionario Extralaboral'
              }
              color={color}
              errors={errors}
              filterValue={section.filtro ? getFilterValueForSection(section) : undefined}
              onFilterChange={section.filtro ? getFilterSetterForSection(section) : undefined}
            />
          );
        })()}

        {phase === 'estres' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-rose-600 to-pink-700 px-6 py-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-white/70 uppercase tracking-wide">
                    Cuestionario de Estrés
                  </span>
                  <span className="text-xs font-medium text-white/70">Tercera Versión</span>
                </div>
                <h2 className="text-lg font-bold text-white">
                  Evaluación del Estrés
                </h2>
                <p className="text-white/80 text-xs mt-2">
                  Señale la frecuencia con que se le han presentado los siguientes malestares en los
                  últimos tres meses.
                </p>
              </div>

              <div className="h-1.5 bg-slate-100">
                <div className="h-full bg-rose-600 w-full" />
              </div>

              <div className="p-5 space-y-4">
                {errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-red-700">
                        Debe responder todas las preguntas para finalizar
                      </span>
                    </div>
                    <p className="text-xs text-red-500">
                      {errors.length} pregunta(s) sin responder
                    </p>
                  </div>
                )}

                {estresQuestions.map((q) => (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border transition-all ${estresAnswers[`estres_${q.id}`]
                        ? 'border-slate-200 bg-white'
                        : errors.length > 0
                          ? 'border-red-300 bg-red-50'
                          : 'border-slate-200'
                      }`}
                  >
                    <p className="text-sm font-medium text-slate-700 mb-3">
                      <span className="text-slate-400 mr-1">{q.id}.</span> {q.texto}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {LIKERT_OPTIONS_ESTRES.map((opt) => (
                        <label
                          key={opt.value}
                          className={`flex items-center justify-center py-2 px-2 rounded-lg border cursor-pointer transition-all text-xs font-medium text-center ${estresAnswers[`estres_${q.id}`] === opt.value
                              ? 'ring-1 ring-rose-500 border-rose-500 bg-rose-50'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                            }`}
                        >
                          <input
                            type="radio"
                            name={`estres_${q.id}`}
                            value={opt.value}
                            checked={estresAnswers[`estres_${q.id}`] === opt.value}
                            onChange={() =>
                              setEstresAnswers((p) => ({
                                ...p,
                                [`estres_${q.id}`]: opt.value,
                              }))
                            }
                            className="sr-only"
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={goBackFromEstres}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-1"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={handleEstresNext}
                    className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-1"
                  >
                    Finalizar y Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {phase === 'success' && <SuccessScreen formaType={formType} />}
      </main>
    </div>
  );
}
