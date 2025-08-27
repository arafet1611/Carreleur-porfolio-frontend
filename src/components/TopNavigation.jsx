import { useLocation, Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function TopNavigation() {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  return (
    <nav className="bg-white shadow-sm border-b px-6 py-3 hidden md:block z-50">
      <div className="flex items-center text-sm text-gray-500">
                  <Home className="h-4 w-4 mr-1" />


        {pathParts.map((part, index) => {
          const link = "/" + pathParts.slice(0, index + 1).join("/");
          const isLast = index === pathParts.length - 1;
          const isProjectUpdate = part === "project-update";
          // Custom display text for specific paths
          const getDisplayText = (part) => {
            switch(part) {
              case "project-update":
                return "Modifier Projet";
              case "project-form":
                return "Nouveau Projet";
       
              default:
                return part;
            }
          };

          return (
            <span key={link} className="flex items-center">
              <span className="mx-2">›</span>
              {isLast || isProjectUpdate  ? (
                <span className="text-gray-700">
                  {getDisplayText(part)}
                </span>
              ) : (
                <Link to={link} className="hover:underline hover:text-gray-700">
                  {getDisplayText(part)}
                </Link>
              )}
            </span>
          );
        })}
      </div>
    </nav>
  );
}