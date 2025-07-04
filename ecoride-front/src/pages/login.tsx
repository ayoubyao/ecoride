import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User } from "../services/users";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await User.login(email, password);

      if (data.message !== "Connexion réussie") {
        setError(data.message || "Échec de connexion");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userid", data.utilisateur.id);
      localStorage.setItem("role", data.utilisateur.role); // ✅ Enregistre le rôle
      window.dispatchEvent(new Event("storage")); // ✅ met à jour l'icône en direct

      const profil = await User.getUserProfile(data.utilisateur.id);
      localStorage.setItem("userProfile", JSON.stringify(profil));

      // ✅ Redirection selon le rôle
      if (data.utilisateur.role === "employe") {
        navigate("/employe");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError("Erreur serveur");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600">
          Connexion
        </h2>

        {error && <div className="text-red-600 text-sm text-center">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Se connecter
        </button>

        <p className="text-sm text-center">
          Pas de compte ?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Créer un compte
          </Link>
        </p>
      </form>
    </div>
  );
}
