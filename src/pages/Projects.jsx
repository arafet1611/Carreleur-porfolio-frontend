import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const navItems = [
    { name: "HOME", id: "home", path: "/" },
    { name: "PROJETS", id: "projects", path: "/projects" },
    { name: "SERVICES", id: "services", path: "/services" },
    { name: "CONTACT", id: "contact", path: "/contact" },
  ];
const API = import.meta.env.VITE_API_URL || '/api';
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API}/api/projects/public`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProjects(data.projects || data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Erreur lors du chargement des projets");
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Get up to 3 after images for hover display
  const getAfterImages = (project) => {
    if (
      !project.beforeAndAfterGallery ||
      project.beforeAndAfterGallery.length === 0 ||
      project.beforeAndAfterGallery.length === 1
    ) {
      return [];
    }
    return project.beforeAndAfterGallery
      .map((item) => item.afterImage)
      .filter((img) => img)
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&h=800&fit=crop"
            alt="Travaux de carrelage professionnel - salle de bains moderne"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="min-h-screen bg-white py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-16"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item}>
                    <div className="bg-gray-200 aspect-[4/3] rounded"></div>
                    <div className="h-4 bg-gray-200 rounded mt-4 w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&h=800&fit=crop"
            alt="Travaux de carrelage professionnel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="min-h-screen bg-white py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <h2 className="text-red-800 text-lg mb-4">Erreur</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchProjects}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&h=800&fit=crop"
          alt="Réalisations de carrelage professionnel - projets d'exception"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="min-h-screen bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-7xl mx-auto relative overflow-hidden">
            {/* Header Section */}
            <div className="text-center mb-16">
              <h1 className="text-lg md:text-2xl font-light tracking-[0.2em] text-gray-600 mb-8 font-medium uppercase">
                NOS PROJETS D'EXCEPTION
              </h1>
              <div className="max-w-1xl mx-auto">
                <p className="text-gray-700 text-base leading-relaxed">
                  Confier vos travaux de rénovation à{" "}
                  <span className="underline hover:text-gray-900 transition-colors">
                    {" "}
                    nous
                  </span>{" "}
                  <br />
                  vous garantit un environnement exceptionnel adapté à votre
                  style de vie et à vos priorités. <br />
                  Parcourez nos projets pour découvrir des exemples de notre
                  travail et trouver l'inspiration pour votre propre projet.
                </p>
              </div>
            </div>

            {/* Projects Grid */}
            {projects.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => {
                  const afterImages = getAfterImages(project);
                  const hasAfterImages = afterImages.length > 0;

                  return (
                    <Link
                      key={project._id}
                      to={`/projects/${project._id}/before-after`}
                      className="group cursor-pointer relative block"
                    >
                      <div
                        className="relative overflow-hidden bg-gray-100 aspect-[4/3]"
                        onMouseEnter={() => setHoveredProject(project._id)}
                        onMouseLeave={() => setHoveredProject(null)}
                        onTouchStart={() =>
                          setHoveredProject(
                            hoveredProject === project._id ? null : project._id
                          )
                        }
                      >
                        {/* Main Image */}
                        <img
                          src={
                            project.mainImage ||
                            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center"
                          }
                          alt={project.title}
                          className={`w-full h-full object-cover transition-all duration-700 ${
                            hoveredProject === project._id && hasAfterImages
                              ? "scale-105 opacity-0"
                              : "scale-100 opacity-100 group-hover:scale-105"
                          }`}
                        />

                        {/* Hover Gallery Overlay */}
                        {hasAfterImages && (
                          <div
                            className={`absolute inset-0 transition-all duration-500 ${
                              hoveredProject === project._id
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          >
                            {afterImages.length === 2 && (
                              <div className="flex h-full">
                                <img
                                  src={afterImages[0]}
                                  alt={`${project.title} - Résultat 1`}
                                  className="w-1/2 h-full object-cover"
                                />
                                <img
                                  src={afterImages[1]}
                                  alt={`${project.title} - Résultat 2`}
                                  className="w-1/2 h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Dark overlay for non-hover state */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>

                        {/* Project title overlay (visible on hover) */}
                        <div
                          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-all duration-300 ${
                            hoveredProject === project._id
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-2"
                          }`}
                        >
                          {project.description && (
                            <h3 className="text-white text-sm font-light tracking-wide ">
                              {project.description}
                            </h3>
                          )}
                        </div>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-gray-800 text-lg font-light tracking-wide capitalize">
                          {project.title}
                        </h3>
                        {project.location && (
                          <p className="text-gray-600 text-sm mt-1">
                            {project.location}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="h-12 w-12 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun projet trouvé
                </h3>
                <p className="text-gray-600">
                  Aucun projet de carrelage n'est disponible pour le moment.
                </p>
              </div>
            )}
            <nav className="flex justify-center space-x-5 py-8">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className="w-32 h-20 border border-gray-300 bg-white text-gray-800 font-medium text-sm tracking-wide hover:bg-black hover:text-white transition-all duration-300 ease-in-out focus:outline-none focus:ring-0 flex items-center justify-center"
                  style={{
                    borderRadius: "0px",
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
