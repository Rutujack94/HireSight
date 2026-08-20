import { useState } from "react";
import { Info, Loader2, Sparkles } from "lucide-react";

const SKILL_OPTIONS = [
  "Python",
  "Java",
  "C++",
  "JavaScript",
  "React",
  "SQL",
  "Machine Learning",
  "Data Science",
  "Django",
  "FastAPI",
  "Node.js",
  "Git/GitHub",
  "AWS",
  "Docker",
];

const EXTRACURRICULAR_OPTIONS = [
  { value: 0, label: "None" },
  { value: 1, label: "Low" },
  { value: 2, label: "Moderate" },
  { value: 3, label: "High" },
];

const initialFormData = {
  cgpa: "",
  tenth_percentage: "",
  twelfth_percentage: "",
  backlogs: "",
  attendance: "",
  internships: "",
  certifications: "",
  projects: "",
  coding_score: "",
  communication_score: "",
  aptitude_score: "",
  extracurricular: "",
  technical_skills: [],
};

const FIELD_CONFIG = {
  cgpa: { label: "CGPA", min: 0, max: 10, step: 0.01, help: "Enter CGPA between 0 and 10" },
  tenth_percentage: {
    label: "10th Percentage",
    min: 0,
    max: 100,
    step: 0.1,
    help: "Enter a value between 0 and 100",
  },
  twelfth_percentage: {
    label: "12th / Diploma Percentage",
    min: 0,
    max: 100,
    step: 0.1,
    help: "Enter a value between 0 and 100",
  },
  backlogs: { label: "Backlogs", min: 0, max: 20, step: 1, help: "Number of active backlogs (0-20)" },
  attendance: {
    label: "Attendance (%)",
    min: 0,
    max: 100,
    step: 0.1,
    help: "Overall attendance percentage",
  },
  internships: {
    label: "Internships",
    min: 0,
    max: 10,
    step: 1,
    help: "Number of internships completed (0-10)",
  },
  certifications: {
    label: "Certifications",
    min: 0,
    max: 20,
    step: 1,
    help: "Number of certifications earned (0-20)",
  },
  projects: { label: "Projects", min: 0, max: 10, step: 1, help: "Number of projects completed (0-10)" },
  coding_score: {
    label: "Coding Score",
    min: 0,
    max: 100,
    step: 1,
    help: "Score out of 100 from coding assessments/practice",
  },
  communication_score: {
    label: "Communication Score",
    min: 0,
    max: 100,
    step: 1,
    help: "Score out of 100 for communication skills",
  },
  aptitude_score: {
    label: "Aptitude Score",
    min: 0,
    max: 100,
    step: 1,
    help: "Score out of 100 from aptitude tests",
  },
};

const SECTION_A_FIELDS = ["cgpa", "tenth_percentage", "twelfth_percentage", "backlogs", "attendance"];
const SECTION_B_NUMERIC_FIELDS = ["internships", "certifications", "projects", "coding_score"];
const SECTION_C_FIELDS = ["communication_score", "aptitude_score"];

function NumberField({ name, value, onChange, error }) {
  const config = FIELD_CONFIG[name];
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-700">
        {config.label}
        <span className="text-red-500">*</span>
        <span className="group relative">
          <Info size={13} className="cursor-help text-slate-400" />
          <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-48 -translate-x-1/2 rounded-lg bg-slate-800 px-2.5 py-1.5 text-center text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            {config.help}
          </span>
        </span>
      </label>
      <input
        type="number"
        inputMode="decimal"
        name={name}
        value={value}
        onChange={onChange}
        min={config.min}
        max={config.max}
        step={config.step}
        placeholder={`${config.min} - ${config.max}`}
        className={`input-field ${error ? "input-field-error" : ""}`}
      />
      {error ? (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      ) : (
        <p className="mt-1 text-xs text-slate-400">{config.help}</p>
      )}
    </div>
  );
}

