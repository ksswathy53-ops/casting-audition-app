


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getTalentProfile } from "../services/api";
import Loader from "../Components/Loader";
import { CgProfile } from "react-icons/cg";

const TalentProfileView = () => {
  const { talentId } = useParams();
  const { user } = useAuth(); 
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [talent, setTalent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTalent = async () => {
      try {
        const res = await getTalentProfile(talentId, token);
        setTalent(res.data);
      } catch (err) {
        console.error(err);
        setError(" Talent profile is no longer available");
      } finally {
        setLoading(false);
      }
    };

    fetchTalent();
  }, [talentId, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        {error}
      </p>
    );
  }

  if (!talent) return null;

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-gray-900 text-white rounded-xl min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-700 text-gray-200 px-4 py-2 rounded hover:bg-gray-600 transition"
      >
         Back to Applications
      </button>

      {/* Profile Header  */}
      <div className="flex gap-6 items-center mb-6">
        {/* Avatr */}
        <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden">
          {talent.avatar ? (
            <img
              src={`http://localhost:5000/${talent.avatar}`}
              alt="talent"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">
              <CgProfile />
            </div>
          )}
        </div>

        {/*  info */}
        <div>
          <h1 className="text-2xl font-bold">{talent.name}</h1>
          <p className="text-gray-400">{talent.email}</p>
          <span className="inline-block mt-2 bg-green-600 px-3 py-1 rounded text-sm">
            Talent
          </span>
        </div>
      </div>

      {/* About Section  */}
      <div className="bg-gray-800 p-4 rounded mb-6">
        <h2 className="font-semibold mb-2">About</h2>
        <p className="text-gray-300">
          {talent.bio || "No bio provided"}
        </p>
      </div>

      {/* Intro Video  */}
      {talent.introVideo && (
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="font-semibold mb-2">Intro Video</h2>
          <video controls className="w-full rounded">
            <source
              src={`http://localhost:5000/${talent.introVideo}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default TalentProfileView;










