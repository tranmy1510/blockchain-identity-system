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
  Phone,
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
    phone: "",
    idPhoto: "",
  });

  const validateForm = () => {
    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();
    const documentId = form.documentId.trim();
    const address = form.address.trim();
    const phone = form.phone.trim();

    if (!fullName || !form.dob || !email || !documentId || !address) {
      toast.error("Please fill in all required fields");
      return false;
    }

    if (fullName.length < 3) {
      toast.error("Full name must be at least 3 characters");
      return false;
    }

    const dobDate = new Date(form.dob);
    const today = new Date();

    if (Number.isNaN(dobDate.getTime())) {
      toast.error("Date of birth is invalid");
      return false;
    }

    if (dobDate >= today) {
      toast.error("Date of birth must be in the past");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Email format is invalid");
      return false;
    }

    if (!/^[0-9]{12}$/.test(documentId)) {
      toast.error("National ID must contain exactly 12 digits");
      return false;
    }

    if (address.length < 5) {
      toast.error("Address must be at least 5 characters");
      return false;
    }

    if (phone && !/^(0[0-9]{9}|\+84[0-9]{9})$/.test(phone)) {
      toast.error("Phone number must be valid, for example 0912345678 or +84912345678");
      return false;
    }

    return true;
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);
      setForm((prev) => ({
        ...prev,
        idPhoto: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "documentId") {
      newValue = value.replace(/\D/g, "").slice(0, 12);
    }

    if (name === "phone") {
      newValue = value.replace(/[^\d+]/g, "").slice(0, 12);
    }

    setForm({
      ...form,
      [name]: newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const cleanedForm = {
      fullName: form.fullName.trim(),
      dob: form.dob,
      email: form.email.trim().toLowerCase(),
      documentId: form.documentId.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
      idPhoto: form.idPhoto,
    };

    try {
      setLoading(true);

      await API.post("/identity", cleanedForm);
      await API.put("/identity/submit");

      toast.success("Identity submitted for verification");
      navigate("/user/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        "Create identity failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const todayString = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <p className="text-gold font-semibold mb-2">
          Digital Identity Registration
        </p>

        <h1 className="text-4xl font-bold text-[#ffe9a3]">
          Create Digital Identity
        </h1>

        <p className="text-[#9fb3c8] mt-3">
          Enter your personal information. Your real data is stored off-chain,
          while only the identity hash is stored on blockchain after verifier
          approval.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="rounded-3xl p-6 border border-[#2b2207] bg-[#111111] shadow-xl">
            <div className="w-full aspect-square rounded-3xl overflow-hidden border border-[#2b2207] bg-[#0d0d0d] flex items-center justify-center">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-[#8f8568]">
                  <Upload size={44} className="mx-auto mb-3" />
                  Upload ID Photo
                </div>
              )}
            </div>

            <label className="mt-5 w-full inline-flex items-center justify-center bg-gold text-black px-6 py-3 rounded-xl cursor-pointer font-semibold hover:opacity-90 transition">
              Upload Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImage}
              />
            </label>

            <div className="mt-8 rounded-2xl bg-[#0d0d0d] border border-[#2b2207] p-5">
              <h2 className="text-lg font-bold mb-4 text-[#ffe9a3]">
                Data Protection
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-[#8f8568]">Storage</span>
                  <span className="text-right text-[#f5e6b8]">
                    MongoDB Off-chain
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#8f8568]">Blockchain</span>
                  <span className="text-green-400 text-right">Hash Only</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#8f8568]">Status</span>
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
          className="lg:col-span-2 rounded-3xl p-8 border border-[#2b2207] bg-[#111111] shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-2 text-[#ffe9a3]">
            Identity Information
          </h2>

          <p className="text-[#9fb3c8] mb-8">
            These fields will be sent to backend and saved in MongoDB. Verifier
            will review this profile.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Field
              label="Full Name"
              icon={<User className="text-[#8f8568]" />}
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              type="text"
              placeholder="Nguyen Van A"
              required
            />

            <Field
              label="Date of Birth"
              icon={<Calendar className="text-[#8f8568]" />}
              name="dob"
              value={form.dob}
              onChange={handleChange}
              type="date"
              min="1900-01-01"
              max={todayString}
              required
            />

            <Field
              label="Email Address"
              icon={<Mail className="text-[#8f8568]" />}
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="user@example.com"
              required
            />

            <Field
              label="Phone Number"
              icon={<Phone className="text-[#8f8568]" />}
              name="phone"
              value={form.phone}
              onChange={handleChange}
              type="text"
              placeholder="0987654321"
            />

            <Field
              label="National ID"
              icon={<CreditCard className="text-[#8f8568]" />}
              name="documentId"
              value={form.documentId}
              onChange={handleChange}
              type="text"
              placeholder="012345678901"
              maxLength={12}
              required
            />

            <div className="md:col-span-2">
              <Field
                label="Address"
                icon={<MapPin className="text-[#8f8568]" />}
                name="address"
                value={form.address}
                onChange={handleChange}
                type="text"
                placeholder="Ha Noi, Viet Nam"
                required
              />
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-[#1a1405] border border-[#2b2207] p-5">
            <h3 className="font-bold mb-2 text-[#ffe9a3]">
              What happens after submission?
            </h3>

            <p className="text-[#d6caa8] text-sm leading-6">
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

function Field({
  label,
  icon,
  name,
  value,
  onChange,
  type,
  placeholder,
  required,
  min,
  max,
  maxLength,
}) {
  return (
    <div>
      <label className="block mb-2 text-[#8f8568]">{label}</label>

      <div className="flex items-center gap-3 bg-[#0d0d0d] border border-[#2b2207] rounded-2xl px-4 focus-within:border-[#d4a017] transition">
        {icon}

        <input
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          min={min}
          max={max}
          maxLength={maxLength}
          className="w-full bg-transparent p-4 outline-none text-[#f5e6b8] placeholder:text-[#6f674f]"
          required={required}
        />
      </div>
    </div>
  );
}