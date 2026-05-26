import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function ShareAccess() {
  const [accessRequests, setAccessRequests] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fieldOptions = ["fullName", "email", "status", "dob", "address", "phone"];

  const [selectedFieldsByRequest, setSelectedFieldsByRequest] = useState({});

  const fetchAccessRequests = async () => {
    try {
      const response = await api.get("/access/requests");
      const requests = response.data.data || [];

      setAccessRequests(requests);

      const initialSelected = {};
      requests.forEach((request) => {
        initialSelected[request._id] =
          request.requestedFields?.length > 0
            ? request.requestedFields
            : ["fullName", "email", "status"];
      });

      setSelectedFieldsByRequest(initialSelected);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load access requests"
      );
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await api.get("/access/my-permissions");
      setPermissions(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load permissions");
    }
  };

  useEffect(() => {
    fetchAccessRequests();
    fetchPermissions();
  }, []);

  const toggleField = (requestId, field) => {
    const currentFields = selectedFieldsByRequest[requestId] || [];

    const updatedFields = currentFields.includes(field)
      ? currentFields.filter((item) => item !== field)
      : [...currentFields, field];

    setSelectedFieldsByRequest({
      ...selectedFieldsByRequest,
      [requestId]: updatedFields,
    });
  };

  const handleApproveRequest = async (requestId) => {
    const approvedFields = selectedFieldsByRequest[requestId] || [];

    if (approvedFields.length === 0) {
      toast.error("Please select at least one field to share");
      return;
    }

    try {
      setLoading(true);

      await api.put(`/access/request/${requestId}/approve`, {
        approvedFields,
      });

      toast.success("Access request approved");
      fetchAccessRequests();
      fetchPermissions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Approve request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      setLoading(true);

      await api.put(`/access/request/${requestId}/reject`);

      toast.success("Access request rejected");
      fetchAccessRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Reject request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (permissionId) => {
    try {
      await api.put(`/access/revoke/${permissionId}`);
      toast.success("Access revoked successfully");
      fetchPermissions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Revoke access failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <p className="text-gold font-medium">Access Control</p>

        <h1 className="text-5xl font-bold mt-2">Share Access</h1>

        <p className="text-gray-400 mt-3">
          Review third-party access requests and choose exactly which identity
          fields you want to share.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold">Pending Access Requests</h2>

          <p className="text-gray-400 mt-2">
            Third-parties can request access, but you control which fields are
            shared.
          </p>
        </div>

        <div className="p-6 space-y-5">
          {accessRequests.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No pending access requests
            </div>
          ) : (
            accessRequests.map((request) => (
              <div
                key={request._id}
                className="bg-black/30 border border-white/10 rounded-3xl p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div>
                    <p className="text-sm text-gray-400">Requested by</p>

                    <h3 className="text-xl font-bold mt-1">
                      {request.requesterId?.name || "Unknown Third-party"}
                    </h3>

                    <p className="text-gray-400 mt-1">
                      {request.requesterId?.email || request.requesterId?._id}
                    </p>

                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-2">
                        Third-party requested:
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {request.requestedFields?.map((field) => (
                          <span
                            key={field}
                            className="bg-white/10 text-gray-200 px-3 py-1 rounded-lg text-sm"
                          >
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-[420px]">
                    <p className="text-sm text-gray-400 mb-3">
                      Select fields to approve
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {fieldOptions.map((field) => (
                        <button
                          type="button"
                          key={field}
                          onClick={() => toggleField(request._id, field)}
                          className={`px-4 py-2 rounded-xl border transition ${
                            selectedFieldsByRequest[request._id]?.includes(
                              field
                            )
                              ? "bg-gold text-black border-gold"
                              : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          {field}
                        </button>
                      ))}
                    </div>

                    <div className="mt-5 flex gap-3">
                      <button
                        onClick={() => handleApproveRequest(request._id)}
                        disabled={loading}
                        className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-60 transition px-5 py-3 rounded-xl font-semibold"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleRejectRequest(request._id)}
                        disabled={loading}
                        className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 transition px-5 py-3 rounded-xl font-semibold"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold">Shared Permissions</h2>

          <p className="text-gray-400 mt-2">
            Manage third-parties that currently have access to your selected
            identity information.
          </p>
        </div>

        <table className="w-full">
          <thead className="bg-white/5 text-gray-300">
            <tr>
              <th className="text-left p-5">Third-party</th>
              <th className="text-left p-5">Allowed Fields</th>
              <th className="text-left p-5">Status</th>
              <th className="text-left p-5">Action</th>
            </tr>
          </thead>

          <tbody>
            {permissions.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-400">
                  No permissions shared yet
                </td>
              </tr>
            ) : (
              permissions.map((permission) => (
                <tr
                  key={permission._id}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="p-5">
                    <p className="font-semibold">
                      {permission.thirdPartyId?.name || "Unknown"}
                    </p>

                    <p className="text-sm text-gray-400">
                      {permission.thirdPartyId?.email ||
                        permission.thirdPartyId?._id}
                    </p>
                  </td>

                  <td className="p-5">
                    <div className="flex flex-wrap gap-2">
                      {permission.allowedFields?.map((field) => (
                        <span
                          key={field}
                          className="bg-white/10 text-gray-200 px-3 py-1 rounded-lg text-sm"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="p-5">
                    <span
                      className={`px-4 py-2 rounded-xl text-sm ${
                        permission.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {permission.isActive ? "Active" : "Revoked"}
                    </span>
                  </td>

                  <td className="p-5">
                    <button
                      onClick={() => handleRevoke(permission._id)}
                      disabled={!permission.isActive}
                      className="bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition px-5 py-2 rounded-xl font-medium"
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}