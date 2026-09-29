const BASE = "http://localhost:8000";
// const BASE = "http://192.168.1.42:8000";
// const BASE = "https://unlucent-averie-unprecipitantly.ngrok-free.dev";
// const BASE = import.meta.env.VITE_API_URL;
console.log(BASE);
export async function login({ email, password }) {
  console.log("Sending login:", email, password);

  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  console.log("Response status:", res.status);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Login failed");
  }
  const data = await res.json();

  console.log(data); // Now you can log it safely
  return data;
}

export async function signup({ full_name, email, password, tags }) {
  const res = await fetch(`${BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ full_name, email, password, tags }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Signup failed");
  }
  return res.json();
}

export async function getCurrentUser(token) {
  const res = await fetch(`${BASE}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true", //  bypass header
    },
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json(); // { user: { sub: full_name, exp: ... } }
}

export async function updateProfile(token, { full_name, email, password }) {
  const res = await fetch(`${BASE}/auth/update-profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({
      full_name: full_name,
      email: email,
      password: password || undefined,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Update failed");
  }

  return data;
}
