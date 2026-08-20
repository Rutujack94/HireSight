import { CheckCircle2, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import ProbabilityGauge from "./ProbabilityGauge.jsx";

export default function PredictionCard({ result }) {
  const { prediction, placement_probability, not_placed_probability } = result;
  const likely = prediction === 1;

  const pieData = [
    { name: "Placement Probability", value: placement_probability },
    { name: "Not Placement Probability", value: not_placed_probability },
  ];
  const COLORS = likely ? ["#16a34a", "#e5e7eb"] : ["#dc2626", "#e5e7eb"];

  return (
    <div
      className={`card animate-fade-in overflow-hidden border-t-4 ${
        likely ? "border-t-emerald-500" : "border-t-red-500"
      }`}
    >
      <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 md:grid-cols-2">
        {/* Left: headline result */}
        <div className="flex flex-col items-center justify-center text-center">
          <p className="section-label mb-2">Placement Prediction</p>
          <ProbabilityGauge probability={placement_probability} likely={likely} />

          <div
            className={`mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
              likely ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            }`}
          >
            {likely ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            {likely ? "LIKELY TO BE PLACED" : "NEEDS IMPROVEMENT"}
          </div>

          <p className="mt-4 max-w-xs text-sm text-slate-500">
            {likely
              ? "Your profile shows strong academic and technical indicators."
              : "Focus on the recommendations below to strengthen your profile."}
          </p>
        </div>

        {/* Right: donut chart breakdown */}
        <div className="flex flex-col items-center justify-center">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid w-full grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Placement Probability</p>
              <p className="text-lg font-bold text-slate-900">{placement_probability}%</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Not Placement Probability</p>
              <p className="text-lg font-bold text-slate-900">{not_placed_probability}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
