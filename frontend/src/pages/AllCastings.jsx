




import { useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAllCastings } from "../services/api";
import CastingCard from "../Components/CastingCard";
import Loader from "../Components/Loader";
import { CiSearch } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";

const AllCastings = () => {
  const { user } = useAuth();

  const [castings, setCastings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef(null);

  // redirect director to their  castings
  if (user && user.role === "director") {
    return <Navigate to="/my-castings" replace />;
  }

  const loadCastings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllCastings(search);
      const allCastings = response?.data || [];

      const activeOnly = allCastings.filter(
        (casting) => casting.isActive
      );

      setCastings(activeOnly);
    } catch (err) {
      console.log("Failed to load castings");
      console.error(err);
      setError("Something went wrong while loading castings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      loadCastings();
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  if (loading && castings.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      {/* heading */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white">
          Browse Castings
        </h1>
        <p className="text-gray-400 mt-3">
          Explore auditions and casting calls
        </p>
      </div>

      {/* serach */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-xl">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by title or location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-11 py-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none"
          />

          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <CiSearch />
          </span>

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <IoMdClose />
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="text-center text-red-400 mb-6">
          {error}
        </p>
      )}

      {!loading && castings.length === 0 && !error && (
        <p className="text-center text-gray-400 mt-16">
          No castings found
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {castings.map((casting) => (
          <CastingCard
            key={casting._id}
            casting={casting}
          />
        ))}
      </div>
    </div>
  );
};

export default AllCastings;
