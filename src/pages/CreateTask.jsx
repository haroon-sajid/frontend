import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchProjects, createTask, fetchUsers, fetchTeams } from "../api/project";

export default function CreateTask() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project_id");
  const nav = useNavigate();

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [assignee, setAssignee] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const teams = await fetchTeams();
        const lists = await Promise.all(
          (teams || []).map((t) => fetchProjects(t.id))
        );
        setProjects(lists.flat());
        const u = await fetchUsers();
        setUsers((u || []).filter((x) => !x.is_admin));
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectId || !title || !assignee) return alert("All fields required");
    setLoading(true);
    try {
      await createTask(projectId, { title, description: desc, assigned_to: Number(assignee) });
      setMsg("Task created & assigned!");
      setTitle("");
      setDesc("");
      setAssignee("");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <button className="back-btn" onClick={() => nav(-1)}>← Back</button>
      <h2>Create Task</h2>
      {msg && <p className="success-message">{msg}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Project</label>
          <select value={projectId || ""} onChange={(e) => (window.location = `?project_id=${e.target.value}`)} required>
            <option value="" disabled>Choose project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Task Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Title" />
        </div>

        <div>
          <label>Description</label>
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Optional" />
        </div>

        <div>
          <label>Assign To</label>
          <select value={assignee} onChange={(e) => setAssignee(e.target.value)} required>
            <option value="" disabled>Choose member</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name} ({u.role || "Member"})</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
}


