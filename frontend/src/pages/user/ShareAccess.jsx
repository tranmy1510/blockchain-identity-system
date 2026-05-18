<<<<<<< HEAD
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Trash2, Plus } from "lucide-react";
=======
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)
import api from "../../services/api";

export default function ShareAccess() {
  const [thirdPartyId, setThirdPartyId] = useState("");
  const [allowedFields, setAllowedFields] = useState([
    "fullName",
    "email",
    "status",
  ]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

<<<<<<< HEAD
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);
  const [sharedList, setSharedList] = useState([]);

  useEffect(() => {
    fetchSharedList();
  }, []);

  const fetchSharedList = async () => {
    try {
      const res = await api.get("/access/list");
      setSharedList(res.data.data || []);
    } catch (error) {
      console.log(error);
=======
  const fieldOptions = ["fullName", "email", "status", "dob", "address"];

  const fetchPermissions = async () => {
    try {
      const response = await api.get("/access/my-permissions");
      setPermissions(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load permissions");
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const toggleField = (field) => {
    if (allowedFields.includes(field)) {
      setAllowedFields(allowedFields.filter((item) => item !== field));
    } else {
      setAllowedFields([...allowedFields, field]);
>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)
    }
  };

  const handleShare = async () => {
<<<<<<< HEAD
    if (!orgName.trim()) {
      toast.error("Please enter an organization name");
      return;
    }

    setLoading(true);
    try {
      await api.post("/access/grant", { organization: orgName.trim() });
      toast.success(`Access granted to ${orgName}`);
      setOrgName("");
      fetchSharedList(); // Refresh danh sách
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to grant access");
=======
    if (!thirdPartyId) {
      toast.error("Please enter third-party ID");
      return;
    }

    try {
      setLoading(true);

      await api.post("/access/share", {
        thirdPartyId,
        allowedFields,
      });

      toast.success("Access granted successfully");
      setThirdPartyId("");
      fetchPermissions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Share access failed");
>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const handleRevoke = async (id) => {
    try {
      await api.post(`/access/revoke/${id}`);
      toast.success("Access revoked");
      setSharedList((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to revoke access");
=======
  const handleRevoke = async (permissionId) => {
    try {
      await api.put(`/access/revoke/${permissionId}`);
      toast.success("Access revoked successfully");
      fetchPermissions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Revoke access failed");
>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <p className="text-cyan-400 font-medium">Access Control</p>

<<<<<<< HEAD
      <h1 className="text-4xl font-bold mb-2">Share Access</h1>
      <p className="text-gray-400 mb-8">
        Grant or revoke third-party access to your verified identity
      </p>

      {/* GRANT FORM */}
      <div className="glass rounded-3xl p-8 mb-6">
        <h2 className="text-xl font-bold mb-4">Grant New Access</h2>
=======
        <h1 className="text-5xl font-bold mt-2">Share Access</h1>

        <p className="text-gray-400 mt-3">
          Grant or revoke third-party access to selected identity fields.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Grant New Access</h2>

        <label className="block text-gray-400 mb-2">Third-party User ID</label>
>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)

        <label className="block text-gray-400 mb-2">Organization Name</label>
        <input
<<<<<<< HEAD
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="e.g. VietcomBank, Grab, ..."
          className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none mb-4"
=======
          value={thirdPartyId}
          onChange={(e) => setThirdPartyId(e.target.value)}
          placeholder="Enter third-party user ID"
          className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 outline-none text-white"
>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)
        />

        <div className="mt-6">
          <p className="text-gray-400 mb-3">Allowed Fields</p>

          <div className="flex flex-wrap gap-3">
            {fieldOptions.map((field) => (
              <button
                type="button"
                key={field}
                onClick={() => toggleField(field)}
                className={`px-4 py-2 rounded-xl border transition ${
                  allowedFields.includes(field)
                    ? "bg-cyan-400 text-black border-cyan-400"
                    : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                }`}
              >
                {field}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleShare}
          disabled={loading}
<<<<<<< HEAD
          className="bg-gold text-[#111] px-6 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-60"
        >
          <Plus size={18} />
          {loading ? "Granting..." : "Grant Access"}
        </button>
      </div>

      {/* SHARED LIST */}
      <div className="glass rounded-3xl p-8">
        <h2 className="text-xl font-bold mb-4">Organizations with Access</h2>

        {sharedList.length === 0 ? (
          <p className="text-gray-400">
            No organizations have access to your identity yet.
          </p>
        ) : (
          <div className="space-y-3">
            {sharedList.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center border border-white/10 rounded-2xl p-4"
              >
                <div>
                  <p className="font-semibold">{item.organization}</p>
                  <p className="text-gray-400 text-sm">
                    Granted {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleRevoke(item._id)}
                  className="bg-red-500/20 text-red-400 hover:bg-red-500/40 transition px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Revoke
                </button>
              </div>
            ))}
          </div>
        )}
=======
          className="mt-8 bg-cyan-400 hover:bg-cyan-300 transition text-black px-8 py-4 rounded-2xl font-semibold disabled:opacity-60"
        >
          {loading ? "Granting Access..." : "Grant Access"}
        </button>
>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold">Shared Permissions</h2>
          <p className="text-gray-400 mt-2">
            Manage organizations or third-parties that can view your identity
            information.
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
                      {permission.thirdPartyId?.email || permission.thirdPartyId?._id}
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