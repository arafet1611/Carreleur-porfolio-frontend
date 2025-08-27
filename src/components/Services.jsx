import React from 'react';
import { useNavigate } from "react-router-dom";

export default function FullServiceCarrelage() {
    const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Image */}
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000&h=800&fit=crop"
            alt="Pose de carrelage moderne dans une salle de bains élégante"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side - Content */}
        <div className="flex items-center justify-center p-8 lg:p-16">
          <div className="max-w-2xl space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-light tracking-wide text-gray-800 leading-tight">
                Service Complet<br />
                Pose et Rénovation de Carrelage
              </h1>
            </div>

            {/* Content Paragraphs */}
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg font-light">
                Nous est spécialisée dans la 
                <span className="underline decoration-1 underline-offset-2"> pose de carrelage haut de gamme</span>, 
                pour particuliers et professionnels. Nous créons des espaces esthétiques, durables et adaptés 
                à vos besoins.
              </p>

              <p className="text-lg font-light">
                Nous proposons un accompagnement personnalisé, du choix des matériaux 
                jusqu’à la pose finale, afin de garantir un résultat exceptionnel qui combine style et qualité.
              </p>
            </div>

            {/* Design Services Section */}
            <div className="pt-2">
              <h3 className="text-xl font-light text-gray-800 mb-6">
                Nos Prestations en Carrelage :
              </h3>

              {/* Two Column Service Lists */}
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                {/* Left Column */}
                <div className="space-y-3">
                  <ServiceItem text="Carrelage Sol et Mur" />
                  <ServiceItem text="Carrelage Antidérapant Extérieur" />
                  <ServiceItem text="Crédence de Cuisine" />
                  <ServiceItem text="Revêtement de Salle de Bain" />
                  <ServiceItem text="Carrelage Imitation Parquet" />
                  <ServiceItem text="Mosaïque et Carreaux de Ciment" />
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  <ServiceItem text="Pierre Naturelle" />
                  <ServiceItem text="Grès Cérame et Porcelaine" />
                  <ServiceItem text="Rénovation Sols et Terrasses" />
                  <ServiceItem text="Préparation et Ragréage des Supports" />
                  <ServiceItem text="Étanchéité et Finitions" />
                  <ServiceItem text="Conseil & Sélection des Matériaux" />
                </div>
              </div>
            </div>

            {/* View All Services Button */}
            <div className="pt-2">
              <button                    onClick={() => navigate("/services")}
className="border-2 border-gray-900 text-gray-900 px-6 py-3 text-sm font-light tracking-wider hover:bg-gray-900 hover:text-white transition-all duration-300">
                Voir Tous Nos Services
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=800&fit=crop"
            alt="Pose de carrelage dans une cuisine moderne"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="px-8 py-12 bg-white">
          <div className="max-w-lg mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-light tracking-wide text-gray-800 leading-tight">
                Service Complet<br />
                Pose et Rénovation de Carrelage
              </h1>
            </div>

            {/* Content Paragraphs */}
            <div className="space-y-6 text-gray-700 font-light leading-relaxed">
              <p className="text-lg">
                <span className="font-medium">[NOM DE VOTRE ENTREPRISE]</span> vous accompagne pour 
                tous vos projets de carrelage, qu’il s’agisse d’une salle de bain moderne, d’une cuisine ou 
                d’une terrasse extérieure.
              </p>

              <p className="text-lg">
                Nous allions savoir-faire artisanal et respect des délais pour transformer vos espaces 
                avec style et précision.
              </p>
            </div>

            {/* Services Section */}
            <div className="pt-6">
              <h3 className="text-xl font-light text-gray-800 mb-6 text-center">
                Nos Services :
              </h3>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <MobileServiceItem text="Carrelage Sol et Mur" />
                <MobileServiceItem text="Extérieur Antidérapant" />
                <MobileServiceItem text="Crédence Cuisine" />
                <MobileServiceItem text="Salle de Bain" />
                <MobileServiceItem text="Mosaïque" />
                <MobileServiceItem text="Pierre Naturelle" />
                <MobileServiceItem text="Terrasses & Balcons" />
                <MobileServiceItem text="Étanchéité & Finitions" />
              </div>
            </div>

            {/* View All Services Button */}
            <div className="pt-6 w-full">
              <button className="w-full border-2 border-gray-900 text-gray-900 py-3 text-sm font-light tracking-wider hover:bg-gray-900 hover:text-white transition-all duration-300">
                Voir Tous Nos Services
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Small reusable component for service items
function ServiceItem({ text }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
      <span className="text-sm text-gray-700 font-light underline decoration-1 underline-offset-2">
        {text}
      </span>
    </div>
  );
}

function MobileServiceItem({ text }) {
  return (
    <div className="flex items-start space-x-2">
      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
      <span className="text-sm text-gray-700 font-light underline decoration-1 underline-offset-2 leading-tight">
        {text}
      </span>
    </div>
  );
}
