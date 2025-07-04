import React, { useEffect, useState } from "react";
import { Admin } from "../services/admin";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function EspaceAdmin() {
  const [stats, setStats] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      const data = await Admin.getDashboard();
      setStats(data);
    };
    fetchStats();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await Admin.createEmploye({ email, password, nom, prenom  });
    setMessage(res.message);
    window.location.reload();

  };

  const handleSuspend = async (id: number) => {
    if (!window.confirm("Suspendre ce compte ?")) return;
    const res = await Admin.suspendUser(id);
    alert(res.message);
    window.location.reload();

  };

  const chartCovoiturages = {
    labels: stats?.covoituragesParJour.map((c: any) => c.date),
    datasets: [
      {
        label: "Covoiturages par jour",
        data: stats?.covoituragesParJour.map((c: any) => c.total),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
    ],
  };

  const chartCredits = {
    labels: stats?.creditsParJour.map((c: any) => c.date),
    datasets: [
      {
        label: "Crédits gagnés par jour",
        data: stats?.creditsParJour.map((c: any) => c.total),
        backgroundColor: "rgba(16, 185, 129, 0.6)",
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Espace Administrateur</h1>

      {/* Formulaire de création d'employé */}
      <section className="mb-8">
        <h2 className="font-bold mb-2">Créer un employé</h2>
        <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-2">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input border p-2 rounded"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            type="password"
            className="input border p-2 rounded"
          />
          <input
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Nom"
            type="nom"
            className="input border p-2 rounded"
          />
          <input
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            placeholder="prenom"
            type="prenom"
            className="input border p-2 rounded"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Créer
          </button>
        </form>
        {message && <p className="text-sm text-green-600 mt-2">{message}</p>}
      </section>

      {/* Graphiques */}
      {stats && (
        <>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-4 rounded shadow">
              <Bar data={chartCovoiturages} />
            </div>
            <div className="bg-white p-4 rounded shadow">
              <Bar data={chartCredits} />
            </div>
          </section>

          <div className="text-lg font-bold text-right mb-6">
            Total crédits gagnés : <span className="text-green-600">{stats.creditsTotal}</span>
          </div>

          {/* Liste des utilisateurs */}
          <section>
            <h2 className="font-bold mb-2">Comptes à gérer</h2>
            <ul className="space-y-2">
              {stats.utilisateurs.map((u: any) => (
                <li key={u.utilisateur_id} className="border p-2 rounded flex justify-between items-center">
                  <span>{u.nom} ({u.email}) - {u.role}</span>
                  <button
                    onClick={() => handleSuspend(u.utilisateur_id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Suspendre
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
