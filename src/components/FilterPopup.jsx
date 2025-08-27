import React, { useState } from 'react';
import { X, Filter, Calendar, MapPin, DollarSign, User, CheckCircle, Clock, XCircle } from 'lucide-react';

const FilterPopup = ({ isOpen, onClose, onApplyFilters, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    status: initialFilters.status || '',
    location: initialFilters.location || '',
    budgetRange: initialFilters.budgetRange || '',
    projectType: initialFilters.projectType || '',
    dateFrom: initialFilters.dateFrom || '',
    dateTo: initialFilters.dateTo || '',
    clientName: initialFilters.clientName || '',
    ...initialFilters
  });

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'waiting', label: 'Waiting', icon: Clock, color: 'text-orange-600' },
    { value: 'done', label: 'Done', icon: CheckCircle, color: 'text-green-600' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-600' }
  ];

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'Tunis', label: 'Tunis' },
    { value: 'Sousse', label: 'Sousse' },
    { value: 'Sfax', label: 'Sfax' },
    { value: 'Monastir', label: 'Monastir' },
    { value: 'Bizerte', label: 'Bizerte' },
    { value: 'Gabès', label: 'Gabès' },
    { value: 'Ariana', label: 'Ariana' },
    { value: 'Gafsa', label: 'Gafsa' }
  ];

  const budgetOptions = [
    { value: '', label: 'All Budgets' },
    { value: '500-1000', label: '500-1000 DT' },
    { value: '1000-2000', label: '1000-2000 DT' },
    { value: '1500-3000', label: '1500-3000 DT' },
    { value: '2000-5000', label: '2000-5000 DT' },
    { value: '3000-5000', label: '3000-5000 DT' },
    { value: '5000+', label: '5000+ DT' }
  ];

  const projectTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'Residential', label: 'Residential' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Renovation', label: 'Renovation' },
    { value: 'Installation', label: 'Installation' },
    { value: 'Consultation', label: 'Consultation' },
    { value: 'Maintenance', label: 'Maintenance' }
  ];

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      status: '',
      location: '',
      budgetRange: '',
      projectType: '',
      dateFrom: '',
      dateTo: '',
      clientName: ''
    };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Filter className="w-6 h-6 text-red-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Filter Alerts</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-6 space-y-6">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <CheckCircle className="w-4 h-4 inline mr-2 text-red-500" />
              Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              {statusOptions.map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={filters.status === option.value}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 flex items-center">
                    {option.icon && <option.icon className={`w-4 h-4 mr-1 ${option.color}`} />}
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Location and Budget Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <MapPin className="w-4 h-4 inline mr-2 text-red-500" />
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {locationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <DollarSign className="w-4 h-4 inline mr-2 text-red-500" />
                Budget Range
              </label>
              <select
                value={filters.budgetRange}
                onChange={(e) => handleInputChange('budgetRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {budgetOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Project Type
            </label>
            <select
              value={filters.projectType}
              onChange={(e) => handleInputChange('projectType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {projectTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Calendar className="w-4 h-4 inline mr-2 text-red-500" />
              Date Range
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleInputChange('dateFrom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleInputChange('dateTo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Client Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <User className="w-4 h-4 inline mr-2 text-red-500" />
              Client Name
            </label>
            <input
              type="text"
              value={filters.clientName}
              onChange={(e) => handleInputChange('clientName', e.target.value)}
              placeholder="Search by client name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-red-800">Active Filters</h4>
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-red-600 hover:text-red-800 underline"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value) return null;
                  return (
                    <span
                      key={key}
                      className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full"
                    >
                      {key}: {value}
                      <button
                        onClick={() => handleInputChange(key, '')}
                        className="ml-1 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear All Filters
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPopup;