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
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-700 mb-4">Bienvenue chez EcoRide 🌱</h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          EcoRide est une startup engagée pour un avenir plus vert 🌍. Notre mission est de réduire l’impact
          environnemental des transports en facilitant le covoiturage entre particuliers. Rejoignez la
          communauté de ceux qui roulent plus propre, plus solidaire, et plus économique.
        </p>
      </section>

      
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <img
          src="/images/ecologie1.jpg"
          alt="Voiture électrique en pleine nature"
          className="rounded shadow-lg object-cover w-full"
        />
        <img
          src="/images/ecologie2.jpg"
          alt="Gens partageant un trajet ensemble"
          className="rounded shadow-lg object-cover  w-full"
        />
        <img
          src="/images/ecologie3.jpg"
          alt="Feuille verte en main"
          className="rounded shadow-lg object-cover w-full"
        />
      </section>
    </div>
  );
}