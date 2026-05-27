import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  Image as ImageIcon,
} from "lucide-react";
import api from "../../services/api";

export default function VerifierIdentityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [identity, setIdentity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchIdentityDetail = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/verifier/identity/${id}`);

      setIdentity(response.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load identity detail"
      );
      navigate("/verifier/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);

      await api.put(`/verifier/approve/${id}`);

      toast.success("Identity approved successfully");
      navigate("/verifier/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Approve failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setActionLoading(true);

      await api.put(`/verifier/reject/${id}`);

      toast.success("Identity rejected successfully");
      navigate("/verifier/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reject failed");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchIdentityDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="p-5 text-center text-sm text-gray-400">
        Loading identity detail...
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="p-5 text-center text-sm text-gray-400">
        Identity not found
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div>
        <button
          onClick={() => navigate("/verifier/dashboard")}
          className="mb-3 flex items-center gap-2 text-sm text-gray-400 hover:text-gold transition"
        >
          <ArrowLeft size={16} />
          Back to Pending List
        </button>

        <p className="text-sm text-gold font-medium">Verifier Portal</p>

        <h1 className="text-3xl font-bold mt-1">Identity Details</h1>

        <p className="text-sm text-gray-400 mt-1">
          Review submitted information before approving or rejecting.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg">
            <div className="w-full h-56 rounded-2xl bg-black/30 border border-white/10 overflow-hidden flex items-center justify-center">
              {identity.idPhoto ? (
                <img
                  src={identity.idPhoto}
                  alt="ID document"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-sm text-gray-500">
                  <ImageIcon size={34} className="mx-auto mb-2" />
                  No ID Photo
                </div>
              )}
            </div>

            <div className="mt-3">
              <span className="inline-flex bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-lg text-xs">
                {identity.status}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Submitted Information</h2>

            <div className="grid md:grid-cols-2 gap-3">
              <InfoItem
                icon={<User size={18} />}
                label="Full Name"
                value={identity.fullName}
              />

              <InfoItem
                icon={<Calendar size={18} />}
                label="Date of Birth"
                value={
                  identity.dob
                    ? new Date(identity.dob).toLocaleDateString()
                    : "N/A"
                }
              />

              <InfoItem
                icon={<Mail size={18} />}
                label="Email"
                value={identity.email}
              />

              <InfoItem
                icon={<Phone size={18} />}
                label="Phone"
                value={identity.phone || "N/A"}
              />

              <InfoItem
                icon={<CreditCard size={18} />}
                label="National ID"
                value={identity.documentId}
              />

              <InfoItem
                icon={<MapPin size={18} />}
                label="Address"
                value={identity.address}
              />
            </div>

            <div className="mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-100 text-xs leading-5">
              Verifier should compare submitted information with the uploaded ID
              photo or trusted records. Once approved, backend generates a hash
              and stores verification proof on blockchain.
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="flex-1 bg-green-500 hover:bg-green-600 transition px-5 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <CheckCircle size={18} />
                {actionLoading ? "Processing..." : "Approve Identity"}
              </button>

              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="flex-1 bg-red-500 hover:bg-red-600 transition px-5 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <XCircle size={18} />
                {actionLoading ? "Processing..." : "Reject Identity"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="bg-black/30 border border-white/10 rounded-xl p-3">
      <div className="flex items-center gap-2 text-gray-400 mb-1">
        <span className="text-gold">{icon}</span>
        <span className="text-xs">{label}</span>
      </div>

      <p className="text-sm font-semibold break-words">{value || "N/A"}</p>
    </div>
  );
}