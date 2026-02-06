
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { FaGripLines } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const [mobileNav, setMobileNav] = useState(false);

  // prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileNav) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileNav]);

  if (loading) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileNav(false);
  };

  const talentLinks = [
    { name: "All Castings", path: "/castings" },
    { name: "My Applications", path: "/my-applications" },
    { name: "Profile", path: "/profile" },
  ];

  const directorLinks = [
    { name: "Create Casting", path: "/create-casting" },
    { name: "My Castings", path: "/my-castings" },
    { name: "Profile", path: "/profile" },
  ];

  const linksToShow =
    user && user.role === "talent" ? talentLinks : directorLinks;

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center relative">
      <h1 className="font-bold text-lg lg:text-2xl">
        <Link to="/">Castique</Link>
      </h1>

      {/* Desktop menu */}
      <ul className="hidden md:flex gap-4 items-center">
        <li>
          <Link to="/">Home</Link>
        </li>

        {!user && (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>
        )}

        {user &&
          linksToShow.map((link) => (
            <li key={link.path}>
              <Link to={link.path}>{link.name}</Link>
            </li>
          ))}

        {user && (
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </li>
        )}
      </ul>

      {/* Mobile menu button */}
      <button
        className="block md:hidden text-2xl"
        onClick={() => setMobileNav(!mobileNav)}
      >
        <FaGripLines />
      </button>

      {/* Mobile menu */}
      {mobileNav && (
        <div className="absolute top-full left-0 w-full bg-black flex flex-col items-center gap-10 py-10 z-50 md:hidden min-h-screen text-2xl">
          <Link to="/" onClick={() => setMobileNav(false)}>
            Home
          </Link>

          {!user && (
            <>
              <Link to="/login" onClick={() => setMobileNav(false)}>
                Login
              </Link>
              <Link to="/signup" onClick={() => setMobileNav(false)}>
                Signup
              </Link>
            </>
          )}

          {user &&
            linksToShow.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileNav(false)}
              >
                {link.name}
              </Link>
            ))}

          {user && (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-1 rounded"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
