import React, { createContext, useContext, useReducer, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const VideoContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Action types
const VIDEO_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_TEMPLATES: 'SET_TEMPLATES',
  SET_CURRENT_TEMPLATE: 'SET_CURRENT_TEMPLATE',
  SET_PROJECT_DATA: 'SET_PROJECT_DATA',
  SET_MEDIA_FILES: 'SET_MEDIA_FILES',
  ADD_MEDIA_FILE: 'ADD_MEDIA_FILE',
  REMOVE_MEDIA_FILE: 'REMOVE_MEDIA_FILE',
  SET_GENERATION_STATUS: 'SET_GENERATION_STATUS',
  SET_GENERATED_VIDEO: 'SET_GENERATED_VIDEO',
  SET_PREVIEW_MODE: 'SET_PREVIEW_MODE',
  RESET_PROJECT: 'RESET_PROJECT'
};

// Initial state
const initialState = {
  loading: false,
  error: null,
  templates: [],
  currentTemplate: null,
  projectData: {
    bride: '',
    groom: '',
    date: '',
    time: '',
    venue: '',
    message: '',
    style: 'elegant',
    customization: {
      colors: [],
      fonts: [],
      backgroundMusic: null,
      fadeEffects: true,
      stylePrompt: ''
    }
  },
  mediaFiles: [],
  generationStatus: null,
  generatedVideo: null,
  previewMode: false,
  sessionId: null
};

// Reducer
function videoReducer(state, action) {
  switch (action.type) {
    case VIDEO_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };
    
    case VIDEO_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case VIDEO_ACTIONS.SET_TEMPLATES:
      return { ...state, templates: action.payload };
    
    case VIDEO_ACTIONS.SET_CURRENT_TEMPLATE:
      return { ...state, currentTemplate: action.payload };
    
    case VIDEO_ACTIONS.SET_PROJECT_DATA:
      return { 
        ...state, 
        projectData: { ...state.projectData, ...action.payload } 
      };
    
    case VIDEO_ACTIONS.SET_MEDIA_FILES:
      return { ...state, mediaFiles: action.payload };
    
    case VIDEO_ACTIONS.ADD_MEDIA_FILE:
      return { 
        ...state, 
        mediaFiles: [...state.mediaFiles, action.payload] 
      };
    
    case VIDEO_ACTIONS.REMOVE_MEDIA_FILE:
      return { 
        ...state, 
        mediaFiles: state.mediaFiles.filter(file => file.id !== action.payload) 
      };
    
    case VIDEO_ACTIONS.SET_GENERATION_STATUS:
      return { ...state, generationStatus: action.payload };
    
    case VIDEO_ACTIONS.SET_GENERATED_VIDEO:
      return { ...state, generatedVideo: action.payload };
    
    case VIDEO_ACTIONS.SET_PREVIEW_MODE:
      return { ...state, previewMode: action.payload };
    
    case VIDEO_ACTIONS.RESET_PROJECT:
      return { 
        ...initialState, 
        templates: state.templates,
        sessionId: generateSessionId()
      };
    
    default:
      return state;
  }
}

