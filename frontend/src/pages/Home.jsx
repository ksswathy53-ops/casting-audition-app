




import Hero from "../Components/Hero";
import LatestCastings from "../Components/LatestCastings";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-zinc-900 text-white px-10 py-8 min-h-screen">
      <Hero />

      {/*  latest castings only to talents */}
      {user?.role === "talent" && <LatestCastings />}
    </div>
  );
};

export default Home;
