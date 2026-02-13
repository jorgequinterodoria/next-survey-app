 'use client';
 
 import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
 import type { SurveySection } from '@/data/surveyData';
 
 interface LikertSectionProps {
   section: SurveySection;
   sectionIndex: number;
   totalSections: number;
   answers: Record<string, string>;
   onAnswer: (key: string, value: string) => void;
   onNext: () => void;
   onPrev: () => void;
   likertOptions: { value: string; label: string }[];
   formLabel: string;
   color: string;
   errors: string[];
   filterValue?: string | null;
   onFilterChange?: (v: string) => void;
 }
 
 const colorClasses: Record<string, { gradient: string; ring: string; bg: string; shadow: string; btn: string; btnHover: string }> = {
   blue: {
     gradient: 'from-blue-600 to-indigo-700',
     ring: 'ring-blue-500 border-blue-500 bg-blue-50',
     bg: 'bg-blue-50',
     shadow: 'shadow-blue-200',
     btn: 'bg-blue-600',
     btnHover: 'hover:bg-blue-700',
   },
   purple: {
     gradient: 'from-purple-600 to-violet-700',
     ring: 'ring-purple-500 border-purple-500 bg-purple-50',
     bg: 'bg-purple-50',
     shadow: 'shadow-purple-200',
     btn: 'bg-purple-600',
     btnHover: 'hover:bg-purple-700',
   },
   amber: {
     gradient: 'from-amber-600 to-orange-700',
     ring: 'ring-amber-500 border-amber-500 bg-amber-50',
     bg: 'bg-amber-50',
     shadow: 'shadow-amber-200',
     btn: 'bg-amber-600',
     btnHover: 'hover:bg-amber-700',
   },
   rose: {
     gradient: 'from-rose-600 to-pink-700',
     ring: 'ring-rose-500 border-rose-500 bg-rose-50',
     bg: 'bg-rose-50',
     shadow: 'shadow-rose-200',
     btn: 'bg-rose-600',
     btnHover: 'hover:bg-rose-700',
   },
 };
 
 export function LikertSection({
   section,
   sectionIndex,
   totalSections,
   answers,
   onAnswer,
   onNext,
   onPrev,
   likertOptions,
   formLabel,
   color,
   errors,
   filterValue,
   onFilterChange,
 }: LikertSectionProps) {
   const c = colorClasses[color] || colorClasses.blue;
   const showQuestions = !section.filtro || filterValue === 'si';
 
   return (
     <div className="max-w-2xl mx-auto">
       <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
         <div className={`bg-gradient-to-r ${c.gradient} px-6 py-5`}>
           <div className="flex items-center justify-between mb-1">
             <span className="text-xs font-medium text-white/70 uppercase tracking-wide">
               {formLabel}
             </span>
             <span className="text-xs font-medium text-white/70">
               Sección {sectionIndex + 1} de {totalSections}
             </span>
           </div>
           <h2 className="text-lg font-bold text-white">{section.titulo}</h2>
           <p className="text-white/80 text-xs mt-2">{section.instruccion}</p>
         </div>
 
         <div className="h-1.5 bg-slate-100">
           <div
             className={`h-full ${c.btn} transition-all duration-500`}
             style={{ width: `${((sectionIndex + 1) / totalSections) * 100}%` }}
           />
         </div>
 
         <div className="p-5 space-y-4">
           {errors.length > 0 && (
             <div className="bg-red-50 border border-red-200 rounded-xl p-4">
               <div className="flex items-center gap-2 mb-1">
                 <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                 <p className="text-sm font-semibold text-red-700">
                   Debe responder todas las preguntas para continuar
                 </p>
               </div>
               <p className="text-xs text-red-500">
                 {errors.length} pregunta(s) sin responder
               </p>
             </div>
           )}
 
           {section.filtro && onFilterChange && (
            <div className={`p-4 rounded-xl border-2 border-dashed border-slate-300 ${c.bg}`}>
              <p className="text-sm font-semibold text-slate-700 mb-3">{section.filtro}</p>
              <div className="flex gap-3">
               {['si', 'no'].map((v) => (
                 <label
                   key={v}
                   className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 cursor-pointer transition-all font-medium text-sm ${
                     filterValue === v
                       ? `${c.ring} ring-2 text-slate-700`
                       : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                   }`}
                 >
                    <input
                      type="radio"
                      name={`filter_${section.key}`}
                      value={v}
                      checked={filterValue === v}
                      onChange={() => onFilterChange(v)}
                      className="sr-only"
                    />
                    {v === 'si' ? 'Sí' : 'No'}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Mostrar preguntas SOLO si no hay filtro O si el filtro es 'si' */}
          {(showQuestions) && (
            <div className="space-y-3">
              {section.preguntas.map((q) => (
                 <div
                   key={q.id}
                   className={`p-4 rounded-xl border transition-all ${
                     answers[`${section.key}_${q.id}`]
                       ? 'border-slate-200 bg-white'
                       : errors.length > 0 && !answers[`${section.key}_${q.id}`]
                       ? 'border-red-300 bg-red-50'
                       : 'border-slate-200'
                   }`}
                 >
                   <p className="text-sm font-medium text-slate-700 mb-3">
                     <span className="text-slate-400 mr-1">{q.id}.</span> {q.texto}
                   </p>
                   <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                     {likertOptions.map((opt) => (
                       <label
                         key={opt.value}
                         className={`flex items-center justify-center py-2 px-2 rounded-lg border cursor-pointer transition-all text-xs font-medium text-center ${
                           answers[`${section.key}_${q.id}`] === opt.value
                             ? `${c.ring} ring-1`
                             : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                         }`}
                       >
                         <input
                           type="radio"
                           name={`${section.key}_${q.id}`}
                           value={opt.value}
                           checked={answers[`${section.key}_${q.id}`] === opt.value}
                           onChange={() => onAnswer(`${section.key}_${q.id}`, opt.value)}
                           className="sr-only"
                         />
                         {opt.label}
                       </label>
                     ))}
                   </div>
                 </div>
               ))}
             </div>
           )}
 
           {section.filtro && filterValue === 'no' && (
             <div className="text-center py-8 text-slate-400">
               <p className="text-sm">Esta sección no aplica para usted.</p>
             </div>
           )}
 
           <div className="flex gap-3 pt-2">
             <button
               onClick={onPrev}
               className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-1"
             >
               <ChevronLeft className="w-5 h-5" />
               Anterior
             </button>
             <button
               onClick={onNext}
               className={`flex-1 py-3 ${c.btn} text-white rounded-xl font-semibold text-sm ${c.btnHover} transition-all ${c.shadow} shadow-lg flex items-center justify-center gap-1`}
             >
               Siguiente
               <ChevronRight className="w-5 h-5" />
             </button>
           </div>
         </div>
       </div>
     </div>
   );
 }
