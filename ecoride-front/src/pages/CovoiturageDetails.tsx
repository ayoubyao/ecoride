import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Covoiturage } from "../services/covoiturage"; // service à adapter

export default function CovoiturageDetails() {
  const { id } = useParams();
  const [trajet, setTrajet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const currentUser = { id: 10, credit: 8 }; // à remplacer par contexte auth réel

  useEffect(() => {
    if (id) {
      Covoiturage.getById(+id)
        .then((data) => setTrajet(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  function formatDateTime(fullDateStr: string): string {
    const date = new Date(fullDateStr);
    if (isNaN(date.getTime())) return "Date invalide";
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const handleParticipation = async () => {
    if (!trajet || !id) return;

    if (trajet.nb_place < 1) {
      return alert("Aucune place disponible.");
    }

    if (currentUser.credit < 2) {
      return alert("Crédits insuffisants.");
    }

    const confirm1 = window.confirm(
      `Participer à ce covoiturage pour 2 crédits ?`
    );
    if (!confirm1) return;

    const confirm2 = window.confirm(
      `Êtes-vous sûr ? Cette action est définitive.`
    );
    if (!confirm2) return;

    try {
      const res = await Covoiturage.participerCovoiturage(currentUser.id, +id)

      alert("Participation confirmée !");
      navigate("/user"); // ou recharger les données actuelles
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la participation.");
    }
  };

  if (loading) return <div className="p-4">Chargement...</div>;
  if (!trajet)
    return <div className="p-4 text-red-600">Trajet non trouvé.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-green-700">
        Détails du covoiturage #{trajet.covoiturage_id}
      </h1>

      <div className="mb-2">
        <strong>Itinéraire :</strong> {trajet.lieu_depart} →{" "}
        {trajet.lieu_arrivee}
      </div>
      <div className="mb-2">
        <strong>Départ :</strong> {formatDateTime(trajet.date_depart)}{" "}
        {trajet.heure_depart}
      </div>
      <div className="mb-2">
        <strong>Arrivée :</strong> {formatDateTime(trajet.date_arrivee)}{" "}
        {trajet.heure_arrivee}
      </div>
      <div className="mb-2">
        <strong>Nombre de places :</strong> {trajet.nb_place}
      </div>
      <div className="mb-2">
        <strong>Prix par personne :</strong> {trajet.prix_personne} €
      </div>
      <div className="mb-2">
        <strong>Voiture ID :</strong> {trajet.voiture_id}
      </div>
      <div className="mb-2">
        <strong>Statut :</strong> {trajet.statut}
      </div>
      {trajet.nb_place > 0 && (
        <button
          onClick={handleParticipation}
          className="mt-6 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Participer
        </button>
      )}
    </div>
  );
}
