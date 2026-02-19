// src/api/groups.js
// const API_URL = "http://localhost:8000/groups";
// const API_URL = "http://10.204.191.97:5173/groups";
// const API_URL = "http://192.168.1.42:8000/groups";
// const API_URL =
// "https://unlucent-averie-unprecipitantly.ngrok-free.dev /groups";
const API_URL = `${import.meta.env.VITE_API_URL}/groups`;

export const getUserGroups = async (token) => {
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true", // bypass header
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch groups");
  }
  return response.json();
};

export const createGroup = async (name, token) => {
  const response = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to create group");
  }
  return response.json();
};

export const joinGroup = async (joinCode, token) => {
  const response = await fetch(`${API_URL}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ join_code: joinCode }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to join group");
  }
  return response.json();
};

export const sendInviteEmail = async (email, joinCode, token) => {
  const response = await fetch(`${API_URL}/invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, join_code: joinCode }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to send invite");
  }
  return response.json();
};
export const getGroupMessages = async (groupId, token) => {
  const response = await fetch(`${API_URL}/${groupId}/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch messages");
  }
  return response.json();
};
