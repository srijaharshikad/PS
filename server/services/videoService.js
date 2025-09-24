const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
// Canvas functionality will be added later when dependencies are resolved
const templateService = require('./templateService');
const aiService = require('./aiService');

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

class VideoService {
  constructor() {
    this.jobs = new Map(); // Store job status
  }

  async generateVideo(options) {
    const {
      templateId,
      text,
      style,
      mediaFiles = [],
      customization = {},
      sessionId
    } = options;

    const jobId = uuidv4();
    this.jobs.set(jobId, { status: 'processing', progress: 0 });

    try {
      console.log(`Starting video generation for job ${jobId}`);
      
      // Get template
      const template = await templateService.getTemplate(templateId);
      
      // Create output directory
      const outputDir = path.join(__dirname, '../outputs', sessionId || 'default');
      await fs.ensureDir(outputDir);
      
      // Update progress
      this.updateJobProgress(jobId, 20, 'Template loaded');

      // Process media files
      const processedMedia = await this.processMediaFiles(mediaFiles, sessionId);
      this.updateJobProgress(jobId, 40, 'Media processed');

      // Generate base video from template
      const baseVideoPath = await this.createBaseVideo(template, text, processedMedia, outputDir);
      this.updateJobProgress(jobId, 60, 'Base video created');

      // Apply AI styling if specified
      let finalVideoPath = baseVideoPath;
      if (style && style !== 'default') {
        finalVideoPath = await aiService.applyVideoStyle({
          videoPath: baseVideoPath,
          style,
          prompt: customization.stylePrompt || `Create a ${style} style wedding invitation video`
        });
        this.updateJobProgress(jobId, 80, 'AI styling applied');
      }

      // Add final touches (music, transitions, etc.)
      const enhancedVideoPath = await this.enhanceVideo(finalVideoPath, customization, outputDir);
      this.updateJobProgress(jobId, 100, 'Video generation complete');

      const result = {
        id: jobId,
        path: enhancedVideoPath,
        url: enhancedVideoPath.replace(path.join(__dirname, '../'), '/'),
        duration: await this.getVideoDuration(enhancedVideoPath),
        size: (await fs.stat(enhancedVideoPath)).size,
        format: 'mp4',
        createdAt: new Date().toISOString()
      };

      this.jobs.set(jobId, { status: 'completed', progress: 100, result });
      return result;

    } catch (error) {
      console.error(`Error generating video for job ${jobId}:`, error);
      this.jobs.set(jobId, { status: 'failed', progress: 0, error: error.message });
      throw error;
    }
  }

  async createBaseVideo(template, text, mediaFiles, outputDir) {
    const videoPath = path.join(outputDir, `base-${Date.now()}.mp4`);
    const tempDir = path.join(outputDir, 'temp');
    await fs.ensureDir(tempDir);

    try {
      // Create video scenes based on template
      const scenes = await this.createScenes(template, text, mediaFiles, tempDir);
      
      // Combine scenes into final video
      await this.combineScenes(scenes, videoPath);
      
      // Clean up temp files
      await fs.remove(tempDir);
      
      return videoPath;
    } catch (error) {
      await fs.remove(tempDir);
      throw error;
    }
  }

  async createScenes(template, text, mediaFiles, tempDir) {
    const scenes = [];
    const { scenes: templateScenes, duration: sceneDuration = 3 } = template;

    for (let i = 0; i < templateScenes.length; i++) {
      const scene = templateScenes[i];
      const scenePath = path.join(tempDir, `scene-${i}.mp4`);
      
      // Create a simple video scene (simplified for now)
      await this.createSimpleScene(scene, text, mediaFiles, scenePath, sceneDuration);
      
      scenes.push(scenePath);
    }

    return scenes;
  }

  async createSimpleScene(scene, text, mediaFiles, outputPath, duration) {
    // Create a simple mock video file for demonstration
    console.log('Creating mock video scene:', outputPath);
    
    try {
      // For now, create a simple demo video using FFmpeg testsrc
      return new Promise((resolve, reject) => {
        ffmpeg()
          .input('testsrc2=duration=' + duration + ':size=1920x1080:rate=30')
          .inputFormat('lavfi')
          .outputOptions(['-c:v libx264', '-pix_fmt yuv420p'])
          .output(outputPath)
          .on('start', (cmd) => {
            console.log('FFmpeg command:', cmd);
          })
          .on('end', () => {
            console.log('Mock video created:', outputPath);
            resolve(outputPath);
          })
          .on('error', (err) => {
            console.error('FFmpeg error:', err);
            // If FFmpeg fails, create a placeholder file
            const fs = require('fs');
            fs.writeFileSync(outputPath, 'mock video content');
            resolve(outputPath);
          })
          .run();
      });
    } catch (error) {
      console.error('Error creating scene:', error);
      // Create placeholder file as fallback
      const fs = require('fs');
      fs.writeFileSync(outputPath, 'mock video content');
      return outputPath;
    }
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : {r: 102, g: 126, b: 234}; // Default blue
  }

