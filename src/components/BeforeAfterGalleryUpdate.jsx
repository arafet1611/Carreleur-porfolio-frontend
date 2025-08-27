import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Upload, 
  X, 
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  Loader
} from 'lucide-react';

export default function BeforeAfterGalleryUpdate({ project, onUpdate }) {
  const [galleryItems, setGalleryItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedView, setSelectedView] = useState('all');
  const [newItem, setNewItem] = useState({
    beforeImage: null,
    afterImage: null
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  // Track loading states for individual items
  const [loadingItems, setLoadingItems] = useState(new Set());

  // Initialize gallery items from project data
  useEffect(() => {
    if (project && project.beforeAndAfterGallery) {
      setGalleryItems(project.beforeAndAfterGallery.map((item, index) => ({
        id: index,
        beforeImage: item.beforeImage,
        afterImage: item.afterImage,
        isVisible: true
      })));
    }
  }, [project]);

  // Helper functions to manage loading states
  const setItemLoading = (itemId, isLoading) => {
    setLoadingItems(prev => {
      const newSet = new Set(prev);
      if (isLoading) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  };

  const isItemLoading = (itemId) => {
    return loadingItems.has(itemId);
  };

  // Filter items based on selected view
  const filteredItems = galleryItems.filter(item => {
    if (selectedView === 'visible') return item.isVisible;
    if (selectedView === 'hidden') return !item.isVisible;
    return true;
  });

const saveToDatabase = async (newItems) => {
  setIsSaving(true);
  setError(null);
  
  try {
    const formDataToSend = new FormData();
    
    // Only send new items (files) to the server
    // The server will handle appending them to the existing gallery
    newItems.forEach((item, index) => {
      if (item.beforeImage && typeof item.beforeImage !== 'string') {
        formDataToSend.append(`beforeImage${index}`, item.beforeImage);
      }
      
      if (item.afterImage && typeof item.afterImage !== 'string') {
        formDataToSend.append(`afterImage${index}`, item.afterImage);
      }
    });

    const response = await fetch(`/api/projects/${project._id}/gallery`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
      },
      body: formDataToSend,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erreur HTTP! statut: ${response.status}`);
    }

    const updatedProject = await response.json();
    onUpdate(updatedProject);
    setSaveSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
    return updatedProject;
  } catch (err) {
    console.error('Error updating gallery:', err);
    setError(err.message);
    throw err;
  } finally {
    setIsSaving(false);
  }
};

  const addNewItem = async () => {
    if (newItem.beforeImage && newItem.afterImage) {
      try {
        setIsSaving(true);
        
        // Create temporary item with files
        const tempItem = {
          id: Date.now(),
          beforeImage: newItem.beforeImage,
          afterImage: newItem.afterImage,
          isVisible: true
        };

        // Save to database first
        const updatedItems = [...galleryItems, tempItem];
        const updatedProject = await saveToDatabase(updatedItems);
        
        // If successful, update local state
        setGalleryItems(updatedProject.beforeAndAfterGallery.map((item, index) => ({
          id: index,
          beforeImage: item.beforeImage,
          afterImage: item.afterImage,
          isVisible: true
        })));
        
        setNewItem({ beforeImage: null, afterImage: null });
        setShowAddForm(false);
      } catch (err) {
        console.error('Error adding new item:', err);
      }
    }
  };

const deleteItem = async (id) => {
  try {
    setItemLoading(id, true);
    
    // Find the index of the item to delete
    const itemIndex = galleryItems.findIndex(item => item.id === id);
    if (itemIndex === -1) return;

    const response = await fetch(`/api/projects/${project._id}/gallery/${itemIndex}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const updatedProject = await response.json();
    onUpdate(updatedProject);
    
    // Update local state
    setGalleryItems(updatedProject.beforeAndAfterGallery.map((item, index) => ({
      id: index,
      beforeImage: item.beforeImage,
      afterImage: item.afterImage,
      isVisible: true
    })));
    
  } catch (err) {
    console.error('Error deleting item:', err);
    setError(err.message);
  } finally {
    setItemLoading(id, false);
  }
};

  const toggleVisibility = async (id) => {
    try {
      setItemLoading(id, true);
      const updatedItems = galleryItems.map(item => 
        item.id === id ? { ...item, isVisible: !item.isVisible } : item
      );
      const updatedProject = await saveToDatabase(updatedItems);
      
      setGalleryItems(updatedProject.beforeAndAfterGallery.map((item, index) => ({
        id: index,
        beforeImage: item.beforeImage,
        afterImage: item.afterImage,
        isVisible: true
      })));
    } catch (err) {
      console.error('Error toggling visibility:', err);
    } finally {
      setItemLoading(id, false);
    }
  };

  const handleFileUpload = (file, type) => {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Les images ne doivent pas dépasser 5MB");
      return;
    }
    
    setNewItem(prev => ({ ...prev, [type]: file }));
    setError(null);
  };

  const ImageUploadArea = ({ file, onUpload, label }) => (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onUpload(e.target.files[0])}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        id={`upload-${label}`}
      />
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:border-red-400 hover:bg-red-50 transition-colors">
        {file ? (
          <div className="space-y-2">
            <img 
              src={typeof file === 'string' ? file : URL.createObjectURL(file)} 
              alt="Preview" 
              className="w-full h-32 object-cover rounded-md mx-auto"
            />
            <p className="text-sm text-gray-600">
              {typeof file === 'string' ? 'Image existante' : file.name}
            </p>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-600 text-sm">Image {label}</p>
            <p className="text-xs text-gray-500">Cliquer ou glisser</p>
          </>
        )}
      </div>
    </div>
  );

  const BeforeAfterSlider = ({ beforeImage, afterImage, id, isVisible }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const itemIsLoading = isItemLoading(id);

    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="relative h-64 bg-gray-100 overflow-hidden">
          {/* Before Image */}
          <div 
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img 
              src={typeof beforeImage === 'string' ? beforeImage : URL.createObjectURL(beforeImage)} 
              alt="Avant" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              AVANT
            </div>
          </div>
          
          {/* After Image */}
          <div 
            className="absolute inset-0"
            style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
          >
            <img 
              src={typeof afterImage === 'string' ? afterImage : URL.createObjectURL(afterImage)} 
              alt="Après" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
              APRÈS
            </div>
          </div>
          
          {/* Slider */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            onMouseDown={(e) => {
              const rect = e.currentTarget.parentElement.getBoundingClientRect();
              const handleMouseMove = (e) => {
                const x = e.clientX - rect.left;
                const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                setSliderPosition(percentage);
              };
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
              <ArrowLeft className="h-3 w-3 text-gray-600 -mr-1" />
              <ArrowRight className="h-3 w-3 text-gray-600 -ml-1" />
            </div>
          </div>

          {/* Visibility overlay */}
          {!isVisible && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white text-center">
                <EyeOff className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Masqué</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="p-4">
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() => toggleVisibility(id)}
              className={`p-2 rounded transition-colors ${
                isVisible 
                  ? 'text-green-600 hover:bg-green-50' 
                  : 'text-gray-400 hover:bg-gray-50'
              } ${itemIsLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isVisible ? 'Masquer' : 'Afficher'}
              disabled={itemIsLoading}
            >
              {
                isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />
              }
            </button>
            
            <button
              onClick={() => deleteItem(id)}
              className={`p-2 text-red-600 hover:bg-red-50 rounded transition-colors ${
                itemIsLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Supprimer"
              disabled={itemIsLoading}
            >
              {itemIsLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!project) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Projet non chargé
          </h2>
          <p className="text-gray-600">
            Impossible de charger la galerie du projet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">
              Galerie Avant/Après
            </h2>
            <p className="text-gray-600">
             <span className="hidden sm:inline">Gérez vos comparaisons avant/après pour montrer la transformation de vos projets</span> 
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* View Filter */}
            <select
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              disabled={isSaving}
            >
              <option value="all">Tout afficher ({galleryItems.length})</option>
              <option value="visible">Visibles ({galleryItems.filter(i => i.isVisible).length})</option>
              <option value="hidden">Masqués ({galleryItems.filter(i => !i.isVisible).length})</option>
            </select>
            
            {isSaving ? (
              <div className="flex items-center text-gray-600">
                <Loader className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm">Sauvegarde...</span>
              </div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-300 transition-colors"
                disabled={isSaving}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </button>
            )}
          </div>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <Check className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800 text-sm">Galerie mise à jour avec succès!</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-800">
                  Ajouter une comparaison avant/après
                </h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                  disabled={isSaving}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Avant *
                    </label>
                    <ImageUploadArea
                      file={newItem.beforeImage}
                      onUpload={(file) => handleFileUpload(file, 'beforeImage')}
                      label="avant"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Après *
                    </label>
                    <ImageUploadArea
                      file={newItem.afterImage}
                      onUpload={(file) => handleFileUpload(file, 'afterImage')}
                      label="après"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={isSaving}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={addNewItem}
                    disabled={!newItem.beforeImage || !newItem.afterImage || isSaving}
                    className="flex items-center px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSaving ? (
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    {isSaving ? 'Ajout en cours...' : 'Ajouter'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <BeforeAfterSlider
              key={item.id}
              beforeImage={item.beforeImage}
              afterImage={item.afterImage}
              id={item.id}
              isVisible={item.isVisible}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Upload className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune comparaison trouvée
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedView === 'all' 
                ? "Commencez par ajouter votre première comparaison avant/après."
                : `Aucune image ${selectedView === 'visible' ? 'visible' : 'masquée'} pour le moment.`
              }
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 transition-colors"
              disabled={isSaving}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une comparaison
            </button>
          </div>
        )}
      </div>
    </div>
  );
}