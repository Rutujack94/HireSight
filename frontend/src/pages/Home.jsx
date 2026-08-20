import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Code2,
  LineChart,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Random Forest ML Model",
    desc: "A trained ensemble model analyzes 26+ academic, technical and soft-skill signals.",
  },
  {
    icon: Target,
    title: "Probability, Not a Guess",
    desc: "Get a clear placement probability percentage instead of a plain yes/no answer.",
  },
  {
    icon: LineChart,
    title: "Personalized Recommendations",
    desc: "Rule-based suggestions highlight exactly what to improve in your profile.",
  },
  {
    icon: BarChart3,
    title: "Explainable Results",
    desc: "See which factors most influenced the prediction via feature importance.",
  },
];

const steps = [
  { icon: Code2, label: "Enter your profile" },
  { icon: Brain, label: "Model analyzes your data" },
  { icon: Sparkles, label: "Get your prediction" },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="container-app relative py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">
              <Sparkles size={14} />
              Powered by a Random Forest ML model
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Student Placement Prediction System
            </h1>
            <p className="mt-5 text-lg text-slate-600 sm:text-xl">
              Predict your placement probability using Machine Learning.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-500 sm:text-base">
              This system uses a Random Forest Machine Learning model to analyze academic
              performance, technical skills, internships, projects, coding ability,
              communication, and other factors to estimate a student&apos;s placement
              probability.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/predict" className="btn-primary w-full text-base sm:w-auto">
                Predict Placement
                <ArrowRight size={18} />
              </Link>
              <Link to="/dashboard" className="btn-secondary w-full text-base sm:w-auto">
                View Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative ML-themed background shapes */}
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
      </section>

      {/* How it works */}
      <section className="border-y border-slate-100 bg-white py-14">
        <div className="container-app">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {steps.map((step, idx) => (
              <div key={step.label} className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-card">
                  <step.icon size={22} />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-400">STEP {idx + 1}</p>
                  <p className="font-semibold text-slate-800">{step.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container-app">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="section-label">Why StudentPredict</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Built for accurate, explainable predictions
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="card p-6 transition-all hover:-translate-y-1 hover:shadow-card-hover"
              >
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <f.icon size={20} />
                </span>
                <h3 className="mb-1.5 font-semibold text-slate-900">{f.title}</h3>
                <p className="text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer strip */}
      <section className="pb-20">
        <div className="container-app">
          <div className="card flex items-start gap-4 border-l-4 border-l-amber-400 p-5">
            <ShieldCheck size={22} className="mt-0.5 shrink-0 text-amber-500" />
            <p className="text-sm text-slate-600">
              This system provides an ML-based estimate for educational purposes. It should not
              be treated as a guarantee of actual placement outcomes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
