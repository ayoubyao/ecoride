import { useState } from "react";
import CovoiturageCard from "../components/CovoiturageCard";
import { Covoiturage } from "../services/covoiturage";

export default function VoirCovoiturages() {
  const [form, setForm] = useState({ depart: "", arrivee: "", date: "" ,prix_max: 0, duree_max: 0, note_min: 0, ecologique: false,});
  const [results, setResults] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Recherche en cours...");

    try {
      const data = await Covoiturage.searchItineraire(form.depart, form.arrivee, form.date, form.prix_max, form.duree_max, form.note_min, form.ecologique )

      if (data == null || data.prochain) {
        setMessage("Aucun covoiturage trouvé. Voici le plus proche disponible :");
        setResults(data.prochain || []);
      } else {
        setMessage("");
        setResults(data);
      }
    } catch {
      setMessage("Erreur serveur.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Rechercher un covoiturage</h2>

      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <input name="depart" placeholder="Ville de départ" onChange={handleChange} className="input" required />
        <input name="arrivee" placeholder="Ville d’arrivée" onChange={handleChange} className="input" required />
        <input type="date" name="date" onChange={handleChange} className="input" required />
        <button className="col-span-1 sm:col-span-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Rechercher
        </button>

        <input
          type="number"
          name="prix_max"
          placeholder="Prix maximum (€)"
          onChange={handleChange}
          className="input"
        />
        <input
          type="number"
          name="duree_max"
          placeholder="Durée max (min)"
          onChange={handleChange}
          className="input"
        />
        <input
          type="number"
          name="note_min"
          placeholder="Note min chauffeur"
          onChange={handleChange}
          className="input"
        />
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="ecologique" onChange={(e) =>
            setForm({ ...form, ecologique: e.target.checked })} />
          <span>Écologique seulement</span>
        </label>

      </form>

      {message && <p className="text-center text-gray-700 mb-4">{message}</p>}

      <div className="space-y-4">
        {results.map((covoiturage, index) => (
          <CovoiturageCard key={index} covoiturage={covoiturage} />
        ))}
      </div>
    </div>
  );
}
