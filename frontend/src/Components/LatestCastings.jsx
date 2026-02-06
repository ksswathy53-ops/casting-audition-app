
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../Components/Loader";

const LatestCastings = () => {
  const [castings, setCastings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCastings = async () => {
      try {
        setLoading(true);

        const response = await API.get("/castings");
        const allCastings = response.data || [];

        // show latst 3 cstgs
        const activeCastings = allCastings.filter(
          (casting) => casting.isActive
        );

        const latestThree = activeCastings.slice(0, 3);
        setCastings(latestThree);
      } catch (err) {
        console.log("Error while loading castings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCastings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader />
      </div>
    );
  }

  if (castings.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-400 min-h-64">
        No castings available.
      </p>
    );
  }

  return (
    <section className="mt-16">
      <h2 className="text-3xl font-semibold text-yellow-100 mb-8 text-center">
        Latest Castings
      </h2>

      <div className="grid gap-8 md:grid-cols-3">
        {castings.map((casting) => (
          <div
            key={casting._id}
            className="bg-zinc-800 rounded-lg p-6 hover:scale-105 transition-transform"
          >
            <h3 className="text-xl font-semibold text-white mb-2">
              {casting.title}
            </h3>

            <p className="text-zinc-400 mb-4 line-clamp-3">
              {casting.description}
            </p>

            {/* director info only for talent */}
            {user?.role === "talent" && casting.postedBy && (
              <div className="mt-2">
                <p className="text-yellow-200 font-semibold">
                  {casting.postedBy.name}
                </p>
                <p className="text-zinc-400 text-sm">
                  {casting.postedBy.email}
                </p>
              </div>
            )}

            <div className="mt-4">
              <Link
                to={`/castings/${casting._id}`}
                className="text-yellow-100 hover:text-blue-400"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/castings"
          className="border border-yellow-100 px-8 py-3 rounded-full text-yellow-100 hover:bg-zinc-800 hover:text-blue-500"
        >
          View All Castings
        </Link>
      </div>
    </section>
  );
};

export default LatestCastings;
