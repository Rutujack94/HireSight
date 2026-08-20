import { Lightbulb } from "lucide-react";

export default function RecommendationCard({ recommendations = [] }) {
  return (
    <div className="card animate-fade-in p-6 sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <Lightbulb size={20} />
        </span>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Improvement Suggestions</h3>
          <p className="text-sm text-slate-500">Rule-based tips to help strengthen your profile</p>
        </div>
      </div>

      <ul className="space-y-3">
        {recommendations.map((rec, idx) => {
          const [title, ...rest] = rec.split(":");
          const description = rest.join(":").trim();
          return (
            <li
              key={idx}
              className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                {idx + 1}
              </span>
              <div>
                <p className="font-semibold text-slate-800">{title}</p>
                {description && <p className="mt-0.5 text-sm text-slate-600">{description}</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
