import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail } from 'lucide-react';
const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    placeAddress: "",
    localisation: "",
    projectDescription: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar Space */}
      <div className="h-20 bg-gray-800"></div>

      {/* Main Content */}
      <div className="flex items-center py-8">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* Left Side - Contact Form */}
            <div className="lg:col-span-3">
              <div className="max-w-4xl">
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-light tracking-wider text-gray-800 mb-2">
                    NOUS CONTACTER
                  </h1>
                  <p className="text-gray-600 font-light text-sm">
                    Nous serions ravis d'avoir de vos nouvelles !
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* First Row - Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-light tracking-wide text-gray-700 mb-1">
                        PRÉNOM *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm bg-gray-100 border-none focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-light tracking-wide text-gray-700 mb-1">
                        NOM *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm bg-gray-100 border-none focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                        required
                      />
                    </div>
                  <div>
                      <label className="block text-xs font-light tracking-wide text-gray-700 mb-1">
                        TÉLÉPHONE *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm bg-gray-100 border-none focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                 
               

                  {/* second Row - Project Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-light tracking-wide text-gray-700 mb-1">
                        LIEU DU PROJET *
                      </label>
                      <input
                        type="text"
                        name="projectLocation"
                        value={formData.projectLocation}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm bg-gray-100 border-none focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-light tracking-wide text-gray-700 mb-1">
                        LOCALISATION *
                      </label>
                      <select
                        name="selectLocation"
                        value={formData.selectLocation}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm bg-gray-100 border-none focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                        required
                      >
                        <option value="">Sélectionner la localisation</option>
                        <option value="mahdia-city">Mahdia</option>
                        <option value="el-jem">El Jem</option>
                        <option value="sidi-alouane">Sidi Alouane</option>
                        <option value="chebba">Chebba</option>
                        <option value="ksour-essef">Ksour Essef</option>
                        <option value="souassi">Souassi</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                  </div>

                  {/* Fifth Row - Project Type and Location Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-light tracking-wide text-gray-700 mb-1">
              DESCRIPTION DU PROJET *
                      </label>
                   <textarea
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleInputChange}
              required
              rows="6"
              className="w-full px-4 py-4 bg-gray-100 border-0 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:bg-white transition-all duration-300 resize-none"
              placeholder="Parlez-nous de votre vision du projet, vos préférences de style, calendrier et toute exigence spécifique..."
            />
                    </div>
                  
                  </div>

                  {/* Contact Info and Submit */}
                  <div className="pt-4">
                    <div className="mb-4">
                      <p className="text-xs font-light text-gray-600">
                        username@exemple.com | +216 20 123 456 | DEMANDES D'INSTALLATION DE CARRELAGE
                      </p>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-gray-900 text-white py-3 px-6 text-xs font-light tracking-wider hover:bg-gray-800 transition-all duration-300"
                    >
                      ENVOYER VOTRE MESSAGE
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Side - Map and Contact Info */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 text-white p-6 h-full">
                
                {/* Logo/Brand */}
                <div className="flex justify-center mb-4 -mt-16">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-20 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                </div>


                {/* Contact Information */}
                <div className="space-y-6">
                  {/* Main Office */}
                  <div className="text-center pt-6">
                    <h3 className="text-lg font-light tracking-wide mb-2">MAHDIA (SIÈGE SOCIAL)</h3>
                    <div className="space-y-1 text-xs text-gray-300 font-light">
                      <p>Avenue Habib Bourguiba</p>
                      <p>Mahdia 5100</p>
                      <p>Tunisie</p>
                    </div>
                  </div>
 <div className="text-center pt-6 border-t border-gray-700">
    <h4 className="text-sm font-light tracking-wide mb-1 uppercase"> Ligne directe</h4>
    <div className="space-y-1 text-xs text-gray-300 font-light">
      <p className="text-white">+216 98 765 432</p>                       <p className="mt-2 text-white">+216 20 123 456</p>
      <p className="text-xs">Disponible aux heures d'ouverture </p>
    </div>
  </div>
                  {/* Service Hours */}
                  <div className="text-center pt-6 border-t border-gray-700">
                    <h4 className="text-sm font-light tracking-wide mb-1">HORAIRES DE SERVICE</h4>
                    <div className="space-y-1 text-xs text-gray-300 font-light">
                      <p>Lundi - Vendredi : 7h00 - 18h00</p>
                      <p>Samedi : 8h00 - 16h00</p>
                      <p>Dimanche : Sur rendez-vous</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            {/* Top Line */}
            <div className="mb-6">
              <p className="text-xs tracking-widest uppercase text-gray-300">
                POUR LES DEMANDES DE RENSEIGNEMENTS ET LES PARTENARIATS COMMERCIAUX, VEUILLEZ CONTACTER{' '}
                <span className="text-white font-medium">FAROUKCARRELAGE@GMAIL.COM</span>
              </p>
            </div>

            {/* Connect With Us */}
            <div className="mb-6">
              <h3 className="text-2xl font-light tracking-wide mb-4">Connectez-vous avec nous !</h3>
              
              {/* Social Media Icons */}
              <div className="flex justify-center space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-300">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-blue-400 rounded-full flex items-center justify-center transition-colors duration-300">
                  <Twitter size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-pink-500 rounded-full flex items-center justify-center transition-colors duration-300">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors duration-300">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-300">
                  <Youtube size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-300">
                  <Mail size={20} />
                </a>
              </div>
            </div>

            
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;