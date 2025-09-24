import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useVideo } from '../contexts/VideoContext';
import { 
  ArrowLeft, 
  Play, 
  Download, 
  Share2, 
  Settings,
  Wand2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  Heart,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

function VideoPreview({ onGenerate, onPrevious, isGenerating }) {
  const {
    currentTemplate,
    projectData,
    mediaFiles,
    generatedVideo,
    generationStatus,
    loading
  } = useVideo();

  const [previewMode, setPreviewMode] = useState('preview');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <RefreshCw className="w-5 h-5 text-yellow-400 animate-spin" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const handleDownload = async () => {
    if (!generatedVideo) return;
    
    try {
      const response = await fetch(`http://localhost:5000${generatedVideo.url}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wedding-video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Video downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download video');
    }
  };

  const handleShare = async () => {
    if (!generatedVideo) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Wedding Invitation Video',
          text: `${projectData.bride} & ${projectData.groom} - Wedding Invitation`,
          url: `http://localhost:5000${generatedVideo.url}`
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`http://localhost:5000${generatedVideo.url}`);
      toast.success('Video link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Preview & Generate</h2>
        <p className="text-white/70 max-w-2xl mx-auto">
          Review your wedding invitation details and generate your magical video. 
          This is the final step before creating your personalized invitation.
        </p>
      </div>

      {/* Preview Tabs */}
      <div className="flex justify-center">
        <div className="glass rounded-full p-1 flex">
          <button
            onClick={() => setPreviewMode('preview')}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              previewMode === 'preview'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-2" />
            Preview
          </button>
          <button
            onClick={() => setPreviewMode('details')}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              previewMode === 'details'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Details
          </button>
        </div>
      </div>

      {previewMode === 'preview' ? (
        /* Video Preview Section */
        <div className="space-y-6">
          {generatedVideo ? (
            /* Generated Video Display */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-6"
            >
              <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <video 
                  controls 
                  className="w-full h-full object-cover"
                  poster="/api/placeholder/800/450"
                >
                  <source src={`http://localhost:5000${generatedVideo.url}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Your Wedding Video</h3>
                  <p className="text-white/70 text-sm">
                    Duration: {Math.round(generatedVideo.duration || 0)}s • 
                    Size: {(generatedVideo.size / 1024 / 1024).toFixed(1)}MB
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleShare}
                    className="btn-hover px-4 py-2 glass border border-white/30 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-white/10"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button
                    onClick={handleDownload}
                    className="btn-hover px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Preview Mockup */
            <div className="glass rounded-2xl p-8">
              <div className="aspect-video bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Preview Content */}
                <div className="relative z-10 text-center space-y-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Heart className="w-16 h-16 text-pink-300 mx-auto mb-4" fill="currentColor" />
                  </motion.div>
                  
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-white">
                      {projectData.bride || 'Bride'} & {projectData.groom || 'Groom'}
                    </h3>
                    <div className="w-20 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto"></div>
                    <p className="text-white/80">{projectData.date || 'Wedding Date'}</p>
                    {projectData.venue && (
                      <p className="text-white/60 text-sm">{projectData.venue}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-pink-300">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm">
                      {currentTemplate?.name} Style • {projectData.style}
                    </span>
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 left-4 w-8 h-8 bg-pink-500/20 rounded-full animate-pulse"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 bg-purple-500/20 rounded-full animate-pulse delay-500"></div>
                <div className="absolute top-1/3 right-8 w-4 h-4 bg-yellow-500/20 rounded-full animate-pulse delay-1000"></div>
              </div>

              <p className="text-center text-white/70 mb-6">
                This is a preview of how your video will look. Click generate to create the actual video.
              </p>
            </div>
          )}

          {/* Generation Status */}
          {generationStatus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                {getStatusIcon(generationStatus.status)}
                <h3 className="text-xl font-semibold text-white">Generation Status</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Status</span>
                  <span className={`font-medium capitalize ${getStatusColor(generationStatus.status)}`}>
                    {generationStatus.status}
                  </span>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">Progress</span>
                    <span className="text-white font-medium">{generationStatus.progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div 
                      className="progress-bar h-3 rounded-full transition-all duration-500"
                      style={{ width: `${generationStatus.progress}%` }}
                    />
                  </div>
                </div>
                
                {generationStatus.message && (
                  <p className="text-white/70 text-sm">{generationStatus.message}</p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        /* Details Review Section */
        <div className="space-y-6">
          {/* Project Summary */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Project Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-white/70 text-sm">Template</label>
                  <p className="text-white font-medium">{currentTemplate?.name || 'Not selected'}</p>
                  <p className="text-white/60 text-sm">{currentTemplate?.description}</p>
                </div>
                
                <div>
                  <label className="text-white/70 text-sm">Couple</label>
                  <p className="text-white font-medium">
                    {projectData.bride && projectData.groom 
                      ? `${projectData.bride} & ${projectData.groom}`
                      : 'Not entered'
                    }
                  </p>
                </div>
                
                <div>
                  <label className="text-white/70 text-sm">Event Details</label>
                  <div className="text-white font-medium">
                    <p>{projectData.date || 'Date not set'}</p>
                    {projectData.time && <p className="text-sm text-white/80">{projectData.time}</p>}
                    {projectData.venue && <p className="text-sm text-white/80">{projectData.venue}</p>}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white/70 text-sm">Animation Style</label>
                  <p className="text-white font-medium capitalize">{projectData.style}</p>
                </div>
                
                <div>
                  <label className="text-white/70 text-sm">Media Files</label>
                  <p className="text-white font-medium">
                    {mediaFiles.length} file{mediaFiles.length !== 1 ? 's' : ''} uploaded
                  </p>
                  {mediaFiles.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {mediaFiles.slice(0, 3).map((file, index) => (
                        <div key={index} className="w-8 h-8 bg-white/20 rounded text-xs flex items-center justify-center">
                          {file.mimetype.startsWith('image/') ? '🖼️' : 
                           file.mimetype.startsWith('video/') ? '🎥' : '🎵'}
                        </div>
                      ))}
                      {mediaFiles.length > 3 && (
                        <div className="w-8 h-8 bg-white/20 rounded text-xs flex items-center justify-center">
                          +{mediaFiles.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {projectData.message && (
                  <div>
                    <label className="text-white/70 text-sm">Personal Message</label>
                    <p className="text-white font-medium text-sm italic">
                      "{projectData.message}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="glass rounded-2xl p-6">
            <button
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="flex items-center gap-2 text-white font-semibold mb-4 hover:text-pink-300 transition-colors"
            >
              <Settings className="w-5 h-5" />
              Advanced Options
              <motion.div
                animate={{ rotate: showAdvancedOptions ? 180 : 0 }}
                className="ml-auto"
              >
                ⌄
              </motion.div>
            </button>
            
            {showAdvancedOptions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                <div>
                  <label className="text-white/70 text-sm">Custom Style Prompt</label>
                  <p className="text-white font-medium text-sm">
                    {projectData.customization?.stylePrompt || 'None specified'}
                  </p>
                </div>
                
                <div>
                  <label className="text-white/70 text-sm">Effects</label>
                  <div className="flex gap-4 text-sm">
                    <span className="text-white/80">
                      Fade Effects: {projectData.customization?.fadeEffects !== false ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Generation Button */}
      {!generatedVideo && (
        <div className="text-center">
          <button
            onClick={onGenerate}
            disabled={isGenerating || loading || !currentTemplate}
            className="btn-hover glow-effect px-12 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold text-lg flex items-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="spinner"></div>
                Generating Video...
              </>
            ) : (
              <>
                <Wand2 className="w-6 h-6" />
                Generate Magic Video
                <Sparkles className="w-6 h-6" />
              </>
            )}
          </button>
          
          <p className="text-white/60 text-sm mt-4">
            This may take 1-3 minutes depending on your customizations
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <button
          onClick={onPrevious}
          disabled={isGenerating}
          className="btn-hover px-6 py-3 glass border border-white/30 text-white rounded-full font-medium flex items-center gap-2 hover:bg-white/10 disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5" />
          Previous
        </button>

        <div className="text-center">
          <p className="text-white/70 text-sm">
            {generatedVideo 
              ? 'Video ready for download!' 
              : isGenerating 
              ? 'Generating your video...'
              : 'Ready to generate'
            }
          </p>
        </div>

        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>
    </div>
  );
}

export default VideoPreview;
