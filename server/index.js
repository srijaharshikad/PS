const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const moment = require('moment');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/thumbnails', express.static(path.join(__dirname, 'thumbnails')));

// Ensure directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const thumbnailsDir = path.join(__dirname, 'thumbnails');
fs.ensureDirSync(uploadsDir);
fs.ensureDirSync(thumbnailsDir);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(uploadsDir, 'gallery');
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed!'));
    }
  }
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Prathyusha & Sravan Wedding Website API'
  });
});

// Get wedding details
app.get('/api/wedding-details', (req, res) => {
  const weddingDetails = {
    bride: 'Prathyusha',
    groom: 'Sravan',
    weddingDate: '2025-11-07',
    venue: 'Ithaas',
    timeline: [
      { time: '10:00 AM', event: 'Mehendi Ceremony', description: 'Beautiful henna designs and celebrations' },
      { time: '6:00 PM', event: 'Sangam Ceremony', description: 'Musical evening with family and friends' },
      { time: '7:00 AM', event: 'Wedding Ceremony', description: 'Sacred union of two souls' },
      { time: '12:00 PM', event: 'Reception', description: 'Celebration with delicious food and dance' }
    ],
    story: 'Two hearts, one love story. Join us as we celebrate the beginning of our forever journey together.',
    location: {
      name: 'Ithaas',
      address: 'Wedding Venue Address',
      coordinates: { lat: 17.4065, lng: 78.4772 }
    }
  };
  
  res.json({ success: true, data: weddingDetails });
});

// Upload photos/videos
app.post('/api/upload', upload.array('files', 20), async (req, res) => {
  try {
    const { guestName, message } = req.body;
    const uploadedFiles = [];

    for (const file of req.files) {
      const fileData = {
        id: uuidv4(),
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
        url: `/uploads/gallery/${file.filename}`,
        guestName: guestName || 'Anonymous',
        message: message || '',
        uploadedAt: new Date().toISOString(),
        type: file.mimetype.startsWith('image/') ? 'image' : 'video'
      };

      // Create thumbnail for images
      if (file.mimetype.startsWith('image/')) {
        try {
          const thumbnailPath = path.join(thumbnailsDir, `thumb_${file.filename}`);
          await sharp(file.path)
            .resize(300, 300, { fit: 'cover' })
            .jpeg({ quality: 80 })
            .toFile(thumbnailPath);
          
          fileData.thumbnail = `/thumbnails/thumb_${file.filename}`;
        } catch (error) {
          console.error('Error creating thumbnail:', error);
        }
      }

      uploadedFiles.push(fileData);
    }

    // Save metadata to JSON file
    const metadataPath = path.join(__dirname, 'gallery-metadata.json');
    let existingData = [];
    
    if (fs.existsSync(metadataPath)) {
      existingData = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    }
    
    existingData.push(...uploadedFiles);
    fs.writeFileSync(metadataPath, JSON.stringify(existingData, null, 2));

    res.json({ 
      success: true, 
      message: 'Files uploaded successfully!',
      files: uploadedFiles 
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get gallery items
app.get('/api/gallery', (req, res) => {
  try {
    const metadataPath = path.join(__dirname, 'gallery-metadata.json');
    
    if (fs.existsSync(metadataPath)) {
      const galleryData = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      // Sort by upload date, newest first
      galleryData.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
      res.json({ success: true, data: galleryData });
    } else {
      res.json({ success: true, data: [] });
    }
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get gallery stats
app.get('/api/gallery/stats', (req, res) => {
  try {
    const metadataPath = path.join(__dirname, 'gallery-metadata.json');
    
    if (fs.existsSync(metadataPath)) {
      const galleryData = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      const stats = {
        totalItems: galleryData.length,
        totalPhotos: galleryData.filter(item => item.type === 'image').length,
        totalVideos: galleryData.filter(item => item.type === 'video').length,
        uniqueGuests: [...new Set(galleryData.map(item => item.guestName))].length,
        recentUploads: galleryData.filter(item => 
          moment().diff(moment(item.uploadedAt), 'hours') < 24
        ).length
      };
      res.json({ success: true, data: stats });
    } else {
      res.json({ success: true, data: { totalItems: 0, totalPhotos: 0, totalVideos: 0, uniqueGuests: 0, recentUploads: 0 } });
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: error.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`💕 Prathyusha & Sravan Wedding Website Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📸 Gallery API: http://localhost:${PORT}/api/gallery`);
  console.log(`💑 Wedding Details: http://localhost:${PORT}/api/wedding-details`);
});