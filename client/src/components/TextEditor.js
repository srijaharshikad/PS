import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useVideo } from '../contexts/VideoContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Clock, 
  MapPin, 
  Heart,
  User,
  MessageCircle,
  Sparkles
} from 'lucide-react';

function TextEditor({ onNext, onPrevious }) {
  const { projectData, updateProjectData, currentTemplate } = useVideo();
  const [formData, setFormData] = useState({
    bride: projectData.bride || '',
    groom: projectData.groom || '',
    date: projectData.date || '',
    time: projectData.time || '',
    venue: projectData.venue || '',
    message: projectData.message || ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    updateProjectData(formData);
  }, [formData, updateProjectData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.bride.trim()) {
      newErrors.bride = 'Bride name is required';
    }
    
    if (!formData.groom.trim()) {
      newErrors.groom = 'Groom name is required';
    }
    
    if (!formData.date.trim()) {
      newErrors.date = 'Wedding date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const getPlaceholderText = (field) => {
    const placeholders = {
      bride: 'Enter bride\'s name',
      groom: 'Enter groom\'s name',
      date: 'e.g., December 25, 2024',
      time: 'e.g., 4:00 PM',
      venue: 'e.g., Grand Ballroom, Hotel Paradise',
      message: 'e.g., Join us as we celebrate our love and begin our journey together...'
    };
    return placeholders[field] || '';
  };

  const getFieldIcon = (field) => {
    const icons = {
      bride: User,
      groom: User,
      date: Calendar,
      time: Clock,
      venue: MapPin,
      message: MessageCircle
    };
    return icons[field] || Heart;
  };

  const inputFields = [
    { key: 'bride', label: 'Bride\'s Name', required: true, type: 'text' },
    { key: 'groom', label: 'Groom\'s Name', required: true, type: 'text' },
    { key: 'date', label: 'Wedding Date', required: true, type: 'text' },
    { key: 'time', label: 'Wedding Time', required: false, type: 'text' },
    { key: 'venue', label: 'Venue', required: false, type: 'text' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Add Your Details</h2>
        <p className="text-white/70 max-w-2xl mx-auto">
          Fill in your wedding details to personalize your invitation video. 
          {currentTemplate && (
            <span className="block mt-2 text-pink-300">
              Using template: <strong>{currentTemplate.name}</strong>
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inputFields.map((field, index) => {
          const Icon = getFieldIcon(field.key);
          return (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="space-y-2"
            >
              <label className="flex items-center gap-2 text-white font-medium">
                <Icon className="w-5 h-5 text-pink-300" />
                {field.label}
                {field.required && <span className="text-red-400">*</span>}
              </label>
              <div className="relative">
                <input
                  type={field.type}
                  value={formData[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={getPlaceholderText(field.key)}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 ${
                    errors[field.key] 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-white/20 hover:border-white/40'
                  }`}
                />
                {errors[field.key] && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1"
                  >
                    {errors[field.key]}
                  </motion.p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Message Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="space-y-2"
      >
        <label className="flex items-center gap-2 text-white font-medium">
          <MessageCircle className="w-5 h-5 text-pink-300" />
          Personal Message
          <span className="text-white/50 text-sm">(Optional)</span>
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder={getPlaceholderText('message')}
          rows={4}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 hover:border-white/40 transition-all duration-300 resize-none"
        />
        <p className="text-white/50 text-sm">
          Add a personal message that will appear in your invitation video
        </p>
      </motion.div>

      {/* Preview Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-pink-300" />
          <h3 className="text-xl font-semibold text-white">Preview</h3>
        </div>
        
        <div className="space-y-4">
          {/* Couple Names */}
          <div className="text-center">
            <p className="text-3xl font-bold text-white mb-2">
              {formData.bride || 'Bride'} & {formData.groom || 'Groom'}
            </p>
            <div className="w-20 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto"></div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-pink-300">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Date</span>
              </div>
              <p className="text-white/80">{formData.date || 'Wedding Date'}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-pink-300">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Time</span>
              </div>
              <p className="text-white/80">{formData.time || 'Wedding Time'}</p>
            </div>
          </div>

          {formData.venue && (
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-pink-300">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Venue</span>
              </div>
              <p className="text-white/80">{formData.venue}</p>
            </div>
          )}

          {formData.message && (
            <div className="text-center space-y-2 pt-4 border-t border-white/20">
              <p className="text-white/80 italic">"{formData.message}"</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Fill Templates */}
      <div className="glass rounded-xl p-4">
        <h4 className="text-lg font-semibold text-white mb-3">Quick Fill Examples</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => setFormData({
              bride: 'Priya',
              groom: 'Arjun',
              date: 'December 15, 2024',
              time: '6:00 PM',
              venue: 'Grand Palace, Mumbai',
              message: 'Join us as we celebrate our love and begin our journey together as one.'
            })}
            className="text-left p-3 glass border border-white/20 rounded-lg hover:border-pink-300 transition-colors"
          >
            <p className="text-white font-medium text-sm">Traditional Indian Wedding</p>
            <p className="text-white/60 text-xs">Priya & Arjun • Mumbai</p>
          </button>
          
          <button
            onClick={() => setFormData({
              bride: 'Emily',
              groom: 'James',
              date: 'June 20, 2024',
              time: '4:00 PM',
              venue: 'Seaside Resort, California',
              message: 'Two hearts, one love, one life together. Please join us for our special day.'
            })}
            className="text-left p-3 glass border border-white/20 rounded-lg hover:border-pink-300 transition-colors"
          >
            <p className="text-white font-medium text-sm">Beach Wedding</p>
            <p className="text-white/60 text-xs">Emily & James • California</p>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <button
          onClick={onPrevious}
          className="btn-hover px-6 py-3 glass border border-white/30 text-white rounded-full font-medium flex items-center gap-2 hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
          Previous
        </button>

        <div className="text-center">
          <p className="text-white/70 text-sm">
            {Object.keys(errors).length > 0 
              ? 'Please fix the errors above'
              : 'All required fields completed ✓'
            }
          </p>
        </div>

        <button
          onClick={handleNext}
          disabled={Object.keys(errors).length > 0 && !formData.bride && !formData.groom}
          className="btn-hover px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default TextEditor;
