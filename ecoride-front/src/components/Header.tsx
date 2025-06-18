import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <nav className="bg-blue-600 p-4 text-white">
      <ul className="flex space-x-4">
        <li><Link to="/">Accueil</Link></li>
        <li><Link to="/covoiturage">Accès aux covoiturages</Link></li>
        <li><Link to="/Contact">Contact</Link></li>
      </ul>
    </nav>
  );
}
