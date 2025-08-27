import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Plus,
  X,
  ArrowLeft,
} from "lucide-react";
import TopNavigation from "../components/TopNavigation";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

export default function ProjectForm() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    mainImage: null,
    date: "",
    beforeAndAfterGallery: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMainImageUpload = (file) => {
    console.log("Main image file:", file);
    if (file) {
      setFormData((prev) => ({
        ...prev,
        mainImage: file,
      }));
    }
  };

  const addGalleryItem = () => {
    setFormData((prev) => ({
      ...prev,
      beforeAndAfterGallery: [
        ...prev.beforeAndAfterGallery,
        { beforeImage: null, afterImage: null },
      ],
    }));
  };

  const removeGalleryItem = (i) => {
    setFormData((prev) => ({
      ...prev,
      beforeAndAfterGallery: prev.beforeAndAfterGallery.filter(
        (_, index) => index !== i
      ),
    }));
  };

  const updateGalleryItem = (i, field, value) => {
    console.log(`Updating gallery item ${i} field ${field} with value:`, value);
    setFormData((prev) => ({
      ...prev,
      beforeAndAfterGallery: prev.beforeAndAfterGallery.map((item, index) =>
        index === i ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleGalleryImageUpload = (i, field, file) => {
    console.log(`Gallery image ${field} for item ${i}:`, file);
    updateGalleryItem(i, field, file);
  };

  const navigateTo = (path) => {
    // This assumes you're using React Router
    // If using Next.js, you would use: router.push(path)
    window.location.href = path;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitMessage("Création du projet en cours...");

    try {
      const formDataToSend = new FormData();

      // Append basic fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("date", formData.date);

      // Append main image
      if (formData.mainImage) {
        formDataToSend.append("mainImage", formData.mainImage);
      }

      // Append gallery images
      formData.beforeAndAfterGallery.forEach((item, index) => {
        if (item.beforeImage) {
          formDataToSend.append(`beforeImage${index}`, item.beforeImage);
        }
        if (item.afterImage) {
          formDataToSend.append(`afterImage${index}`, item.afterImage);
        }
      });

      const response = await fetch("/api/projects", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const result = await response.json();
      console.log("Project created successfully:", result);

      // Reset form
      setFormData({
        title: "",
        description: "",
        location: "",
        category: "",
        mainImage: null,
        date: "",
        beforeAndAfterGallery: [],
      });
      setCurrentPage(1);

      // Show success message
      setSubmitMessage("Projet créé avec succès! Redirection en cours...");

      // Wait 1 seconds then navigate to dashboard
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitMessage("");
        navigateTo("/admin/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Error creating project:", error);
      setSubmitMessage(
        "Erreur lors de la création du projet. Veuillez réessayer."
      );

      // Hide error message after 5 seconds
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitMessage("");
      }, 2000);
    }
  };

  const nextPage = () => {
    if (currentPage < 2) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const ImageUploadArea = ({
    onUpload,
    file,
    label,
    accept = "image/*",
    index,
    field,
  }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:border-gray-400 transition-colors">
      <input
        type="file"
        accept={accept}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            console.log("File selected:", e.target.files[0]);
            onUpload(index, field, e.target.files[0]);
          }
        }}
        className="hidden"
        id={`upload-${label}-${index}`}
      />
      <label htmlFor={`upload-${label}-${index}`} className="cursor-pointer">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">
                        {console.log("file",file)}

          {file ? file.name : `Cliquer ou déposer ${label}`}
        </p>
        <p className="text-sm text-gray-500">
          Publiez une photo (taille max : 5 Mo)
        </p>
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sm:hidden h-12"></div>

      <TopNavigation />
      <div className="flex">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Submission Alert */}
            {isSubmitting && (
              <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                  {submitMessage}
                </div>
              </div>
            )}
            {/* Header with back button */}
            <div className="flex items-center mb-6">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Retour
              </button>
            </div>
            {/* Header */}
            <div className="bg-white rounded-t-lg border-b">
              <div className="px-6 py-4">
                <h1 className="text-2xl font-medium text-red-600 border-b-2 border-red-600 inline-block pb-1">
                  Créer un projet
                </h1>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="bg-white px-6 py-2 border-b">
              <div className="flex items-center space-x-4">
                <div
                  className={`px-3 py-1 rounded text-sm ${
                    currentPage === 1
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  Page 1: Informations de base
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <div
                  className={`px-3 py-1 rounded text-sm ${
                    currentPage === 2
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  Page 2: Galerie avant/après
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-b-lg p-6">
              {currentPage === 1 && (
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quel est le titre de votre projet? *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Saisir le titre"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                     Exemples: "Rénovation avec du carrelage premium " ou
"Escalier avec du carrelage résistant au gel" ou
"Crédence en carrelage type carreaux métro" 
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Localisation *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Localisation"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        disabled={isSubmitting}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
    Exemples: "Saint-Germain, Paris" • "Vieux Lyon" • "Le Panier, Marseille" • "Capitole, Toulouse"
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description du projet *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Décrivez votre produit ou service en détail..."
                      rows="6"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      required
                      disabled={isSubmitting}
                    />
                
                    <p className="text-xs text-gray-500 mt-1">
                      Exemples: " Salle de bains • Cuisine • Terrasse • Sol • Mur • Crédence"

                    </p>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date du projet
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Main Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image principale *
                    </label>
                    <ImageUploadArea
                      onUpload={(index, field, file) =>
                        handleMainImageUpload(file)
                      }
                      file={formData.mainImage}
                      label="l'image principale"
                      index={0}
                      field="mainImage"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Choisissez une image qui représente le mieux votre projet.
                    </p>
                  </div>
                </div>
              )}

              {currentPage === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Galerie avant/après
                    </label>
                    <p className="text-sm text-gray-600 mb-4">
                      Ajoutez des photos avant et après pour montrer la
                      transformation de votre projet.
                    </p>

                    {formData.beforeAndAfterGallery.map((item, i) => (
                      <div
                        key={i}
                        className="border border-gray-200 rounded-lg p-4 mb-4"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-medium">Photo {i + 1}</h4>
                          <button
                            onClick={() => removeGalleryItem(i)}
                            className="text-red-600 hover:text-red-800"
                            disabled={isSubmitting}
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Image Avant
                            </label>
                            <ImageUploadArea
                              onUpload={handleGalleryImageUpload}
                              file={item.beforeImage}
                              label="image avant"
                              index={i}
                              field="beforeImage"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Image Après
                            </label>
                            <ImageUploadArea
                              onUpload={handleGalleryImageUpload}
                              file={item.afterImage}
                              label="image après"
                              index={i}
                              field="afterImage"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={addGalleryItem}
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors"
                      disabled={isSubmitting}
                    >
                      <Plus className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-600">
                        Ajouter une nouvelle comparaison avant/après
                      </p>
                    </button>

                    <p className="text-xs text-gray-500 mt-2">
                      Choisissez une photo illustrative de votre projet.{" "}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 mt-6 border-t">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1 || isSubmitting}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    currentPage === 1 || isSubmitting
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Précédent
                </button>

                {currentPage === 1 ? (
                  <button
                    onClick={nextPage}
                    disabled={isSubmitting}
                    className={`flex items-center px-6 py-2 rounded-md transition-colors ${
                      isSubmitting
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-6 py-2 rounded-md transition-colors ${
                      isSubmitting
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {isSubmitting ? "Création en cours..." : "Soumettre"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pb-12 md:pb-0"> </div>
    </div>
  );
}
