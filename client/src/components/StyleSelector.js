import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useVideo } from '../contexts/VideoContext';
import { ArrowLeft, ArrowRight, Palette, Sparkles, Wand2 } from 'lucide-react';

const STYLES = [
  {
    id: 'ghibli',
    name: 'Studio Ghibli',
    description: 'Magical, hand-drawn animation style with dreamy atmospheres',
    emoji: '🌸',
    preview: '/previews/ghibli.jpg',
    colors: ['#a8e6cf', '#88d8a3', '#4ecdc4', '#ffd89b'],
    features: ['Soft colors', 'Floating particles', 'Magical effects', 'Nature themes']
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Hollywood movie-like quality with dramatic lighting',
    emoji: '🎬',
    preview: '/previews/cinematic.jpg',
    colors: ['#000000', '#434343', '#d4af37', '#ffffff'],
    features: ['Dramatic lighting', 'Film grain', 'Epic music', 'Professional look']
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated and classy with refined details',
    emoji: '✨',
    preview: '/previews/elegant.jpg',
    colors: ['#ffeaa7', '#fab1a0', '#e17055', '#2d3436'],
    features: ['Refined typography', 'Soft transitions', 'Luxury feel', 'Classic design']
  },
  {
    id: 'romantic',
    name: 'Romantic',
    description: 'Dreamy and love-filled with pastel colors',
    emoji: '💕',
    preview: '/previews/romantic.jpg',
    colors: ['#fbc2eb', '#a6c1ee', '#ff9a9e', '#fecfef'],
    features: ['Pastel colors', 'Heart effects', 'Soft music', 'Dreamy atmosphere']
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean contemporary design with minimalist aesthetics',
    emoji: '🎨',
    preview: '/previews/modern.jpg',
    colors: ['#ffffff', '#ecf0f1', '#bdc3c7', '#2c3e50'],
    features: ['Clean lines', 'Minimal design', 'Geometric shapes', 'Contemporary']
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Classic retro aesthetic with nostalgic atmosphere',
    emoji: '📸',
    preview: '/previews/vintage.jpg',
    colors: ['#d4a574', '#c4996c', '#b8860b', '#8b4513'],
    features: ['Aged effects', 'Retro filters', 'Classic fonts', 'Nostalgic feel']
  },
  {
    id: 'anime',
    name: 'Anime Style',
    description: 'Vibrant anime-inspired art with dynamic effects',
    emoji: '🌟',
    preview: '/previews/anime.jpg',
    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'],
    features: ['Vibrant colors', 'Dynamic effects', 'Manga style', 'Energetic']
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    description: 'Artistic watercolor painting style with flowing colors',
    emoji: '🎨',
    preview: '/previews/watercolor.jpg',
    colors: ['#e8f5e8', '#b8e6b8', '#88d8a3', '#58c878'],
    features: ['Soft brushes', 'Flowing colors', 'Artistic medium', 'Organic feel']
  }
];

function StyleSelector({ onNext, onPrevious }) {
  const { projectData, updateProjectData } = useVideo();
  const [selectedStyle, setSelectedStyle] = useState(projectData.style || 'elegant');
  const [customPrompt, setCustomPrompt] = useState(projectData.customization?.stylePrompt || '');

  const handleStyleSelect = (styleId) => {
    setSelectedStyle(styleId);
    updateProjectData({
      style: styleId,
      customization: {
        ...projectData.customization,
        stylePrompt: customPrompt
      }
    });
  };

  const handleCustomPromptChange = (prompt) => {
    setCustomPrompt(prompt);
    updateProjectData({
      customization: {
        ...projectData.customization,
        stylePrompt: prompt
      }
    });
  };

  const selectedStyleData = STYLES.find(style => style.id === selectedStyle);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Choose Your Style</h2>
        <p className="text-white/70 max-w-2xl mx-auto">
          Select the perfect animation style for your wedding invitation. 
          Each style brings its own unique aesthetic and mood to your video.
        </p>
      </div>

      {/* Style Grid */}
      <div className="style-grid">
        {STYLES.map((style, index) => (
          <motion.div
            key={style.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => handleStyleSelect(style.id)}
            className={`style-card cursor-pointer ${
              selectedStyle === style.id ? 'selected' : ''
            }`}
          >
            <div className="text-4xl mb-3">{style.emoji}</div>
            <h3 className="text-lg font-semibold text-white mb-2">{style.name}</h3>
            <p className="text-white/60 text-sm text-center mb-4 px-2">
              {style.description}
            </p>
            
            {/* Color Palette */}
            <div className="flex justify-center gap-1 mb-3">
              {style.colors.slice(0, 4).map((color, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Features */}
            <div className="text-xs text-white/50 text-center">
              {style.features.slice(0, 2).join(' • ')}
            </div>

            {selectedStyle === style.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Selected Style Details */}
      {selectedStyleData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-start gap-6">
            <div className="text-6xl">{selectedStyleData.emoji}</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">
                {selectedStyleData.name} Style
              </h3>
              <p className="text-white/70 mb-4">{selectedStyleData.description}</p>
              
              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {selectedStyleData.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-white/80"
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" />
                    {feature}
                  </div>
                ))}
              </div>

              {/* Color Palette */}
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-white/70" />
                <span className="text-white/70 text-sm">Color Palette:</span>
                <div className="flex gap-2">
                  {selectedStyleData.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-white/30"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Custom Style Prompt */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Wand2 className="w-6 h-6 text-white" />
          <h3 className="text-xl font-semibold text-white">Custom Style Prompt</h3>
        </div>
        <p className="text-white/70 mb-4">
          Add a custom prompt to further personalize your video style. This will be combined with the selected style.
        </p>
        <textarea
          value={customPrompt}
          onChange={(e) => handleCustomPromptChange(e.target.value)}
          placeholder="e.g., 'Add golden sparkles and romantic lighting with soft pink tones...'"
          className="w-full h-24 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 resize-none"
        />
        <p className="text-white/50 text-sm mt-2">
          Optional: Describe specific elements, colors, or effects you'd like to see
        </p>
      </div>

      {/* Style Preview Tips */}
      <div className="glass rounded-xl p-4">
        <h4 className="text-lg font-semibold text-white mb-3">Style Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-white/70">
              <strong className="text-white">Ghibli & Anime:</strong> Best for whimsical, magical themes
            </p>
          </div>
          <div>
            <p className="text-white/70">
              <strong className="text-white">Cinematic:</strong> Perfect for dramatic, epic presentations
            </p>
          </div>
          <div>
            <p className="text-white/70">
              <strong className="text-white">Elegant & Romantic:</strong> Ideal for traditional weddings
            </p>
          </div>
          <div>
            <p className="text-white/70">
              <strong className="text-white">Modern & Minimal:</strong> Great for contemporary couples
            </p>
          </div>
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
            Style: <span className="text-white font-medium">{selectedStyleData?.name}</span>
          </p>
        </div>

        <button
          onClick={onNext}
          className="btn-hover px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-medium flex items-center gap-2"
        >
          Next
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default StyleSelector;
