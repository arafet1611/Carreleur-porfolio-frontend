import RecentProjects from "../components/recentProjects";
import { useEffect } from "react";
export default function ServicesPage() {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&h=800&fit=crop"
          alt="Travaux de carrelage professionnel - salle de bains moderne"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Page Content with Open Effect */}
      <div className="relative -mt-16 bg-white  shadow-2xl z-10">
        <div className="py-20 px-8">
          {/* Header Section */}
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-4">
              <h1 className="text-4xl md:text-5xl font-light tracking-wide text-gray-800 mb-2">
                Services de Carrelage Professionnel
              </h1>
            </div>
            
            <div className="text-center mb-16">
              <p className="text-gray-600 font-light tracking-wider text-lg">
                Expertise en pose de carrelage pour particuliers et professionnels
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Image */}
              <div className="relative">
                <div className="aspect-[4/3] bg-gray-200  overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
                    alt="Carrelage moderne salle de bains"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right Side - Content */}
              <div className="space-y-8">
                {/* Experience Client Header */}
                <div>
                  <h2 className="text-3xl font-light tracking-wide text-gray-800 mb-8">
                    Expérience Client Exceptionnelle
                  </h2>
                </div>

                {/* Content Paragraphs */}
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  <p className="text-lg font-light">
                    Nous sommes spécialisés dans la 
                <span className="underline decoration-1 underline-offset-2"> pose de carrelage haut de gamme</span>, 
                pour particuliers et professionnels. Nous créons des espaces esthétiques, durables et adaptés 
                à vos besoins.
                  </p>

                  <p className="text-lg font-light">
                    Notre approche est centrée sur le client : nous écoutons vos besoins. Nous concevons et réalisons{' '}
                    <span className="underline decoration-1 underline-offset-2">des espaces carrelés</span>{' '}
                    qui correspondent à votre style de vie et à vos goûts. Nous sommes reconnus pour notre expertise technique et notre savoir-faire artisanal qui se reflètent dans des{' '}
                    <span className="underline decoration-1 underline-offset-2">rénovations sur mesure</span>.
                  </p>

                  <p className="text-lg font-light">
                    Notre priorité est d'apporter une approche professionnelle à{' '}
                    <span className="underline decoration-1 underline-offset-2">chaque étape</span> de{' '}
                    <span className="underline decoration-1 underline-offset-2">la transformation de vos espaces</span>.{' '}
                    Sans stress, avec des résultats durables et esthétiques ! Notre équipe maîtrise parfaitement{' '}
                    <span className="underline decoration-1 underline-offset-2">la gestion de projet</span>{' '}
                    et le respect des délais et budgets pour garantir l'excellence de chaque réalisation.
                  </p>
                </div>
              </div>
            </div>

            {/* Prestations de Qualité Section */}
            <div className="mt-32">
              {/* Section Header */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-light tracking-wide text-gray-800 mb-6">
                  Prestations Haut de Gamme
                </h2>
                <div className="max-w-4xl mx-auto">
                  <p className="text-gray-700 font-light text-lg leading-relaxed">
                    Notre concept est simple : vous nous confiez votre projet de carrelage et nous nous chargeons de l'intégralité des travaux. 
                    De la conception à la pose finale, nous prenons en compte tous les détails 
                    de votre projet, vous permettant ainsi de profiter de votre quotidien pendant que nous créons{' '}
                    <span className="underline decoration-1 underline-offset-2">des espaces exceptionnels</span>.
                  </p>
                </div>
              </div>

              {/* Three Service Categories */}
              <div className="grid md:grid-cols-3 gap-12 mb-16">
                {/* Pose de Carrelage */}
                <div className="text-center">
                  <div className="aspect-[4/3] bg-gray-200 overflow-hidden mb-6">
                    <img 
                      src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
                      alt="Pose de carrelage cuisine moderne"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-light tracking-wide text-gray-800 mb-6">
                    Pose de Carrelage
                  </h3>
                  <ul className="space-y-2 text-gray-700 font-light text-base">
                    <li>Carrelage sol et mur</li>
                    <li>Carrelage antidérapant extérieur</li>
                    <li className="underline decoration-1 underline-offset-2">Crédence de cuisine</li>
                    <li className="underline decoration-1 underline-offset-2">Revêtement salle de bains</li>
                    <li className="underline decoration-1 underline-offset-2">Carrelage imitation parquet</li>
                    <li className="underline decoration-1 underline-offset-2">Mosaïque et carreaux de ciment</li>
                    <li>Carrelage pierre naturelle</li>
                    <li>Grès cérame et porcelaine</li>
                  </ul>
                </div>

                {/* Rénovation */}
                <div className="text-center">
                  <div className="aspect-[4/3] bg-gray-200  overflow-hidden mb-6">
                    <img 
                      src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop"
                      alt="Rénovation salle de bains avec carrelage"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-light tracking-wide text-gray-800 mb-6">
                    Rénovation Complète
                  </h3>
                  <ul className="space-y-2 text-gray-700 font-light text-base">
                    <li>Rénovation salles de bains</li>
                    <li>Rénovation cuisines</li>
                    <li>Rénovation terrasses et balcons</li>
                    <li>Rénovation sols intérieurs</li>
                    <li>Démolition et préparation des supports</li>
                    <li>Ragréage et mise à niveau des sols</li>
                    <li>Étanchéité et protection anti-humidité</li>
                  </ul>
                </div>

                {/* Services Spécialisés */}
                <div className="text-center">
                  <div className="aspect-[4/3] bg-gray-200  overflow-hidden mb-6">
                    <img 
                      src="https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop"
                      alt="Travaux de carrelage sur mesure"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-light tracking-wide text-gray-800 mb-6">
                    Services Spécialisés
                  </h3>
                  <ul className="space-y-2 text-gray-700 font-light text-base">
                    <li>Conseil et expertise technique</li>
                    <li>Devis détaillé et planification</li>
                    <li>Choix des matériaux et conseils</li>
                    <li>Pose avec joints parfaits</li>
                    <li>Finitions et joints de qualité</li>
                    <li>Nettoyage et traitement des surfaces</li>
                    <li>Service après-vente et garantie</li>
                    <li>Respect des normes et réglementations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <RecentProjects />
        </div>
      </div>
    </div>
  );
}