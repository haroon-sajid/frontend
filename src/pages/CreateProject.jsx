import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTeams, createProject } from "../api/project";

export default function CreateProject() {
  const nav = useNavigate();
  const [teams, setTeams] = useState([]);
  const [teamId, setTeamId] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchTeams().then(setTeams).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamId || !name) return alert("Team & name required");
    setLoading(true);
    try {
      await createProject({ name, description: desc, team_id: Number(teamId) });
      setMsg("Project created!");
      setName("");
      setDesc("");
      setTeamId("");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <button className="back-btn" onClick={() => nav(-1)}>← Back</button>
      <h2>Create Project</h2>
      {msg && <p className="success-message">{msg}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select Team</label>
          <select value={teamId} onChange={(e) => setTeamId(e.target.value)} required>
            <option value="" disabled>Choose team</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Project Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Project name" />
        </div>

        <div>
          <label>Description</label>
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Optional" />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}


