import React, { useEffect, useState } from "react";
import { User } from "../services/users";
import { Covoiturage } from "../services/covoiturage";

export default function Profile() {
  const [role, setRole] = useState("passager");
  const [vehicules, setVehicules] = useState([
    { immatriculation: "", date: "", modele: "", couleur: "", marque_id: "", nb_place: 1 }
  ]);
  const [prefs, setPrefs] = useState({
    fumeur: false,
    animaux: false,
    preference_custom: ""
  });
  const [historique, setHistorique] = useState<any[]>([]);

  const utilisateurId = localStorage.getItem("userid");

  useEffect(() => {
    const fetchData = async () => {
      if (!utilisateurId) return;
      try {
        const data = await User.getUserProfile(+utilisateurId);
        setRole(data.utilisateur[0].role || "passager");
        setVehicules(data.vehicules || []);
        setPrefs(data.preferences[0] || { fumeur: false, animaux: false, preference_custom: "" });

        const historiqueData = await Covoiturage.getHistoriqueCovoiturages(+utilisateurId);
        setHistorique(historiqueData);
      } catch (err) {
        console.error("Erreur chargement profil :", err);
      }
    };

    fetchData();
  }, [utilisateurId]);

  const handleAddVehicule = () => {
    setVehicules([...vehicules, {
      immatriculation: "", date: "", modele: "", couleur: "", marque_id: "", nb_place: 1
    }]);
  };

  const handleChangeVehicule = (i: number, field: string, value: string) => {
    const copy = [...vehicules];
    (copy[i] as any)[field] = value;
    setVehicules(copy);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utilisateurId) return;
    await User.saveProfile({ utilisateurId, role, vehicules, prefs });
    alert("Profil mis à jour");
  };

  const handleStatut = async (id: number, action: "demarrer" | "terminer") => {

    try {
      const res = await Covoiturage.actionCovoiturage(id, action)
      alert(res.message);
      // Refresh la liste
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du covoiturage");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Mon Profil</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rôle */}
        <div>
          <label className="font-medium">Votre rôle :</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="ml-2 p-1 border rounded">
            <option value="passager">Passager</option>
            <option value="chauffeur">Chauffeur</option>
            <option value="chauffeur_passager">Chauffeur + Passager</option>
          </select>
        </div>

        {/* Véhicules */}
        {role !== "passager" && (
          <div>
            <label className="font-medium block mb-2">Vos véhicules :</label>
            {vehicules.map((v, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 mb-3">
                <input value={v.immatriculation} placeholder="Immatriculation" onChange={(e) => handleChangeVehicule(i, "immatriculation", e.target.value)} className="input" />
                <input value={v.date} placeholder="Date 1ère immatriculation" onChange={(e) => handleChangeVehicule(i, "date", e.target.value)} className="input" />
                <input value={v.modele} placeholder="Modèle" onChange={(e) => handleChangeVehicule(i, "modele", e.target.value)} className="input" />
                <input value={v.couleur} placeholder="Couleur" onChange={(e) => handleChangeVehicule(i, "couleur", e.target.value)} className="input" />
                <input value={v.marque_id} placeholder="Marque ID" onChange={(e) => handleChangeVehicule(i, "marque_id", e.target.value)} className="input" />
                <input value={v.nb_place} type="number" placeholder="Nb places" onChange={(e) => handleChangeVehicule(i, "nb_place", e.target.value)} className="input" />
              </div>
            ))}
            <button type="button" onClick={handleAddVehicule} className="text-sm text-blue-600">+ Ajouter un véhicule</button>
          </div>
        )}

        {/* Préférences */}
        <div>
          <label className="font-medium block mb-1">Préférences :</label>
          <label><input type="checkbox" checked={prefs.fumeur} onChange={() => setPrefs({ ...prefs, fumeur: !prefs.fumeur })} /> Fumeur accepté</label>
          <label className="ml-4"><input type="checkbox" checked={prefs.animaux} onChange={() => setPrefs({ ...prefs, animaux: !prefs.animaux })} /> Animaux acceptés</label>
          <input
            className="input mt-2 block w-full"
            placeholder="Préférences personnalisées (ex : musique douce)"
            value={prefs.preference_custom}
            onChange={(e) => setPrefs({ ...prefs, preference_custom: e.target.value })}
          />
        </div>

        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Enregistrer</button>
      </form>

      {/* Historique */}
      <hr className="my-6" />
      <div>
        <h3 className="text-xl font-semibold mb-4">Historique des covoiturages</h3>

        {historique.length === 0 ? (
          <p>Aucun trajet enregistré.</p>
        ) : (
          <ul className="space-y-4">
            {historique.map((t, i) => (
              <li key={i} className="border p-4 rounded shadow">
                <p><strong>{t.lieu_depart} → {t.lieu_arrivee}</strong></p>
                <p>Départ : {t.date_depart} {t.heure_depart}</p>
                <p>Arrivée : {t.date_arrivee} {t.heure_arrivee}</p>
                <p>Prix : {t.prix_personne} € — Places restantes : {t.nb_place}</p>
                <p>Statut : <span className="text-blue-600">{t.statut}</span></p>

                {t.statut !== "annulé" && (
                  <button
                    onClick={async () => {
                      if (!utilisateurId) return;
                      const confirm = window.confirm("Voulez-vous annuler ce covoiturage ?");
                      if (!confirm) return;
                      try {
                        await Covoiturage.annulerCovoiturage(+utilisateurId, t.covoiturage_id);
                        alert("Covoiturage annulé.");
                        window.location.reload();
                      } catch (err) {
                        console.error(err);
                        alert("Erreur lors de l’annulation.");
                      }
                    }}
                    className="mt-2 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Annuler
                  </button>
                )}
                                  {t.statut === 'à venir' && (
                  <button className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => handleStatut(t.id, 'demarrer')} >Démarrer</button>
                )}
                {t.statut === 'en_attente' && (
                  <button className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => handleStatut(t.id, 'terminer')} >Arrivée à destination</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
