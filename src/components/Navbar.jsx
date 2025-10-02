import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  return (
    <header className="main-header">
      <div className="header-left">
        <Link to="/" className="logo">TeamFlow</Link>
      </div>

      <nav className="header-nav">
        {user ? (
          <>
            <Link to={user.is_admin ? "/admin" : "/member"} className="nav-link">Dashboard</Link>
            <button className="nav-btn" onClick={() => { logout(); nav("/"); }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/signup" className="nav-link">Sign Up</Link>
            <Link to="/login" className="nav-link">Login</Link>
          </>
        )}
      </nav>
    </header>
  );
}
