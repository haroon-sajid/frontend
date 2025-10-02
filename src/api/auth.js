// src/api/auth.js
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function signupUser(data) {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.detail || "Signup failed");
  }
  return result;
}

export async function loginUser(data) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.detail || "Login failed");
  }
  return result;
}
