import { useEffect, useState } from 'react';
import { User } from '../services/users';

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    User.getAllUsers()
      .then(setUsers)
      .catch((err) => {
        console.error("Erreur lors du chargement des utilisateurs :", err);
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Liste des utilisateurs</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Nom</th>
              <th className="p-2 border">Prénom</th>
              <th className="p-2 border">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.utilisateur_id} className="hover:bg-gray-50">
                <td className="p-2 border">{user.utilisateur_id}</td>
                <td className="p-2 border">{user.nom}</td>
                <td className="p-2 border">{user.prenom}</td>
                <td className="p-2 border">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
