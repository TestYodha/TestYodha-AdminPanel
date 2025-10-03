import React from "react";
import { useNavigate } from "react-router-dom";
import { useThemeMode } from "../contexts/ThemeContext";
import "../components/FeatureCard.css";

const TestSeriesManagement = () => {
  const navigate = useNavigate();
  const { darkMode } = useThemeMode();

  const actions = [
    { title: "Upload New Test Series", desc: "Add a new test series", icon: "➕", path: "/upload-test" },
    { title: "View Uploaded Test Series", desc: "See all uploaded tests", icon: "📂", path: "/view-tests" },
    { title: "Delete Test Series", desc: "Remove test series from DB", icon: "🗑️", path: "/delete-test" },
    { title: "Update Test Series", desc: "Edit existing test series", icon: "🔄", path: "/update-test" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", margin: "20px 0", color: darkMode ? "#fff" : "#000" }}>Test Series Management</h1>
      <div className="dashboard-grid">
        {actions.map((action, index) => (
          <div
            key={index}
            className="feature-card"
            style={{
              backgroundColor: darkMode ? "#1e1e1e" : "#f9f9f9",
              color: darkMode ? "#fff" : "#000",
              cursor: "pointer",
            }}
            onClick={() => navigate(action.path)}
          >
            <div className="icon">{action.icon}</div>
            <h3>{action.title}</h3>
            <p>{action.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestSeriesManagement;
