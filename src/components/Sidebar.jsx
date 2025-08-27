import { 
  Home, 
  User, 
  Bell, 
  LogOut, 
  Edit3,
  Plus,
  Bookmark,
  Menu,
  X
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const API = import.meta.env.VITE_API_URL || '/api';
  // Determine active states based on current path
  const isAnnoncesActive = location.pathname === '/admin/dashboard' || 
                          location.pathname.startsWith('/admin/dashboard/project-update/');
  const isAnnoncerActive = location.pathname === '/admin/dashboard/project-form';
  const isNotesActive = location.pathname === '/admin/notes';
  const isAlertsActive = location.pathname === '/admin/alerts';
  const isProfileActive = location.pathname === '/admin/profile';
  
  const handleLogout = async () => {
    try {
      await fetch(`${API}/api/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      localStorage.removeItem('adminToken');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
     
    }
  };
  
  const sidebarItems = [
    { icon: Home, label: 'Mes annonces', active: isAnnoncesActive, onClick: () => navigate('/admin/dashboard') },
    { icon: Bookmark, label: 'Mes Notes', active: isNotesActive, onClick: () => navigate('/admin/notes') },
    { icon: Bell, label: 'Mes alertes', active: isAlertsActive, onClick: () => navigate('/admin/alerts') },
    { icon: User, label: 'Mon profile', active: isProfileActive, onClick: () => navigate('/admin/profile') },
  ];

  const mobileSidebarItems = [
    { icon: Home, label: 'Annonces', active: isAnnoncesActive, onClick: () => navigate('/admin/dashboard') },
    { icon: Bookmark, label: 'Notes', active: isNotesActive, onClick: () => navigate('/admin/notes') },
    { icon: Plus, label: 'Annoncer', active: isAnnoncerActive, isAddButton: true, onClick: () => navigate('/admin/dashboard/project-form') },
    { icon: Bell, label: 'Alertes', active: isAlertsActive, onClick: () => navigate('/admin/alerts') },
    { icon: User, label: 'Mon profile', active: isProfileActive, onClick: () => navigate('/admin/profile') },
  ];

  return (
    <>
      {/* Mobile Navbar - Now shows in both portrait and landscape */}
      <div className="sm:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3 landscape:px-6 landscape:py-2">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3 landscape:w-6 landscape:h-6 landscape:mr-2">
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center landscape:w-4 landscape:h-4">
                <User className="h-3 w-3 text-red-500 landscape:h-2 landscape:w-2" />
              </div>
            </div>
            <span className="text-sm font-medium text-gray-900 landscape:text-xs">Admin Panel</span>
          </div>
          
          {/* Mobile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors landscape:p-1"
            >
              {isDropdownOpen ? <X className="h-5 w-5 text-gray-600 landscape:h-4 landscape:w-4" /> : <Menu className="h-5 w-5 text-gray-600 landscape:h-4 landscape:w-4" />}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 landscape:w-40">
                <div className="px-4 py-2 border-b border-gray-100 landscape:px-3 landscape:py-1">
                  <p className="text-xs text-gray-500 landscape:text-[10px]">Admin@exemple.com</p>
                </div>
                <button
                  onClick={() => { setIsDropdownOpen(false); handleLogout(); }}
                  className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors landscape:px-3 landscape:py-2 landscape:text-xs"
                >
                  <LogOut className="h-4 w-4 mr-3 landscape:h-3 landscape:w-3 landscape:mr-2" />
                  <span>Se déconnecter</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden sm:flex w-64 bg-white shadow-sm h-screen flex-col sticky top-0">
        {/* Profile Section */}
        <div className="p-6 border-b flex-shrink-0">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <p className="text-sm text-gray-600 flex items-center justify-center">
              <Edit3 className="h-3 w-3 mr-1" /> Admin@exemple.com
            </p>
          </div>
        </div>

        {/* Menu (scrollable if long) */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={item.onClick}
                  className={`flex items-center w-full px-4 py-3 rounded-lg text-sm transition-colors ${
                    item.active ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout pinned at bottom */}
        <div className="p-4 sticky bottom-0 bg-white border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-around px-2 py-2 landscape:flex-row landscape:justify-evenly landscape:px-4 landscape:py-1">
          {mobileSidebarItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors relative
                landscape:flex-row landscape:space-x-1 landscape:p-2
                ${item.isAddButton
                  ? 'bg-red-500 text-white rounded-full w-12 h-12 shadow-lg landscape:w-auto landscape:rounded-lg landscape:px-3 landscape:py-2'
                  : item.active
                    ? 'text-red-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {item.isAddButton ? (
                <>
                  <item.icon className="h-6 w-6 landscape:h-4 landscape:w-4" />
                  <span className="hidden landscape:inline-block landscape:text-xs landscape:ml-1">
                    {item.label}
                  </span>
                </>
              ) : (
                <>
                  <item.icon className={`h-5 w-5 mb-1 landscape:mb-0 landscape:h-4 landscape:w-4 ${item.active ? 'text-red-500' : ''}`} />
                  <span className={`text-xs font-medium landscape:text-[10px] landscape:ml-1 ${item.active ? 'text-red-500' : ''}`}>
                    {item.label}
                  </span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isDropdownOpen && (
        <div 
          className="sm:hidden fixed inset-0 z-40 bg-black bg-opacity-25"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;