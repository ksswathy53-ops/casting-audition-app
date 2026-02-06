
import { useEffect, useState, useRef } from "react";
import { getMyCastings, updateCasting } from "../services/api";
import CastingCard from "../Components/CastingCard";
import Loader from "../Components/Loader";
import { CiSearch } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";

const MyCastings = () => {
  const [castings, setCastings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCasting, setEditingCasting] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    roleType: "",
    location: "",
    auditionDate: "",
    updateNote: "",
  });

  const [search, setSearch] = useState("");
  const inputRef = useRef(null);

  const token = localStorage.getItem("token");

  // Fetch castings created by the director
  useEffect(() => {
    const fetchMyCastings = async () => {
      try {
        const res = await getMyCastings(token);
        //  Filter only active castings
        const activeCastings = res.data.filter((c) => c.isActive);
        setCastings(activeCastings);
      } catch (err) {
        setError("Failed to load your castings");
      } finally {
        setLoading(false);
      }
    };
    fetchMyCastings();
  }, [token]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Open edit modal
  const handleEdit = (casting) => {
    setEditingCasting(casting);
    setFormData({
      title: casting.title,
      description: casting.description,
      roleType: casting.roleType,
      location: casting.location,
      auditionDate: casting.auditionDate?.slice(0, 10) || "",
      updateNote: casting.updateNote || "",
    });
  };

  // Input change 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update casting
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingCasting) return;

    try {
      await updateCasting(editingCasting._id, formData, token);
      alert("Casting updated successfully");
      setEditingCasting(null);

      const freshCastings = await getMyCastings(token);
      const activeCastings = freshCastings.data.filter((c) => c.isActive);
      setCastings(activeCastings);
    } catch (err) {
      console.error(err);
      alert("Failed to update casting");
    }
  };

  // Fltr casts based on sarch
  const filteredCastings = castings.filter(
    (casting) =>
      casting.title.toLowerCase().includes(search.toLowerCase()) ||
      casting.location.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-red-500 min-h-screen">{error}</p>
    );

  if (castings.length === 0)
    return (
      <p className="text-center mt-10 text-gray-600 min-h-screen text-2xl">
        You haven't posted any castings yet
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      <h1 className="text-3xl text-white font-bold mb-8 text-center">
        My Castings
      </h1>

      {/* Search box */}
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

      {filteredCastings.length === 0 && (
        <p className="text-center text-gray-400 mt-6 text-lg">
          No castings found
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCastings.map((casting) => (
          <CastingCard
            key={casting._id}
            casting={casting}
            showDelete
            showEdit
            onEdit={() => handleEdit(casting)}
          />
        ))}
      </div>

      {/* Edit Modal */}
      {editingCasting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-lg w-full max-w-lg text-white">
            <h2 className="text-2xl font-bold mb-4">Edit Casting</h2>

            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 rounded bg-zinc-800"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 rounded bg-zinc-800"
                required
              />
              <input
                type="text"
                name="roleType"
                placeholder="Role Type"
                value={formData.roleType}
                onChange={handleChange}
                className="w-full p-2 rounded bg-zinc-800"
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 rounded bg-zinc-800"
                required
              />
              <input
                type="date"
                name="auditionDate"
                value={formData.auditionDate}
                onChange={handleChange}
                className="w-full p-2 rounded bg-zinc-800"
                required
              />
              <textarea
                name="updateNote"
                placeholder="Note for talents (shown to applicants)"
                value={formData.updateNote}
                onChange={handleChange}
                className="w-full p-2 rounded bg-zinc-800 border border-yellow-500"
              />

              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setEditingCasting(null)}
                  className="px-4 py-2 rounded bg-red-500 hover:bg-red-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-500 hover:bg-green-600"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCastings;







