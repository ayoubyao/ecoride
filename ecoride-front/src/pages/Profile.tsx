import { useEffect, useState } from "react";
import { getProfile } from "../services/userService";

interface Utilisateur {
  pseudo: string;
  email: string;
  credit: number;
}

export default function Profile() {
  const [user, setUser] = useState<Utilisateur | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Non connecté.");
      return;
    }

    getProfile(token)
      .then(setUser)
      .catch(() => setError("Impossible de charger le profil."));
  }, []);

  if (error) {
    return <div className="text-red-600 text-center mt-6">{error}</div>;
  }

  if (!user) {
    return <div className="text-center mt-6">Chargement...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Mon profil</h2>
      <p><strong>Pseudo :</strong> {user.pseudo}</p>
      <p><strong>Email :</strong> {user.email}</p>
      <p><strong>Crédits :</strong> {user.credit}</p>
    </div>
  );
}
