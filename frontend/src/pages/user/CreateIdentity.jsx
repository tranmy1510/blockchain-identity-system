import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Upload,
  ShieldCheck,
  User,
  Mail,
  CreditCard,
  MapPin,
  Calendar,
} from "lucide-react";
import API from "../../services/api";

export default function CreateIdentity() {
  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    email: "",
    documentId: "",
    address: "",
  });

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.fullName ||
      !form.dob ||
      !form.email ||
      !form.documentId ||
      !form.address
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      await API.post("/identity", form);
      await API.put("/identity/submit");

      toast.success("Identity submitted for verification");
      navigate("/user/dashboard");
    } catch (error) {
      const message = error.response?.data?.message || "Create identity failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <p className="text-gold font-semibold mb-2">
          Digital Identity Registration
        </p>

        <h1 className="text-4xl font-bold text-white">
          Create Digital Identity
        </h1>

        <p className="text-gray-400 mt-3">
          Enter your personal information. Your real data is stored off-chain,
          while only the identity hash is stored on blockchain after verifier
          approval.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="glass rounded-3xl p-6 border border-white/10 shadow-xl">
            <div className="w-full aspect-square rounded-3xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <Upload size={44} className="mx-auto mb-3" />
                  Upload ID Photo
                </div>
              )}
            </div>

            <label className="mt-5 w-full inline-flex items-center justify-center bg-gold text-black px-6 py-3 rounded-xl cursor-pointer font-semibold hover:opacity-90 transition">
              Upload Image
              <input type="file" className="hidden" onChange={handleImage} />
            </label>

            <div className="mt-8 rounded-2xl bg-white/5 border border-white/10 p-5">
              <h2 className="text-lg font-bold mb-4">Data Protection</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Storage</span>
                  <span className="text-right">MongoDB Off-chain</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Blockchain</span>
                  <span className="text-green-400 text-right">Hash Only</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Status</span>
                  <span className="text-yellow-400 text-right">
                    Pending after submit
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 glass rounded-3xl p-8 border border-white/10 shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-2">Identity Information</h2>

          <p className="text-gray-400 mb-8">
            These fields will be sent to backend and saved in MongoDB. Verifier
            will review this profile.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-gray-400">Full Name</label>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4">
                <User className="text-gray-400" />

                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  type="text"
                  placeholder="Nguyen Van A"
                  className="w-full bg-transparent p-4 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-gray-400">Date of Birth</label>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4">
                <Calendar className="text-gray-400" />

                <input
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  type="date"
                  max="2099-12-31"
                  min="1900-01-01"
                  className="w-full bg-transparent p-4 outline-none text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-gray-400">Email Address</label>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4">
                <Mail className="text-gray-400" />

                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="user@example.com"
                  className="w-full bg-transparent p-4 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-gray-400">National ID</label>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4">
                <CreditCard className="text-gray-400" />

                <input
                  name="documentId"
                  value={form.documentId}
                  onChange={handleChange}
                  type="text"
                  placeholder="012345678901"
                  className="w-full bg-transparent p-4 outline-none"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 text-gray-400">Address</label>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4">
                <MapPin className="text-gray-400" />

                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  type="text"
                  placeholder="Ha Noi, Viet Nam"
                  className="w-full bg-transparent p-4 outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-blue-500/10 border border-blue-500/20 p-5">
            <h3 className="font-bold mb-2">What happens after submission?</h3>

            <p className="text-gray-300 text-sm leading-6">
              Your profile will be created and automatically submitted with
              status <span className="text-yellow-400">Pending</span>. The
              verifier will review it. If approved, backend will create a hash
              and store it on blockchain.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full bg-gold text-black py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? (
              "Submitting identity..."
            ) : (
              <>
                <ShieldCheck />
                Submit for Verification
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}