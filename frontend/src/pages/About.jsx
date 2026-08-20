import { Brain, Layers, ListChecks, ShieldAlert, Target } from "lucide-react";

export default function About() {
  return (
    <div className="container-app py-16">
      <div className="mx-auto max-w-3xl">
        <p className="section-label text-center">About</p>
        <h1 className="mt-2 text-center text-3xl font-bold text-slate-900 sm:text-4xl">
          About This Project
        </h1>

        <div className="mt-10 space-y-8">
          <InfoBlock icon={Brain} title="What is this project?">
            A Machine Learning-based student placement prediction system. It estimates a
            student&apos;s likelihood of being placed by a recruiter based on their academic,
            technical, and soft-skill profile.
          </InfoBlock>

          <InfoBlock icon={Layers} title="Algorithm">
            Random Forest Classifier — an ensemble of decision trees trained with balanced class
            weights to handle any imbalance between placed and not-placed students in the
            training data.
          </InfoBlock>

          <InfoBlock icon={ListChecks} title="Inputs">
            Academic performance (CGPA, 10th/12th percentages, backlogs, attendance), technical
            profile (skills, internships, certifications, projects, coding score), and soft
            skills (communication, aptitude, extracurricular activity level).
          </InfoBlock>

          <InfoBlock icon={Target} title="Output">
            A placement prediction (Likely to be Placed / Needs Improvement), a placement
            probability percentage, rule-based improvement recommendations, and a breakdown of
            which factors most influenced the model&apos;s overall predictions.
          </InfoBlock>

          <div className="card flex items-start gap-4 border-l-4 border-l-amber-400 p-5">
            <ShieldAlert size={22} className="mt-0.5 shrink-0 text-amber-500" />
            <div>
              <p className="font-semibold text-slate-800">Disclaimer</p>
              <p className="mt-1 text-sm text-slate-600">
                This system provides an ML-based estimate for educational purposes. It should not
                be treated as a guarantee of actual placement. The model is trained on a
                synthetic/demo dataset and is intended as a portfolio/learning project, not a
                production placement decision tool.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ icon: Icon, title, children }) {
  return (
    <div className="card p-6">
      <div className="mb-2 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon size={20} />
        </span>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      <p className="text-sm leading-relaxed text-slate-600">{children}</p>
    </div>
  );
}
