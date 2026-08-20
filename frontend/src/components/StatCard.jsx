export default function StatCard({ label, value, icon: Icon, accent = "brand", suffix = "" }) {
  const accentClasses = {
    brand: "bg-brand-50 text-brand-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="card animate-fade-in flex items-center gap-4 p-5 transition-shadow hover:shadow-card-hover">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accentClasses[accent]}`}>
        {Icon && <Icon size={22} />}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900">
          {value}
          {suffix}
        </p>
      </div>
    </div>
  );
}
