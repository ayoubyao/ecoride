import axios from "axios";
import { config } from "./config";

const apiUrl = config.API_URL;

export async function creerVoyage(data: any) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/covoiturages/creer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur lors de la création");
  return res.json();
}

export async function getVehicules(utilisateurId: number) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vehicules/utilisateur/${utilisateurId}`);
  return res.json();
}
