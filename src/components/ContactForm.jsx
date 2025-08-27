import React, { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    placeAddress: "",
    localisation: "",
    projectDescription: "",
    email: "" // Add email field
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          placeAddress: "",
          localisation: "",
          projectDescription: "",
          email: ""
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16  px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-4xl font-light text-gray-800 mb-1 tracking-wide">
            Meilleur Carreleur de Luxe{" "}
          </h1>
          <div className="text-xs font-medium text-gray-800 tracking-widest uppercase mb-3">
            NOUS CONTACTER
          </div>
          <p className="text-gray-600 text-sm font-light">
            Nous serions ravis d'avoir de vos nouvelles !
          </p>
        </div>

        {/* Contact Form */}
        <div className="space-y-4">
          {/* First Row - Name and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 tracking-widest uppercase mb-1">
                PRÉNOM *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-100 border-0 text-gray-800 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:bg-white transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 tracking-widest uppercase mb-1">
                NOM *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-100 border-0 text-gray-800 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:bg-white transition-all duration-300"
              />
            </div>
          </div>
          
          {/* Second Row - Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 tracking-widest uppercase mb-1">
                EMAIL *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-100 border-0 text-gray-800 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:bg-white transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 tracking-widest uppercase mb-1">
                TÉLÉPHONE *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-100 border-0 text-gray-800 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:bg-white transition-all duration-300"
              />
            </div>
          </div>
          
          {/* Third Row - Address and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 tracking-widest uppercase mb-1">
                LIEU DU PROJET *
              </label>
              <input
                type="text"
                name="placeAddress"
                value={formData.placeAddress}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-100 border-0 text-gray-800 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:bg-white transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 tracking-widest uppercase mb-1">
               LOCALISATION *
              </label>
              <select
                name="localisation"
                value={formData.localisation}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-100 border-0 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:bg-white transition-all duration-300 appearance-none cursor-pointer"
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

          {/* Project Description */}
          <div>
            <label className="block text-xs font-medium text-gray-700 tracking-widest  uppercase mb-1">
              DESCRIPTION DU PROJET *
            </label>
            <textarea
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleInputChange}
              required
              rows="6"
              className="w-full px-3 py-2 bg-gray-100 border-0 text-gray-800 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:bg-white transition-all duration-300 resize-none"
              placeholder="Parlez-nous de votre vision du projet, vos préférences de style, calendrier et toute exigence spécifique..."
            />
          </div>

          {/* Contact Info */}
          <div className="text-center">
            <p className="text-xs text-gray-600 tracking-wider">
              username@exemple.com | +216 20 123 456
            </p>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-2 px-6 text-xs font-medium tracking-widest uppercase transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transform hover:scale-[1.01] ${
                isSubmitting 
                  ? 'bg-gray-500 text-white cursor-not-allowed' 
                  : 'bg-gray-800 text-white hover:bg-black'
              }`}
            >
              {isSubmitting ? 'ENVOI EN COURS...' : 'ENVOYER VOTRE MESSAGE'}
            </button>
            
            {/* Status Messages */}
            {isSubmitting && (
              <div className="mt-3 p-3 bg-blue-50 text-center">
                <p className="text-sm text-blue-700">
                  Envoi de votre message en cours...
                </p>
              </div>
            )}
            
            {submitStatus === 'success' && (
              <div className="mt-3 p-3 bg-green-50 text-center">
                <p className="text-sm text-green-700">
                  Merci de nous avoir contacté. Nous vous répondrons sous peu.
                </p>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="mt-3 p-3 bg-red-50 text-center">
                <p className="text-sm text-red-700">
                  Une erreur s'est produite. Veuillez réessayer plus tard.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;