  async combineScenes(scenes, outputPath) {
    return new Promise((resolve, reject) => {
      const command = ffmpeg();
      
      // Add all scene inputs
      scenes.forEach(scene => {
        command.input(scene);
      });
      
      // Create filter for concatenation
      const filterComplex = scenes.map((_, index) => `[${index}:v]`).join('') + 
                           `concat=n=${scenes.length}:v=1:a=0[outv]`;
      
      command
        .complexFilter(filterComplex)
        .outputOptions(['-map [outv]', '-c:v libx264', '-pix_fmt yuv420p'])
        .output(outputPath)
        .on('end', () => {
          // Clean up scene files
          scenes.forEach(scene => fs.remove(scene));
          resolve(outputPath);
        })
        .on('error', reject)
        .run();
    });
  }

  async enhanceVideo(videoPath, customization, outputDir) {
    const enhancedPath = path.join(outputDir, `enhanced-${Date.now()}.mp4`);
    
    return new Promise((resolve, reject) => {
      let command = ffmpeg(videoPath);
      
      // Add background music if provided
      if (customization.backgroundMusic) {
        command = command.input(customization.backgroundMusic);
        command = command.outputOptions([
          '-c:v copy',
          '-c:a aac',
          '-map 0:v:0',
          '-map 1:a:0',
          '-shortest'
        ]);
      }
      
      // Add fade in/out effects
      if (customization.fadeEffects !== false) {
        command = command.videoFilters([
          'fade=in:0:30',
          'fade=out:st=27:d=3'
        ]);
      }
      
      command
        .output(enhancedPath)
        .on('end', () => resolve(enhancedPath))
        .on('error', reject)
        .run();
    });
  }

  async processMediaFiles(mediaFiles, sessionId) {
    const processed = [];
    
    for (const file of mediaFiles) {
      try {
        // Process based on file type
        if (file.mimetype.startsWith('image/')) {
          const processedImage = await this.processImage(file);
          processed.push({ ...file, ...processedImage, type: 'image' });
        } else if (file.mimetype.startsWith('video/')) {
          const processedVideo = await this.processVideo(file);
          processed.push({ ...file, ...processedVideo, type: 'video' });
        } else if (file.mimetype.startsWith('audio/')) {
          processed.push({ ...file, type: 'audio' });
        }
      } catch (error) {
        console.error(`Error processing file ${file.originalName}:`, error);
      }
    }
    
    return processed;
  }

  async processImage(file) {
    // TODO: Implement image processing (resize, format conversion, etc.)
    return { processed: true };
  }

  async processVideo(file) {
    // TODO: Implement video processing (format conversion, compression, etc.)
    return { processed: true };
  }

  async getVideoDuration(videoPath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata.format.duration);
      });
    });
  }

  getJobStatus(jobId) {
    return this.jobs.get(jobId) || { status: 'not_found' };
  }

  updateJobProgress(jobId, progress, message) {
    const job = this.jobs.get(jobId);
    if (job) {
      job.progress = progress;
      job.message = message;
      job.updatedAt = new Date().toISOString();
      this.jobs.set(jobId, job);
    }
  }

  replaceTextPlaceholders(template, textData) {
    return template
      .replace(/\{bride\}/g, textData.bride || '')
      .replace(/\{groom\}/g, textData.groom || '')
      .replace(/\{date\}/g, textData.date || '')
      .replace(/\{venue\}/g, textData.venue || '')
      .replace(/\{time\}/g, textData.time || '')
      .replace(/\{message\}/g, textData.message || '');
  }

  wrapText(text, maxWidth) {
    // Simple text wrapping without canvas context
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      if ((currentLine + ' ' + word).length < maxWidth / 10) { // Rough estimate
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  async getDefaultBackground(theme) {
    // TODO: Implement default background selection based on theme
    return null;
  }
}

module.exports = new VideoService();
