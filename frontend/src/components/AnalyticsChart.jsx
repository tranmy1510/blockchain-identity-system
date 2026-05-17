import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    month: "Jan",
    users: 120,
  },
  {
    month: "Feb",
    users: 210,
  },
  {
    month: "Mar",
    users: 380,
  },
  {
    month: "Apr",
    users: 520,
  },
  {
    month: "May",
    users: 740,
  },
  {
    month: "Jun",
    users: 980,
  },
];

export default function AnalyticsChart() {

  return (

    <div className="glass rounded-3xl p-8">

      <div className="mb-6">

        <h2 className="text-2xl font-bold">
          Verification Analytics
        </h2>

        <p className="text-gray-400 mt-2">
          Monthly blockchain identity growth
        </p>

      </div>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="users"
              stroke="#00f5d4"
              strokeWidth={4}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}