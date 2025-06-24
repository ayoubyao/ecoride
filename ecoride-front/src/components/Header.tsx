import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => setIsLoggedIn(!!localStorage.getItem("token"));
    checkToken();
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setMenuOpen(false);
    window.dispatchEvent(new Event("storage")); // 🔄 met à jour les composants écoutant
    navigate("/login");
  };

  return (
    <header className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
      {/* Navigation principale */}
      <nav>
        <ul className="flex space-x-6 text-sm font-medium">
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/covoiturage">Accès aux covoiturages</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
      {/* Menu connecté / déconnecté */}
      <div className="relative">
        {isLoggedIn ? (
          <>
            <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
              <FaUserCircle size={28} className="text-green-400 hover:text-white transition" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 shadow rounded z-10">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Mon profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </>
        ) : (
          <Link to="/login" className="text-sm hover:underline flex items-center gap-1">
            <FaUserCircle size={24} className="text-red-400" />
            Se connecter
          </Link>
        )}
      </div>
    </header>
  );
}
function setMenuOpen(arg0: boolean) {
  throw new Error("Function not implemented.");
}

