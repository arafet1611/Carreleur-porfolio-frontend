import React, { useState, useEffect } from "react";
import { Menu, X, Lock, LockOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // For demo purposes - in your real app, this would check localStorage
  const [currentPath, setCurrentPath] = useState("/");
  const navigate = useNavigate();
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Demo authentication toggle (replace with actual localStorage check in your app)


  // Close mobile menu when clicking on a link
  const handleLinkClick = (path) => {
    setIsMenuOpen(false);
    navigate(path);
    setCurrentPath(path);
  };

  // Check if current path matches the link
  const isActive = (path) => {
    return currentPath === path;
  };

  return (
    <div>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div
              onClick={() => handleLinkClick("/")}
              className={`cursor-pointer transition-colors duration-300 ${
                isScrolled ? "text-black" : "text-white"
              }`}
            >
              <h1 className="text-2xl font-light tracking-wider uppercase">
                Farouk et cie
              </h1>
              <p className="text-xs tracking-widest opacity-80 uppercase">
                Carreleur professionnel
              </p>
            </div>

            <div className="flex items-center">
              {/* Desktop Menu */}
              <div
                className={`hidden md:flex space-x-8 transition-colors duration-300 ${
                  isScrolled ? "text-black" : "text-white"
                }`}
              >
                <button
                  onClick={() => handleLinkClick("/")}
                  className={`text-sm font-light tracking-wide hover:opacity-70 transition-all duration-300 ${
                    isActive("/")
                      ? `opacity-100 border-b pb-1 ${
                          isScrolled ? "border-black" : "border-white"
                        }`
                      : ""
                  }`}
                >
                  HOME
                </button>
                <button
                  onClick={() => handleLinkClick("/projects")}
                  className={`text-sm font-light tracking-wide hover:opacity-70 transition-all duration-300 ${
                    isActive("/projects")
                      ? `opacity-100 border-b pb-1 ${
                          isScrolled ? "border-black" : "border-white"
                        }`
                      : ""
                  }`}
                >
                  PROJETS
                </button>
                <button
                  onClick={() => handleLinkClick("/services")}
                  className={`text-sm font-light tracking-wide hover:opacity-70 transition-all duration-300 ${
                    isActive("/services")
                      ? `opacity-100 border-b pb-1 ${
                          isScrolled ? "border-black" : "border-white"
                        }`
                      : ""
                  }`}
                >
                  SERVICES
                </button>
                <button
                  onClick={() => handleLinkClick("/contact")}
                  className={`text-sm font-light tracking-wide hover:opacity-70 transition-all duration-300 ${
                    isActive("/contact")
                      ? `opacity-100 border-b pb-1 ${
                          isScrolled ? "border-black" : "border-white"
                        }`
                      : ""
                  }`}
                >
                  CONTACT
                </button>
              </div>

              

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`md:hidden p-2 transition-colors duration-300 ml-4 ${
                  isScrolled ? "text-black" : "text-white"
                }`}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div
              className={`md:hidden mt-6  p-6 transition-colors duration-300 ${
                isScrolled
                  ? "bg-white "
                  : "bg-black bg-opacity-90"
              }`}
            >
              <div
                className={`flex flex-col space-y-4 transition-colors duration-300 ${
                  isScrolled ? "text-black" : "text-white"
                }`}
              >
                <button
                  onClick={() => handleLinkClick("/")}
                  className={`text-left text-sm font-light tracking-wide hover:opacity-70 transition-all duration-300 ${
                    isActive("/")
                      ? `opacity-100 border-l-2 pl-2 ${
                          isScrolled ? "border-black" : "border-white"
                        }`
                      : ""
                  }`}
                >
                  HOME
                </button>
                <button
                  onClick={() => handleLinkClick("/projects")}
                  className={`text-left text-sm font-light tracking-wide hover:opacity-70 transition-all duration-300 ${
                    isActive("/projects")
                      ? `opacity-100 border-l-2 pl-2 ${
                          isScrolled ? "border-black" : "border-white"
                        }`
                      : ""
                  }`}
                >
                  PROJETS
                </button>
                <button
                  onClick={() => handleLinkClick("/services")}
                  className={`text-left text-sm font-light tracking-wide hover:opacity-70 transition-all duration-300 ${
                    isActive("/services")
                      ? `opacity-100 border-l-2 pl-2 ${
                          isScrolled ? "border-black" : "border-white"
                        }`
                      : ""
                  }`}
                >
                  SERVICES
                </button>
                <button
                  onClick={() => handleLinkClick("/contact")}
                  className={`text-left text-sm font-light tracking-wide hover:opacity-70 transition-all duration-300 ${
                    isActive("/contact")
                      ? `opacity-100 border-l-2 pl-2 ${
                          isScrolled ? "border-black" : "border-white"
                        }`
                      : ""
                  }`}
                >
                  CONTACT
                </button>
                
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
