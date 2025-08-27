import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RecentProjects from "../components/RecentProjects";
export default function BeforeAfterGallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Get project ID from URL
 useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll to top when project ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  // Fetch project data from backend
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/projects/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Project not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const projectData = await response.json();
        setProject(projectData);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Error</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Project not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        <img
          src={project.mainImage || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop&crop=center"}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Text overlay */}
        <div className="absolute inset-0 flex items-center sm:px-4 pr-4 md:pr-12">
          <div className="bg-white/80 backdrop-blur-sm p-6 md:p-10 max-w-xl text-left md:mt-20 mt-12 ">
            <h1 className="text-2xl md:text-4xl font-light tracking-wide mb-4 text-gray-800 uppercase">
              BEFORE & AFTER Transformations
            </h1>
            <h2 className="text-lg md:text-2xl font-light tracking-wide mb-6 text-gray-800">
              {project.title}
            </h2>
             
            <p className="text-gray-700 leading-relaxed mb-4">
                              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide mr-4 w-20">Description:</span>

              {project.description}
            </p>
            {project.location && (
              <>
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide mr-4 w-20">Location:</span>
                <span className="text-gray-800">{project.location}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Gallery section */}
      <div className="min-h-screen bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {project.beforeAndAfterGallery && project.beforeAndAfterGallery.length > 0 ? (
            project.beforeAndAfterGallery.map((item, i) => (
              <div key={i} className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-12">
                {/* Before */}
                <div className="relative group">
                  <div className="relative overflow-hidden bg-white aspect-[4/3]">
                    <img
                      src={item.beforeImage}
                      alt={`Before Renovation ${i + 1}`}
                      className="w-full h-full object-cover cursor-pointer md:cursor-default"
                      onClick={() => window.innerWidth < 768 && setSelectedImage(item.beforeImage)}
                    />
                    <div className="absolute top-4 left-4">
                      <h2 className="text-white text-base sm:text-xl md:text-2xl lg:text-3xl font-light tracking-wide bg-black bg-opacity-30 px-3 py-1 sm:px-4 sm:py-2 rounded">
                        Before
                      </h2>
                    </div>
                  </div>
                </div>

                {/* After */}
                <div className="relative group">
                  <div className="relative overflow-hidden bg-white aspect-[4/3]">
                    <img
                      src={item.afterImage}
                      alt={`After Renovation ${i + 1}`}
                      className="w-full h-full object-cover cursor-pointer md:cursor-default"
                      onClick={() => window.innerWidth < 768 && setSelectedImage(item.afterImage)}
                    />
                    <div className="absolute top-4 right-4">
                      <h2 className="text-white text-base sm:text-xl md:text-2xl lg:text-3xl font-light tracking-wide bg-black bg-opacity-30 px-3 py-1 sm:px-4 sm:py-2 rounded">
                        After
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No before/after images available
              </h3>
              <p className="text-gray-600">
                This project doesn't have any before and after comparisons yet.
              </p>
            </div>
          )}
        </div>

        {/* Modal (only when an image is clicked) */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="relative max-w-3xl w-full px-4">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white text-2xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center z-10"
              >
                ✕
              </button>
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full max-h-[80vh] object-contain"
              />
            </div>
          </div>
        )}
      </div>
      <RecentProjects />
    </div>
  );
}