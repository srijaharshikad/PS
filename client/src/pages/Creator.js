import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideo } from '../contexts/VideoContext';
import MediaUpload from '../components/MediaUpload';
import StyleSelector from '../components/StyleSelector';
import TextEditor from '../components/TextEditor';
import VideoPreview from '../components/VideoPreview';
import TemplateSelector from '../components/TemplateSelector';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Download, 
  Play,
  Settings,
  Wand2,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 'template', title: 'Choose Template', icon: Settings },
  { id: 'content', title: 'Add Content', icon: Wand2 },
  { id: 'media', title: 'Upload Media', icon: Save },
  { id: 'style', title: 'Select Style', icon: Play },
  { id: 'preview', title: 'Preview & Generate', icon: CheckCircle }
];

function Creator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const {
    currentTemplate,
    projectData,
    mediaFiles,
    generatedVideo,
    generationStatus,
    loading,
    fetchTemplates,
    generateVideo,
    updateProjectData,
    resetProject
  } = useVideo();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    if (!currentTemplate) {
      toast.error('Please select a template first');
      return;
    }

    if (!projectData.bride || !projectData.groom) {
      toast.error('Please enter bride and groom names');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateVideo();
      if (result) {
        toast.success('Video generated successfully!');
      }
    } catch (error) {
      toast.error('Failed to generate video');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    resetProject();
    setCurrentStep(0);
    setIsGenerating(false);
  };

  const renderStepContent = () => {
    switch (STEPS[currentStep].id) {
      case 'template':
        return <TemplateSelector onNext={handleNext} />;
      case 'content':
        return <TextEditor onNext={handleNext} onPrevious={handlePrevious} />;
      case 'media':
        return <MediaUpload onNext={handleNext} onPrevious={handlePrevious} />;
      case 'style':
        return <StyleSelector onNext={handleNext} onPrevious={handlePrevious} />;
      case 'preview':
        return (
          <VideoPreview 
            onGenerate={handleGenerate} 
            onPrevious={handlePrevious}
            isGenerating={isGenerating}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Create Your Perfect
            <span className="block gradient-text">Wedding Video</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Follow our simple step-by-step process to create a magical wedding invitation video
          </p>
        </div>

        {/* Progress Steps */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted
                          ? 'bg-green-500 border-green-500'
                          : isActive
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-transparent'
                          : 'bg-white/10 border-white/30'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-white/50'}`} />
                      )}
                    </motion.div>
                    <span className={`text-sm mt-2 font-medium ${isActive ? 'text-white' : 'text-white/50'}`}>
                      {step.title}
                    </span>
                  </div>
                  
                  {index < STEPS.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-white/20'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-2xl p-8"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Project Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-white/70">Template</label>
                  <p className="text-white font-medium">
                    {currentTemplate?.name || 'Not selected'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-white/70">Couple</label>
                  <p className="text-white font-medium">
                    {projectData.bride && projectData.groom 
                      ? `${projectData.bride} & ${projectData.groom}`
                      : 'Not entered'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm text-white/70">Style</label>
                  <p className="text-white font-medium capitalize">
                    {projectData.style || 'Not selected'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-white/70">Media Files</label>
                  <p className="text-white font-medium">
                    {mediaFiles.length} file{mediaFiles.length !== 1 ? 's' : ''} uploaded
                  </p>
                </div>
              </div>
            </div>

            {/* Generation Status */}
            {generationStatus && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Generation Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Status</span>
                    <span className={`font-medium ${
                      generationStatus.status === 'completed' ? 'text-green-400' :
                      generationStatus.status === 'failed' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>
                      {generationStatus.status}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/70">Progress</span>
                      <span className="text-white font-medium">{generationStatus.progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="progress-bar h-2 rounded-full transition-all duration-500"
                        style={{ width: `${generationStatus.progress}%` }}
                      />
                    </div>
                  </div>
                  {generationStatus.message && (
                    <p className="text-white/70 text-sm">{generationStatus.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Generated Video */}
            {generatedVideo && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Your Video</h3>
                <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video 
                      controls 
                      className="w-full h-full object-cover"
                      poster="/api/placeholder/400/225"
                    >
                      <source src={`http://localhost:5000${generatedVideo.url}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 btn-hover px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button 
                      onClick={handleReset}
                      className="px-4 py-2 glass border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
                    >
                      New Project
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={handleReset}
                  className="w-full px-4 py-2 glass border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Reset Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Creator;
