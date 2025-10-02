import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyTasks, updateTaskStatus } from "../api/task";

const COLUMNS = {
  "To-Do": [],
  "In Progress": [],
  Completed: [],
};

export default function MemberDashboard() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [columns, setColumns] = useState(COLUMNS);

  // SAFELY load user
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return nav("/login");
    try {
      const u = JSON.parse(raw);
      if (!u?.id) throw new Error("bad user");
      setUser(u);
    } catch {
      nav("/login");
    }
  }, [nav]);

  // load tasks only when user is ready
  useEffect(() => {
    if (!user) return;
    fetchMyTasks(user.id)
      .then((tasks) => {
        const map = { ...COLUMNS };
        tasks.forEach((t) => map[t.status].push(t));
        setColumns(map);
      })
      .catch((err) => {
        console.error(err);
        alert("Could not load tasks");
      });
  }, [user]);

  const change = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      // move card locally
      setColumns((prev) => {
        const next = { ...prev };
        // remove from old column
        for (const col of Object.keys(next)) {
          const idx = next[col].findIndex((t) => t.id === taskId);
          if (idx !== -1) {
            const [task] = next[col].splice(idx, 1);
            task.status = newStatus;
            next[newStatus].push(task);
            break;
          }
        }
        return next;
      });
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user) return null; // redirecting

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome, {user.name}</h1>
        <p className="subtitle">Role: {user.role || "Member"}</p>
      </div>

      <div className="kanban-board">
        {Object.entries(columns).map(([status, list]) => (
          <div className="kanban-column" key={status}>
            <h3 className="column-title">
              {status} <span className="count">{list.length}</span>
            </h3>
            <div className="column-cards">
              {list.map((t) => (
                <div className="task-card" key={t.id}>
                  <div className="card-project">{t.project_name}</div>
                  <div className="card-title">{t.title}</div>
                  <div className="card-desc">{t.description || "-"}</div>
                  <select
                    className="status-select"
                    value={t.status}
                    onChange={(e) => change(t.id, e.target.value)}
                  >
                    {Object.keys(COLUMNS).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              ))}
              {list.length === 0 && (
                <div className="empty-card">No tasks</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

