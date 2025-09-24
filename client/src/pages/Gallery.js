import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Masonry from 'react-masonry-css';
import { Image, Video, User, MessageCircle, Calendar, Search, Filter } from 'lucide-react';
import axios from 'axios';
import moment from 'moment';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [galleryItems, searchQuery, filterType]);

  const fetchGalleryItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/gallery');
      setGalleryItems(response.data.data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = galleryItems;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.message && item.message.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredItems(filtered);
  };

  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  const openModal = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading beautiful memories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Our Memory Gallery
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A collection of beautiful moments shared by our loved ones. 
            Thank you for making our special day even more memorable!
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">All Media</option>
              <option value="image">Photos Only</option>
              <option value="video">Videos Only</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center space-x-6 bg-white rounded-lg px-6 py-3 shadow-md">
            <div className="text-center">
              <span className="block text-2xl font-bold text-gray-800">{filteredItems.length}</span>
              <span className="text-sm text-gray-600">
                {filterType === 'all' ? 'Total Items' : filterType === 'image' ? 'Photos' : 'Videos'}
              </span>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-gray-800">
                {[...new Set(filteredItems.map(item => item.guestName))].length}
              </span>
              <span className="text-sm text-gray-600">Contributors</span>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredItems.length > 0 ? (
          <Masonry
            breakpointCols={breakpointColumns}
            className="masonry-grid"
            columnClassName="masonry-grid_column"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="gallery-item cursor-pointer"
                onClick={() => openModal(item)}
              >
                <div className="relative">
                  {item.type === 'image' ? (
                    <img
                      src={`http://localhost:5000${item.url}`}
                      alt="Gallery item"
                      className="w-full h-auto"
                      loading="lazy"
                    />
                  ) : (
                    <div className="relative">
                      <video
                        src={`http://localhost:5000${item.url}`}
                        className="w-full h-auto"
                        muted
                        onMouseEnter={(e) => e.target.play()}
                        onMouseLeave={(e) => e.target.pause()}
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Video className="h-12 w-12 text-white/80" />
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2">
                    <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center">
                      {item.type === 'image' ? (
                        <Image className="h-3 w-3 mr-1" />
                      ) : (
                        <Video className="h-3 w-3 mr-1" />
                      )}
                      {item.type.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="overlay">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-800">{item.guestName}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{moment(item.uploadedAt).fromNow()}</span>
                    </div>
                  </div>
                  
                  {item.message && (
                    <div className="flex items-start space-x-2">
                      <MessageCircle className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600 line-clamp-2">{item.message}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </Masonry>
        ) : (
          <div className="text-center py-20">
            <div className="mb-4">
              <Image className="h-16 w-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">No memories found</h3>
            <p className="text-gray-500">
              {searchQuery || filterType !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Be the first to share a beautiful memory!'}
            </p>
          </div>
        )}

        {/* Modal */}
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row">
                <div className="flex-1">
                  {selectedItem.type === 'image' ? (
                    <img
                      src={`http://localhost:5000${selectedItem.url}`}
                      alt="Gallery item"
                      className="w-full h-auto max-h-[70vh] object-contain"
                    />
                  ) : (
                    <video
                      src={`http://localhost:5000${selectedItem.url}`}
                      controls
                      className="w-full h-auto max-h-[70vh] object-contain"
                    />
                  )}
                </div>
                
                <div className="md:w-80 p-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Details</h3>
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Shared by</label>
                      <p className="text-gray-800">{selectedItem.guestName}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Date</label>
                      <p className="text-gray-800">{moment(selectedItem.uploadedAt).format('MMMM D, YYYY [at] h:mm A')}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Type</label>
                      <p className="text-gray-800 capitalize">{selectedItem.type}</p>
                    </div>
                    
                    {selectedItem.message && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Message</label>
                        <p className="text-gray-800">{selectedItem.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Gallery;