



import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getCastingById, applyForCasting } from "../services/api";
import Loader from "../Components/Loader";
import { IoAlertCircleOutline } from "react-icons/io5";

const CastingDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [casting, setCasting] = useState(null);
  const [message, setMessage] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [loading, setLoading] = useState(true);

  // load casting details
  useEffect(() => {
    const loadCasting = async () => {
      try {
        const response = await getCastingById(id);
        setCasting(response?.data || null);
      } catch (err) {
        console.log("Error loading casting");
        console.error(err);
        setCasting(null);
      } finally {
        setLoading(false);
      }
    };

    loadCasting();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      alert("Please login to apply");
      return;
    }

    if (!casting || casting.isActive === false) {
      alert("This casting is not available anymore");
      return;
    }

    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await applyForCasting(
        {
          castingId: casting._id,
          message,
          portfolioLink: portfolioLink || "",
        },
        token
      );

      alert("Application submitted successfully");
      setMessage("");
      setPortfolioLink("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Could not apply");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  // casting removed or inactive mssg
  if (!casting || casting.isActive === false) {
    return (
      <div className="max-w-3xl mx-auto mt-16 px-4 min-h-screen">
        <div className="bg-red-50 border border-red-300 rounded-xl p-6 text-center">
          <IoAlertCircleOutline className="text-4xl text-red-600 mx-auto mb-3" />
          <h2 className="text-2xl font-semibold text-red-700">
            Casting Not Available
          </h2>
          <p className="text-red-600 mt-2">
            This casting has been removed or is no longer active.
          </p>

          <Link
            to="/castings"
            className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Other Castings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 min-h-screen mb-5">
      {/* casting details */}
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {casting.title}
        </h1>

        <p className="text-gray-600 mb-6">
          {casting.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded">
            <strong>Role Type:</strong> {casting.roleType}
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <strong>Location:</strong> {casting.location}
          </div>

          <div className="bg-gray-50 p-3 rounded md:col-span-2">
            <strong>Audition Date:</strong>{" "}
            {new Date(casting.auditionDate).toLocaleDateString()}
          </div>
        </div>

        {/* director info for (talent only) */}
        {user?.role === "talent" && casting.postedBy && (
          <div
            className="mt-6 p-4 bg-zinc-100 rounded shadow cursor-pointer hover:bg-zinc-200"
            onClick={() =>
              navigate(`/director/${casting.postedBy._id}`)
            }
          >
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              Director Details
            </h3>

            <div className="flex items-center gap-4">
              {casting.postedBy.avatar ? (
                <img
                  src={`http://localhost:5000/${casting.postedBy.avatar}`}
                  alt={casting.postedBy.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center text-white">
                  👤
                </div>
              )}

              <div>
                <p className="font-semibold text-gray-800">
                  {casting.postedBy.name}
                </p>
                <p className="text-gray-600">
                  {casting.postedBy.email}
                </p>
              </div>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Click to view profile
            </p>
          </div>
        )}

        {/* director  */}
        {user?.role === "director" && (
          <div className="mt-6">
            <Link
              to={`/incoming-applications/${casting._id}`}
              className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              View Incoming Applications
            </Link>
          </div>
        )}
      </div>

      {/* apply section */}
      {user?.role === "talent" && (
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Apply for this Casting
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Message to Director *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              placeholder="Introduce yourself briefly..."
              className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Portfolio link (optional)
            </label>
            <input
              type="text"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
              placeholder="Any link showcasing your work"
              className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <button
            onClick={handleApply}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600"
          >
            Apply Now
          </button>
        </div>
      )}
    </div>
  );
};

export default CastingDetails;
