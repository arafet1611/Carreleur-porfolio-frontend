import {
  User,
  Mail,
  Calendar,
  Shield,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  Camera,
  Clock,
  Settings,
  Lock,
  Bell,
  Activity,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopNavigation from "../components/TopNavigation";
import AdminFooter from "../components/AdminFooter";

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Admin data state
  const [adminData, setAdminData] = useState({
    username: "",
    email: "",
    createdAt: "",
  });

  const [formData, setFormData] = useState({ 
    username: "",
    email: "",
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch admin data on component mount
  useEffect(() => {
    fetchAdminData();
  }, []);

  // Fetch admin data from backend
  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAdminData(data.data.admin);
        setFormData({
          username: data.data.admin.username,
          email: data.data.admin.email,
        });
      } else {
        setMessage({ type: 'error', text: 'Erreur lors du chargement des données' });
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setAdminData(prev => ({ ...prev, ...formData }));
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profil modifié avec succès !' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Erreur lors de la modification' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setMessage({ type: 'success', text: 'Mot de passe modifié avec succès !' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Erreur lors de la modification du mot de passe' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setFormData({
      username: adminData.username,
      email: adminData.email,
    });
    setIsEditing(false);
    setIsChangingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <div className="sm:hidden h-12"></div>

      <TopNavigation />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white py-12 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Mon Profil</h1>
                  <p className="text-red-100 text-lg">
                    Gérez vos informations personnelles et paramètres de sécurité
                  </p>
                </div>
                <User className="h-16 w-16 text-red-200" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 px-6 py-8">
            <div className="max-w-4xl mx-auto">
              {/* Message Display */}
              {message.text && (
                <div className={`mb-6 p-4 rounded-xl flex items-center ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 mr-3" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-3" />
                  )}
                  {message.text}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Overview */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                    <div className="relative inline-block mb-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {adminData.username?.charAt(0).toUpperCase() || 'A'}
                      </div>
                     
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{adminData.username}</h2>
                    <p className="text-gray-600 mb-2">{adminData.email}</p>
                    
                    <div className="flex items-center justify-center text-gray-500 text-sm mt-4">
                      <Calendar className="h-4 w-4 mr-1" />
                            Créé le {formatDate(adminData.createdAt)}
                    </div>
                  </div>

              
                </div>

                {/* Main Content - Profile and Security */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Profile Information */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <User className="h-6 w-6 mr-3 text-red-500" />
                        Informations du profil
                      </h3>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Modifier
                        </button>
                      ) : (
                        <button
                          onClick={handleSaveProfile}
                          disabled={loading}
                          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {loading ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom d'utilisateur
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <User className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-gray-900">{adminData.username}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adresse email
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <Mail className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-gray-900">{adminData.email}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date de création
                        </label>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-gray-900">{formatDate(adminData.createdAt)}</span>
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex gap-4 mt-6">
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Annuler
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <Lock className="h-6 w-6 mr-3 text-red-500" />
                        Sécurité
                      </h3>
                      {!isChangingPassword && (
                        <button
                          onClick={() => setIsChangingPassword(true)}
                          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Changer le mot de passe
                        </button>
                      )}
                    </div>

                    {isChangingPassword ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mot de passe actuel
                          </label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nouveau mot de passe
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmer le mot de passe
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                          <button
                            onClick={handleChangePassword}
                            disabled={loading}
                            className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? 'Modification...' : 'Modifier le mot de passe'}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Mot de passe</h4>
                            <p className="text-sm text-gray-600">Dernière modification il y a 30 jours</p>
                          </div>
                          <div className="text-green-600">
                            <Shield className="h-6 w-6" />
                          </div>
                        </div>
                        
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <AdminFooter />
        </div>
      </div>
    </div>
  );
}