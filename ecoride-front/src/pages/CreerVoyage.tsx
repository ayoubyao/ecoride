import { useState } from "react";
import CovoiturageForm from "./CovoiturageForm";
import { creerVoyage } from "../services/api";

export default function CreerVoyagePage() {
  const utilisateurId = 1; // à remplacer avec JWT ou contexte
  const [confirmation, setConfirmation] = useState("");

  const handleSubmit = async (data: any) => {
    const response = await creerVoyage({ ...data, utilisateurId });
    setConfirmation(response.message);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {confirmation ? (
        <div className="max-w-lg mx-auto bg-green-100 text-green-800 p-4 rounded text-center font-semibold">
          ✅ {confirmation}
        </div>
      ) : (
        <CovoiturageForm utilisateurId={utilisateurId} onSubmit={handleSubmit} />
      )}
    </div>
  );
}
