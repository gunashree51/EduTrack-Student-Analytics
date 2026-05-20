export const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
export async function apiCall(token, path, method = "GET", body = null) {
  const headers = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  if (res.status === 401 || res.status === 403) {
    throw new Error("UNAUTHORIZED");
  }
  return res;
}
export async function publicApi(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (res.status === 401 || res.status === 403) {
    throw new Error("UNAUTHORIZED");
  }
  return res;
}