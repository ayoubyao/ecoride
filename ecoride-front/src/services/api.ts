import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3010";

export async function creerVoyage(data: {
  utilisateurId: number;
  adresse_depart: string;
  adresse_arrivee: string;
  prix: number;
  vehicule_id: number;
}) {
  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL;

  const res = await fetch(`${apiUrl}/api/covoiturages/creer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  return res.json();
  
}

export async function getVehicules(utilisateurId: number) {
  const res = await fetch(`${API_URL}/api/vehicules/utilisateur/${utilisateurId}`);
  return res.json();
}
