export default function VerifierDashboard() {
  return (
    <div>

      <h1 className="text-4xl font-bold mb-8">
        Pending Verifications
      </h1>

      <div className="glass rounded-3xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-white/5">

            <tr>
              <th className="text-left p-4">User</th>
              <th className="text-left p-4">Document</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Action</th>
            </tr>

          </thead>

          <tbody>

            <tr className="border-t border-white/10">

              <td className="p-4">
                Nguyen Van A
              </td>

              <td className="p-4">
                Passport
              </td>

              <td className="p-4 text-yellow-400">
                Pending
              </td>

              <td className="p-4 flex gap-3">

                <button className="bg-green-500 px-4 py-2 rounded-lg">
                  Approve
                </button>

                <button className="bg-red-500 px-4 py-2 rounded-lg">
                  Reject
                </button>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}