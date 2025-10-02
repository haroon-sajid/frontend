const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function fetchMyTasks(userId) {
  const res = await fetch(`${API_URL}/member/tasks?user_id=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return await res.json();
}

export async function updateTaskStatus(taskId, status) {
  const res = await fetch(`${API_URL}/tasks/${taskId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Update failed");
  return result;
}

export async function fetchAllTasksAdmin() {
  const res = await fetch(`${API_URL}/admin/tasks`);
  if (!res.ok) throw new Error("Failed to fetch admin tasks");
  return await res.json();
}


