import { PlayCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface VideoInstructionScreenProps {
  onAccept: () => void;
}

export function VideoInstructionScreen({ onAccept }: VideoInstructionScreenProps) {
  const [hasWatched, setHasWatched] = useState(false);
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="bg-gradient-to-r from-[#dc9222] to-[#f39205] px-6 py-5">
          <div className="flex items-center gap-3">
            <PlayCircle className="w-7 h-7 text-white" />
            <h2 className="text-lg font-bold text-white leading-tight">
              Instrucciones Previas a la Evaluación
            </h2>
          </div>
          <p className="text-white/85 text-xs mt-2">
            Por favor, observe el siguiente video explicativo antes de iniciar su encuesta.
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-inner">
            <video 
              controls 
              className="w-full h-full object-cover"
              onEnded={() => setHasWatched(true)}
              preload="auto"
            >
              <source src="/demo.mp4" type="video/mp4" />
              Su navegador no soporta la reproducción de videos.
            </video>
          </div>

          <div className={`transition-all duration-500 ${hasWatched ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-2 pointer-events-none'}`}>
            <label className="flex items-start gap-3 p-4 border rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                disabled={!hasWatched}
                className="mt-1 w-5 h-5 text-[#dc9222] rounded border-slate-300 focus:ring-[#dc9222]/30 disabled:opacity-50"
              />
              <div>
                <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Confirmo que he visto el video completo
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Comprendo las instrucciones y el propósito de esta evaluación de riesgo psicosocial.
                </span>
              </div>
            </label>

            <button
              onClick={onAccept}
              disabled={!accepted}
              className="mt-6 w-full py-3.5 bg-[#dc9222] hover:bg-[#c7831f] disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Continuar al Consentimiento Informado
              <CheckCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
