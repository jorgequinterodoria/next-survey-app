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
  | 'consent'
  | 'ficha'
  | 'intralaboral'
  | 'extralaboral'
  | 'estres'
  | 'success';

function determineFormType(fichaAnswers: Record<string, string>): 'A' | 'B' {
  const tipoCargo = fichaAnswers['ficha_13'] || '';
  if (
    tipoCargo.includes('Jefatura') ||
    tipoCargo.includes('Profesional')
  ) {
    return 'A';
  }
  return 'B';
}

export function useSurvey({ campaignId }: { campaignId: string }) {
  const [phase, setPhase] = useState<Phase>('consent');
  // ... (keep state)
  const [consentName, setConsentName] = useState('');
  const [consentDoc, setConsentDoc] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [fichaAnswers, setFichaAnswers] = useState<Record<string, string>>({});
  const [intralaboralAnswers, setIntralaboralAnswers] = useState<Record<string, string>>({});
  const [extralaboralAnswers, setExtralaboralAnswers] = useState<Record<string, string>>({});
  const [estresAnswers, setEstresAnswers] = useState<Record<string, string>>({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formType, setFormType] = useState<'A' | 'B'>('B');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (section.filtro) {
      if (!filterVal) return ['Debe responder la pregunta filtro'];
      if (filterVal === 'no') return [];
    }
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

  const handleConsentNext = () => {
    if (consentName.trim() && consentDoc.trim() && consentAccepted) {
      setPhase('ficha');
      setErrors([]);
    }
  };

  const handleFichaNext = () => {
    const errs = validateFicha();
    if (errs.length > 0) {
      setErrors(errs);
      scrollToTop();
      return;
    }
    const ft = determineFormType(fichaAnswers);
    setFormType(ft);
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
        consentName,
        consentDoc,
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
    } catch (error: any) {
      console.error('Error submitting survey:', error);
      setErrors([error.message || 'Error al guardar la encuesta.']);
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
    filterJefatura,
    progressSteps,
    getCurrentSections,
    setConsentName,
    setConsentDoc,
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
  };
}
