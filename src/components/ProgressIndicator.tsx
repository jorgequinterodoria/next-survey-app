'use client';

interface ProgressStep {
  label: string;
  completed: boolean;
  active: boolean;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
}

export function ProgressIndicator({ steps }: ProgressIndicatorProps) {
  return (
    <div className="max-w-2xl mx-auto mb-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step.completed
                      ? 'bg-green-500 text-white'
                      : step.active
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step.completed ? '✓' : index + 1}
                </div>
                <span
                  className={`mt-1 text-xs font-medium text-center max-w-20 ${
                    step.active ? 'text-blue-600' : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-2 ${
                    step.completed ? 'bg-green-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}