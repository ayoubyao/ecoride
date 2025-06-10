'use client';

import { useState } from 'react';
import { Covoiturage } from '../services/covoiturage';



export default function ItineraireSearch() {
  const [depart, setDepart] = useState('');
  const [arrivee, setArrivee] = useState('');
  const [resultats, setResultats] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await Covoiturage.searchItineraire(depart, arrivee);
    setResultats(data);
  };

function formatDateTime(fullDateStr: string): string {
  const date = new Date(fullDateStr);
  if (isNaN(date.getTime())) return 'Date invalide';

  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}


  return (
    <div className="p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 md:flex-row md:items-center mb-6"
      >
        <input
          type="text"
          placeholder="Départ"
          value={depart}
          onChange={(e) => setDepart(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        />
        <input
          type="text"
          placeholder="Arrivée"
          value={arrivee}
          onChange={(e) => setArrivee(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 w-full md:w-auto"
        >
          Rechercher
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resultats.map((trajet) => (
          <div
            key={trajet.covoiturage_id}
            className="bg-white border border-gray-200 rounded-2xl shadow-md p-5 flex flex-col gap-4 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-blue-700">
                  {trajet.lieu_depart} → {trajet.lieu_arrivee}
                </h3>
                <p className="text-sm text-gray-500">Trajet #{trajet.covoiturage_id}</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 font-medium">
                  {trajet.statut}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-sm">
              <div>
                <span className="font-semibold">Départ :</span> {formatDateTime(trajet.date_depart)} {trajet.heure_depart}
              </div>
              <div>
                <span className="font-semibold">Arrivée :</span> {formatDateTime(trajet.date_arrivee)} {trajet.heure_arrivee}
              </div>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <p><strong>Places :</strong> {trajet.nb_place}</p>
              <p><strong>Prix :</strong> {trajet.prix_personne} €</p>
            </div>

            <div className="text-sm text-gray-500 mt-2">
              {/* <p><strong>Conducteur ID :</strong> {trajet.utilisateur_id}</p> */}
              <p><strong>Voiture ID :</strong> {trajet.voiture_id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
