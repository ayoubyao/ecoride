const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3010";

export async function getProfile(token: string) {
  const res = await fetch(`${API_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Erreur lors du chargement du profil");

  return res.json();
}
