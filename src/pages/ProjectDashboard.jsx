import React, { useState, useEffect } from "react";
import {
  Home,
  Edit3,
  ChevronDown,
  MapPin,
  Clock,
  Trash2,
  Eye,
  RefreshCw,
} from "lucide-react";
import Swal from "sweetalert2";

import { useNavigate } from "react-router-dom";
import AdminFooter from "../components/AdminFooter";
import Sidebar from "../components/Sidebar";
import TopNavigation from "../components/TopNavigation";

export default function ProjectDashboard() {
  const [selectedFilter, setSelectedFilter] = useState("Nouveaux en premier");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
const API = import.meta.env.VITE_API_URL || '/api';
  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API}/api/projects`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProjects(data.projects || data); // Handle both array and object response
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Erreur lors du chargement des projets");
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas annuler cette action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler",
      reverseButtons: true,
      customClass: {
        confirmButton:
          "px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600",
        cancelButton:
          "px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300",
      },
    });

    if (result.isConfirmed) {
      try {
        // Your delete logic here
        const token = localStorage.getItem("token");
        const response = await fetch(`${API}/api/projects/${projectId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete project");
        }

        // Remove the project from the local state
        setProjects(projects.filter((project) => project._id !== projectId));

        Swal.fire(
          "Supprimé!",
          "Le projet a été supprimé avec succès.",
          "success"
        );
      } catch (err) {
        console.error("Error deleting project:", err);
        Swal.fire(
          "Erreur!",
          "Une erreur est survenue lors de la suppression.",
          "error"
        );
      }
    }
  };
  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const filterOptions = ["Nouveaux en premier", "Anciens en premier"];

  const filteredProjects = [...projects].sort((a, b) => {
    if (selectedFilter === "Nouveaux en premier") {
      return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
    } else {
      return new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date);
    }
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Date non spécifiée";

    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const timeAgo = (dateString) => {
    if (!dateString) return "Date inconnue";

    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Aujourd'hui";
    if (diffInDays === 1) return "Hier";
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
    if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`;
    if (diffInDays < 365) return `Il y a ${Math.floor(diffInDays / 30)} mois`;
    return `Il y a ${Math.floor(diffInDays / 365)} ans`;
  };

 if (loading) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="sm:hidden h-12"></div>

      <TopNavigation />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading messages...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
      <div className="sm:hidden h-12"></div>

        <TopNavigation />
        <div className="sm:flex">
          <Sidebar />
          <div className="flex-1 p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchProjects}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center mx-auto"
              >
                <RefreshCw className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Réessayer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sm:hidden h-12"></div>

      <TopNavigation />

      <div className="sm:flex">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6">
          {/* Header - Mobile Optimized Layout */}
          <div className="mb-6">
            {/* Title on the left */}
            <div className="mb-4">
              <h1 className="text-xl sm:text-2xl font-medium text-gray-800">
                Mes projets de carrelage
                <span className="text-blue-500 text-sm sm:text-base ml-2 font-normal">
                  ({projects.length} projet{projects.length !== 1 ? "s" : ""})
                </span>
              </h1>
            </div>
            
            {/* Controls on the right - Mobile responsive */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-end sm:space-y-0 sm:space-x-4">
              {/* Mobile: Buttons side by side, Desktop: Horizontal */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate("/admin/dashboard/project-form")}
                  className="bg-red-500 text-white px-4 py-2 text-sm rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center flex-1 sm:flex-none"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Nouveau projet
                </button>
                <button
                  onClick={fetchProjects}
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center sm:bg-gray-200 sm:text-gray-700 sm:px-4 sm:hover:bg-gray-300"
                  title="Actualiser"
                >
                  <RefreshCw className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Actualiser</span>
                </button>
              </div>
              
              {/* Filter dropdown */}
              <div className="relative">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-auto"
                >
                  {filterOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                {/* Project Image */}
                <div className="relative">
                  <img
                    src={
                      project.mainImage ||
                      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=250&fit=crop&crop=center"
                    }
                    alt={project.title}
                    className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
                  />
                </div>

                {/* Project Content */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base">
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 mb-3 sm:space-y-0">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {project.location || "Localisation non spécifiée"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span>{timeAgo( project.date)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 truncate flex-1 mr-2">
                      {formatDate( project.date)}
                    </div>
                    <div className="flex items-center sm:space-x-2 space-x-1 flex-shrink-0">
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/dashboard/project-update/${project._id}`
                          )
                        }
                        className="sm:p-1.5 p-2 hover:bg-gray-100 rounded"
                        title="Modifier"
                      >
                        <Edit3 className="h-5 w-5 sm:h-4 sm:w-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => deleteProject(project._id)}
                        className="sm:p-1.5 p-2 hover:bg-gray-100 rounded"
                        title="Supprimer"
                      >
                        <Trash2 className="h-5 w-5 sm:h-4 sm:w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Home className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun projet trouvé
              </h3>
              <p className="text-gray-600 mb-4 px-4">
                Vous n'avez aucun projet de carrelage enregistré pour le moment.
              </p>
              <button
                onClick={() => navigate("/admin/dashboard/project-form")}
                className="bg-red-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Créer votre premier projet
              </button>
            </div>
          )}
        </div>
      </div>
      <AdminFooter />
    </div>
  );
}