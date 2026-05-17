export default function ThirdPartyDashboard() {
  return (
    <div className="max-w-3xl mx-auto">

      <h1 className="text-4xl font-bold mb-8">
        Verify Identity
      </h1>

      <div className="glass rounded-3xl p-8">

        <input
          placeholder="Enter User ID"
          className="w-full p-4 rounded-xl bg-white/5 border border-white/10"
        />

        <button className="mt-4 bg-primary px-6 py-3 rounded-xl">
          Check Verification
        </button>

        <div className="mt-8 p-6 rounded-2xl bg-green-500/10 border border-green-500/20">

          <h3 className="text-green-400 text-2xl font-bold">
            VERIFIED
          </h3>

          <p className="text-gray-300 mt-2">
            Blockchain identity verified successfully
          </p>

        </div>

      </div>

    </div>
  );
}