import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideo } from '../contexts/VideoContext';
import { 
  Upload, 
  Image, 
  Video, 
  Music, 
  X, 
  FileText,
  ArrowLeft,
  ArrowRight,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

function MediaUpload({ onNext, onPrevious }) {
  const { mediaFiles, uploadMediaFiles, removeMediaFile, loading } = useVideo();
  const [draggedOver, setDraggedOver] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      await uploadMediaFiles(acceptedFiles);
    }
  }, [uploadMediaFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.webm'],
      'audio/*': ['.mp3', '.wav', '.m4a', '.aac']
    },
    maxFiles: 10,
    maxSize: 100 * 1024 * 1024, // 100MB
    onDragEnter: () => setDraggedOver(true),
    onDragLeave: () => setDraggedOver(false),
    onDropAccepted: () => setDraggedOver(false),
    onDropRejected: (rejectedFiles) => {
      setDraggedOver(false);
      rejectedFiles.forEach(file => {
        file.errors.forEach(error => {
          if (error.code === 'file-too-large') {
            toast.error(`File ${file.file.name} is too large. Maximum size is 100MB.`);
          } else if (error.code === 'file-invalid-type') {
            toast.error(`File ${file.file.name} has an invalid type.`);
          } else {
            toast.error(`Error with file ${file.file.name}: ${error.message}`);
          }
        });
      });
    }
  });

  const getFileIcon = (mimetype) => {
    if (mimetype.startsWith('image/')) return Image;
    if (mimetype.startsWith('video/')) return Video;
    if (mimetype.startsWith('audio/')) return Music;
    return FileText;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleRemoveFile = (fileId) => {
    removeMediaFile(fileId);
    toast.success('File removed');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Upload Your Media</h2>
        <p className="text-white/70 max-w-2xl mx-auto">
          Add photos, videos, and audio files to personalize your wedding invitation. 
          You can upload couple photos, engagement videos, or background music.
        </p>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`file-upload-area rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive || draggedOver ? 'drag-active' : ''
        } ${loading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input {...getInputProps()} />
        <motion.div
          animate={{ scale: isDragActive ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Upload className="w-10 h-10 text-white/70" />
          </div>
          
          {loading ? (
            <div className="space-y-4">
              <div className="spinner mx-auto"></div>
              <p className="text-white/70">Uploading files...</p>
            </div>
          ) : isDragActive ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Drop files here</h3>
              <p className="text-white/70">Release to upload your media files</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Drag & drop your files here</h3>
              <p className="text-white/70">or click to browse and select files</p>
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="flex items-center gap-2 text-white/50">
                  <Image className="w-5 h-5" />
                  <span>Images</span>
                </div>
                <div className="flex items-center gap-2 text-white/50">
                  <Video className="w-5 h-5" />
                  <span>Videos</span>
                </div>
                <div className="flex items-center gap-2 text-white/50">
                  <Music className="w-5 h-5" />
                  <span>Audio</span>
                </div>
              </div>
              <p className="text-sm text-white/50">Maximum file size: 100MB per file</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Uploaded Files Grid */}
      {mediaFiles.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Uploaded Files ({mediaFiles.length})</h3>
            <button
              {...getRootProps()}
              className="btn-hover px-4 py-2 glass border border-white/30 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-white/10"
            >
              <Plus className="w-4 h-4" />
              Add More
            </button>
          </div>

          <div className="upload-grid">
            <AnimatePresence>
              {mediaFiles.map((file, index) => {
                const FileIcon = getFileIcon(file.mimetype);
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="upload-item group relative"
                  >
                    {file.mimetype.startsWith('image/') ? (
                      <img
                        src={`http://localhost:5000${file.url}`}
                        alt={file.originalName}
                        className="w-full h-full object-cover"
                      />
                    ) : file.mimetype.startsWith('video/') ? (
                      <video
                        src={`http://localhost:5000${file.url}`}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <FileIcon className="w-12 h-12 text-white/50 mb-2" />
                        <p className="text-white/70 text-sm text-center px-2">
                          {file.originalName}
                        </p>
                      </div>
                    )}

                    <div className="upload-item-overlay">
                      <div className="text-center">
                        <p className="text-white font-medium text-sm mb-1">
                          {file.originalName}
                        </p>
                        <p className="text-white/70 text-xs mb-3">
                          {formatFileSize(file.size)}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(file.id);
                          }}
                          className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* File Type Guidelines */}
      <div className="glass rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">File Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white">
              <Image className="w-5 h-5" />
              <span className="font-medium">Images</span>
            </div>
            <p className="text-white/70 text-sm">
              JPG, PNG, GIF, WebP<br />
              Best for: Couple photos, portraits, backgrounds
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white">
              <Video className="w-5 h-5" />
              <span className="font-medium">Videos</span>
            </div>
            <p className="text-white/70 text-sm">
              MP4, MOV, AVI, WebM<br />
              Best for: Engagement clips, memories
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white">
              <Music className="w-5 h-5" />
              <span className="font-medium">Audio</span>
            </div>
            <p className="text-white/70 text-sm">
              MP3, WAV, M4A, AAC<br />
              Best for: Background music, voice notes
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
            {mediaFiles.length === 0 
              ? 'You can skip this step or add media files'
              : `${mediaFiles.length} file${mediaFiles.length !== 1 ? 's' : ''} ready`
            }
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

export default MediaUpload;
