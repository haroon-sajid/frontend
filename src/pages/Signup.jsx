import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signupUser } from "../api/auth";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    is_admin: false,
  });

  const [role, setRole] = useState("");
  const roleChoices = ["Software Engineer", "ML Engineer", "Backend Developer", "Frontend Developer", "DevOps", "QA Engineer"];

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "radio") {
      setForm({ ...form, is_admin: value === "admin" });
      if (value === "admin") setRole(""); // reset role if admin
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const data = await signupUser({ ...form, role: form.is_admin ? null : role });
      setMessage(`Signup successful! Welcome, ${data.name}`);
      setForm({ name: "", email: "", password: "", is_admin: false });
      setRole("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />
        </div>
        <div>
          <label>User Type:</label>
          <div className="radio-group">
            <label>
              <input type="radio" name="userType" value="member" checked={!form.is_admin} onChange={handleChange} /> Member
            </label>
            <label>
              <input type="radio" name="userType" value="admin" checked={form.is_admin} onChange={handleChange} /> Admin
            </label>
          </div>
        </div>

        {/* Role dropdown added here */}
        {!form.is_admin && (
          <div>
            <label>Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="" disabled>Select your role</option>
              {roleChoices.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        )}

        <button type="submit">Signup</button>
      </form>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
      <Link to="/" className="back-link">← Back to Home</Link>
    </div>
  );
}
