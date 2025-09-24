import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useVideo } from '../contexts/VideoContext';
import { 
  Heart, 
  Calendar, 
  Sparkles, 
  Clock, 
  Star, 
  Play,
  ArrowRight,
  Search,
  Filter
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All Templates', icon: Heart },
  { id: 'engagement', name: 'Engagement', icon: Heart },
  { id: 'save-the-date', name: 'Save the Date', icon: Calendar },
  { id: 'wedding', name: 'Wedding', icon: Sparkles }
];

const STYLES = [
  { id: 'all', name: 'All Styles' },
  { id: 'ghibli', name: 'Studio Ghibli' },
  { id: 'cinematic', name: 'Cinematic' },
  { id: 'elegant', name: 'Elegant' },
  { id: 'romantic', name: 'Romantic' },
  { id: 'modern', name: 'Modern' }
];

function Templates() {
  const { templates, fetchTemplates, setCurrentTemplate, loading } = useVideo();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState([]);

  useEffect(() => {
    if (templates.length === 0) {
      fetchTemplates();
    }
  }, [templates, fetchTemplates]);

  useEffect(() => {
    let filtered = templates;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredTemplates(filtered);
  }, [templates, selectedCategory, selectedStyle, searchQuery]);

  const handleTemplateSelect = (template) => {
    setCurrentTemplate(template);
  };

  const getCategoryIcon = (categoryId) => {
    const category = CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.icon : Heart;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-white/70">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Wedding Video
            <span className="block gradient-text">Templates</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl mx-auto">
            Choose from our collection of beautiful, professionally designed templates. 
            Each template can be customized with your personal details and preferred animation style.
          </p>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 hover:border-white/40 transition-all duration-300"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-white/70 flex-shrink-0" />
              <div className="flex gap-2 overflow-x-auto">
                {CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`category-filter flex-shrink-0 ${
                        selectedCategory === category.id ? 'active' : ''
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template, index) => {
              const CategoryIcon = getCategoryIcon(template.category);
              
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="template-card glass rounded-2xl overflow-hidden group"
                >
                  {/* Template Preview */}
                  <div className="aspect-video bg-gradient-to-br from-pink-900/50 to-purple-900/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    
                    {/* Preview Content */}
                    <div className="relative z-10 h-full flex items-center justify-center">
                      <div className="text-center">
                        <CategoryIcon className="w-16 h-16 text-white/70 mx-auto mb-3" />
                        <h3 className="text-xl font-semibold text-white mb-2">{template.name}</h3>
                        <div className="flex items-center justify-center gap-2 text-white/60">
                          <Clock className="w-4 h-4" />
                          <span>{template.duration}s</span>
                        </div>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mx-auto">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                        <p className="text-white text-sm">Preview Template</p>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                      <div className="flex items-center gap-2 text-white text-sm">
                        <CategoryIcon className="w-3 h-3" />
                        <span className="capitalize">{template.category}</span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="absolute top-4 right-4 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-3 h-3 text-yellow-400"
                          fill="currentColor"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-white mb-2">{template.name}</h3>
                      <p className="text-white/70 text-sm line-clamp-2">{template.description}</p>
                    </div>

                    {/* Template Features */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Sparkles className="w-4 h-4" />
                        <span>AI Enhanced</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Clock className="w-4 h-4" />
                        <span>{template.duration} seconds</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleTemplateSelect(template)}
                        className="flex-1 px-4 py-2 glass border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors text-sm"
                      >
                        Preview
                      </button>
                      <Link
                        to="/create"
                        onClick={() => handleTemplateSelect(template)}
                        className="flex-1 btn-hover px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm"
                      >
                        Use Template
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-white/50" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">No templates found</h3>
            <p className="text-white/70 mb-8 max-w-md mx-auto">
              {searchQuery 
                ? `No templates match "${searchQuery}". Try adjusting your search or filters.`
                : `No templates available in the ${CATEGORIES.find(c => c.id === selectedCategory)?.name} category.`
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedStyle('all');
              }}
              className="btn-hover px-6 py-3 glass border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Template Stats */}
        <div className="mt-16 glass rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">{templates.length}+</div>
              <p className="text-white/70">Beautiful Templates</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">8+</div>
              <p className="text-white/70">Animation Styles</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">∞</div>
              <p className="text-white/70">Customization Options</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Your
            <span className="block gradient-text">Perfect Wedding Video?</span>
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Choose a template above or start with a blank canvas. 
            Our AI-powered platform will help you create a magical wedding invitation video.
          </p>
          <Link
            to="/create"
            className="btn-hover glow-effect px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold text-lg flex items-center gap-3 mx-auto w-fit"
          >
            <Sparkles className="w-6 h-6" />
            Start Creating
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Templates;
