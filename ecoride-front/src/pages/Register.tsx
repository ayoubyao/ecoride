import { useState } from "react";
import { User } from "../services/users";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    pseudo: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await User.register(formData);
      
      if (res.ok) {
        setMessage("✅ Compte créé avec succès !");
        setFormData({ email: "", pseudo: "", password: "" });
      } else {
        setMessage("❌ Une erreur est survenue.");
      }
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        setMessage("❌ Échec de connexion au serveur.");
      }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Créer un compte</h2>
      {message && <p className="text-center mb-4 text-sm">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Adresse email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="pseudo"
          placeholder="Pseudo"
          value={formData.pseudo}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          S'inscrire
        </button>
      </form>
    </div>
  );
}
