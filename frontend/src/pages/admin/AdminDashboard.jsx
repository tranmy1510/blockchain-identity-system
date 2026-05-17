import {
  Users,
  ShieldCheck,
  Activity,
  Database,
} from "lucide-react";

const users = [
  {
    name: "John Doe",
    status: "Verified",
  },
  {
    name: "Alice Smith",
    status: "Pending",
  },
  {
    name: "Michael Lee",
    status: "Verified",
  },
];

export default function AdminDashboard() {

  return (

    <div>

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-gray-400 mt-2">
          Blockchain Identity Management System
        </p>

      </div>

      {/* STATS */}

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

        <div className="glass rounded-3xl p-6">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Total Users
              </p>

              <h2 className="text-3xl font-bold mt-3">
                1,248
              </h2>

            </div>

            <Users size={40} />

          </div>

        </div>

        <div className="glass rounded-3xl p-6">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Verified Identities
              </p>

              <h2 className="text-3xl font-bold mt-3 text-green-400">
                986
              </h2>

            </div>

            <ShieldCheck size={40} />

          </div>

        </div>

        <div className="glass rounded-3xl p-6">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Transactions
              </p>

              <h2 className="text-3xl font-bold mt-3">
                18K
              </h2>

            </div>

            <Database size={40} />

          </div>

        </div>

        <div className="glass rounded-3xl p-6">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Network Health
              </p>

              <h2 className="text-3xl font-bold mt-3 text-green-400">
                99%
              </h2>

            </div>

            <Activity size={40} />

          </div>

        </div>

      </div>

      {/* USER TABLE */}

      <div className="glass rounded-3xl p-8 mt-8">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            User Verification
          </h2>

          <button className="bg-secondary text-black px-5 py-2 rounded-xl font-semibold">
            Export Logs
          </button>

        </div>

        <div className="space-y-4">

          {
            users.map((user, index) => (

              <div
                key={index}
                className="flex justify-between items-center border border-white/10 rounded-2xl p-5"
              >

                <div>

                  <h3 className="font-semibold">
                    {user.name}
                  </h3>

                  <p className="text-gray-400 text-sm">
                    Blockchain Identity
                  </p>

                </div>

                <div className="flex items-center gap-4">

                  <span
                    className={`
                      px-4 py-2 rounded-xl text-sm
                      ${
                        user.status === "Verified"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }
                    `}
                  >
                    {user.status}
                  </span>

                  <button className="bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition">
                    View
                  </button>

                </div>

              </div>

            ))
          }

        </div>

      </div>

    </div>
  );
}