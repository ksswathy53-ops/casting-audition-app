





import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../Components/Loader"; 

const Hero = () => {
  const { user, loading } = useAuth(); 

  // if  data is  loading, show loader cmpt
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-120px)]">
        <Loader />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col md:flex-row items-center justify-center overflow-hidden"
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      {/* Left Content */}
      <div className="w-full mb-12 md:mb-0 lg:w-3/6 flex flex-col items-center md:items-center lg:items-start justify-center px-4">
        <h1 className="text-4xl lg:text-6xl font-bold text-yellow-100 text-center lg:text-left leading-tight">
          Discover Talent. <br />
          Launch Careers.
        </h1>

        <p className="mt-6 text-lg lg:text-xl text-zinc-300 text-center lg:text-left max-w-xl">
          A professional platform connecting talented artists with directors
          and casting professionals. Apply for castings or create auditions —
          all in one place.
        </p>

        {/*  Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          {!user && (
            <>
              <Link
                to="/signup"
                className="text-black bg-yellow-100 text-lg font-semibold px-8 py-3 rounded-full hover:bg-yellow-200 transition text-center"
              >
                Join Now
              </Link>
              <Link
                to="/castings"
                className="text-yellow-100 text-lg font-semibold border border-yellow-100 px-8 py-3 rounded-full hover:bg-zinc-800 transition"
              >
                Explore Castings
              </Link>
            </>
          )}

          {user?.role === "talent" && (
            <Link
              to="/castings"
              className="text-black bg-yellow-100 text-lg font-semibold px-8 py-3 rounded-full hover:bg-yellow-200 transition"
            >
              View Castings
            </Link>
          )}

          {user?.role === "director" && (
            <Link
              to="/create-casting"
              className="text-black bg-yellow-100 text-lg font-semibold px-8 py-3 rounded-full hover:bg-yellow-200 transition"
            >
              Create Casting
            </Link>
          )}
        </div>
      </div>

      {/* Right Image */}
      <div className="w-full lg:w-3/6 flex items-center justify-center overflow-hidden px-4">
        <img
          src="/hero1.jpg"
          alt="Casting Audition"
          className="w-full h-auto object-cover rounded-xl shadow-lg"
        />
      </div>
    </div>
  );
};

export default Hero;
