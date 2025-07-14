'use client';

import { useState, useEffect } from 'react';
import { Event, EventFormData, Club } from '@/types';
import { getClubs } from '@/lib/firebaseService';
import { 
  X, 
  Save, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Euro,
  Link as LinkIcon,
  ImageIcon,
  FileText,
  Building,
  AlertCircle,
  ChevronDown
} from 'lucide-react';

interface EventFormProps {
  event?: Event | null;
  onSave: (eventData: EventFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function EventForm({ event, onSave, onCancel, isEditing = false }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: event?.title || '',
    clubId: event?.clubId || '',
    date: event?.date || '',
    time: event?.time || '',
    price: event?.price || 0,
    description: event?.description || '',
    maxTickets: event?.maxTickets || 0,
    imageUrl: event?.imageUrl || '',
    stripePaymentLink: event?.stripePaymentLink || '',
    spreadsheetLink: event?.spreadsheetLink || '',
    availability: event?.availability || 0
  });

  const [errors, setErrors] = useState<Partial<EventFormData>>({});
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  // Load clubs from Firebase
  useEffect(() => {
    const loadClubs = async () => {
      try {
        const clubsData = await getClubs();
        setClubs(clubsData);
      } catch (error) {
        console.error('Error loading clubs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClubs();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<EventFormData> = {};

    if (!formData.title.trim()) newErrors.title = 'Event title is required';
    if (!formData.clubId.trim()) newErrors.clubId = 'Club selection is required';
    if (!formData.date) newErrors.date = 'Event date is required';
    if (!formData.time) newErrors.time = 'Event time is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0' as any;
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.maxTickets <= 0) newErrors.maxTickets = 'Max tickets must be greater than 0' as any;
    if (formData.availability < 0) newErrors.availability = 'Availability cannot be negative' as any;
    if (formData.availability > formData.maxTickets) newErrors.availability = 'Availability cannot exceed max tickets' as any;
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'Image URL is required';
    if (!formData.stripePaymentLink.trim()) newErrors.stripePaymentLink = 'Stripe payment link is required';
    if (!formData.stripePaymentLink.includes('buy.stripe.com')) {
      newErrors.stripePaymentLink = 'Invalid Stripe payment link format';
    }
    if (formData.spreadsheetLink && !formData.spreadsheetLink.includes('docs.google.com/spreadsheets')) {
      newErrors.spreadsheetLink = 'Invalid Google Sheets link format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (field: keyof EventFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const selectedClub = clubs.find(club => club.id === formData.clubId);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-effect-strong rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700/50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black bg-gradient-to-r from-neon-pink to-neon-teal bg-clip-text text-transparent">
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onCancel}
            className="p-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Event Title */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                <FileText className="inline w-4 h-4 mr-2" />
                Event Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                  errors.title ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-neon-pink'
                }`}
                placeholder="Enter event title"
              />
              {errors.title && (
                <p className="text-red-400 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Club Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                <Building className="inline w-4 h-4 mr-2" />
                Club
              </label>
              <div className="relative">
                <select
                  value={formData.clubId}
                  onChange={(e) => handleChange('clubId', e.target.value)}
                  disabled={loading}
                  className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white focus:outline-none transition-colors appearance-none ${
                    errors.clubId ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-neon-pink'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="">
                    {loading ? 'Loading clubs...' : 'Select a club'}
                  </option>
                  {clubs.filter(club => club.status === 'active').map(club => (
                    <option key={club.id} value={club.id}>
                      {club.name} - {club.type.charAt(0).toUpperCase() + club.type.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {selectedClub && (
                <div className="text-sm text-gray-400 mt-1">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  {selectedClub.location}
                </div>
              )}
              {clubs.length === 0 && !loading && (
                <div className="text-sm text-yellow-400 mt-1">
                  <AlertCircle className="inline w-4 h-4 mr-1" />
                  No clubs available. Please create a club first.
                </div>
              )}
              {errors.clubId && (
                <p className="text-red-400 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.clubId}
                </p>
              )}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                <Calendar className="inline w-4 h-4 mr-2" />
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white focus:outline-none transition-colors ${
                  errors.date ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-neon-pink'
                }`}
              />
              {errors.date && (
                <p className="text-red-400 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.date}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                <Clock className="inline w-4 h-4 mr-2" />
                Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white focus:outline-none transition-colors ${
                  errors.time ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-neon-pink'
                }`}
              />
              {errors.time && (
                <p className="text-red-400 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.time}
                </p>
              )}
            </div>
          </div>

          {/* Price and Tickets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                <Euro className="inline w-4 h-4 mr-2" />
                Price (€)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', Number(e.target.value))}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white focus:outline-none transition-colors ${
                  errors.price ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-neon-pink'
                }`}
                placeholder="0"
                min="0"
                step="0.01"
              />
              {errors.price && (
                <p className="text-red-400 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.price}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                <Users className="inline w-4 h-4 mr-2" />
                Max Tickets
              </label>
              <input
                type="number"
                value={formData.maxTickets}
                onChange={(e) => handleChange('maxTickets', Number(e.target.value))}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white focus:outline-none transition-colors ${
                  errors.maxTickets ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-neon-pink'
                }`}
                placeholder="0"
                min="0"
              />
              {errors.maxTickets && (
                <p className="text-red-400 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.maxTickets}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                <Users className="inline w-4 h-4 mr-2" />
                Available Tickets
              </label>
              <input
                type="number"
                value={formData.availability}
                onChange={(e) => handleChange('availability', Number(e.target.value))}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white focus:outline-none transition-colors ${
                  errors.availability ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-neon-pink'
                }`}
                placeholder="0"
                min="0"
                max={formData.maxTickets}
              />
              {errors.availability && (
                <p className="text-red-400 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.availability}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              <FileText className="inline w-4 h-4 mr-2" />
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors resize-none ${
                errors.description ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-neon-pink'
              }`}
              placeholder="Describe the event experience..."
              rows={4}
            />
            {errors.description && (
              <p className="text-red-400 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              <ImageIcon className="inline w-4 h-4 mr-2" />
              Image URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                errors.imageUrl ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-neon-pink'
              }`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.imageUrl && (
              <p className="text-red-400 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.imageUrl}
              </p>
            )}
          </div>

          {/* Stripe Payment Link */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              <LinkIcon className="inline w-4 h-4 mr-2" />
              Stripe Payment Link
            </label>
            <input
              type="url"
              value={formData.stripePaymentLink}
              onChange={(e) => handleChange('stripePaymentLink', e.target.value)}
              className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                errors.stripePaymentLink ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-neon-pink'
              }`}
              placeholder="https://buy.stripe.com/..."
            />
            {errors.stripePaymentLink && (
              <p className="text-red-400 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.stripePaymentLink}
              </p>
            )}
          </div>

          {/* Google Sheets Link */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              <LinkIcon className="inline w-4 h-4 mr-2" />
              Google Sheets Link (Optional)
            </label>
            <input
              type="url"
              value={formData.spreadsheetLink}
              onChange={(e) => handleChange('spreadsheetLink', e.target.value)}
              className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                errors.spreadsheetLink ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-neon-pink'
              }`}
              placeholder="https://docs.google.com/spreadsheets/d/..."
            />
            <p className="text-gray-400 text-sm">
              Link to the Google Sheets where purchases for this event will be tracked
            </p>
            {errors.spreadsheetLink && (
              <p className="text-red-400 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.spreadsheetLink}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700/50">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-800/50 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 btn-neon text-black rounded-xl font-bold transition-all ripple flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Update Event' : 'Create Event'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}