'use client';

import { FileText } from 'lucide-react';
import { FieldStatus, SectionProgress } from './FieldStatus';

interface ConsentScreenProps {
  consentName: string;
  consentDoc: string;
  consentAccepted: boolean;
  onNameChange: (v: string) => void;
  onDocChange: (v: string) => void;
  onAccept: (v: boolean) => void;
  onNext: () => void;
  errors?: string[];
  isVerifying?: boolean;
}

export function ConsentScreen({
  consentName,
  consentDoc,
  consentAccepted,
  onNameChange,
  onDocChange,
  onAccept,
  onNext,
  errors = [],
  isVerifying = false,
}: ConsentScreenProps) {
  const isNameValid = consentName.trim() !== '';
  const isDocValid = consentDoc.trim() !== '';
  const isCheckboxValid = consentAccepted;
  const validFieldsCount = [isNameValid, isDocValid, isCheckboxValid].filter(Boolean).length;
  const totalFields = 3;
  const canProceed = validFieldsCount === totalFields;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
          <div className="flex items-center gap-3">
            <FileText className="w-7 h-7 text-white" />
            <h2 className="text-lg font-bold text-white leading-tight">
              Consentimiento Informado para la Evaluación de Riesgos Psicosociales
            </h2>
          </div>
          <p className="text-blue-100 text-xs mt-2">
            En cumplimiento a la Resolución 2764 de 2022 y la Ley 1090 de 2006
          </p>
        </div>

        <div className="p-5 space-y-4">
          <SectionProgress 
            current={validFieldsCount} 
            total={totalFields} 
            label={`${validFieldsCount} de ${totalFields} campos completados`}
          />

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Nombre completo</label>
                <FieldStatus isValid={isNameValid} showWhenInvalid={true} />
              </div>
              <input
                type="text"
                value={consentName}
                onChange={(e) => onNameChange(e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder-slate-400 dark:placeholder-slate-500 ${
                  isNameValid 
                    ? 'border-green-400 dark:border-green-600 bg-green-50/30 dark:bg-green-900/20' 
                    : 'border-slate-300 dark:border-slate-600'
                }`}
                placeholder="Ingrese su nombre completo"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Número de documento</label>
                <FieldStatus isValid={isDocValid} showWhenInvalid={true} />
              </div>
              <input
                type="text"
                value={consentDoc}
                onChange={(e) => onDocChange(e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder-slate-400 dark:placeholder-slate-500 ${
                  isDocValid 
                    ? 'border-green-400 dark:border-green-600 bg-green-50/30 dark:bg-green-900/20' 
                    : 'border-slate-300 dark:border-slate-600'
                }`}
                placeholder="Ingrese su número de documento"
              />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Declaración de Consentimiento</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Declaro que he sido informado(a) de manera clara y completa sobre la naturaleza, propósitos, procedimientos,
              riesgos y beneficios de la evaluación de riesgos psicosociales en el trabajo. Comprendo que mi participación
              es voluntaria y que puedo retirar mi consentimiento en cualquier momento sin que esto afecte mi relación laboral.
              Autorizo el tratamiento de mis datos personales exclusivamente para los fines de esta evaluación, de acuerdo con
              lo establecido en la Ley 1581 de 2012 y demás normas concordantes sobre protección de datos personales.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Entiendo que la información proporcionada será tratada con confidencialidad y utilizada únicamente para
              identificar y gestionar los factores de riesgo psicosocial en mi lugar de trabajo, con el objetivo de mejorar
              las condiciones laborales y proteger mi salud mental.
            </p>
          </div>

          <label className={`flex items-start gap-3 cursor-pointer group p-3 rounded-lg border transition-all ${
            isCheckboxValid
              ? 'border-green-400 dark:border-green-600 bg-green-50/30 dark:bg-green-900/20'
              : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50'
          }`}>
            <input
              type="checkbox"
              checked={consentAccepted}
              onChange={(e) => onAccept(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-200 group-hover:text-slate-800 dark:group-hover:text-slate-100 flex-1">
              Acepto los términos y condiciones del consentimiento informado y autorizo el tratamiento de mis datos personales
            </span>
            <FieldStatus isValid={isCheckboxValid} showWhenInvalid={true} />
          </label>

          <button
            onClick={onNext}
            disabled={!canProceed || isVerifying}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              canProceed && !isVerifying
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-blue-900/30'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
            }`}
          >
            {isVerifying && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isVerifying ? 'Verificando...' : 'Continuar con la evaluación'}
          </button>
          
          {errors.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm font-medium text-red-600 dark:text-red-400 text-center">
                {errors[0]}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
