import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturedProjectsCarousel = () => {
  const [projects, setProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Add useNavigate hook
const API = import.meta.env.VITE_API_URL || '/api';
  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API}/api/projects/public?limit=6`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProjects(data.projects || data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load featured projects');
    } finally {
      setLoading(false);
    }
  };

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Navigation functions
  const navigateToPortfolio = () => {
    navigate('/projects');
  };

  const navigateToProjectGallery = (projectId) => {
    navigate(`/projects/${projectId}/before-after`);
  };

  // Infinite scroll functions
  const goToPrevious = () => {
    if (projects.length <= 1) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, projects.length - (isMobile ? 1 : 2)) : prevIndex - 1
    );
  };

  const goToNext = () => {
    if (projects.length <= 1) return;
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % Math.max(1, projects.length - (isMobile ? 0 : 1))
    );
  };

  // Get current projects to display
  const getCurrentProjects = () => {
    if (projects.length === 0) return [];
    if (isMobile) {
      return [projects[currentIndex % projects.length]];
    }
    return [
      projects[currentIndex % projects.length],
      projects[(currentIndex + 1) % projects.length]
    ];
  };

  const currentProjects = getCurrentProjects();

  if (loading) {
    return (
      <div className="w-full bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-light tracking-wider text-gray-800 text-start flex-1 -mb-6">
              FEATURED PROJECTS
            </h2>
          </div>
          <div className="flex gap-6">
            {[1, 2].map((item) => (
              <div key={item} className="flex-1">
                <div className="bg-gray-200 aspect-[4/3] mb-6 animate-pulse"></div>
                <div className="text-center">
                  <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse mx-auto w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchProjects}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="w-full bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-light tracking-wider text-gray-800 mb-12">
            FEATURED PROJECTS
          </h2>
          <p className="text-gray-500">No featured projects available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-light tracking-wider text-gray-800 text-start flex-1 -mb-6">
            FEATURED PROJECTS
          </h2>
          <button 
            onClick={navigateToPortfolio}
            className="text-sm font-light tracking-wider text-gray-600 hover:text-gray-800 transition-colors duration-300 uppercase -mb-20"
          >
            VIEW PORTFOLIO →
          </button>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="flex gap-6 transition-all duration-500 ease-in-out">
            {currentProjects.map((project, index) => (
              <div
                key={`${project._id}-${currentIndex}-${index}`}
                className="flex-1 group cursor-pointer"
                onClick={() => navigateToProjectGallery(project._id)}
              >
                <div className="relative overflow-hidden bg-gray-100 aspect-[4/3] mb-6">
                  <img
                    src={project.mainImage || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-light tracking-wider text-gray-800 mb-2 group-hover:text-gray-600 transition-colors duration-300">
                    {project.title}
                  </h3>
                  {project.location && (
                    <p className="text-sm text-gray-500 font-light">
                      {project.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows - Only show if there are enough projects */}
          {projects.length > (isMobile ? 1 : 2) && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 group z-10"
                aria-label="Previous projects"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-300" />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 group z-10"
                aria-label="Next projects"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-300" />
              </button>
            </>
          )}
        </div>

        {/* Progress Indicators - Only show if there are enough projects */}
        {projects.length > 1 && (
          <div className="flex justify-center mt-12 space-x-2">
            {Array.from({ length: Math.max(1, projects.length - (isMobile ? 0 : 1)) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-gray-800 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Current slide indicator */}
        {projects.length > 1 && (
          <div className="text-center mt-6">
            <span className="text-xs text-gray-400 font-light tracking-wider">
              {String(currentIndex + 1).padStart(2, '0')} / {String(Math.max(1, projects.length - (isMobile ? 0 : 1))).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProjectsCarousel;