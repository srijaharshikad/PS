import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Calendar, Heart, Users, Music, Camera, Utensils } from 'lucide-react';
import axios from 'axios';

const Timeline = () => {
  const [weddingDetails, setWeddingDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeddingDetails();
  }, []);

  const fetchWeddingDetails = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/wedding-details');
      setWeddingDetails(response.data.data);
    } catch (error) {
      console.error('Error fetching wedding details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventName) => {
    const name = eventName.toLowerCase();
    if (name.includes('mehendi')) return <Heart className="h-6 w-6" />;
    if (name.includes('sangam') || name.includes('music')) return <Music className="h-6 w-6" />;
    if (name.includes('wedding') || name.includes('ceremony')) return <Users className="h-6 w-6" />;
    if (name.includes('reception')) return <Utensils className="h-6 w-6" />;
    return <Clock className="h-6 w-6" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wedding timeline...</p>
        </div>
      </div>
    );
  }

  if (!weddingDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Unable to load wedding details</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Wedding Timeline
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join us for a celebration of love, tradition, and joy. 
            Here's everything you need to know about our special day!
          </p>
        </motion.div>

        {/* Wedding Date & Venue */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="dancing-script text-4xl font-bold gradient-text mb-4">
              {weddingDetails.bride} & {weddingDetails.groom}
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex items-center space-x-2 text-gray-700">
                <Calendar className="h-6 w-6 text-pink-500" />
                <span className="text-lg font-medium">November 7, 2025</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <MapPin className="h-6 w-6 text-pink-500" />
                <span className="text-lg font-medium">{weddingDetails.venue}</span>
              </div>
            </div>
          </div>

          <div className="text-center p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
            <p className="text-gray-700 text-lg italic">
              "{weddingDetails.story}"
            </p>
          </div>
        </motion.div>

        {/* Timeline Events */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500 to-purple-600 transform md:-translate-x-1/2"></div>

          {weddingDetails.timeline.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className={`relative flex items-center mb-12 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full transform md:-translate-x-1/2 z-10 border-4 border-white shadow-lg"></div>

              {/* Event Card */}
              <div className={`timeline-item ml-16 md:ml-0 ${
                index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
              } md:w-5/12`}>
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-full mr-4">
                    {getEventIcon(event.event)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{event.event}</h3>
                    <div className="flex items-center space-x-2 text-pink-600">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{event.time}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 leading-relaxed">
                  {event.description}
                </p>
                
                {/* Decorative elements */}
                <div className="mt-4 flex space-x-2">
                  <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Location Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl shadow-xl p-8 mt-12"
        >
          <h2 className="text-2xl font-bold gradient-text mb-6 text-center">
            Venue Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <MapPin className="h-6 w-6 text-pink-500 mr-2" />
                {weddingDetails.location.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {weddingDetails.location.address}
              </p>
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
                <p className="text-gray-700 text-sm">
                  <strong>Getting There:</strong> We recommend arriving 30 minutes early for parking and seating. 
                  Valet parking will be available for your convenience.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p>Interactive Map</p>
                <p className="text-sm">Coming Soon</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl p-8 mt-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Important Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Photography
              </h3>
              <ul className="text-white/90 text-sm space-y-1">
                <li>• Professional photographers will be present</li>
                <li>• Feel free to take photos and share them</li>
                <li>• Please upload your photos to our gallery</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Dress Code
              </h3>
              <ul className="text-white/90 text-sm space-y-1">
                <li>• Traditional Indian attire preferred</li>
                <li>• Bright colors are encouraged</li>
                <li>• Comfortable footwear recommended</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-white/90">
              For any questions or special requirements, please contact us in advance. 
              We can't wait to celebrate with you! 💕
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Timeline;