export default function StudentForm({ onSubmit, loading, apiError }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const toggleSkill = (skill) => {
    setFormData((prev) => {
      const has = prev.technical_skills.includes(skill);
      return {
        ...prev,
        technical_skills: has
          ? prev.technical_skills.filter((s) => s !== skill)
          : [...prev.technical_skills, skill],
      };
    });
  };

  const validate = () => {
    const newErrors = {};

    Object.keys(FIELD_CONFIG).forEach((name) => {
      const config = FIELD_CONFIG[name];
      const raw = formData[name];

      if (raw === "" || raw === null || raw === undefined) {
        newErrors[name] = `${config.label} is required`;
        return;
      }
      const num = Number(raw);
      if (Number.isNaN(num)) {
        newErrors[name] = `${config.label} must be a number`;
        return;
      }
      if (num < config.min || num > config.max) {
        newErrors[name] = `${config.label} must be between ${config.min} and ${config.max}`;
      }
    });

    if (formData.extracurricular === "") {
      newErrors.extracurricular = "Please select an extracurricular activity level";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      // Scroll to first error for better UX
      const firstErrorField = document.querySelector(".input-field-error");
      firstErrorField?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const payload = {
      cgpa: Number(formData.cgpa),
      tenth_percentage: Number(formData.tenth_percentage),
      twelfth_percentage: Number(formData.twelfth_percentage),
      backlogs: Number(formData.backlogs),
      internships: Number(formData.internships),
      certifications: Number(formData.certifications),
      technical_skills: formData.technical_skills,
      communication_score: Number(formData.communication_score),
      aptitude_score: Number(formData.aptitude_score),
      projects: Number(formData.projects),
      coding_score: Number(formData.coding_score),
      attendance: Number(formData.attendance),
      extracurricular: Number(formData.extracurricular),
    };

    onSubmit(payload);
  };

  const totalFields = Object.keys(FIELD_CONFIG).length + 1;
  const filledFields =
    Object.keys(FIELD_CONFIG).filter((k) => formData[k] !== "").length +
    (formData.extracurricular !== "" ? 1 : 0);
  const progress = Math.round((filledFields / totalFields) * 100);

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-600">Form completion</span>
          <span className="font-semibold text-brand-600">{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brand-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {apiError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {apiError}
        </div>
      )}

      {/* Section A - Academic Performance */}
      <section className="mb-10">
        <p className="section-label">Section A</p>
        <h2 className="mb-5 text-xl font-bold text-slate-900">Academic Performance</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SECTION_A_FIELDS.map((name) => (
            <NumberField
              key={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              error={errors[name]}
            />
          ))}
        </div>
      </section>

      {/* Section B - Technical Profile */}
      <section className="mb-10">
        <p className="section-label">Section B</p>
        <h2 className="mb-5 text-xl font-bold text-slate-900">Technical Profile</h2>

        <div className="mb-6">
          <label className="mb-2 flex items-center gap-1 text-sm font-medium text-slate-700">
            Technical Skills
            <span className="text-slate-400">(select all that apply)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {SKILL_OPTIONS.map((skill) => {
              const selected = formData.technical_skills.includes(skill);
              return (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                    selected
                      ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:bg-brand-50"
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SECTION_B_NUMERIC_FIELDS.map((name) => (
            <NumberField
              key={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              error={errors[name]}
            />
          ))}
        </div>
      </section>

      {/* Section C - Soft Skills */}
      <section className="mb-10">
        <p className="section-label">Section C</p>
        <h2 className="mb-5 text-xl font-bold text-slate-900">Soft Skills</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SECTION_C_FIELDS.map((name) => (
            <NumberField
              key={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              error={errors[name]}
            />
          ))}

          <div>
            <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-700">
              Extracurricular Activities
              <span className="text-red-500">*</span>
            </label>
            <select
              name="extracurricular"
              value={formData.extracurricular}
              onChange={handleChange}
              className={`input-field ${errors.extracurricular ? "input-field-error" : ""}`}
            >
              <option value="" disabled>
                Select level
              </option>
              {EXTRACURRICULAR_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.extracurricular ? (
              <p className="mt-1 text-xs font-medium text-red-600">{errors.extracurricular}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-400">0 = None, 1 = Low, 2 = Moderate, 3 = High</p>
            )}
          </div>
        </div>
      </section>

      <button type="submit" disabled={loading} className="btn-primary w-full text-base sm:w-auto">
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Analyzing Student Profile...
          </>
        ) : (
          <>
            <Sparkles size={18} />
            Predict Placement
          </>
        )}
      </button>
    </form>
  );
}
