import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Calendar, MapPin, Users, Camera, Upload } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const [weddingDetails, setWeddingDetails] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchWeddingDetails();
    fetchStats();
  }, []);

  const fetchWeddingDetails = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/wedding-details');
      setWeddingDetails(response.data.data);
    } catch (error) {
      console.error('Error fetching wedding details:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/gallery/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (!weddingDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center z-10 px-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <Heart className="h-20 w-20 text-pink-500 mx-auto heart-beat" />
          </motion.div>
          
          <h1 className="dancing-script text-6xl md:text-8xl font-bold text-white mb-4">
            {weddingDetails.bride} & {weddingDetails.groom}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            {weddingDetails.story}
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 mb-12">
            <div className="flex items-center space-x-2 text-white">
              <Calendar className="h-6 w-6" />
              <span className="text-lg font-medium">November 7, 2025</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <MapPin className="h-6 w-6" />
              <span className="text-lg font-medium">{weddingDetails.venue}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/gallery"
              className="bg-white text-gray-800 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Camera className="inline h-5 w-5 mr-2" />
              View Gallery
            </Link>
            <Link
              to="/upload"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Upload className="inline h-5 w-5 mr-2" />
              Share Memories
            </Link>
          </div>
        </motion.div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 float">
          <Heart className="h-8 w-8 text-pink-300/50" />
        </div>
        <div className="absolute top-40 right-20 float" style={{ animationDelay: '1s' }}>
          <Heart className="h-6 w-6 text-purple-300/50" />
        </div>
        <div className="absolute bottom-32 left-20 float" style={{ animationDelay: '2s' }}>
          <Heart className="h-10 w-10 text-pink-400/50" />
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold gradient-text mb-4">
                Our Journey in Numbers
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                See how our friends and family are sharing in our special moments
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800">{stats.totalPhotos}</h3>
                <p className="text-gray-600">Photos</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800">{stats.uniqueGuests}</h3>
                <p className="text-gray-600">Contributors</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="bg-gradient-to-r from-blue-500 to-green-600 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800">{stats.totalItems}</h3>
                <p className="text-gray-600">Memories</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="bg-gradient-to-r from-green-500 to-pink-600 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800">{stats.recentUploads}</h3>
                <p className="text-gray-600">Recent</p>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Help Us Capture Every Moment
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Your photos and videos make our special day even more memorable. 
              Share your favorite moments with us!
            </p>
            <Link
              to="/upload"
              className="bg-white text-gray-800 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Your Photos
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;