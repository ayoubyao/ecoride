import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function LoginStatusIcon() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLogin();

    // ✅ Option : écouter les changements sur le token (pour que ça se mette à jour dynamiquement)
    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  return (
    <FaUserCircle
      size={28}
      className={isLoggedIn ? "text-green-500" : "text-red-500"}
      title={isLoggedIn ? "Connecté" : "Déconnecté"}
    />
  );
}
