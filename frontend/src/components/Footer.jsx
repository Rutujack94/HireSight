import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="container-app flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <div className="flex items-center gap-2 text-slate-700">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <GraduationCap size={16} />
          </span>
          <span className="font-semibold">HireSight</span>
        </div>
        <p className="text-center text-sm text-slate-500">
          Built as an educational ML portfolio project. Predictions are estimates, not guarantees.
        </p>
        <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} HireSight</p>
      </div>
    </footer>
  );
}
