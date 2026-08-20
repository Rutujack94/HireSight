import { useState } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import StudentForm from "../components/StudentForm.jsx";
import PredictionCard from "../components/PredictionCard.jsx";
import PerformanceChart from "../components/PerformanceChart.jsx";
import RecommendationCard from "../components/RecommendationCard.jsx";
import FeatureImportance from "../components/FeatureImportance.jsx";
import { predictPlacement } from "../services/api.js";

export default function Predict() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await predictPlacement(payload);
      setResult(data);
      setSubmittedData(payload);
      setTimeout(() => {
        document.getElementById("prediction-results")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSubmittedData(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container-app py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <p className="section-label">Prediction</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Enter Your Student Profile
          </h1>
          <p className="mt-3 text-slate-500">
            Fill in the details below to get your ML-based placement prediction.
          </p>
        </div>

        <div className="card p-6 sm:p-8">
          <StudentForm onSubmit={handleSubmit} loading={loading} apiError={error} />
        </div>

        {!result && !loading && !error && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 text-sm text-slate-500">
            <AlertCircle size={18} className="shrink-0 text-slate-400" />
            Your results — including probability, profile analysis, and recommendations — will
            appear here after you submit the form.
          </div>
        )}
      </div>

      {result && submittedData && (
        <div id="prediction-results" className="mx-auto mt-14 max-w-5xl space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Your Results</h2>
            <button onClick={handleReset} className="btn-secondary text-sm">
              <RefreshCcw size={16} />
              Start Over
            </button>
          </div>

          <PredictionCard result={result} />

          {/* Profile Analysis */}
          <div className="card p-6 sm:p-8">
            <h3 className="mb-1 text-lg font-bold text-slate-900">Your Profile Analysis</h3>
            <p className="mb-5 text-sm text-slate-500">
              A visual breakdown of the key inputs used for this prediction.
            </p>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <PerformanceChart studentData={submittedData} />

              <div className="grid grid-cols-2 gap-3 self-center sm:grid-cols-3">
                <ProfileStat label="CGPA" value={submittedData.cgpa} />
                <ProfileStat label="Coding Score" value={submittedData.coding_score} />
                <ProfileStat label="Aptitude" value={submittedData.aptitude_score} />
                <ProfileStat label="Communication" value={submittedData.communication_score} />
                <ProfileStat label="Attendance" value={`${submittedData.attendance}%`} />
                <ProfileStat label="Internships" value={submittedData.internships} />
                <ProfileStat label="Projects" value={submittedData.projects} />
                <ProfileStat label="Certifications" value={submittedData.certifications} />
              </div>
            </div>
          </div>

          <FeatureImportance factors={result.top_factors} />

          <RecommendationCard recommendations={result.recommendations} />
        </div>
      )}
    </div>
  );
}

function ProfileStat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-center">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}
