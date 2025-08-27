import React from 'react';

const NoteCard = ({ note, onClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getPriorityText = (priority) => {
    switch(priority) {
      case 'high': return 'élevée';
      case 'medium': return 'moyenne';
      case 'low': return 'faible';
      default: return priority;
    }
  };

  const getContentText = (content) => {
    if (content.type === 'text') {
      return content.text || '';
    } else if (content.type === 'list') {
      return content.items ? content.items.join(', ') : '';
    } else if (content.type === 'title') {
      return content.title || '';
    }
    return '';
  };

  const getCombinedPreviewContent = () => {
    if (note.content.length === 0) return 'Note vide';
    
    let combinedText = '';
    let maxLength = 150; // Approximate character limit for preview
    
    for (let i = 0; i < note.content.length; i++) {
      const content = note.content[i];
      
      // Skip images for text preview
      if (content.type === 'image') continue;
      
      const contentText = getContentText(content);
      
      if (contentText) {
        // Add separator if we already have content
        if (combinedText) {
          combinedText += ' • ';
        }
        
        // Add content text, but check if we're getting close to limit
        const remainingLength = maxLength - combinedText.length;
        
        if (contentText.length <= remainingLength) {
          combinedText += contentText;
        } else {
          // Truncate the current content to fit
          combinedText += contentText.substring(0, remainingLength - 3) + '...';
          break;
        }
        
        // If we're at or near the limit, break
        if (combinedText.length >= maxLength) {
          break;
        }
      }
    }
    
    return combinedText || 'Pas de contenu textuel';
  };

  const getFirstImage = () => {
    return note.content.find(content => content.type === 'image' && content.url);
  };

  const firstImage = getFirstImage();

  return (
    <div
      onClick={() => onClick(note)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1 h-64 flex flex-col"
    >
      <div className="flex justify-between items-start mb-2">
        <p className="text-xs text-gray-500">{formatDate(note.date)}</p>
        <div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
          note.priority === 'high' ? 'bg-red-100 text-red-800 border border-red-200' :
          note.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
          'bg-green-100 text-green-800 border border-green-200'
        }`}>
          {getPriorityText(note.priority)}
        </div>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-2 truncate max-w-[90%] sm:max-w-full">
        {note.title || "Sans titre"}
      </h3>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {firstImage ? (
          <div className="flex flex-col h-full">
            <img 
              src={firstImage.url} 
              alt="Aperçu de la note" 
              className="w-full h-24 object-cover rounded-md mb-2 flex-shrink-0"
            />
            <div className="text-sm text-gray-600 flex-1 overflow-hidden">
              <p className="line-clamp-2">{getCombinedPreviewContent()}</p>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-600 flex-1 overflow-hidden">
            <p className="line-clamp-4">{getCombinedPreviewContent()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteCard;