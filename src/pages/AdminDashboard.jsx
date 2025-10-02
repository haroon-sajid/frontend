import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsers, fetchTeams, createTeam } from "../api/admin";
import { fetchProjects } from "../api/project";
import { fetchAllTasksAdmin } from "../api/task";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [teamDesc, setTeamDesc] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [tasks, setTasks] = useState([]);

// Fetch users, teams, and projects on mount
useEffect(() => {
  async function loadData() {
    try {
      const [allUsers, allTeams, allTasks] = await Promise.all([
        fetchUsers(),
        fetchTeams(),
        fetchAllTasksAdmin(),
      ]);
      setUsers(allUsers);
      setTeams(allTeams);
      setTasks(allTasks);

      // fetch projects across all teams
      const lists = await Promise.all((allTeams || []).map((t) => fetchProjects(t.id)));
      setProjects(lists.flat());
    } catch (err) {
      console.error(err);
    }
  }
  loadData();
}, []);


  const handleMemberToggle = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]
    );
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamName || selectedMembers.length === 0) {
      alert("Please enter team name and select at least one member.");
      return;
    }

    setLoading(true);
    try {
      const newTeam = await createTeam({
        name: teamName,
        description: teamDesc,
        member_ids: selectedMembers,
      });
      setMessage(`Team "${newTeam.name}" created successfully!`);
      setTeamName("");
      setTeamDesc("");
      setSelectedMembers([]);
      const updatedTeams = await fetchTeams();
      setTeams(updatedTeams);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  // Convert member IDs to names for display
  const getMemberNames = (ids) =>
    ids
      .map((id) => {
        const user = users.find((u) => u.id === id);
        return user ? user.name : `ID:${id}`;
      })
      .join(", ");

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Admin Dashboard – Team Management</h1>
        {message && <p className="success-message">{message}</p>}
      </div>

      <div className="dashboard-content">
      {/* Create Team Form */}
      <form onSubmit={handleCreateTeam} className="team-form">
        <div className="form-group">
          <label>Team Name:</label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
            placeholder="Enter team name"
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            value={teamDesc}
            onChange={(e) => setTeamDesc(e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div className="form-group">
          <label>Select Members:</label>
          <div className="members-checkboxes" style={{ maxHeight: 160, overflowY: "auto" }}>
            {users.length === 0 ? (
              <p>Loading members…</p>
            ) : (
              users
                .filter((u) => !u.is_admin)
                .map((u) => (
                <label key={u.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(u.id)}
                    onChange={() =>
                      setSelectedMembers((prev) =>
                        prev.includes(u.id)
                          ? prev.filter((id) => id !== u.id)
                          : [...prev, u.id]
                      )
                    }
                  />
                  {u.name} ({u.email}) {u.role && `- ${u.role}`}
                </label>
                ))
            )}
          </div>
        </div>

        <button type="submit">Create Team</button>
        <div style={{ marginTop: 20 }}>
          <button type="button" onClick={() => navigate("/create-project-tasks")}>
            Create Project & Assign Tasks
          </button>
        </div>
      </form>

      {/* Teams Table */}
      <h3>Current Teams</h3>
      {teams.length === 0 ? (
        <p>No teams yet</p>
      ) : (
        <table className="teams-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Created By</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id}>
                <td>{team.id}</td>
                <td>{team.name}</td>
                <td>{team.description || "-"}</td>
                <td>{team.created_by_name}</td>
                <td>{getMemberNames(team.member_ids)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Current Projects</h3>
      {projects.length === 0 ? (
        <p>No projects yet</p>
      ) : (
        <table className="teams-table">
          <thead><tr><th>ID</th><th>Name</th><th>Team</th></tr></thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}><td>{p.id}</td><td>{p.name}</td><td>{p.team_id}</td></tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>All Tasks Status</h3>
      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <table className="teams-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Team</th>
              <th>Member</th>
              <th>Task</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id}>
                <td>{t.project_name}</td>
                <td>{t.team_name}</td>
                <td>{t.member_name}</td>
                <td>{t.title}</td>
                <td>{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>
    </div>
  );
}
