import { Plus, X, Upload, Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3, Palette, Quote } from 'lucide-react';

import { ArrowLeft } from 'lucide-react';

const ViewCard = ({ selectedNote, onBack, onEdit, renderContent }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center p-6 pb-0">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to notes
          </button>
        </div>

        {/* Header */}
        <div className="mx-6 bg-white rounded-t-lg border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-medium text-red-600 border-b-2 border-red-600 inline-block pb-1">
              View Note
            </h1>
          </div>
        </div>

        {/* Form Content */}
        <div className="mx-6 bg-white rounded-b-lg p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-500 mb-2">{selectedNote.date}</div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedNote.title || 'Untitled Note'}
                </h2>
              </div>
              <button 
                onClick={onEdit} 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Edit
              </button>
            </div>

            <div className="space-y-4">
              {selectedNote.content.length === 0 ? (
                <p className="text-gray-400 italic">This note is empty</p>
              ) : (
                selectedNote.content.map((content, index) => renderContent(content, index, false))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCard;