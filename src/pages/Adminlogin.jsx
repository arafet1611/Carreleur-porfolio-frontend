import React, { useState, useEffect } from 'react';
import { Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    identifier: '', // Can be email or username
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        // Store token in localStorage or secure storage
        if (formData.rememberMe) {
          localStorage.setItem('adminToken', data.data.token);
        } else {
          sessionStorage.setItem('adminToken', data.data.token);
        }
        
        setSuccess('Connexion réussie! Redirection...');
        
        // Redirect to dashboard after success
        setTimeout(() => {
          window.location.href = '/admin';
        }, 1500);
        
      } else {
        setError(data.message || 'Échec de la connexion');
        setLoginAttempts(prev => prev + 1);
      }
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Erreur de connexion. Veuillez réessayer.');
      setLoginAttempts(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getIdentifierPlaceholder = () => {
    return "Email ou nom d'utilisateur";
  };

  const getIdentifierType = () => {
    // Check if the input looks like an email
    if (formData.identifier.includes('@')) {
      return 'email';
    }
    return 'text';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* Main Content */}
      <div className="flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-md">
          
          {/* Profile Section */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Administration
            </h1>
            <p className="text-gray-600 text-sm">
              Connectez-vous avec votre email ou nom d'utilisateur
            </p>
          </div>

          {/* Login Card */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            
            {/* Identifier Field (Email or Username) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email ou nom d'utilisateur
              </label>
              <div className="relative">
                <input
                  type={getIdentifierType()}
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200"
                  placeholder={getIdentifierPlaceholder()}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200"
                  placeholder="Entrez votre mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                Se souvenir de moi
              </label>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Login Attempts Warning */}
            {loginAttempts >= 3 && !success && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-600">
                  Plusieurs tentatives échouées. Assurez-vous d'utiliser le bon email/nom d'utilisateur et mot de passe.
                </p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-red-300 disabled:to-red-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Connexion en cours...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          {/* Help Section */}
          <div className="text-center mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Comment se connecter ?</h3>
              <p className="text-xs text-blue-600">
                Vous pouvez utiliser soit votre <strong>adresse email</strong> soit votre <strong>nom d'utilisateur</strong> pour vous connecter.
              </p>
            </div>
            
            <p className="text-xs text-gray-400 mt-4">
              © 2025 Farouk et Cie - Carreleur Professionnel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;