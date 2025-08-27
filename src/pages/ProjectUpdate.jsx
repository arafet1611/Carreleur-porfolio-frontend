import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import BeforeAfterGalleryUpdate from '../components/BeforeAfterGalleryUpdate';
import ProjectDetailsUpdate from '../components/ProjectDetailsUpdate';
import TopNavigation from '../components/TopNavigation';
import Sidebar from '../components/Sidebar';

const ProjectUpdate = () => {
  const { id } = useParams(); // Get project ID from URL
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const API = import.meta.env.VITE_API_URL || '/api';

  // Fetch project data
  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API}/api/projects/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Projet non trouvé');
        }
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }

      const projectData = await response.json();
      setProject(projectData);
    } catch (err) {
      console.error('Erreur lors du chargement du projet:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle project update
  const handleProjectUpdate = (updatedData) => {
    setProject(prev => ({ ...prev, ...updatedData }));
  };

  // Fetch project on component mount
  useEffect(() => {
    if (id) {
      fetchProject();
    } else {
      setError('ID de projet non spécifié');
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
      <div className="sm:hidden h-12"></div>

          <TopNavigation />
        <div className="sm:flex">
            <Sidebar />
          <div className="flex-1 p-6">
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mr-2" />
              <span className="text-gray-600">Chargement du projet...</span>
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
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-lg font-medium text-red-800 mb-2">Erreur</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour au tableau de bord
                </button>
                <button
                  onClick={fetchProject}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
      <div className="sm:hidden h-12"></div>

          <TopNavigation />
        <div className="sm:flex">
            <Sidebar />
          <div className="flex-1 p-6">
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Projet non trouvé
              </h2>
              <p className="text-gray-600 mb-4">
                Le projet que vous essayez de modifier n'existe pas.
              </p>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Retour au tableau de bord
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
        <div className="flex-1 p-6">
          {/* Header with back button */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour
            </button>
         
          </div>

          {/* Project Details */}
          <ProjectDetailsUpdate 
            project={project} 
            onUpdate={handleProjectUpdate}
            onRefresh={fetchProject}
          />
          
          {/* Before/After Gallery */}
          <BeforeAfterGalleryUpdate 
            project={project}
            onUpdate={handleProjectUpdate}
                        onRefresh={fetchProject}

          />
        </div>
      </div>
                  <div className="pb-16 md:pb-0"> </div>

    </div>
  );
};

export default ProjectUpdate;