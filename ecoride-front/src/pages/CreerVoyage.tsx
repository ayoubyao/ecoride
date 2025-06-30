import { useEffect, useState } from "react";
import { creerVoyage, getVehicules } from "../services/api";

export default function CreerVoyagePage() {
  const [form, setForm] = useState({
    lieu_depart: "",
    lieu_arrivee: "",
    date_depart: "",
    heure_depart: "",
    date_arrivee: "",
    heure_arrivee: "",
    nb_place: 1,
    prix_personne: 5,
    voiture_id: "",
  });

  const [vehicules, setVehicules] = useState([]);
  const [message, setMessage] = useState("");

  const utilisateurId = localStorage.getItem("userId");

  useEffect(() => {
    if (utilisateurId) {
      getVehicules(+utilisateurId).then(setVehicules).catch(console.error);
    }
  }, [utilisateurId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await creerVoyage({ ...form, utilisateurId: +utilisateurId! });
      setMessage("✅ Voyage créé avec succès !");
    } catch (err: any) {
      setMessage("❌ Erreur : " + err.message);
    }
  };

   (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Saisir un nouveau voyage</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="lieu_depart" placeholder="Lieu de départ" onChange={handleChange} className="input" required />
        <input name="lieu_arrivee" placeholder="Lieu d’arrivée" onChange={handleChange} className="input" required />

        <div className="grid grid-cols-2 gap-2">
          <input type="date" name="date_depart" onChange={handleChange} className="input" required />
          <input name="heure_depart" placeholder="Heure départ" onChange={handleChange} className="input" required />
          <input type="date" name="date_arrivee" onChange={handleChange} className="input" required />
          <input name="heure_arrivee" placeholder="Heure arrivée" onChange={handleChange} className="input" required />
        </div>

        <input type="number" name="nb_place" placeholder="Nombre de places" onChange={handleChange} className="input" required />
        <input type="number" name="prix_personne" placeholder="Prix par personne (€)" onChange={handleChange} className="input" required />

        <select name="voiture_id" onChange={handleChange} className="input" required>
          <option value="">Sélectionner un véhicule</option>
          {vehicules.map((v: any) => (
            <option key={v.voiture_id} value={v.voiture_id}>
              {v.modele} - {v.immatriculation}
            </option>
          ))}
        </select>

        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Valider le voyage
        </button>
      </form>

      {message && <p className="mt-4 text-blue-700">{message}</p>}
    </div>
  );
}
