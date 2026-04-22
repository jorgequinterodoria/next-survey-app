'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  formaASections,
  formaBSections,
  extralaboralSections,
  estresQuestions,
  fichaQuestions,
  LIKERT_OPTIONS_INTRALABORAL,
  LIKERT_OPTIONS_EXTRALABORAL,
  LIKERT_OPTIONS_ESTRES,
} from '@/data/surveyData';

type Phase =
  | 'intro'
  | 'video'
  | 'consent'
  | 'compliance'
  | 'ficha'
  | 'intralaboral'
  | 'extralaboral'
  | 'estres'
  | 'success';

export function useSurvey({ campaignId }: { campaignId: string }) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [videoWatched, setVideoWatched] = useState(false);
  // ... (keep state)
  const [consentName, setConsentName] = useState('');
  const [consentDoc, setConsentDoc] = useState('');
  const [consentSignature, setConsentSignature] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [fichaAnswers, setFichaAnswers] = useState<Record<string, string>>({});
  const [intralaboralAnswers, setIntralaboralAnswers] = useState<Record<string, string>>({});
  const [extralaboralAnswers, setExtralaboralAnswers] = useState<Record<string, string>>({});
  const [estresAnswers, setEstresAnswers] = useState<Record<string, string>>({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formType, setFormType] = useState<'A' | 'B'>('B');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [notEligibleMessage, setNotEligibleMessage] = useState<string | null>(null);

  // Filter states for conditional sections
  const [filterClientes, setFilterClientes] = useState<string | null>(null);
  const [filterJefatura, setFilterJefatura] = useState<string | null>(null);

  const intralaboralSections = formType === 'A' ? formaASections : formaBSections;

  // Build the overall list of sections for the current questionnaire phase
  const getCurrentSections = useCallback(() => {
    if (phase === 'intralaboral') return intralaboralSections;
    if (phase === 'extralaboral') return extralaboralSections;
    return [];
  }, [phase, intralaboralSections]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToTop();
  }, [phase, currentSectionIndex]);

  // Validate ficha
  const validateFicha = (): string[] => {
    const errs: string[] = [];
    for (const q of fichaQuestions) {
      if (q.subfields) {
        for (const sf of q.subfields) {
          if (!fichaAnswers[sf.key]?.trim()) {
            errs.push(`${q.texto} - ${sf.label}`);
          }
        }
      } else {
        if (!fichaAnswers[`ficha_${q.id}`]?.trim()) {
          errs.push(q.texto);
        }
      }
    }
    return errs;
  };

  // Validate a likert section
  const validateLikertSection = (
    section: typeof intralaboralSections[0],
    answers: Record<string, string>,
    filterVal?: string | null
  ): string[] => {
    // Si tiene filtro y no se ha respondido
    if (section.filtro) {
      if (!filterVal) return ['Debe responder la pregunta inicial (Sí/No)'];
      // Si respondió NO, no valida preguntas internas
      if (filterVal === 'no') return [];
    }

    // Validar preguntas internas (solo si no hay filtro o si filtro es 'si')
    const errs: string[] = [];
    for (const q of section.preguntas) {
      if (!answers[`${section.key}_${q.id}`]) {
        errs.push(`Pregunta ${q.id}`);
      }
    }
    return errs;
  };

  // Validate estres
  const validateEstres = (): string[] => {
    const errs: string[] = [];
    for (const q of estresQuestions) {
      if (!estresAnswers[`estres_${q.id}`]) {
        errs.push(`Pregunta ${q.id}`);
      }
    }
    return errs;
  };

  const handleIntroNext = () => {
    setPhase('video');
  };

  const handleVideoNext = () => {
    setVideoWatched(true);
    setPhase('compliance');
  };

  const handleComplianceNext = () => {
    setPhase('consent');
  };

  const handleConsentNext = async () => {
    if (consentName.trim() && consentDoc.trim() && consentSignature.trim() && consentAccepted) {
      setIsVerifying(true);
      setErrors([]);
      try {
        const response = await fetch('/api/survey/verify-cedula', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            campaignId,
            cedula: consentDoc,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al verificar la cédula');
        }

        const data = await response.json();

        const prefill = (data?.prefill && typeof data.prefill === 'object') ? data.prefill : null;

        const normalizeText = (value: string) =>
          value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();

        const mapNivelOcupacionalToFicha13 = (nivel: string): string | null => {
          const q13 = fichaQuestions.find((q) => q.id === 13);
          const opts = (q13 && 'opciones' in q13 ? (q13.opciones as string[] | undefined) : undefined) ?? [];
          if (!opts.length) return null;

          const n = normalizeText(nivel);
          if (n.includes('directivo') || n.includes('jefatura') || n.includes('coordin')) return opts[0] ?? null;
          if (n.includes('profesional') || n.includes('tecnico') || n.includes('tecnologo') || n.includes('analista')) return opts[1] ?? null;
          if (n.includes('auxiliar') || n.includes('asistente') || n.includes('asistencial')) return opts[2] ?? null;
          if (n.includes('operario') || n.includes('operador') || n.includes('ayudante') || n.includes('servicios generales')) return opts[3] ?? null;
          return null;
        };

        if (data.hasCompleted) {
          setErrors(['Ya has completado la encuesta para esta campaña.']);
        } else if (data.notEligible) {
          setNotEligibleMessage('Aún no cuenta con la antigüedad suficiente para realizar la encuesta.');
        } else if (data.isRegistered === false) {
          setErrors(['No se encuentra habilitado para esta campaña.']);
        } else {
          if (data.cuestionarioAsignado === 'A' || data.cuestionarioAsignado === 'B') {
            setFormType(data.cuestionarioAsignado);
          }
          if (prefill) {
            setFichaAnswers((prev) => {
              const next = { ...prev };

              const pf = prefill as Record<string, unknown>;
              const cargo = typeof pf.cargo === 'string' ? String(pf.cargo).trim() : '';
              if (cargo && !next['ficha_12']) next['ficha_12'] = cargo;

              const antiguedadMesesRaw = pf.antiguedadMeses;
              const antiguedadMeses =
                typeof antiguedadMesesRaw === 'number' && Number.isFinite(antiguedadMesesRaw)
                  ? Math.max(0, Math.floor(antiguedadMesesRaw))
                  : null;
              if (antiguedadMeses !== null && !next['ficha_11']) {
                if (antiguedadMeses < 12) {
                  next['ficha_11'] = 'Menos de 1 año';
                } else {
                  next['ficha_11'] = String(Math.floor(antiguedadMeses / 12));
                }
              }

              const nivel = typeof pf.nivelOcupacional === 'string' ? String(pf.nivelOcupacional).trim() : '';
              if (nivel && !next['ficha_13']) {
                const mapped = mapNivelOcupacionalToFicha13(nivel);
                if (mapped) next['ficha_13'] = mapped;
              }

              return next;
            });
          }
          setPhase('ficha');
        }
      } catch (error: any) {
        console.error('Error verifying cedula:', error);
        setErrors([error.message || 'Error al verificar la cédula. Por favor, intenta de nuevo.']);
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const handleFichaNext = () => {
    const errs = validateFicha();
    if (errs.length > 0) {
      setErrors(errs);
      scrollToTop();
      return;
    }
    setPhase('intralaboral');
    setCurrentSectionIndex(0);
    setErrors([]);
  };

  const getFilterValueForSection = (section: typeof intralaboralSections[0]) => {
    if (section.key === 'clientes_usuarios') return filterClientes;
    if (section.key === 'jefatura') return filterJefatura;
    return null;
  };

  const getFilterSetterForSection = (section: typeof intralaboralSections[0]) => {
    if (section.key === 'clientes_usuarios') return setFilterClientes;
    if (section.key === 'jefatura') return setFilterJefatura;
    return undefined;
  };

  const handleSectionNext = () => {
    const sections = getCurrentSections();
    const section = sections[currentSectionIndex];
    const answersMap = phase === 'intralaboral' ? intralaboralAnswers : extralaboralAnswers;
    const filterVal = getFilterValueForSection(section);

    const errs = validateLikertSection(section, answersMap, filterVal);
    if (errs.length > 0) {
      setErrors(errs);
      scrollToTop();
      return;
    }

    setErrors([]);
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    } else {
      // Move to next phase
      if (phase === 'intralaboral') {
        setPhase('extralaboral');
        setCurrentSectionIndex(0);
      } else if (phase === 'extralaboral') {
        setPhase('estres');
      }
    }
  };

  const handleSectionPrev = () => {
    setErrors([]);
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    } else {
      if (phase === 'extralaboral') {
        setPhase('intralaboral');
        setCurrentSectionIndex(intralaboralSections.length - 1);
      } else if (phase === 'intralaboral') {
        setPhase('ficha');
      }
    }
  };

  const handleEstresNext = async () => {
    const errs = validateEstres();
    if (errs.length > 0) {
      setErrors(errs);
      scrollToTop();
      return;
    }

    setIsSubmitting(true);

    try {
      // Save all data to database
      const allData = {
        campaignId,
        cedula: consentDoc, // Assuming consentDoc is the ID
        videoWatched,
        consentName,
        consentDoc,
        consentSignature,
        consentAccepted,
        formType,
        fichaAnswers,
        intralaboralAnswers,
        extralaboralAnswers,
        estresAnswers,
      };

      const response = await fetch('/api/survey/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(allData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar la encuesta');
      }

      const result = await response.json();

      if (result.success) {
        setPhase('success');
        setErrors([]);
      }
    } catch (error: unknown) {
      console.error('Error submitting survey:', error);
      let message = 'Error al guardar la encuesta.';
      if (error instanceof Error) {
        message = error.message;
      }
      setErrors([message]);
      scrollToTop();
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBackFromEstres = () => {
    setErrors([]);
    setPhase('extralaboral');
    setCurrentSectionIndex(extralaboralSections.length - 1);
  };

  // Build progress steps
  const progressSteps = [
    {
      label: 'Consentimiento',
      completed: phase !== 'consent',
      active: phase === 'consent',
    },
    {
      label: 'Datos',
      completed: ['intralaboral', 'extralaboral', 'estres', 'success'].includes(phase),
      active: phase === 'ficha',
    },
    {
      label: `Intralaboral`,
      completed: ['extralaboral', 'estres', 'success'].includes(phase),
      active: phase === 'intralaboral',
    },
    {
      label: 'Extralaboral',
      completed: ['estres', 'success'].includes(phase),
      active: phase === 'extralaboral',
    },
    {
      label: 'Estrés',
      completed: phase === 'success',
      active: phase === 'estres',
    },
  ];

  return {
    phase,
    videoWatched,
    consentName,
    consentDoc,
    consentSignature,
    consentAccepted,
    fichaAnswers,
    intralaboralAnswers,
    extralaboralAnswers,
    estresAnswers,
    currentSectionIndex,
    formType,
    errors,
    isSubmitting,
    isVerifying,
    notEligibleMessage,
    filterClientes,
    filterJefatura,
    progressSteps,
    getCurrentSections,
    setConsentName,
    setConsentDoc,
    setConsentSignature,
    setConsentAccepted,
    setFichaAnswers,
    setIntralaboralAnswers,
    setExtralaboralAnswers,
    setEstresAnswers,
    setFilterClientes,
    setFilterJefatura,
    handleConsentNext,
    handleFichaNext,
    handleSectionNext,
    handleSectionPrev,
    handleEstresNext,
    goBackFromEstres,
    getFilterValueForSection,
    getFilterSetterForSection,
    handleIntroNext,
    handleVideoNext,
    handleComplianceNext,
    closeNotEligible: () => setNotEligibleMessage(null),
  };
}