// Helper function to generate session ID
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Provider component
export function VideoProvider({ children }) {
  const [state, dispatch] = useReducer(videoReducer, {
    ...initialState,
    sessionId: generateSessionId()
  });

  // API client setup
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Error handler
  const handleError = useCallback((error, customMessage) => {
    const message = customMessage || error.response?.data?.error || error.message || 'Something went wrong';
    dispatch({ type: VIDEO_ACTIONS.SET_ERROR, payload: message });
    toast.error(message);
    console.error('API Error:', error);
  }, []);

  // Fetch templates
  const fetchTemplates = useCallback(async () => {
    try {
      dispatch({ type: VIDEO_ACTIONS.SET_LOADING, payload: true });
      console.log('Fetching templates from:', `${API_BASE_URL}/templates`);
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const response = await Promise.race([
        apiClient.get('/templates'),
        timeoutPromise
      ]);
      
      console.log('Templates response:', response.data);
      if (response.data && response.data.templates) {
        dispatch({ type: VIDEO_ACTIONS.SET_TEMPLATES, payload: response.data.templates });
        toast.success(`Loaded ${response.data.templates.length} templates`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Templates fetch error:', error);
      handleError(error, 'Failed to fetch templates');
      // Set some default templates as fallback
      const fallbackTemplates = [
        {
          id: 'fallback-elegant',
          name: 'Elegant Wedding',
          category: 'wedding',
          description: 'Beautiful elegant wedding template',
          duration: 15
        }
      ];
      dispatch({ type: VIDEO_ACTIONS.SET_TEMPLATES, payload: fallbackTemplates });
    } finally {
      dispatch({ type: VIDEO_ACTIONS.SET_LOADING, payload: false });
    }
  }, [apiClient, handleError]);

  // Get template by ID
  const getTemplate = useCallback(async (templateId) => {
    try {
      dispatch({ type: VIDEO_ACTIONS.SET_LOADING, payload: true });
      const response = await apiClient.get(`/templates/${templateId}`);
      dispatch({ type: VIDEO_ACTIONS.SET_CURRENT_TEMPLATE, payload: response.data.template });
      return response.data.template;
    } catch (error) {
      handleError(error, 'Failed to fetch template');
      return null;
    } finally {
      dispatch({ type: VIDEO_ACTIONS.SET_LOADING, payload: false });
    }
  }, [apiClient, handleError]);

  // Upload media files
  const uploadMediaFiles = useCallback(async (files) => {
    try {
      dispatch({ type: VIDEO_ACTIONS.SET_LOADING, payload: true });
      
      const formData = new FormData();
      formData.append('sessionId', state.sessionId);
      
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      const response = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          toast.loading(`Uploading files... ${progress}%`, { id: 'upload' });
        }
      });

      toast.dismiss('upload');
      toast.success(`${response.data.files.length} files uploaded successfully`);
      
      dispatch({ type: VIDEO_ACTIONS.SET_MEDIA_FILES, payload: [...state.mediaFiles, ...response.data.files] });
      return response.data.files;
    } catch (error) {
      toast.dismiss('upload');
      handleError(error, 'Failed to upload files');
      return [];
    } finally {
      dispatch({ type: VIDEO_ACTIONS.SET_LOADING, payload: false });
    }
  }, [apiClient, handleError, state.sessionId, state.mediaFiles]);

  // Generate video
  const generateVideo = useCallback(async () => {
    try {
      dispatch({ type: VIDEO_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: VIDEO_ACTIONS.SET_GENERATION_STATUS, payload: { status: 'processing', progress: 0 } });

      const payload = {
        templateId: state.currentTemplate?.id,
        text: {
          bride: state.projectData.bride,
          groom: state.projectData.groom,
          date: state.projectData.date,
          time: state.projectData.time,
          venue: state.projectData.venue,
          message: state.projectData.message
        },
        style: state.projectData.style,
        mediaFiles: state.mediaFiles,
        customization: state.projectData.customization,
        sessionId: state.sessionId
      };

      const response = await apiClient.post('/generate-video', payload);
      
      dispatch({ type: VIDEO_ACTIONS.SET_GENERATED_VIDEO, payload: response.data.video });
      dispatch({ type: VIDEO_ACTIONS.SET_GENERATION_STATUS, payload: { status: 'completed', progress: 100 } });
      
      toast.success('Video generated successfully!');
      return response.data.video;
    } catch (error) {
      dispatch({ type: VIDEO_ACTIONS.SET_GENERATION_STATUS, payload: { status: 'failed', progress: 0 } });
      handleError(error, 'Failed to generate video');
      return null;
    } finally {
      dispatch({ type: VIDEO_ACTIONS.SET_LOADING, payload: false });
    }
  }, [apiClient, handleError, state]);

  // Apply AI style to video
  const applyVideoStyle = useCallback(async (videoPath, style, prompt) => {
    try {
      dispatch({ type: VIDEO_ACTIONS.SET_LOADING, payload: true });
      
      const payload = {
        videoPath,
        style,
        prompt
      };

      const response = await apiClient.post('/apply-style', payload);
      
      toast.success(`${style} style applied successfully!`);
      return response.data.video;
    } catch (error) {
      handleError(error, 'Failed to apply video style');
      return null;
    } finally {
      dispatch({ type: VIDEO_ACTIONS.SET_LOADING, payload: false });
    }
  }, [apiClient, handleError]);

  // Get generation status
  const getGenerationStatus = useCallback(async (jobId) => {
    try {
      const response = await apiClient.get(`/status/${jobId}`);
      dispatch({ type: VIDEO_ACTIONS.SET_GENERATION_STATUS, payload: response.data.status });
      return response.data.status;
    } catch (error) {
      console.error('Failed to get generation status:', error);
      return null;
    }
  }, [apiClient]);

  // Update project data
  const updateProjectData = useCallback((data) => {
    dispatch({ type: VIDEO_ACTIONS.SET_PROJECT_DATA, payload: data });
  }, []);

  // Add media file
  const addMediaFile = useCallback((file) => {
    dispatch({ type: VIDEO_ACTIONS.ADD_MEDIA_FILE, payload: file });
  }, []);

  // Remove media file
  const removeMediaFile = useCallback((fileId) => {
    dispatch({ type: VIDEO_ACTIONS.REMOVE_MEDIA_FILE, payload: fileId });
  }, []);

  // Set current template
  const setCurrentTemplate = useCallback((template) => {
    dispatch({ type: VIDEO_ACTIONS.SET_CURRENT_TEMPLATE, payload: template });
  }, []);

  // Toggle preview mode
  const togglePreviewMode = useCallback(() => {
    dispatch({ type: VIDEO_ACTIONS.SET_PREVIEW_MODE, payload: !state.previewMode });
  }, [state.previewMode]);

  // Reset project
  const resetProject = useCallback(() => {
    dispatch({ type: VIDEO_ACTIONS.RESET_PROJECT });
    toast.success('Project reset successfully');
  }, []);

  // Context value
  const contextValue = {
    // State
    ...state,
    
    // Actions
    fetchTemplates,
    getTemplate,
    uploadMediaFiles,
    generateVideo,
    applyVideoStyle,
    getGenerationStatus,
    updateProjectData,
    addMediaFile,
    removeMediaFile,
    setCurrentTemplate,
    togglePreviewMode,
    resetProject
  };

  return (
    <VideoContext.Provider value={contextValue}>
      {children}
    </VideoContext.Provider>
  );
}

// Custom hook to use video context
export function useVideo() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
}

export default VideoContext;
