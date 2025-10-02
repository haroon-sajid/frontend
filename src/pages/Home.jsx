import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">

      {/* ====== Hero Section ====== */}
      <section className="hero" id="hero">
        <h1>Collaborate. Plan. Succeed.</h1>
        <p>
          TeamFlow is a powerful Kanban-based collaboration platform that helps
          teams organize tasks, streamline workflows, and deliver projects faster.
        </p>
        <div className="cta-buttons">
          <Link to="/signup"><button className="primary-btn">Get Started</button></Link>
          <Link to="/login"><button className="secondary-btn">Login</button></Link>
        </div>
      </section>

      {/* ====== About Section ====== */}
      <section className="about" id="about">
        <h2>About TeamFlow</h2>
        <p>
          Whether you're managing a small project or scaling company-wide initiatives,
          TeamFlow keeps your team aligned and productive. Built around the power of 
          Kanban, it makes task management visual, collaborative, and efficient.
        </p>
      </section>

      {/* ====== Features Section ====== */}
      <section className="features" id="features">
        <h2>Key Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Kanban Boards</h3>
            <p>Organize tasks visually and track project progress with an intuitive drag-and-drop board.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Real-Time Collaboration</h3>
            <p>Work together seamlessly, share updates instantly, and stay aligned across your entire team.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Project Analytics</h3>
            <p>Gain valuable insights with dashboards, reports, and key metrics to guide your team decisions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3>Smart Notifications</h3>
            <p>Never miss an update with real-time alerts, reminders, and custom notifications.</p>
          </div>
        </div>
      </section>

      {/* ====== Call to Action ====== */}
      <section className="cta-footer">
        <h2>Start Managing Projects the Smart Way 🚀</h2>
        <p>Join hundreds of teams already using TeamFlow to boost their productivity.</p>
        <div className="cta-buttons">
          <Link to="/signup"><button className="primary-btn">Sign Up Free</button></Link>
          <Link to="/login"><button className="secondary-btn">Login</button></Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
