

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getMyApplications,
  deleteMyApplication,
  updateMyApplication,
} from "../services/api";
import Loader from "../Components/Loader";

import { IoAlertCircleOutline } from "react-icons/io5";

const MyApplications = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editMessage, setEditMessage] = useState("");
  const [editPortfolioLink, setEditPortfolioLink] = useState("");

  const fetchApplications = async () => {
    if (!user || user.role !== "talent") {
      alert("Only talents can view their applications!");
      setLoading(false);
      return;
    }

    try {
      const res = await getMyApplications(token);
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm("Are you sure you want to withdraw this application?"))
      return;

    try {
      setDeletingId(applicationId);
      await deleteMyApplication(applicationId, token);
      setApplications((prev) =>
        prev.filter((app) => app._id !== applicationId)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to withdraw application");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (app) => {
    setEditingId(app._id);
    setEditMessage(app.message || "");
    setEditPortfolioLink(app.portfolioLink || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditMessage("");
    setEditPortfolioLink("");
  };

  const handleSaveEdit = async (applicationId) => {
    try {
      const updatedData = {
        message: editMessage,
        portfolioLink: editPortfolioLink,
      };

      const res = await updateMyApplication(applicationId, updatedData, token);

      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? res.data.application : app
        )
      );

      setEditingId(null);
      setEditMessage("");
      setEditPortfolioLink("");
      alert("Application updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update application");
    }
  };

  if (loading) return <Loader />;

  if (!applications.length)
    return (
      <p className="text-center mt-10 text-gray-400 min-h-screen">
        No applications submitted yet.
      </p>
    );

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    shortlisted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 min-h-screen mb-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        My Applications
      </h1>

      <div className="grid gap-6">
        {applications.map((a) => {
          const statusKey = a.status || "pending";
          const isEditing = editingId === a._id;

          //  Detect deltd or inative casting
          const isCastingDeleted = !a.casting || a.casting.isActive === false;

          const castingWasUpdated =
            a.casting?.isUpdated &&
            a.casting?.updatedAt &&
            a.casting?.updatedAt !== a.castingUpdatedAt;

          return (
            <div
              key={a._id}
              className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                {isCastingDeleted ? (
                  <p className="text-xl font-semibold text-gray-500">
                    Casting no longer available
                  </p>
                ) : (
                  <Link
                    to={`/castings/${a.casting._id}`}
                    className="text-xl font-semibold text-blue-600 hover:underline"
                  >
                    {a.casting.title}
                  </Link>
                )}

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[statusKey]}`}
                >
                  {statusKey === "shortlisted"
                    ? "Accepted"
                    : statusKey === "rejected"
                    ? "Rejected"
                    : "Pending"}
                </span>
              </div>

              {/*  CASTING DELETED ALERT */}
              {isCastingDeleted && (
                <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-300">
                  <p className="font-semibold text-red-700 flex items-center gap-2">
                    <IoAlertCircleOutline className="text-xl" />
                    This casting is no longer available
                  </p>
                  <p className="text-sm text-red-600 mt-1">
                    The director has removed this casting or deactivated their account.
                  </p>
                </div>
              )}

              {/* EXISTING CASTING UPDATE ALERT */}
              {castingWasUpdated && (
                <div className="mt-4 p-4 rounded-lg bg-yellow-50 border border-yellow-300">
                  <p className="font-semibold text-yellow-800 flex items-center gap-2">
                    <IoAlertCircleOutline className="text-xl" />
                    Casting Updated by Director
                  </p>
                  {a.casting.updateNote && (
                    <p className="mt-1 text-sm text-yellow-700">
                      {a.casting.updateNote}
                    </p>
                  )}
                </div>
              )}

              {/* EDIT MODE */}
              {isEditing ? (
                <div className="mt-3">
                  <textarea
                    className="w-full border p-2 rounded"
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    placeholder="Update your message..."
                  />
                  <input
                    type="text"
                    className="w-full border p-2 mt-2 rounded"
                    value={editPortfolioLink}
                    onChange={(e) => setEditPortfolioLink(e.target.value)}
                    placeholder="Portfolio link (optional)"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleSaveEdit(a._id)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {a.message && (
                    <p className="mt-2 text-gray-700">
                      <strong>Message:</strong> {a.message}
                    </p>
                  )}

                 

                  {/* Disable  if cast dlted */}
                  {statusKey === "pending" && !isCastingDeleted && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleWithdraw(a._id)}
                        disabled={deletingId === a._id}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-60"
                      >
                        {deletingId === a._id
                          ? "Withdrawing..."
                          : "Withdraw"}
                      </button>
                      <button
                        onClick={() => handleEditClick(a)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyApplications;
