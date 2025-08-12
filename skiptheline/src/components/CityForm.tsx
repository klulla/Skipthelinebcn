'use client';

import { useState, useEffect } from 'react';
import { Building, X, Star, Globe } from 'lucide-react';

interface City {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  status: 'active' | 'inactive';
}

interface CityFormProps {
  city?: City | null;
  onSave: (cityData: Omit<City, 'id'>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function CityForm({ city, onSave, onCancel, isEditing = false }: CityFormProps) {
  const [formData, setFormData] = useState<Omit<City, 'id'>>({
    name: city?.name || '',
    description: city?.description || '',
    imageUrl: city?.imageUrl || '',
    status: city?.status || 'active'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (city) {
      setFormData({
        name: city.name,
        description: city.description,
        imageUrl: city.imageUrl,
        status: city.status
      });
    }
  }, [city]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving city:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-effect-strong rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700/50">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-neon-pink to-neon-teal rounded-xl">
              <Globe className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">
                {isEditing ? 'Edit City' : 'Add New City'}
              </h2>
              <p className="text-gray-400">Manage city information and settings</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center">
              <Star className="w-5 h-5 mr-2 text-neon-pink" />
              Basic Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                City Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-neon-pink focus:outline-none transition-colors"
                placeholder="Enter city name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-neon-pink focus:outline-none transition-colors resize-none"
                placeholder="Enter city description"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-neon-pink focus:outline-none transition-colors"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-neon-pink focus:outline-none transition-colors"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-4 bg-gray-800/50 text-gray-300 font-bold rounded-2xl transition-all duration-300 hover:bg-gray-700/50 border border-gray-600 hover:border-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim() || !formData.description.trim() || !formData.imageUrl.trim()}
              className="px-8 py-4 btn-neon text-black font-bold rounded-2xl transition-all duration-300 ripple disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : isEditing ? 'Update City' : 'Create City'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
