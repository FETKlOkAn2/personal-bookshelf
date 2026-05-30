const BASE = "http://localhost:8000";

export async function getBooks(status) {
  const url = status ? `${BASE}/books?status=${status}` : `${BASE}/books`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export async function createBook(data) {
  const res = await fetch(`${BASE}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create book");
  return res.json();
}

export async function updateStatus(id, status) {
  const res = await fetch(`${BASE}/books/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}

export async function deleteBook(id) {
  const res = await fetch(`${BASE}/books/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete book");
}