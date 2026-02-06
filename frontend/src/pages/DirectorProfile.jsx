



import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDirectorProfile } from "../services/api";
import Loader from "../Components/Loader";
import { CgProfile } from "react-icons/cg";

const DirectorProfile = () => {
  const { id } = useParams();
  const [director, setDirector] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDirector = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getDirectorProfile(id, token);
        setDirector(res.data);
      } catch (err) {
        setError("Could not load director profile");
      } finally {
        setLoading(false);
      }
    };

    fetchDirector();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  if (!director) return null;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-5 bg-gray-900 text-white rounded-lg min-h-screen">
      <div className="flex gap-4 items-center mb-5">
        <div className="w-20 h-20 rounded-full bg-gray-700 overflow-hidden">
          {director.avatar ? (
            <img
              src={`http://localhost:5000/${director.avatar}`}
              alt="director"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              <CgProfile />
            </div>
          )}
        </div>

        <div>
          <h1 className="text-xl font-bold">{director.name}</h1>
          <p className="text-gray-400">{director.email}</p>
          <span className="mt-1 bg-blue-500 px-2 py-1 rounded text-xs inline-block">
            Director
          </span>
        </div>
      </div>

      <div className="bg-gray-800 p-3 rounded">
        <h2 className="font-semibold mb-1">About</h2>
        <p className="text-gray-300">{director.bio || "No bio yet"}</p>
      </div>
    </div>
  );
};

export default DirectorProfile;
