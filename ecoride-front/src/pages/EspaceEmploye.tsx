import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EspaceEmploye() {
  const [avis, setAvis] = useState<any[]>([]);
  const [problemes, setProblemes] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isEmploye = localStorage.getItem("role") === "employe"; 

    if(!isEmploye) {
       navigate("/login");
    }
    fetch("http://localhost:3010/api/employe/avis")
      .then(res => res.json()).then(setAvis);

    fetch("http://localhost:3010/api/employe/problemes")
      .then(res => res.json()).then(setProblemes);
  }, []);

  const valider = async (id: number, statut: string) => {
    await fetch("http://localhost:3010/api/employe/avis/valider", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avis_id: id, statut }),
    });
    setAvis(prev => prev.filter(a => a.avis_id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Espace Employé</h1>

      <h2 className="text-xl font-semibold mt-6 mb-2">📝 Avis en attente</h2>
      {avis.length === 0 ? (
        <p className="text-gray-600">Aucun avis à modérer.</p>
      ) : (
        <ul className="space-y-4">
          {avis.map(a => (
            <li key={a.avis_id} className="border p-4 rounded shadow">
              <p><strong>{a.auteur}</strong> ({a.note}/5)</p>
              <p>{a.commentaire}</p>
              <div className="space-x-2 mt-2">
                <button onClick={() => valider(a.avis_id, "valide")} className="px-3 py-1 bg-green-600 text-white rounded">Valider</button>
                <button onClick={() => valider(a.avis_id, "refuse")} className="px-3 py-1 bg-red-600 text-white rounded">Refuser</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-xl font-semibold mt-10 mb-2">🚨 Covoiturages signalés</h2>
      {problemes.length === 0 ? (
        <p className="text-gray-600">Aucun problème signalé.</p>
      ) : (
        <ul className="space-y-4">
          {problemes.map(p => (
            <li key={p.covoiturage_id} className="border p-4 rounded shadow">
              <p><strong>Trajet :</strong> {p.lieu_depart} → {p.lieu_arrivee}</p>
              <p><strong>Date :</strong> {p.date_depart} - {p.date_arrivee}</p>
              <p><strong>Chauffeur :</strong> {p.chauffeur_pseudo} ({p.chauffeur_email})</p>
              <p><strong>Passager :</strong> {p.passager_pseudo} ({p.passager_email})</p>
              <p><strong>Commentaire :</strong> {p.commentaire}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
