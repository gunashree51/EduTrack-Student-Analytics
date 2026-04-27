export const BASE = import.meta.env.VITE_API_URL + "/api";

export async function apiCall(token, path, method = "GET", body = null) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (res.status === 401) throw new Error("UNAUTHORIZED");
  return res;
}

export async function publicApi(path, body) {
  return fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
