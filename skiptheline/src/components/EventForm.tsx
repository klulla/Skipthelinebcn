'use client';

import { useState } from 'react';
import { Event, EventFormData } from '@/types';
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
  AlertCircle
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
    clubName: event?.clubName || '',
    date: event?.date || '',
    time: event?.time || '',
    price: event?.price || 0,
    description: event?.description || '',
    arrivalWindow: event?.arrivalWindow || '',
    maxTickets: event?.maxTickets || 0,
    imageUrl: event?.imageUrl || '',
    location: event?.location || '',
    stripePaymentLink: event?.stripePaymentLink || '',
    availability: event?.availability || 0
  });

  const [errors, setErrors] = useState<Partial<EventFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<EventFormData> = {};

    if (!formData.title.trim()) newErrors.title = 'Event title is required';
    if (!formData.clubName.trim()) newErrors.clubName = 'Club name is required';
    if (!formData.date) newErrors.date = 'Event date is required';
    if (!formData.time) newErrors.time = 'Event time is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0' as any;
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.arrivalWindow.trim()) newErrors.arrivalWindow = 'Arrival window is required';
    if (formData.maxTickets <= 0) newErrors.maxTickets = 'Max tickets must be greater than 0' as any;
    if (formData.availability < 0) newErrors.availability = 'Availability cannot be negative' as any;
    if (formData.availability > formData.maxTickets) newErrors.availability = 'Availability cannot exceed max tickets' as any;
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'Image URL is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.stripePaymentLink.trim()) newErrors.stripePaymentLink = 'Stripe payment link is required';
    if (!formData.stripePaymentLink.includes('buy.stripe.com')) {
      newErrors.stripePaymentLink = 'Invalid Stripe payment link format';
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
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                <Building className="w-4 h-4 inline mr-2" />
                Event Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 transition-colors input-glow ${
                  errors.title ? 'border-red-500' : 'border-gray-600 focus:border-neon-pink'
                }`}
                placeholder="e.g., Saturday @ Opium – Fast Pass"
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                <Building className="w-4 h-4 inline mr-2" />
                Club Name *
              </label>
              <input
                type="text"
                value={formData.clubName}
                onChange={(e) => handleChange('clubName', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 transition-colors input-glow ${
                  errors.clubName ? 'border-red-500' : 'border-gray-600 focus:border-neon-pink'
                }`}
                placeholder="e.g., Opium Barcelona"
              />
              {errors.clubName && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.clubName}
                </p>
              )}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                <Calendar className="w-4 h-4 inline mr-2" />
                Event Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white transition-colors input-glow ${
                  errors.date ? 'border-red-500' : 'border-gray-600 focus:border-neon-pink'
                }`}
              />
              {errors.date && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.date}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                <Clock className="w-4 h-4 inline mr-2" />
                Event Time *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white transition-colors input-glow ${
                  errors.time ? 'border-red-500' : 'border-gray-600 focus:border-neon-pink'
                }`}
              />
              {errors.time && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.time}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                <Clock className="w-4 h-4 inline mr-2" />
                Arrival Window *
              </label>
              <input
                type="text"
                value={formData.arrivalWindow}
                onChange={(e) => handleChange('arrivalWindow', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 transition-colors input-glow ${
                  errors.arrivalWindow ? 'border-red-500' : 'border-gray-600 focus:border-neon-pink'
                }`}
                placeholder="e.g., 12:00 AM - 1:30 AM"
              />
              {errors.arrivalWindow && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.arrivalWindow}
                </p>
              )}
            </div>
          </div>

          {/* Pricing and Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                <Euro className="w-4 h-4 inline mr-2" />
                Price (€) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 transition-colors input-glow ${
                  errors.price ? 'border-red-500' : 'border-gray-600 focus:border-neon-pink'
                }`}
                placeholder="45"
              />
              {errors.price && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.price}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                <Users className="w-4 h-4 inline mr-2" />
                Max Tickets *
              </label>
              <input
                type="number"
                min="1"
                value={formData.maxTickets}
                onChange={(e) => handleChange('maxTickets', parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 transition-colors input-glow ${
                  errors.maxTickets ? 'border-red-500' : 'border-gray-600 focus:border-neon-pink'
                }`}
                placeholder="30"
              />
              {errors.maxTickets && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.maxTickets}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                <Users className="w-4 h-4 inline mr-2" />
                Available Spots *
              </label>
              <input
                type="number"
                min="0"
                max={formData.maxTickets}
                value={formData.availability}
                onChange={(e) => handleChange('availability', parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 transition-colors input-glow ${
                  errors.availability ? 'border-red-500' : 'border-gray-600 focus:border-neon-pink'
                }`}
                placeholder="30"
              />
              {errors.availability && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.availability}
                </p>
              )}
            </div>
          </div>

          {/* Location and Image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                <MapPin className="w-4 h-4 inline mr-2" />
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 transition-colors input-glow ${
                  errors.location ? 'border-red-500' : 'border-gray-600 focus:border-neon-pink'
                }`}
                placeholder="Passeig Marítim de la Barceloneta, 34, Barcelona"
              />
              {errors.location && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.location}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                <ImageIcon className="w-4 h-4 inline mr-2" />
                Image URL *
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 transition-colors input-glow ${
                  errors.imageUrl ? 'border-red-500' : 'border-gray-600 focus:border-neon-pink'
                }`}
                placeholder="https://images.unsplash.com/..."
              />
              {errors.imageUrl && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.imageUrl}
                </p>
              )}
            </div>
          </div>

          {/* Stripe Payment Link */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              <LinkIcon className="w-4 h-4 inline mr-2" />
              Stripe Payment Link *
            </label>
            <input
              type="url"
              value={formData.stripePaymentLink}
              onChange={(e) => handleChange('stripePaymentLink', e.target.value)}
              className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 transition-colors input-glow ${
                errors.stripePaymentLink ? 'border-red-500' : 'border-gray-600 focus:border-neon-pink'
              }`}
              placeholder="https://buy.stripe.com/..."
            />
            {errors.stripePaymentLink && (
              <p className="text-red-400 text-sm mt-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.stripePaymentLink}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-2">
              Create a payment link in your Stripe dashboard and paste the URL here
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              <FileText className="w-4 h-4 inline mr-2" />
              Event Description *
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 transition-colors input-glow resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-600 focus:border-neon-pink'
              }`}
              placeholder="Walk straight into the club through the express line. Avoid the wait and enjoy the ultimate Saturday night experience..."
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700/50">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-neon px-8 py-3 rounded-xl font-bold text-black ripple flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{isEditing ? 'Update Event' : 'Create Event'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}