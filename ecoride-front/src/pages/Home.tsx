import Footer from "../components/Footer";
import ItineraireSearch from "../components/ItineraireSearch";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Barre de recherche */}
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-bold mb-4">Trouvez votre covoiturage</h1>
        <ItineraireSearch />
      </header>

            {/* Contenu principal */}
      <main className="flex-grow p-4">
        {/* Tu peux mettre ici les covoiturages récents, les offres, etc. */}
      </main>

      {/* Contenu principal */}
      <main className="flex-grow p-4">
        {/* Tu peux mettre ici les covoiturages récents, les offres, etc. */}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}