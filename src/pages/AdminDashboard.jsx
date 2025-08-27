import {
  Home,
  User,
  Bell,
  Edit3,
  Plus,
  Bookmark,
  LogOut,
  Mail,
  Phone,
  MapPin,
  BarChart3,
  Users,
  Calendar,
  Settings,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Activity
} from "lucide-react";
import { useState, useEffect } from "react";

import TopNavigation from "../components/TopNavigation";
import Sidebar from "../components/Sidebar";
import AdminFooter from "../components/AdminFooter";

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animatedStats, setAnimatedStats] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Animate stats on mount
  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedStats(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
    // Replace with actual navigation logic
  };

  const stats = [
    { 
      icon: Home, 
      label: 'Projets totaux', 
      value: '24', 
      change: '+12%',
      color: 'bg-blue-500',
      trend: 'up'
    },
    { 
      icon: Users, 
      label: 'Clients actifs', 
      value: '18', 
      change: '+8%',
      color: 'bg-green-500',
      trend: 'up'
    },
    { 
      icon: Calendar, 
      label: 'Ce mois', 
      value: '8', 
      change: '+3%',
      color: 'bg-purple-500',
      trend: 'up'
    },
    { 
      icon: BarChart3, 
      label: 'Taux de réussite', 
      value: '92%', 
      change: '+2%',
      color: 'bg-orange-500',
      trend: 'up'
    },
  ];

  const quickActions = [
    {
      icon: Home,
      label: 'Mes Projets',
      description: 'Gérer tous vos projets',
      path: '/admin/projects',
      color: 'bg-red-50 hover:bg-red-100 border-gray-600'
    },
    {
      icon: Bookmark,
      label: 'Mes Notes',
      description: 'Accéder à vos notes',
      path: '/admin/notes',
      color: 'bg-red-50 hover:bg-red-100 border-gray-600'
    },
    {
      icon: Bell,
      label: 'Alertes',
      description: 'Voir les notifications',
      path: '/admin/alerts',
      color: 'bg-red-50 hover:bg-red-100 border-gray-600'
    },
    {
      icon: User,
      label: 'Mon Profil',
      description: 'Gérer votre profil',
      path: '/admin/profile',
      color: 'bg-red-50 hover:bg-red-100 border-gray-700'
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <div className="sm:hidden h-12"></div>

      <TopNavigation />
      
      <div className="flex flex-1">
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Enhanced Hero Section */}
          <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>
            
            <div className="relative py-16 px-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center justify-between">
                  <div className="text-center lg:text-left mb-8 lg:mb-0">
                    <p className="text-red-100 text-sm font-medium tracking-wide mb-2">
                      {currentTime.toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                      Bonjour ! 👋
                    </h1>
                    <p className="text-red-100 text-lg sm:text-xl max-w-2xl leading-relaxed">
                      Voici un aperçu de votre activité. Votre business de carrelage performe à merveille !
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <Activity className="h-24 w-24 text-red-200 mb-4" />
                    <div className="text-center">
                      <p className="text-3xl font-bold">{currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                      <p className="text-red-200 text-sm">Heure actuelle</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Section */}
          <div className="px-6 py-12 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Statistiques en Temps Réel
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className={`bg-white rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300 p-6 transform hover:-translate-y-1 ${
                      animatedStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className={`${stat.color} rounded-xl p-3 mr-4 shadow-lg`}>
                          <stat.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                          <p className="text-sm text-gray-600">{stat.label}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-green-600 text-sm font-medium">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {stat.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 bg-gray-50 px-6 py-12">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
                <div>
                  <h2 className="text-2xl font-bold text-white-900 mb-8 flex items-center">
                    <Settings className="h-6 w-6 mr-3 text-red-500" />
                    Actions Rapides
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => navigate(action.path)}
                        className={`${action.color} p-6 rounded-2xl border-2 transition-all duration-200 text-left group hover:scale-105 hover:shadow-lg`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <action.icon className="h-8 w-8 text-gray-700" />
                          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.label}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

              
              </div>

              
            </div>
          </div>

          <AdminFooter />
        </div>
      </div>
      
      {/* Mobile bottom spacing */}
      <div className="sm:hidden h-20"></div>
    </div>
  );
}