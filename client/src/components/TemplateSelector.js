import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useVideo } from '../contexts/VideoContext';
import { 
  ArrowRight, 
  Clock, 
  Heart, 
  Sparkles, 
  Film,
  Calendar,
  Star,
  Search,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'all', name: 'All Templates', icon: Heart },
  { id: 'engagement', name: 'Engagement', icon: Heart },
  { id: 'save-the-date', name: 'Save the Date', icon: Calendar },
  { id: 'wedding', name: 'Wedding', icon: Sparkles }
];

function TemplateSelector({ onNext }) {
  const {
    templates,
    currentTemplate,
    loading,
    fetchTemplates,
    setCurrentTemplate
  } = useVideo();

  // Add hardcoded templates as fallback for testing
  const hardcodedTemplates = [
    {
      id: 'elegant-engagement',
      name: 'Elegant Engagement',
      category: 'engagement',
      description: 'Sophisticated engagement announcement with elegant typography',
      duration: 15
    },
    {
      id: 'ghibli-wedding',
      name: 'Ghibli Style Wedding',
      category: 'wedding',
      description: 'Magical Studio Ghibli inspired wedding invitation',
      duration: 20
    },
    {
      id: 'cinematic-save-date',
      name: 'Cinematic Save the Date',
      category: 'save-the-date',
      description: 'Hollywood-style cinematic save the date video',
      duration: 18
    },
    {
      id: 'modern-minimalist',
      name: 'Modern Minimalist',
      category: 'wedding',
      description: 'Clean, modern design with minimalist aesthetics',
      duration: 12
    }
  ];

  // Use hardcoded templates if API templates are not available
  const displayTemplates = templates.length > 0 ? templates : hardcodedTemplates;

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState([]);

  useEffect(() => {
    console.log('TemplateSelector mounted, templates:', templates);
    if (templates.length === 0) {
      console.log('Fetching templates...');
      fetchTemplates();
    }
  }, [templates, fetchTemplates]);

  useEffect(() => {
    let filtered = displayTemplates;
    
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
  }, [displayTemplates, selectedCategory, searchQuery]);

  const handleTemplateSelect = (template) => {
    setCurrentTemplate(template);
    toast.success(`Template "${template.name}" selected`);
  };

  const handleNext = () => {
    if (!currentTemplate) {
      toast.error('Please select a template first');
      return;
    }
    onNext();
  };

  const getCategoryIcon = (categoryId) => {
    const category = CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.icon : Heart;
  };

  // Always show templates - never show loading if we have any templates (API or hardcoded)
  const shouldShowLoading = loading && displayTemplates.length === 0;
  
  if (shouldShowLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-white/70">Loading templates...</p>
          <p className="text-white/50 text-sm mt-2">Display templates: {displayTemplates.length}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Choose Your Template</h2>
        <p className="text-white/70 max-w-2xl mx-auto">
          Select a beautiful template for your wedding invitation video. 
          Each template is designed for different occasions and styles.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 hover:border-white/40 transition-all duration-300"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-5 h-5 text-white/70 flex-shrink-0" />
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

      {/* Debug info */}
      <div className="text-white/50 text-sm mb-4">
        Debug: API templates: {templates.length}, Display templates: {displayTemplates.length}, Filtered: {filteredTemplates.length}, Loading: {loading.toString()}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => {
            const CategoryIcon = getCategoryIcon(template.category);
            const isSelected = currentTemplate?.id === template.id;
            
            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => handleTemplateSelect(template)}
                className={`template-card glass rounded-2xl overflow-hidden cursor-pointer group relative ${
                  isSelected ? 'ring-2 ring-pink-500' : ''
                }`}
              >
                {/* Template Preview */}
                <div className="aspect-video bg-gradient-to-br from-pink-900/50 to-purple-900/50 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative z-10 text-center">
                    <CategoryIcon className="w-12 h-12 text-white/70 mx-auto mb-2" />
                    <p className="text-white/70 text-sm">Preview</p>
                  </div>
                  
                  {/* Hover Play Button */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Film className="w-6 h-6 text-white ml-1" />
                    </div>
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center"
                    >
                      <Star className="w-4 h-4 text-white" fill="currentColor" />
                    </motion.div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {template.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <CategoryIcon className="w-4 h-4" />
                        <span className="capitalize">{template.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-white/60">
                      <Clock className="w-4 h-4" />
                      <span>{template.duration}s</span>
                    </div>
                  </div>
                  
                  <p className="text-white/70 text-sm mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  {/* Template Features */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-3 h-3 text-yellow-400"
                            fill="currentColor"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-white/60">Popular</span>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTemplateSelect(template);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                        isSelected
                          ? 'bg-pink-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-white/50" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
          <p className="text-white/70 mb-6">
            {searchQuery 
              ? `No templates match "${searchQuery}"`
              : `No templates available in ${CATEGORIES.find(c => c.id === selectedCategory)?.name}`
            }
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-6 py-3 glass border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Selected Template Info */}
      {currentTemplate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Selected: {currentTemplate.name}
              </h3>
              <p className="text-white/70">{currentTemplate.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-pink-300 mb-1">
                <Clock className="w-4 h-4" />
                <span>{currentTemplate.duration} seconds</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <span className="capitalize">{currentTemplate.category}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <div className="text-white/70">
          <p className="text-sm">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="text-center">
          <p className="text-white/70 text-sm">
            {currentTemplate 
              ? `Template: ${currentTemplate.name}` 
              : 'Please select a template'
            }
          </p>
        </div>

        <button
          onClick={handleNext}
          disabled={!currentTemplate}
          className="btn-hover px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default TemplateSelector;
