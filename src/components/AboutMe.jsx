import carreleur from "../assets/carreleur.jpg"; 
import { useNavigate } from "react-router-dom";
const AboutMe = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Côté gauche - Contenu */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-light tracking-wide text-gray-900 mb-2">
                AHMED BENNOUR
              </h1>
              <p className="text-lg font-light tracking-wider text-gray-600 mb-8">
                Maître Artisan & Spécialiste en Installation de Carrelage
              </p>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg font-light">
                Ahmed Bennour est un maître artisan carreleur et spécialiste de l'installation avec plus de 15 ans d'expérience 
                dans la transformation d'espaces à Mahdia et dans toute la Tunisie. Il se spécialise dans la création 
                d'installations de carrelage époustouflantes qui allient l'artisanat tunisien traditionnel et l'excellence du design contemporain.
              </p>

              <p className="text-lg font-light">
                Basé dans la ville côtière historique de Mahdia, le travail d'Ahmed reflète le riche héritage méditerranéen 
                de la région. Son expertise s'étend des mosaïques complexes et des carreaux de zellige traditionnels aux 
                installations modernes en porcelaine et en pierre naturelle pour les maisons, hôtels et espaces commerciaux.
              </p>

              <p className="text-lg font-light">
                Avec des racines profondes dans les techniques traditionnelles tunisiennes de fabrication de carreaux et un apprentissage continu 
                des méthodes d'installation modernes, Ahmed offre un savoir-faire exceptionnel qui honore à la fois l'héritage et 
                l'innovation. Chaque projet reflète sa passion pour créer des espaces qui inspirent et perdurent.
              </p>
            </div>

            {/* Bouton d'appel à l'action */}
            <div className="pt-4">
              <button onClick={()=> navigate("/projects")} className="border-2 border-gray-900 text-gray-900 px-8 py-4 text-sm font-light tracking-wider hover:bg-gray-900 hover:text-white transition-all duration-300 transform hover:scale-105 rounded-sm">
                Voir Mon Travail
              </button>
            </div>
          </div>
          
          {/* Côté droit - Image */}
          <div className="relative">
            <div className="aspect-[4/4] overflow-hidden rounded-sm">
              <img
                src={carreleur}
                alt="Artisan carreleur professionnel au travail à Mahdia"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Élément décoratif - motif de carreaux méditerranéen */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-blue-600 to-blue-800 opacity-10 rounded-sm"></div>
            <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-blue-600 opacity-20 rounded-sm"></div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutMe;