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
      <div className="p-8 text-center text-gray-400">
        Loading identity detail...
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="p-8 text-center text-gray-400">
        Identity not found
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <button
          onClick={() => navigate("/verifier/dashboard")}
          className="mb-5 flex items-center gap-2 text-gray-400 hover:text-gold transition"
        >
          <ArrowLeft size={18} />
          Back to Pending List
        </button>

        <p className="text-gold font-medium">Verifier Portal</p>

        <h1 className="text-5xl font-bold mt-2">Identity Details</h1>

        <p className="text-gray-400 mt-3">
          Review the submitted information carefully before approving or rejecting.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl">
            <div className="w-full aspect-square rounded-3xl bg-black/30 border border-white/10 overflow-hidden flex items-center justify-center">
              {identity.idPhoto ? (
                <img
                  src={identity.idPhoto}
                  alt="ID document"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <ImageIcon size={46} className="mx-auto mb-3" />
                  No ID Photo
                </div>
              )}
            </div>

            <div className="mt-6">
              <span className="inline-flex bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-xl text-sm">
                {identity.status}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Submitted Information</h2>

            <div className="grid md:grid-cols-2 gap-5">
              <InfoItem
                icon={<User />}
                label="Full Name"
                value={identity.fullName}
              />

              <InfoItem
                icon={<Calendar />}
                label="Date of Birth"
                value={
                  identity.dob
                    ? new Date(identity.dob).toLocaleDateString()
                    : "N/A"
                }
              />

              <InfoItem
                icon={<Mail />}
                label="Email"
                value={identity.email}
              />

              <InfoItem
                icon={<Phone />}
                label="Phone"
                value={identity.phone || "N/A"}
              />

              <InfoItem
                icon={<CreditCard />}
                label="National ID"
                value={identity.documentId}
              />

              <InfoItem
                icon={<MapPin />}
                label="Address"
                value={identity.address}
              />
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-100 text-sm leading-6">
              Verifier should compare the submitted information with the uploaded ID
              photo or external trusted records before approving. Once approved,
              the backend will generate an identity hash and store verification
              proof on blockchain.
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="flex-1 bg-green-500 hover:bg-green-600 transition px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 disabled:opacity-60"
              >
                <CheckCircle />
                {actionLoading ? "Processing..." : "Approve Identity"}
              </button>

              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="flex-1 bg-red-500 hover:bg-red-600 transition px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 disabled:opacity-60"
              >
                <XCircle />
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
    <div className="bg-black/30 border border-white/10 rounded-2xl p-5">
      <div className="flex items-center gap-3 text-gray-400 mb-2">
        <span className="text-gold">{icon}</span>
        <span className="text-sm">{label}</span>
      </div>

      <p className="text-lg font-semibold break-words">{value || "N/A"}</p>
    </div>
  );
}