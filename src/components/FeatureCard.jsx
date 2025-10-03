import React from "react";
import "./FeatureCard.css";

const FeatureCard = ({ title, desc, icon, onClick }) => {
  return (
    <div className="feature-card" onClick={onClick}>
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
};

export default FeatureCard;
