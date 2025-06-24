import { Link } from "react-router-dom";

interface Props {
  covoiturage: {
    covoiturage_id: number;
    nb_place: number;
    prix_personne: number;
    date_depart: string;
    heure_depart: string;
    date_arrivee: string;
    heure_arrivee: string;
    ecologique: boolean;
    chauffeur: {
      pseudo: string;
      photo: string;
      note: number | string;
    };
  };
}

export default function CovoiturageCard({ covoiturage }: Props) {
  const {
    covoiturage_id,
    nb_place,
    prix_personne,
    date_depart,
    heure_depart,
    date_arrivee,
    heure_arrivee,
    ecologique,
    chauffeur,
  } = covoiturage;

  return (
    <div className="bg-white shadow p-4 rounded space-y-2">
      {/* Infos chauffeur */}
      <div className="flex items-center gap-4">
        <img
          src={chauffeur.photo}
          alt="photo chauffeur"
          className="w-12 h-12 rounded-full border"
        />
        <div>
          <p className="font-semibold">{chauffeur.pseudo}</p>
          <p className="text-sm text-gray-500">⭐ {chauffeur.note || "—"}</p>
        </div>
      </div>

      {/* Infos trajet */}
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
        <p><strong>Départ :</strong> {date_depart} à {heure_depart}</p>
        <p><strong>Arrivée :</strong> {date_arrivee} à {heure_arrivee}</p>
        <p><strong>Places restantes :</strong> {nb_place}</p>
        <p><strong>Prix :</strong> {prix_personne} €</p>
        <p><strong>Écologique :</strong> {ecologique ? "✅ Oui" : "🚫 Non"}</p>
      </div>

      {/* Bouton détail */}
      <div className="text-right">
        <Link
          to={`/covoiturage/${covoiturage_id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          ➕ Voir détail
        </Link>
      </div>
    </div>
  );
}
