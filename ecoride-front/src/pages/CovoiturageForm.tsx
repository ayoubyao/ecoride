import { useState, useEffect } from "react";
import { getVehicules } from "../services/api";

interface Props {
  onSubmit: (data: any) => void;
  utilisateurId: number;
}

export default function CovoiturageForm({ onSubmit, utilisateurId }: Props) {
  const [form, setForm] = useState({
    date_depart: "",
    heure_depart: "",
    lieu_depart: "",
    date_arrivee: "",
    heure_arrivee: "",
    lieu_arrivee: "",
    nb_place: 1,
    prix_personne: 0,
    voiture_id: "",
  });

  const [vehicules, setVehicules] = useState([]);

  useEffect(() => {
    getVehicules(utilisateurId).then(setVehicules);
  }, [utilisateurId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Créer un covoiturage</h2>

      <input name="lieu_depart" placeholder="Lieu de départ" className="input" required onChange={handleChange} />
      <input name="date_depart" type="date" className="input" required onChange={handleChange} />
      <input name="heure_depart" type="time" className="input" required onChange={handleChange} />

      <input name="lieu_arrivee" placeholder="Lieu d'arrivée" className="input" required onChange={handleChange} />
      <input name="date_arrivee" type="date" className="input" required onChange={handleChange} />
      <input name="heure_arrivee" type="time" className="input" required onChange={handleChange} />

      <input name="nb_place" type="number" placeholder="Nombre de places" className="input" required onChange={handleChange} />
      <input name="prix_personne" type="number" placeholder="Prix par personne (€)" className="input" required onChange={handleChange} />

      <select name="voiture_id" className="input" required onChange={handleChange}>
        <option value="">Sélectionner un véhicule</option>
        {vehicules.map((v: any) => (
          <option key={v.vehicule_id} value={v.vehicule_id}>
            {v.marque} {v.modele} – {v.plaque}
          </option>
        ))}
      </select>

      <button type="submit" className="btn-primary">Créer le voyage</button>
    </form>
  );
}
