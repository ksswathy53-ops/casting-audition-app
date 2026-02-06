
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CgProfile } from "react-icons/cg";
import Loader from "../Components/Loader";
import { useEffect, useState } from "react";
import { deleteCasting } from "../services/api";

const CastingCard = ({
  casting,
  showDelete = false,
  showEdit = false,
  onEdit,
}) => {
  const { user } = useAuth();

  const [isAvatarLoading, setIsAvatarLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // load  avatar dirctr
  useEffect(() => {
    if (!casting?.postedBy?.avatar) {
      setIsAvatarLoading(false);
      return;
    }

    const image = new Image();
    image.src = `http://localhost:5000/${casting.postedBy.avatar}`;

    image.onload = () => setIsAvatarLoading(false);
    image.onerror = () => setIsAvatarLoading(false);
  }, [casting]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this casting? All applications will be removed."
    );

    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      await deleteCasting(casting._id, token);
      alert("Casting deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to delete casting");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-zinc-800 p-4 rounded-lg shadow hover:scale-105 transition-transform">
      <h2 className="text-xl font-semibold text-yellow-300">
        {casting.title}
      </h2>

      <p className="text-zinc-400 mt-2">
        {casting.description && casting.description.length > 80
          ? casting.description.substring(0, 80) + "..."
          : casting.description}
      </p>

      <p className="text-zinc-500 mt-1">Role: {casting.roleType}</p>
      <p className="text-zinc-500">Location: {casting.location}</p>

      {/* director info  visible only for talent */}
      {user?.role === "talent" && casting.postedBy && (
        <div className="mt-3 flex items-center gap-3 p-2 bg-zinc-700 rounded">
          {isAvatarLoading ? (
            <div className="w-10 h-10 flex items-center justify-center">
              <Loader />
            </div>
          ) : casting.postedBy.avatar ? (
            <img
              src={`http://localhost:5000/${casting.postedBy.avatar}`}
              alt={casting.postedBy.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
              <CgProfile className="w-8 h-8 text-white" />
            </div>
          )}

          <div>
            <p className="text-white font-semibold">
              {casting.postedBy.name}
            </p>
            <p className="text-zinc-400 text-sm">
              {casting.postedBy.email}
            </p>
          </div>
        </div>
      )}

      {/* actions */}
      <div className="mt-3 flex justify-between items-center">
        <Link
          to={`/castings/${casting._id}`}
          className="text-blue-400 hover:underline"
        >
          View Details
        </Link>

        <div className="flex gap-2">
          {showDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-60"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}

          {showEdit && (
            <button
              onClick={() => onEdit(casting)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CastingCard;

