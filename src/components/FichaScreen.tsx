 'use client';
 
 import { ChevronRight, AlertCircle, ClipboardList } from 'lucide-react';
 import { fichaQuestions } from '@/data/surveyData';
 
 interface FichaScreenProps {
   fichaAnswers: Record<string, string>;
   onAnswer: (key: string, value: string) => void;
   onNext: () => void;
   errors: string[];
 }
 
 export function FichaScreen({ fichaAnswers, onAnswer, onNext, errors }: FichaScreenProps) {
   return (
     <div className="max-w-2xl mx-auto">
       <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
         <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-5">
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
           {errors.length > 0 && (
             <div className="bg-red-50 border border-red-200 rounded-xl p-4">
               <div className="flex items-center gap-2 mb-2">
                 <AlertCircle className="w-5 h-5 text-red-500" />
                 <p className="text-sm font-semibold text-red-700">Campos obligatorios sin completar:</p>
               </div>
               <ul className="text-xs text-red-600 space-y-1 list-disc list-inside">
                 {errors.map((e, i) => (
                   <li key={i}>{e}</li>
                 ))}
               </ul>
             </div>
           )}
 
           {fichaQuestions.map((q) => (
             <div key={q.id} className="space-y-1.5">
               <label className="block text-sm font-semibold text-slate-700">
                 {q.id}. {q.texto} <span className="text-red-500">*</span>
               </label>
 
               {q.subfields ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {q.subfields.map((sf) => (
                     <div key={sf.key}>
                       <label className="block text-xs text-slate-500 mb-1">{sf.label}</label>
                       <input
                         type="text"
                         value={fichaAnswers[sf.key] || ''}
                         onChange={(e) => onAnswer(sf.key, e.target.value)}
                         className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-sm text-slate-800 bg-white placeholder-slate-400"
                         placeholder={sf.label}
                       />
                     </div>
                   ))}
                 </div>
               ) : q.tipo === 'text' ? (
                 <input
                   type="text"
                   value={fichaAnswers[`ficha_${q.id}`] || ''}
                   onChange={(e) => onAnswer(`ficha_${q.id}`, e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-sm text-slate-800 bg-white placeholder-slate-400"
                 />
               ) : q.tipo === 'number' ? (
                 <input
                   type="number"
                   value={fichaAnswers[`ficha_${q.id}`] || ''}
                   onChange={(e) => onAnswer(`ficha_${q.id}`, e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-sm text-slate-800 bg-white placeholder-slate-400"
                 />
               ) : q.tipo === 'select' ? (
                 <select
                   value={fichaAnswers[`ficha_${q.id}`] || ''}
                   onChange={(e) => onAnswer(`ficha_${q.id}`, e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-sm bg-white text-slate-800"
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
                       className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                         fichaAnswers[`ficha_${q.id}`] === op
                           ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500'
                           : 'border-slate-200 hover:bg-slate-50'
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
                       <span className="text-sm text-slate-700">{op}</span>
                     </label>
                   ))}
                 </div>
               ) : null}
             </div>
           ))}
 
           <button
             onClick={onNext}
             className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
           >
             Continuar
             <ChevronRight className="w-5 h-5" />
           </button>
         </div>
       </div>
     </div>
   );
 }
