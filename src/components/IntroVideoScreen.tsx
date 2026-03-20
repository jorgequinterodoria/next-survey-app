'use client';

import dynamic from 'next/dynamic';
import { PlayCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any;

interface IntroVideoScreenProps {
  onAccept: () => void;
}

export function IntroVideoScreen({ onAccept }: IntroVideoScreenProps) {
  const [hasWatched, setHasWatched] = useState(false);
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-5">
          <div className="flex items-center gap-3">
            <PlayCircle className="w-7 h-7 text-white" />
            <h2 className="text-lg font-bold text-white leading-tight">
              Presentación de la Batería de Riesgo Psicosocial
            </h2>
          </div>
          <p className="text-indigo-100 text-xs mt-2">
            Por favor, observe este video introductorio antes de continuar.
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-inner relative">
            <ReactPlayer
              url="https://youtu.be/KoCdntpPdJ4"
              width="100%"
              height="100%"
              controls={true}
              onEnded={() => setHasWatched(true)}
            />
          </div>

          <div className={`transition-all duration-500 ${hasWatched ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-2 pointer-events-none'}`}>
            <label className="flex items-start gap-3 p-4 border rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                disabled={!hasWatched}
                className="mt-1 w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 disabled:opacity-50"
              />
              <div>
                <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  He visto el video introductorio
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Comprendo los conceptos presentados sobre la evaluación de riesgo psicosocial.
                </span>
              </div>
            </label>

            <button
              onClick={onAccept}
              disabled={!accepted}
              className="mt-6 w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Continuar
              <CheckCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
