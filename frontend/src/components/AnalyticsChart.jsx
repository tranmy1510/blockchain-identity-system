import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", users: 120 },
  { month: "Feb", users: 210 },
  { month: "Mar", users: 380 },
  { month: "Apr", users: 520 },
  { month: "May", users: 740 },
  { month: "Jun", users: 980 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-3 border border-gold-dim rounded-xl px-4 py-2 text-sm">
      <p className="text-[#555] mb-1">{label}</p>
      <p className="text-gold font-medium">{payload[0].value} verifications</p>
    </div>
  );
};

export default function AnalyticsChart() {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-medium text-[#e8e0cc]">Verification Analytics</h2>
          <p className="text-[#555] text-sm mt-0.5">Monthly blockchain identity growth</p>
        </div>
        <span className="badge-verified">2025</span>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#1e1e1e" strokeDasharray="4 4" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#555", fontSize: 12 }}
              axisLine={{ stroke: "#1e1e1e" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#555", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#D4A017"
              strokeWidth={2}
              dot={{ fill: "#D4A017", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#D4A017" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}