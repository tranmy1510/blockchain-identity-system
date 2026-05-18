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
import api from "../../services/api";

export default function CreateIdentity() {

  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // State cho từng trường - trước đây bị thiếu hoàn toàn
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    email: "",
    documentId: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!form.fullName || !form.dob || !form.email || !form.documentId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Gọi API tạo identity thật
      await api.post("/identity/create", form);
      toast.success("Identity created! Submitting for verification...");

      // Gửi lên verifier ngay
      await api.post("/identity/submit");
      toast.success("Submitted for verification. Status: Pending");

      navigate("/user/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create identity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Create Digital Identity</h1>
        <p className="text-gray-400 mt-3">
          Secure your identity using blockchain verification
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="glass rounded-3xl p-8">

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-10">

          {/* LEFT */}
          <div>

            {/* IMAGE PREVIEW */}
            <div className="mb-8">
              <div className="w-52 h-52 rounded-3xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <Upload size={40} className="mx-auto mb-3" />
                    Upload ID Photo
                  </div>
                )}
              </div>

              <label className="mt-4 inline-block bg-secondary text-black px-6 py-3 rounded-xl cursor-pointer font-semibold">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImage}
                />
              </label>
            </div>

            {/* BLOCKCHAIN STATUS */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Blockchain Status</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Network</span>
                  <span>Ethereum</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Verification</span>
                  <span className="text-green-400">Secure</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Encryption</span>
                  <span>SHA-256 Hash</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* FULL NAME */}
            <div>
              <label className="block mb-2 text-gray-400">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4">
                <User />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Nguyen Van A"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full bg-transparent p-4 outline-none"
                  required
                />
              </div>
            </div>

            {/* DATE OF BIRTH */}
            <div>
              <label className="block mb-2 text-gray-400">
                Date of Birth <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4">
                <Calendar />
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className="w-full bg-transparent p-4 outline-none"
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block mb-2 text-gray-400">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4">
                <Mail />
                <input
                  type="email"
                  name="email"
                  placeholder="nguyen@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-transparent p-4 outline-none"
                  required
                />
              </div>
            </div>

            {/* NATIONAL ID */}
            <div>
              <label className="block mb-2 text-gray-400">
                National ID / Document ID <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4">
                <CreditCard />
                <input
                  type="text"
                  name="documentId"
                  placeholder="0123456789"
                  value={form.documentId}
                  onChange={handleChange}
                  className="w-full bg-transparent p-4 outline-none"
                  required
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div>
              <label className="block mb-2 text-gray-400">Address</label>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4">
                <MapPin />
                <input
                  type="text"
                  name="address"
                  placeholder="123 Nguyen Trai, Ha Noi"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full bg-transparent p-4 outline-none"
                />
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-black py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-60"
            >
              {loading ? (
                "Submitting..."
              ) : (
                <>
                  <ShieldCheck />
                  Create & Submit Identity
                </>
              )}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}