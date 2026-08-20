import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function PerformanceChart({ studentData }) {
  const data = [
    { subject: "CGPA", value: (studentData.cgpa / 10) * 100, raw: studentData.cgpa },
    { subject: "Coding", value: studentData.coding_score, raw: studentData.coding_score },
    { subject: "Aptitude", value: studentData.aptitude_score, raw: studentData.aptitude_score },
    {
      subject: "Communication",
      value: studentData.communication_score,
      raw: studentData.communication_score,
    },
    { subject: "Attendance", value: studentData.attendance, raw: studentData.attendance },
    {
      subject: "Projects",
      value: Math.min((studentData.projects / 10) * 100, 100),
      raw: studentData.projects,
    },
  ];

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "#475569", fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Radar
            name="Profile"
            dataKey="value"
            stroke="#3563f0"
            fill="#3563f0"
            fillOpacity={0.35}
          />
          <Tooltip
            formatter={(value, name, props) => [props.payload.raw, props.payload.subject]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
