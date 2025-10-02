import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTeams, fetchUsers } from "../api/project";

// const API_URL = "http://127.0.0.1:8000";
const API_URL = "https://teamflow-backend-yi6l.onrender.com/";


async function createProjectWithTasks(payload) {
  const res = await fetch(`${API_URL}/project_with_tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Creation failed");
  return result;
}

export default function CreateProjectTasks() {
  const nav = useNavigate();
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [teamId, setTeamId] = useState("");
  const [projName, setProjName] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    Promise.all([fetchTeams(), fetchUsers()]).then(([t, u]) => {
      setTeams(t);
      setUsers(u.filter((x) => !x.is_admin));
    });
  }, []);

  useEffect(() => {
    if (teamId) {
      const teamMembers = users.filter((u) =>
        teams.find((t) => t.id === Number(teamId))?.member_ids?.includes(u.id)
      );
      setRows(
        teamMembers.map((m) => ({
          user_id: m.id,
          task_title: "",
          task_desc: "",
        }))
      );
    } else setRows([]);
  }, [teamId, teams, users]);

  const updateRow = (idx, field, val) =>
    setRows((r) => r.map((row, i) => (i === idx ? { ...row, [field]: val } : row)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projName || !teamId || rows.some((r) => !r.task_title))
      return alert("Fill project name + every task title");
    setLoading(true);
    try {
      await createProjectWithTasks({
        name: projName,
        description: projDesc,
        team_id: Number(teamId),
        members: rows,
      });
      setMsg("✅ Project & tasks created!");
      setTimeout(() => nav("/admin"), 1200);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Project & Assign Tasks</h2>
      <p className="back-link" onClick={() => nav(-1)}>← Back to previous</p>

      {msg && <p className="success-message">{msg}</p>}

      <form onSubmit={handleSubmit} className="team-form">
        <div className="form-group">
          <label>Team</label>
          <select value={teamId} onChange={(e) => setTeamId(e.target.value)} required>
            <option value="" disabled>Select team</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Project Name</label>
          <input value={projName} onChange={(e) => setProjName(e.target.value)} required placeholder="Project name" />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input value={projDesc} onChange={(e) => setProjDesc(e.target.value)} placeholder="Optional" />
        </div>

        <div className="form-group">
          <label>Tasks per Member</label>
          <table className="teams-table" style={{ marginTop: 8 }}>
            <thead>
              <tr>
                <th>Member</th>
                <th>Task Title</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => {
                const u = users.find((x) => x.id === r.user_id);
                return (
                  <tr key={r.user_id}>
                    <td>{u?.name} {u?.role && `(${u.role})`}</td>
                    <td>
                      <input
                        value={r.task_title}
                        onChange={(e) => updateRow(idx, "task_title", e.target.value)}
                        required
                        placeholder="Title"
                      />
                    </td>
                    <td>
                      <input
                        value={r.task_desc}
                        onChange={(e) => updateRow(idx, "task_desc", e.target.value)}
                        placeholder="Optional"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Project & Assign Tasks"}
        </button>
      </form>
    </div>
  );
}


