

import { Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import ProtectedRoute from "./Components/ProtectedRoute";
import Footer from "./Components/Footer";

import { AuthProvider } from "./contexts/AuthContext";

// pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import AllCastings from "./pages/AllCastings";
import CreateCasting from "./pages/CreateCasting";
import Profile from "./pages/Profile";
import MyApplications from "./pages/MyApplications";
import TalentProfileView from "./pages/TalentProfileView";
import IncomingApplications from "./pages/IncomingApplications";
import CastingDetails from "./pages/CastingDetails";
import ForgotPassword from "./pages/ForgotPassword";
import MyCastings from "./pages/MyCastings";
import DirectorProfile from "./pages/DirectorProfile";

function App() {
  return (
    <AuthProvider>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/*  (Talent + Director) */}
        <Route
          path="/castings"
          element={
            <ProtectedRoute allowedRoles={["talent", "director"]}>
              <AllCastings />
            </ProtectedRoute>
          }
        />

        {/* Talent only */}
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute allowedRoles={["talent"]}>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        {/* Talent only */}

        <Route
          path="/director/:id"
          element={
            <ProtectedRoute allowedRoles={["talent"]}>
              <DirectorProfile />
            </ProtectedRoute>
          }
        />


        {/* Director only */}
        <Route
          path="/my-castings"  
          element={
            <ProtectedRoute allowedRoles={["director"]}>
              <MyCastings />
            </ProtectedRoute>
          }
        />


        {/* Director only */}
        <Route
          path="/create-casting"
          element={
            <ProtectedRoute allowedRoles={["director"]}>
              <CreateCasting />
            </ProtectedRoute>
          }
        />

        {/* Any logged-in user */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/castings/:id"
          element={
            <ProtectedRoute>
              <CastingDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/talent/:talentId"
          element={
            <ProtectedRoute allowedRoles={["director"]}>
              <TalentProfileView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/incoming-applications/:castingId"
          element={
            <ProtectedRoute allowedRoles={["director"]}>
              <IncomingApplications />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </AuthProvider>
  );
}

export default App;


