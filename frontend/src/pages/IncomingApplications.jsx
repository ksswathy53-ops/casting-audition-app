

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getApplicationsForCasting,
  updateApplicationStatus,
} from "../services/api";
import Loader from "../Components/Loader";

const IncomingApplications = () => {
  const { castingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!castingId) return;

    const fetchApplications = async () => {
      try {
        const res = await getApplicationsForCasting(castingId, token);
        setApplications(res?.data || []);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 403) {
          setError("You are not authorized to view applications for this casting.");
        } else {
          setError("Failed to load applications.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [castingId, token]);

  const handleStatusChange = async (appId, status) => {
    try {
      await updateApplicationStatus(appId, status, token);
      setApplications((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status } : app
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-semibold text-red-400 mb-4">
          Access Denied
        </h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <button
          onClick={() => navigate("/castings")}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Go Back to Castings
        </button>
      </div>
    );
  }

  if (!castingId) {
    return (
      <p className="text-center mt-10 text-gray-600">
        No casting selected
      </p>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!applications.length) {
    return (
      <p className="text-center mt-10 text-gray-600 min-h-screen">
        No applications yet
      </p>
    );
  }

  const statusStyles = {
    shortlisted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 min-h-screen">
      <h1 className="text-3xl text-white font-bold mb-8 text-center">
        Incoming Applications
      </h1>

      <div className="grid gap-6">
        {applications.map((app) => {
          const applicantDeleted = app.applicantDeleted;
          const applicant = app.applicant;
          const statusKey = app.status || "pending";

          return (
            <div
              key={app._id}
              className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {!applicantDeleted ? (applicant?.name || "Unknown Applicant") : "Talent account deleted"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {!applicantDeleted ? (applicant?.email || "Email not available") : "Email not available"}
                  </p>
                </div>

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

              {/* Message & Portfolio */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Message
                </p>
                <p className="text-gray-600 bg-gray-50 p-3 rounded">
                  {app.message || "No message provided"}
                </p>

                {/* Only show prtflo if the talent acct not dltd */}
                {!applicantDeleted && app.portfolioLink && (
                  <p className="mt-2">
                    Portfolio:{" "}
                    <a
                      href={app.portfolioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {app.portfolioLink}
                    </a>
                  </p>
                )}

                {!applicantDeleted && app.portfolioFile && (
                  <p className="mt-1">
                    Uploaded File:{" "}
                    <a
                      href={`http://localhost:5000/${app.portfolioFile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View File
                    </a>
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {!applicantDeleted ? (
                  <button
                    onClick={() => navigate(`/talent/${applicant._id}`)}
                    className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    View Full Talent Profile
                  </button>
                ) : (
                  <span className="text-gray-400 text-sm italic">
                    Talent profile not available
                  </span>
                )}

                <div className="flex gap-3">
                  {!applicantDeleted ? (
                    <>
                      {app.status !== "shortlisted" && (
                        <button
                          onClick={() =>
                            handleStatusChange(app._id, "shortlisted")
                          }
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                        >
                          Accept
                        </button>
                      )}

                      {app.status !== "rejected" && (
                        <button
                          onClick={() =>
                            handleStatusChange(app._id, "rejected")
                          }
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-gray-400 italic">
                      Action unavailable — talent account deleted
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IncomingApplications;
