import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, TrendingUp, GraduationCap, Percent, AlertCircle } from "lucide-react";
import StatCard from "../components/StatCard.jsx";
import { getDashboardStats, getDashboardAnalysis } from "../services/api.js";

// Mock / local-state prediction history for the first version.
// Structured so it can later be swapped for a real database-backed table.
const MOCK_HISTORY = [
  { student: "Student 1", cgpa: 8.7, coding: 85, probability: 91, result: "Placed" },
  { student: "Student 2", cgpa: 6.4, coding: 52, probability: 43, result: "Not Placed" },
  { student: "Student 3", cgpa: 7.9, coding: 74, probability: 78, result: "Placed" },
  { student: "Student 4", cgpa: 6.9, coding: 48, probability: 39, result: "Not Placed" },
  { student: "Student 5", cgpa: 9.1, coding: 92, probability: 95, result: "Placed" },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsData, analysisData] = await Promise.all([
          getDashboardStats(),
          getDashboardAnalysis(),
        ]);
        setStats(statsData);
        setAnalysis(analysisData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const placedVsNot = analysis
    ? [
        { name: "Placed", value: analysis.placed_vs_not_placed.placed },
        { name: "Not Placed", value: analysis.placed_vs_not_placed.not_placed },
      ]
    : [];

  const cgpaComparison = analysis
    ? [
        { group: "Placed", cgpa: analysis.avg_cgpa_by_placement.placed },
        { group: "Not Placed", cgpa: analysis.avg_cgpa_by_placement.not_placed },
      ]
    : [];

  const codingComparison = analysis
    ? [
        { group: "Placed", score: analysis.coding_score_by_placement.placed },
        { group: "Not Placed", score: analysis.coding_score_by_placement.not_placed },
      ]
    : [];

  const attendanceComparison = analysis
    ? [
        { group: "Placed", attendance: analysis.attendance_by_placement.placed },
        { group: "Not Placed", attendance: analysis.attendance_by_placement.not_placed },
      ]
    : [];

  const internshipsData = analysis?.internships_by_placement?.length
    ? Object.values(
        analysis.internships_by_placement.reduce((acc, row) => {
          const key = row.internships;
          if (!acc[key]) acc[key] = { internships: key, Placed: 0, "Not Placed": 0 };
          if (row.placed === 1) acc[key].Placed = row.count;
          else acc[key]["Not Placed"] = row.count;
          return acc;
        }, {})
      ).sort((a, b) => a.internships - b.internships)
    : [];

  const PIE_COLORS = ["#16a34a", "#e2e8f0"];

  return (
    <div className="container-app py-12">
      <div className="mb-10">
        <p className="section-label">Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
          Placement Analytics Overview
        </h1>
        <p className="mt-3 max-w-2xl text-slate-500">
          Statistics computed from the synthetic/demo training dataset used to build the model.
        </p>
      </div>

      {error && (
        <div className="mb-8 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-700">
          <AlertCircle size={18} />
          {error} — showing may be incomplete. Please make sure the FastAPI backend is running.
        </div>
      )}

      {/* Stat cards */}
      <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Students Analyzed"
          value={loading ? "…" : stats?.total_students_analyzed ?? "—"}
          icon={Users}
          accent="brand"
        />
        <StatCard
          label="Placement Rate"
          value={loading ? "…" : stats?.placement_rate ?? "—"}
          suffix={loading ? "" : "%"}
          icon={TrendingUp}
          accent="green"
        />
        <StatCard
          label="Average CGPA"
          value={loading ? "…" : stats?.average_cgpa ?? "—"}
          icon={GraduationCap}
          accent="violet"
        />
        <StatCard
          label="Avg. Placement Probability"
          value={loading ? "…" : stats?.average_placement_probability ?? "—"}
          suffix={loading ? "" : "%"}
          icon={Percent}
          accent="amber"
        />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Placement vs Non-Placement">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={placedVsNot} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {placedVsNot.map((entry, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Average CGPA: Placed vs Non-Placed">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cgpaComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="group" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="cgpa" fill="#3563f0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Coding Score vs Placement">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={codingComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="group" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="score" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Internships vs Placement">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={internshipsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="internships" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Placed" fill="#16a34a" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Not Placed" fill="#dc2626" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Attendance vs Placement" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={attendanceComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="group" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="attendance" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent predictions */}
      <div className="card mt-10 overflow-hidden p-6 sm:p-8">
        <h3 className="mb-1 text-lg font-bold text-slate-900">Recent Predictions</h3>
        <p className="mb-5 text-sm text-slate-500">
          Sample history shown for demonstration (local state) — ready to be backed by a database.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="pb-3 font-medium">Student</th>
                <th className="pb-3 font-medium">CGPA</th>
                <th className="pb-3 font-medium">Coding</th>
                <th className="pb-3 font-medium">Probability</th>
                <th className="pb-3 font-medium">Result</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_HISTORY.map((row) => (
                <tr key={row.student} className="border-b border-slate-50 last:border-0">
                  <td className="py-3 font-medium text-slate-800">{row.student}</td>
                  <td className="py-3 text-slate-600">{row.cgpa}</td>
                  <td className="py-3 text-slate-600">{row.coding}</td>
                  <td className="py-3 text-slate-600">{row.probability}%</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        row.result === "Placed"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {row.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children, className = "" }) {
  return (
    <div className={`card p-5 sm:p-6 ${className}`}>
      <h3 className="mb-4 font-semibold text-slate-800">{title}</h3>
      {children}
    </div>
  );
}
