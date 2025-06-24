import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Covoiturage } from "../services/covoiturage";

export default function CovoiturageDetails() {
  const { id } = useParams();
  const [trajet, setTrajet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const currentUser = { id: 10, credit: 8 }; // à remplacer

  useEffect(() => {
    if (id) {
      Covoiturage.getById(+id)
        .then((data) => setTrajet(data?.covoiturage))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const formatDateTime = (fullDateStr: string): string => {
    const date = new Date(fullDateStr);
    if (isNaN(date.getTime())) return "Date invalide";
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleParticipation = async () => {
    if (!trajet || !id) return;
    if (trajet.nb_place < 1) return alert("Aucune place disponible.");
    if (currentUser.credit < 2) return alert("Crédits insuffisants.");
    if (!window.confirm("Participer à ce covoiturage pour 2 crédits ?")) return;
    if (!window.confirm("Êtes-vous sûr ? Cette action est définitive.")) return;

    try {
      await Covoiturage.participerCovoiturage(currentUser.id, +id);
      alert("Participation confirmée !");
      navigate("/user");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la participation.");
    }
  };

  if (loading) return <div className="p-4">Chargement...</div>;
  if (!trajet) return <div className="p-4 text-red-600">Trajet non trouvé.</div>;

  const chauffeur = trajet.chauffeur || {};
  const vehicule = trajet.vehicule || {};
  const avis = trajet.avis || [];

  return (

    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      <button
        onClick={() => navigate("/covoiturage")}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Retour aux trajets
      </button>
      <h1 className="text-2xl font-bold text-green-700">
        Détails du covoiturage #{trajet.covoiturage_id}
      </h1>

      {/* Info Trajet */}
      <div>
        <p><strong>Itinéraire :</strong> {trajet.lieu_depart} → {trajet.lieu_arrivee}</p>
        <p><strong>Départ :</strong> {formatDateTime(trajet.date_depart)} à {trajet.heure_depart}</p>
        <p><strong>Arrivée :</strong> {formatDateTime(trajet.date_arrivee)} à {trajet.heure_arrivee}</p>
        <p><strong>Prix :</strong> {trajet.prix_personne} €</p>
        <p><strong>Places disponibles :</strong> {trajet.nb_place}</p>
        <p><strong>Statut :</strong> {trajet.statut}</p>
        <p><strong>Écologique :</strong> {trajet.ecologique ? "✅ Oui" : "🚫 Non"}</p>
      </div>

      {/* Info Chauffeur */}
      <div className="border-t pt-4">
        <h2 className="font-bold text-lg mb-2">Chauffeur</h2>
        <img src={chauffeur.photo} alt="photo" className="w-12 h-12 rounded-full" />
        <p><strong>Pseudo :</strong> {chauffeur.pseudo}</p>
        <p><strong>Note :</strong> ⭐ {chauffeur.note || "—"}</p>
        <p><strong>Préférences :</strong></p>
        <ul className="ml-4 list-disc">
          <li>Fumeur : {chauffeur.preferences?.fumeur ? "Oui" : "Non"}</li>
          <li>Animal : {chauffeur.preferences?.animal ? "Oui" : "Non"}</li>
          {chauffeur.preferences?.autres && <li>{chauffeur.preferences.autres}</li>}
        </ul>
      </div>

      {/* Info Véhicule */}
      <div className="border-t pt-4">
        <h2 className="font-bold text-lg mb-2">Véhicule</h2>
        <p><strong>Modèle :</strong> {vehicule.modele}</p>
        <p><strong>Marque :</strong> {vehicule.marque}</p>
        <p><strong>Énergie :</strong> {vehicule.energie}</p>
      </div>

      {/* Avis */}
      {avis.length > 0 && (
        <div className="border-t pt-4">
          <h2 className="font-bold text-lg mb-2">Avis sur le conducteur</h2>
          {avis.map((a: any, i: number) => (
            <div key={i} className="border p-2 mb-2 rounded">
              <p>⭐ {a.note}</p>
              <p className="italic text-sm">{a.commentaire}</p>
            </div>
          ))}
        </div>
      )}

      {trajet.nb_place > 0 && (
        <button
          onClick={handleParticipation}
          className="mt-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Participer
        </button>
      )}
    </div>
  );
}
