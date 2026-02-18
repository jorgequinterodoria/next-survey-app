'use client';

import { useSurvey } from '@/hooks/useSurvey';
import { ConsentScreen } from '@/components/ConsentScreen'
import { FichaScreen } from '@/components/FichaScreen'
import { LikertSection } from '@/components/LikertSection'
import { SuccessScreen } from '@/components/SuccessScreen'
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LoadingButton } from '@/components/LoadingButton';
import { SectionProgress } from '@/components/FieldStatus';
import { Brain, Shield } from 'lucide-react';
import {
  LIKERT_OPTIONS_INTRALABORAL,
  LIKERT_OPTIONS_EXTRALABORAL,
  LIKERT_OPTIONS_ESTRES,
  estresQuestions,
} from '@/data/surveyData';

interface SurveyRunnerProps {
    campaignId: string
    campaignName: string
    companyName: string
}

export default function SurveyRunner({ campaignId, campaignName, companyName }: SurveyRunnerProps) {
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
    isSubmitting,
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
  } = useSurvey({ campaignId });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
              {companyName} - {campaignName}
            </h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Batería de Riesgo Psicosocial
            </p>
          </div>
          <ThemeToggle />
          {phase !== 'consent' && phase !== 'success' && (
            <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold px-2 py-1 rounded-full">
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
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
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

              <div className="h-1.5 bg-slate-100 dark:bg-slate-700">
                <div className="h-full bg-rose-600 w-full" />
              </div>

              <div className="p-5 space-y-4">
                {(() => {
                  const answeredCount = estresQuestions.filter(q => estresAnswers[`estres_${q.id}`]).length;
                  return (
                    <SectionProgress
                      current={answeredCount}
                      total={estresQuestions.length}
                      label={`${answeredCount}/${estresQuestions.length} preguntas respondidas`}
                    />
                  );
                })()}

                {errors.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-red-700 dark:text-red-300">
                        {errors.some(e => e.startsWith('Pregunta'))
                          ? 'Debe responder todas las preguntas para finalizar'
                          : 'Hubo un error al procesar la encuesta'}
                      </span>
                    </div>
                    {errors.some(e => e.startsWith('Pregunta')) ? (
                      <p className="text-xs text-red-500 dark:text-red-400">
                        {errors.length} pregunta(s) sin responder
                      </p>
                    ) : (
                      <ul className="list-disc list-inside text-xs text-red-500 dark:text-red-400 mt-1">
                        {errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {estresQuestions.map((q) => {
                  const isAnswered = !!estresAnswers[`estres_${q.id}`];
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border transition-all ${isAnswered
                          ? 'border-green-300 dark:border-green-700 bg-green-50/30 dark:bg-green-900/10'
                          : errors.length > 0
                            ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                            : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/30'
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3 flex-1">
                          <span className="text-slate-400 dark:text-slate-500 mr-1">{q.id}.</span> {q.texto}
                        </p>
                        {isAnswered && (
                          <span className="text-green-500 text-xs">✓</span>
                        )}
                      </div>
                       <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {LIKERT_OPTIONS_ESTRES.map((opt) => {
                          const isSelected = estresAnswers[`estres_${q.id}`] === opt.value;
                          return (
                            <label
                              key={opt.value}
                              className={`flex items-center justify-center py-2 px-2 rounded-lg border cursor-pointer transition-all text-xs font-medium text-center ${
                                isSelected
                                  ? 'ring-1 ring-rose-500 border-rose-500 bg-rose-50 text-rose-700 dark:ring-rose-400 dark:border-rose-400 dark:bg-rose-900/40 dark:text-rose-200'
                                  : 'border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`estres_${q.id}`}
                                value={opt.value}
                                checked={isSelected}
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
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                <div className="flex gap-3 pt-2">
                  <LoadingButton
                    onClick={goBackFromEstres}
                    variant="secondary"
                    disabled={isSubmitting}
                  >
                    Anterior
                  </LoadingButton>
                  <LoadingButton
                    onClick={handleEstresNext}
                    variant="success"
                    isLoading={isSubmitting}
                    loadingText="Guardando..."
                  >
                    Finalizar y Guardar
                  </LoadingButton>
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
