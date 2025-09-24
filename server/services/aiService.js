const OpenAI = require('openai');
const Replicate = require('replicate');
const fs = require('fs-extra');
const path = require('path');
const fetch = require('node-fetch');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN
    });

    this.styleModels = {
      'ghibli': 'stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb1a4f3482d9b4c1f3d0b46a3a4b9b2d7b5b5b5b5b',
      'cinematic': 'stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb1a4f3482d9b4c1f3d0b46a3a4b9b2d7b5b5b5b5b',
      'anime': 'cjwbw/animatediff:3f3d6c4f7a8b9c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8',
      'watercolor': 'stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478',
      'vintage': 'stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478',
      'modern': 'stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478',
      'elegant': 'stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478',
      'romantic': 'stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478'
    };
  }

  async applyVideoStyle(options) {
    const { videoPath, style, prompt } = options;
    
    try {
      console.log(`Applying ${style} style to video:`, videoPath);
      
      if (!this.styleModels[style]) {
        throw new Error(`Unsupported style: ${style}`);
      }

      // For now, we'll use a simulated approach since actual video-to-video AI models
      // are still evolving. In production, you'd use services like RunwayML, Stable Video Diffusion, etc.
      const styledVideoPath = await this.simulateStyleTransfer(videoPath, style, prompt);
      
      return {
        path: styledVideoPath,
        url: styledVideoPath.replace(path.join(__dirname, '../'), '/'),
        style,
        originalPath: videoPath
      };

    } catch (error) {
      console.error('Error applying video style:', error);
      throw error;
    }
  }

  async simulateStyleTransfer(videoPath, style, prompt) {
    // This is a placeholder implementation
    // In a real application, you would:
    // 1. Extract frames from the video
    // 2. Apply AI style transfer to each frame
    // 3. Reconstruct the video with styled frames
    
    const outputDir = path.dirname(videoPath);
    const styledPath = path.join(outputDir, `styled-${style}-${Date.now()}.mp4`);
    
    // For demo purposes, copy the original video
    // In production, implement actual AI style transfer
    await fs.copy(videoPath, styledPath);
    
    return styledPath;
  }

  async generateStyledFrames(frames, style, prompt) {
    const styledFrames = [];
    
    for (const frame of frames) {
      try {
        const styledFrame = await this.styleTransferFrame(frame, style, prompt);
        styledFrames.push(styledFrame);
      } catch (error) {
        console.error('Error styling frame:', error);
        // Use original frame as fallback
        styledFrames.push(frame);
      }
    }
    
    return styledFrames;
  }

  async styleTransferFrame(framePath, style, prompt) {
    const stylePrompt = this.getStylePrompt(style, prompt);
    
    try {
      // Use Replicate for image-to-image style transfer
      const output = await this.replicate.run(
        this.styleModels[style],
        {
          input: {
            image: await fs.readFile(framePath),
            prompt: stylePrompt,
            num_inference_steps: 20,
            guidance_scale: 7.5
          }
        }
      );
      
      // Download and save the styled frame
      const styledFramePath = framePath.replace('.png', `-styled-${style}.png`);
      await this.downloadImage(output[0], styledFramePath);
      
      return styledFramePath;
    } catch (error) {
      console.error('Error in style transfer:', error);
      return framePath; // Return original frame as fallback
    }
  }

  getStylePrompt(style, customPrompt) {
    const basePrompts = {
      'ghibli': 'Studio Ghibli anime style, beautiful hand-drawn animation, soft colors, dreamy atmosphere',
      'cinematic': 'cinematic film style, dramatic lighting, professional cinematography, movie-like quality',
      'anime': 'anime style illustration, vibrant colors, manga-inspired art, Japanese animation',
      'watercolor': 'watercolor painting style, soft brush strokes, flowing colors, artistic medium',
      'vintage': 'vintage retro style, aged film look, nostalgic atmosphere, classic aesthetic',
      'modern': 'modern contemporary style, clean lines, minimalist design, sleek appearance',
      'elegant': 'elegant sophisticated style, luxury aesthetic, refined details, classy design',
      'romantic': 'romantic dreamy style, soft lighting, pastel colors, love-themed atmosphere'
    };

    const basePrompt = basePrompts[style] || 'artistic style transformation';
    return customPrompt ? `${basePrompt}, ${customPrompt}` : basePrompt;
  }

  async downloadImage(url, outputPath) {
    const response = await fetch(url);
    const buffer = await response.buffer();
    await fs.writeFile(outputPath, buffer);
    return outputPath;
  }

  async generateWeddingContent(textInput) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert wedding invitation content creator. Generate beautiful, personalized wedding invitation text based on the user's input. Include appropriate cultural elements and romantic language."
          },
          {
            role: "user",
            content: `Create wedding invitation content for: ${textInput}`
          }
        ],
        max_tokens: 500
      });

      return {
        content: completion.choices[0].message.content,
        suggestions: await this.generateContentSuggestions(textInput)
      };
    } catch (error) {
      console.error('Error generating wedding content:', error);
      return {
        content: textInput,
        suggestions: []
      };
    }
  }

  async generateContentSuggestions(input) {
    // Generate alternative content suggestions
    const suggestions = [
      "Add romantic poetry",
      "Include traditional blessings",
      "Add venue details",
      "Include RSVP information",
      "Add dress code",
      "Include gift registry info"
    ];
    
    return suggestions;
  }

  async enhanceVideoWithAI(videoPath, enhancements) {
    // Placeholder for AI-powered video enhancements
    // Could include: upscaling, noise reduction, color correction, etc.
    return videoPath;
  }

  async generateMusicRecommendations(style, mood) {
    // Generate music recommendations based on video style and mood
    const recommendations = {
      'ghibli': ['Spirited Away Theme', 'My Neighbor Totoro', 'Castle in the Sky'],
      'cinematic': ['Epic Orchestral', 'Dramatic Strings', 'Cinematic Piano'],
      'romantic': ['Romantic Piano', 'Soft Acoustic', 'Classical Romance'],
      'elegant': ['Classical Chamber', 'Sophisticated Jazz', 'Elegant Strings']
    };

    return recommendations[style] || ['Beautiful Wedding Music'];
  }
}

module.exports = new AIService();
