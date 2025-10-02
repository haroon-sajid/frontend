const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function fetchProjects(teamId) {
  const res = await fetch(`${API_URL}/projects?team_id=${teamId}`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return await res.json();
}

export async function createProject(data) {
  const res = await fetch(`${API_URL}/create_project`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Failed to create project");
  return result;
}

export async function createTask(projectId, data) {
  const res = await fetch(`${API_URL}/create_task?project_id=${projectId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Failed to create task");
  return result;
}

export async function fetchTasks(userId = null, projectId = null) {
  const us = userId ? `user_id=${userId}` : "";
  const ps = projectId ? `project_id=${projectId}` : "";
  const sep = us && ps ? "&" : "";
  const res = await fetch(`${API_URL}/tasks?${us}${sep}${ps}`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return await res.json();
}

// Convenience re-exports from admin.js for pages that import from project.js
export { fetchTeams, fetchUsers } from "./admin.js";


