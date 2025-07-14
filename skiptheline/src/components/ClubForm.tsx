'use client';

import { useState, useEffect } from 'react';
import { X, MapPin, Users, Star, Building } from 'lucide-react';
import { Club } from '@/types';

interface ClubFormProps {
  club?: Club | null;
  onSave: (clubData: Omit<Club, 'id'>) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

const clubTypes = [
  { value: 'nightclub', label: 'Nightclub', icon: '🌙' },
  { value: 'rooftop', label: 'Rooftop', icon: '🏙️' },
  { value: 'beach', label: 'Beach', icon: '🏖️' },
  { value: 'underground', label: 'Underground', icon: '🕳️' }
];

const amenities = [
  'VIP Tables', 'Bottle Service', 'Live Music', 'DJ Sets', 
  'Dance Floor', 'Outdoor Area', 'Pool', 'Restaurant',
  'Cocktail Bar', 'Beer Garden', 'Terrace', 'Private Rooms'
];

export default function ClubForm({ club, onSave, onCancel, isEditing = false }: ClubFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    imageUrl: '',
    capacity: 100,
    type: 'nightclub' as 'nightclub' | 'rooftop' | 'beach' | 'underground',
    amenities: [] as string[],
    status: 'active' as 'active' | 'inactive'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (club) {
      setFormData({
        name: club.name,
        location: club.location,
        description: club.description,
        imageUrl: club.imageUrl,
        capacity: club.capacity,
        type: club.type,
        amenities: club.amenities,
        status: club.status
      });
    }
  }, [club]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving club:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-effect-strong rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700/50">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-neon-pink to-neon-teal rounded-xl">
              <Building className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">
                {isEditing ? 'Edit Club' : 'Add New Club'}
              </h2>
              <p className="text-gray-400">Manage club information and settings</p>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Club Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600 rounded-2xl focus:border-neon-pink focus:outline-none text-white transition-colors input-glow"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600 rounded-2xl focus:border-neon-pink focus:outline-none text-white transition-colors input-glow"
                    placeholder="Barcelona, Spain"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600 rounded-2xl focus:border-neon-pink focus:outline-none text-white transition-colors input-glow resize-none"
                rows={4}
                placeholder="Describe the club's atmosphere, music style, and unique features..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600 rounded-2xl focus:border-neon-pink focus:outline-none text-white transition-colors input-glow"
                placeholder="https://example.com/club-image.jpg"
                required
              />
            </div>
          </div>

          {/* Club Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-neon-teal" />
              Club Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Capacity
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                  className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600 rounded-2xl focus:border-neon-pink focus:outline-none text-white transition-colors input-glow"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Club Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600 rounded-2xl focus:border-neon-pink focus:outline-none text-white transition-colors"
                  required
                >
                  {clubTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenities.map(amenity => (
                  <label key={amenity} className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:border-neon-pink/30 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="w-4 h-4 text-neon-pink bg-gray-800 border-gray-600 rounded focus:ring-neon-pink focus:ring-2"
                    />
                    <span className="text-white text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600 rounded-2xl focus:border-neon-pink focus:outline-none text-white transition-colors"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700/50">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-4 bg-gray-800/50 text-gray-300 rounded-2xl border border-gray-700/50 hover:bg-gray-700/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 btn-neon text-black font-bold rounded-2xl transition-all duration-300 ripple disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Club' : 'Create Club')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 