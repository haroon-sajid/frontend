const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";


export async function fetchUsers() {
  const res = await fetch(`${API_URL}/users_list`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return await res.json();
}

export async function fetchTeams() {
  const res = await fetch(`${API_URL}/teams_list`);
  if (!res.ok) throw new Error("Failed to fetch teams");
  return await res.json();
}

export async function createTeam(data) {
  const res = await fetch(`${API_URL}/create_team`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Failed to create team");
  return result;
}