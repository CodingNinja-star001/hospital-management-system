import React, { useState } from "react";
import "./App.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    // Dummy login (no backend auth yet)
    onLogin("User");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">🏥</div>
        <h1>Hospital Management System</h1>
        <p className="login-subtitle">Login to continue</p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login-btn admin-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;