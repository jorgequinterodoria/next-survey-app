 'use client';

 import { CheckCircle2, PartyPopper } from 'lucide-react';

 interface SuccessScreenProps {
   formaType: string;
 }

 export function SuccessScreen({ formaType }: SuccessScreenProps) {
   return (
     <div className="max-w-lg mx-auto text-center">
       <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 space-y-6">
         <div className="flex justify-center">
           <div className="relative">
             <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
               <CheckCircle2 className="w-14 h-14 text-green-600 dark:text-green-400" />
             </div>
             <div className="absolute -top-2 -right-2">
               <PartyPopper className="w-8 h-8 text-amber-500" />
             </div>
           </div>
         </div>

         <div>
           <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
             ¡Encuesta completada exitosamente!
           </h2>
           <p className="text-slate-500 dark:text-slate-400 text-sm">
             Ha completado satisfactoriamente la Batería de Riesgo Psicosocial
           </p>
         </div>

         <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-2">
           <p className="text-sm text-slate-600 dark:text-slate-300">
             <span className="font-semibold">Formulario completado:</span> Forma {formaType}
           </p>
           <p className="text-xs text-slate-400 dark:text-slate-500">
             Sus respuestas han sido registradas correctamente. La información será procesada de
             acuerdo con la normatividad vigente en materia de riesgos psicosociales.
           </p>
         </div>

         <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
           <p className="text-xs text-blue-700 dark:text-blue-300">
             <span className="font-semibold">Recuerde:</span> La información suministrada es
             absolutamente confidencial según la Ley 1090 de 2006. El resultado del diagnóstico
             generará un plan de recomendaciones e intervenciones para su bienestar.
           </p>
         </div>

         <button
           onClick={() => window.location.reload()}
           className="w-full py-3 bg-slate-800 dark:bg-slate-700 text-white rounded-xl font-semibold text-sm hover:bg-slate-900 dark:hover:bg-slate-600 transition-all"
         >
           Iniciar nueva evaluación
         </button>
       </div>
     </div>
   );
 }
