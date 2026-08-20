export default function ProbabilityGauge({ probability = 0, likely = true }) {
  const radius = 80;
  const stroke = 14;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const clamped = Math.max(0, Math.min(100, probability));
  const offset = circumference - (clamped / 100) * circumference;

  const trackColor = likely ? "#dcfce7" : "#fee2e2";
  const progressColor = likely ? "#16a34a" : "#dc2626";

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="-rotate-90">
        <circle
          stroke={trackColor}
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={progressColor}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: offset, transition: "stroke-dashoffset 0.8s ease-out" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-extrabold text-slate-900">{clamped.toFixed(1)}%</span>
        <span className="text-xs font-medium text-slate-500">Probability</span>
      </div>
    </div>
  );
}
