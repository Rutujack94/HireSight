import { BarChart3 } from "lucide-react";

export default function FeatureImportance({ factors = [] }) {
  return (
    <div className="card animate-fade-in p-6 sm:p-8">
      <div className="mb-2 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <BarChart3 size={20} />
        </span>
        <div>
          <h3 className="text-lg font-bold text-slate-900">What Influenced Your Prediction?</h3>
          <p className="text-sm text-slate-500">Random Forest feature importance (top factors)</p>
        </div>
      </div>

      <p className="mb-5 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
        These percentages reflect the model&apos;s overall feature importance learned during
        training — they show which factors generally matter most, not proof that a specific
        factor caused your individual prediction.
      </p>

      <div className="space-y-4">
        {factors.map((factor) => (
          <div key={factor.feature}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{factor.feature}</span>
              <span className="font-semibold text-slate-900">{factor.importance_percent}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500 transition-all duration-700"
                style={{ width: `${factor.importance_percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
