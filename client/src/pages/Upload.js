import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, X, Image, Video, User, MessageCircle, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const UploadPage = () => {
  const [files, setFiles] = useState([]);
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video'
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const removeFile = (id) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }

    if (!guestName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    
    files.forEach(({ file }) => {
      formData.append('files', file);
    });
    
    formData.append('guestName', guestName);
    formData.append('message', message);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress({ progress });
        },
      });

      if (response.data.success) {
        toast.success(`Successfully uploaded ${files.length} file(s)!`);
        setFiles([]);
        setGuestName('');
        setMessage('');
        setUploadProgress({});
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Share Your Memories
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Help us capture every beautiful moment of our special day. 
            Upload your photos and videos to share with Prathyusha & Sravan!
          </p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Guest Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <User className="h-6 w-6 mr-2 text-pink-500" />
              Your Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="Leave a sweet message..."
                />
              </div>
            </div>
          </div>

          {/* File Upload Area */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <Upload className="h-6 w-6 mr-2 text-pink-500" />
              Upload Files
            </h2>
            
            <div
              {...getRootProps()}
              className={`upload-area p-8 text-center cursor-pointer transition-all ${
                isDragActive ? 'dragover' : ''
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                {isDragActive ? 'Drop files here...' : 'Drag & drop files here'}
              </p>
              <p className="text-gray-500 mb-4">
                or click to browse your device
              </p>
              <p className="text-sm text-gray-400">
                Supports: JPG, PNG, GIF, MP4, MOV, AVI, WEBM (Max 100MB each)
              </p>
            </div>
          </div>

          {/* File Preview */}
          {files.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Selected Files ({files.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {files.map(({ id, file, preview, type }) => (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative group"
                  >
                    <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
                      {type === 'image' ? (
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => removeFile(id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                        {type === 'image' ? (
                          <Image className="h-3 w-3 mr-1" />
                        ) : (
                          <Video className="h-3 w-3 mr-1" />
                        )}
                        <span className="truncate">{file.name}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && uploadProgress.progress && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Uploading...</span>
                <span className="text-sm text-gray-500">{uploadProgress.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="text-center">
            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0 || !guestName.trim()}
              className={`px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg ${
                uploading || files.length === 0 || !guestName.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
              }`}
            >
              {uploading ? (
                <div className="flex items-center">
                  <div className="loading-spinner mr-2"></div>
                  Uploading...
                </div>
              ) : (
                <div className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload {files.length} File{files.length !== 1 ? 's' : ''}
                </div>
              )}
            </button>
          </div>

          {/* Guidelines */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Upload Guidelines
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Please enter your name so we know who shared the memory</li>
              <li>• Upload high-quality photos and videos for the best experience</li>
              <li>• Maximum file size: 100MB per file</li>
              <li>• Your uploads will be reviewed before appearing in the gallery</li>
              <li>• Only appropriate content will be displayed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
