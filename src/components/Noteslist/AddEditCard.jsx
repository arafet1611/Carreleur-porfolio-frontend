import { ArrowLeft, Type, Image, List, Save } from 'lucide-react';

const AddEditCard = ({ 
  selectedNote, 
  isNewSelectedNote, 
  isSubmitting, 
  onBack, 
  onCancel, 
  onSave, 
  onInputChange, 
  onAddContentBlock, 
  renderContent,
  notes,
  setNotes 
}) => {

  const handleCancel = () => {
    if (isNewSelectedNote) {
      // Remove the empty note if canceling creation
      setNotes(notes.filter(note => note.id !== selectedNote.id));
    }
    onCancel();
  };

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
              {isNewSelectedNote ? 'Create Note' : 'Edit Note'}
            </h1>
          </div>
        </div>

        {/* Form Content */}
        <div className="mx-6 bg-white rounded-b-lg p-6">
          <div className="space-y-6">
            {/* Title & Meta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  value={selectedNote.title}
                  onChange={(e) => onInputChange('title', e.target.value)}
                  placeholder="Note title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  value={selectedNote.date}
                  onChange={(e) => onInputChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Note Content</label>
              <p className="text-sm text-gray-600 mb-4">Add text, images, titles and lists to enrich your note.</p>

              {/* Content blocks */}
              <div className="space-y-4">
                {selectedNote.content.map((content, index) => renderContent(content, index, true))}
              </div>

              {/* Add content buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => onAddContentBlock('title')}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={isSubmitting}
                >
                  <Type className="w-4 h-4" />
                  <span>Title</span>
                </button>
                <button
                  onClick={() => onAddContentBlock('text')}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={isSubmitting}
                >
                  <Type className="w-4 h-4" />
                  <span>Text</span>
                </button>
                <button
                  onClick={() => onAddContentBlock('image')}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={isSubmitting}
                >
                  <Image className="w-4 h-4" />
                  <span>Image</span>
                </button>
                <button
                  onClick={() => onAddContentBlock('list')}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={isSubmitting}
                >
                  <List className="w-4 h-4" />
                  <span>List</span>
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-2">Use different content types to structure your note.</p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-70 flex items-center"
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditCard;