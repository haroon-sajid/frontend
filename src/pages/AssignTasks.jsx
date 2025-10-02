import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProjects, fetchUsers, fetchTeams } from "../api/project";

// const API_URL = "http://127.0.0.1:8000";
const API_URL = "https://teamflow-backend-yi6l.onrender.com/";


async function bulkCreateTasks(projectId, title, desc, userIds) {
  const res = await fetch(`${API_URL}/bulk_tasks/${projectId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description: desc, assigned_to: userIds }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Bulk assign failed");
  return result;
}

export default function AssignTasks() {
  const nav = useNavigate();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const teams = await fetchTeams();
        const lists = await Promise.all((teams || []).map((t) => fetchProjects(t.id)));
        setProjects(lists.flat());
        const u = await fetchUsers();
        setUsers((u || []).filter((x) => !x.is_admin));
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectId || !title || selected.length === 0)
      return alert("Please fill all fields and select at least one member");
    setLoading(true);
    try {
      await bulkCreateTasks(projectId, title, desc, selected);
      setMsg(`✅ Task assigned to ${selected.length} member(s)!`);
      setTitle("");
      setDesc("");
      setSelected([]);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <button className="back-btn" onClick={() => nav(-1)}>← Back</button>
      <h2>Assign Task to Team Members</h2>

      {msg && <p className="success-message">{msg}</p>}

      <form onSubmit={handleSubmit} className="team-form">
        <div className="form-group">
          <label>Project</label>
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)} required>
            <option value="" disabled>Select project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Task Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Title" />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Optional" />
        </div>

        <div className="form-group">
          <label>Pick Members</label>
          <div className="members-checkboxes">
            {users.map((u) => (
              <label key={u.id}>
                <input
                  type="checkbox"
                  checked={selected.includes(u.id)}
                  onChange={() => toggle(u.id)}
                />
                {u.name} {u.role && `- ${u.role}`}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Assigning..." : `Assign to ${selected.length} member(s)`}
        </button>
      </form>
    </div>
  );
}


