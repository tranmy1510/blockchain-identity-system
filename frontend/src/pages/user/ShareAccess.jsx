import toast from "react-hot-toast";

export default function ShareAccess() {

  const handleShare = () => {
    toast.success(
      "Access granted successfully"
    );
  };

  return (
    <div className="max-w-2xl">

      <h1 className="text-4xl font-bold mb-8">
        Share Access
      </h1>

      <div className="glass rounded-3xl p-8">

        <input
          placeholder="Organization Name"
          className="w-full p-4 rounded-xl bg-white/5 border border-white/10"
        />

        <button
          onClick={handleShare}
          className="mt-4 bg-secondary text-black px-6 py-3 rounded-xl"
        >
          Grant Access
        </button>

      </div>

    </div>
  );
}