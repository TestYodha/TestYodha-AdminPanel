import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../components/FeatureCard.css";
import { useThemeMode } from "../contexts/ThemeContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { darkMode } = useThemeMode();
  const location = useLocation();

  const features = [
    { title: "Test Series Upload", description: "Upload test series data", icon: "📚", path: "/upload-test" },
    { title: "PYQ Upload", description: "Upload previous year questions", icon: "📖", path: "/upload-pyq" },
    { title: "Materials Upload", description: "Upload study materials", icon: "📄", path: "/upload-materials" },
    { title: "Results & Leaderboard", description: "View results and rankings", icon: "🏆", path: "/leaderboard" },
    { title: "Create Plan", description: "Add new subscription plans", icon: "📝", path: "/create-plan" },
    { title: "Add Course", description: "Add new course categories", icon: "➕", path: "/add-course" },
    { title: "Assign Subscription", description: "Assign plans to users", icon: "🎫", path: "/assign-subscription" },
    { title: "Withdrawal Requests", description: "Manage user withdrawal requests", icon: "💸", path: "/withdrawal-requests" },
    { title: "Carousel Manager", description: "Manage homepage banner images", icon: "🖼️", path: "/carousel-manager" },

    // ✅ NEW
    { title: "Coupons", description: "Create & manage discount coupons", icon: "🏷️", path: "/coupons" },
  ];

  useEffect(() => {
    const handlePopState = () => {
      if (location.pathname === "/dashboard") {
        window.history.pushState(null, null, window.location.pathname);
      }
    };
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [location]);

  return (
    <div style={{ padding: "190px 20px 20px" , marginTop: "250px"}}>
      <h1 style={{ textAlign: "center", margin: "20px 0", color: darkMode ? "#fff" : "#000" }}>
        Admin Dashboard
      </h1>

      <div className="dashboard-grid">
        {features.map((feature, index) => (
          <div
            key={index}
            className="feature-card"
            style={{
              backgroundColor: darkMode ? "#1e1e1e" : "#f9f9f9",
              color: darkMode ? "#fff" : "#000",
              cursor: "pointer",
              transition: "all 0.3s ease-in-out",
            }}
            onClick={() => navigate(feature.path)}
          >
            <div className="icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
