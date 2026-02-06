


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCasting } from "../services/api";
import Loader from "../Components/Loader"; 

const CreateCasting = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    roleType: "",
    location: "",
    auditionDate: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      await createCasting(form, token);
      alert("Casting created!");
      navigate("/castings");
    } catch (err) {
      console.log("Error creating casting:", err);
      alert(err.response?.data?.message || "Could not create casting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex justify-center items-center">
      <div className="w-full max-w-xl bg-zinc-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-5 text-center text-yellow-100">
          New Casting
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-zinc-700"
            placeholder="Title"
            required
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 rounded bg-zinc-700"
            rows="4"
            placeholder="Description"
            required
          />

          <input
            type="text"
            name="roleType"
            value={form.roleType}
            onChange={handleChange}
            className="w-full p-2 rounded bg-zinc-700"
            placeholder="Actor / Model / Voice Artist"
            required
          />

          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-2 rounded bg-zinc-700"
            placeholder="Location"
            required
          />

          <input
            type="date"
            name="auditionDate"
            value={form.auditionDate}
            onChange={handleChange}
            className="w-full p-2 rounded bg-zinc-700"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded text-white flex justify-center items-center"
          >
            {loading ? <Loader /> : "Create Casting"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCasting;
