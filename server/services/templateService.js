const path = require('path');
const fs = require('fs-extra');

class TemplateService {
  constructor() {
    this.templates = this.initializeTemplates();
  }

  initializeTemplates() {
    return {
      'elegant-engagement': {
        id: 'elegant-engagement',
        name: 'Elegant Engagement',
        category: 'engagement',
        description: 'Sophisticated engagement announcement with elegant typography',
        thumbnail: '/templates/elegant-engagement/thumbnail.jpg',
        duration: 15,
        scenes: [
          {
            id: 'intro',
            duration: 3,
            background: {
              type: 'gradient',
              colors: ['#ffeaa7', '#fab1a0', '#e17055']
            },
            textElements: [
              {
                content: 'We\'re Engaged!',
                x: 960, y: 300,
                fontSize: 72,
                fontFamily: 'Playfair Display',
                color: '#2d3436',
                align: 'center'
              }
            ],
            animations: ['fadeIn', 'slideUp']
          },
          {
            id: 'couple',
            duration: 4,
            background: { type: 'image', theme: 'romantic' },
            textElements: [
              {
                content: '{bride} & {groom}',
                x: 960, y: 400,
                fontSize: 56,
                fontFamily: 'Playfair Display',
                color: '#ffffff',
                align: 'center'
              }
            ],
            mediaElements: [
              {
                type: 'image',
                x: 760, y: 200,
                width: 400, height: 400,
                placeholder: 'couple-photo'
              }
            ],
            animations: ['zoomIn', 'heartBeat']
          },
          {
            id: 'details',
            duration: 4,
            background: {
              type: 'gradient',
              colors: ['#74b9ff', '#0984e3']
            },
            textElements: [
              {
                content: 'Save the Date',
                x: 960, y: 300,
                fontSize: 48,
                fontFamily: 'Playfair Display',
                color: '#ffffff',
                align: 'center'
              },
              {
                content: '{date}',
                x: 960, y: 400,
                fontSize: 36,
                fontFamily: 'Lato',
                color: '#ffffff',
                align: 'center'
              },
              {
                content: '{venue}',
                x: 960, y: 500,
                fontSize: 28,
                fontFamily: 'Lato',
                color: '#ffffff',
                align: 'center'
              }
            ],
            animations: ['slideInLeft', 'slideInRight']
          },
          {
            id: 'message',
            duration: 4,
            background: {
              type: 'gradient',
              colors: ['#fd79a8', '#e84393']
            },
            textElements: [
              {
                content: '{message}',
                x: 960, y: 400,
                fontSize: 32,
                fontFamily: 'Lato',
                color: '#ffffff',
                align: 'center',
                maxWidth: 800
              }
            ],
            animations: ['fadeIn', 'typewriter']
          }
        ]
      },

      'ghibli-wedding': {
        id: 'ghibli-wedding',
        name: 'Ghibli Style Wedding',
        category: 'wedding',
        description: 'Magical Studio Ghibli inspired wedding invitation',
        thumbnail: '/templates/ghibli-wedding/thumbnail.jpg',
        duration: 20,
        scenes: [
          {
            id: 'magical-intro',
            duration: 4,
            background: {
              type: 'gradient',
              colors: ['#a8e6cf', '#88d8a3', '#4ecdc4']
            },
            textElements: [
              {
                content: 'A Magical Beginning',
                x: 960, y: 300,
                fontSize: 64,
                fontFamily: 'Dancing Script',
                color: '#2d5a27',
                align: 'center'
              }
            ],
            animations: ['sparkle', 'fadeIn'],
            effects: ['floating-particles']
          },
          {
            id: 'couple-story',
            duration: 5,
            background: { type: 'image', theme: 'ghibli-forest' },
            textElements: [
              {
                content: 'Once upon a time...',
                x: 960, y: 200,
                fontSize: 36,
                fontFamily: 'Dancing Script',
                color: '#ffffff',
                align: 'center'
              },
              {
                content: '{bride} met {groom}',
                x: 960, y: 400,
                fontSize: 48,
                fontFamily: 'Dancing Script',
                color: '#ffffff',
                align: 'center'
              }
            ],
            mediaElements: [
              {
                type: 'image',
                x: 660, y: 500,
                width: 600, height: 400,
                placeholder: 'couple-photo',
                style: 'ghibli-filter'
              }
            ],
            animations: ['storybook', 'gentle-sway']
          },
          {
            id: 'wedding-details',
            duration: 6,
            background: {
              type: 'gradient',
              colors: ['#ffd89b', '#19547b']
            },
            textElements: [
              {
                content: 'Join us for our Wedding',
                x: 960, y: 250,
                fontSize: 52,
                fontFamily: 'Dancing Script',
                color: '#2d5a27',
                align: 'center'
              },
              {
                content: '{date} at {time}',
                x: 960, y: 400,
                fontSize: 36,
                fontFamily: 'Lato',
                color: '#2d5a27',
                align: 'center'
              },
              {
                content: '{venue}',
                x: 960, y: 500,
                fontSize: 32,
                fontFamily: 'Lato',
                color: '#2d5a27',
                align: 'center'
              }
            ],
            animations: ['wind-effect', 'gentle-bounce']
          },
          {
            id: 'blessing',
            duration: 5,
            background: {
              type: 'gradient',
              colors: ['#fbc2eb', '#a6c1ee']
            },
            textElements: [
              {
                content: 'With love and magic,',
                x: 960, y: 300,
                fontSize: 36,
                fontFamily: 'Dancing Script',
                color: '#4a4a4a',
                align: 'center'
              },
              {
                content: 'we invite you to celebrate',
                x: 960, y: 400,
                fontSize: 36,
                fontFamily: 'Dancing Script',
                color: '#4a4a4a',
                align: 'center'
              },
              {
                content: 'our happily ever after',
                x: 960, y: 500,
                fontSize: 36,
                fontFamily: 'Dancing Script',
                color: '#4a4a4a',
                align: 'center'
              }
            ],
            animations: ['magical-sparkle', 'heart-float']
          }
        ]
      },

      'cinematic-save-date': {
        id: 'cinematic-save-date',
        name: 'Cinematic Save the Date',
        category: 'save-the-date',
        description: 'Hollywood-style cinematic save the date video',
        thumbnail: '/templates/cinematic-save-date/thumbnail.jpg',
        duration: 18,
        scenes: [
          {
            id: 'dramatic-intro',
            duration: 3,
            background: {
              type: 'gradient',
              colors: ['#000000', '#434343']
            },
            textElements: [
              {
                content: 'COMING SOON',
                x: 960, y: 400,
                fontSize: 72,
                fontFamily: 'Bebas Neue',
                color: '#ffffff',
                align: 'center'
              }
            ],
            animations: ['dramatic-zoom', 'film-grain'],
            effects: ['lens-flare']
          },
          {
            id: 'title-reveal',
            duration: 4,
            background: { type: 'image', theme: 'cinematic-black' },
            textElements: [
              {
                content: 'THE WEDDING OF',
                x: 960, y: 300,
                fontSize: 48,
                fontFamily: 'Bebas Neue',
                color: '#d4af37',
                align: 'center'
              },
              {
                content: '{bride} & {groom}',
                x: 960, y: 450,
                fontSize: 84,
                fontFamily: 'Bebas Neue',
                color: '#ffffff',
                align: 'center'
              }
            ],
            animations: ['title-slide', 'golden-glow']
          },
          {
            id: 'couple-montage',
            duration: 6,
            background: { type: 'video', theme: 'cinematic-montage' },
            textElements: [
              {
                content: 'A Love Story',
                x: 960, y: 200,
                fontSize: 42,
                fontFamily: 'Playfair Display',
                color: '#ffffff',
                align: 'center'
              }
            ],
            mediaElements: [
              {
                type: 'image',
                x: 200, y: 300,
                width: 500, height: 400,
                placeholder: 'couple-photo-1'
              },
              {
                type: 'image',
                x: 1220, y: 300,
                width: 500, height: 400,
                placeholder: 'couple-photo-2'
              }
            ],
            animations: ['montage-effect', 'cross-fade']
          },
          {
            id: 'date-announcement',
            duration: 5,
            background: {
              type: 'gradient',
              colors: ['#d4af37', '#000000']
            },
            textElements: [
              {
                content: 'SAVE THE DATE',
                x: 960, y: 300,
                fontSize: 72,
                fontFamily: 'Bebas Neue',
                color: '#ffffff',
                align: 'center'
              },
              {
                content: '{date}',
                x: 960, y: 450,
                fontSize: 56,
                fontFamily: 'Playfair Display',
                color: '#d4af37',
                align: 'center'
              },
              {
                content: '{venue}',
                x: 960, y: 550,
                fontSize: 36,
                fontFamily: 'Lato',
                color: '#ffffff',
                align: 'center'
              }
            ],
            animations: ['epic-reveal', 'golden-particles']
          }
        ]
      },

      'modern-minimalist': {
        id: 'modern-minimalist',
        name: 'Modern Minimalist',
        category: 'wedding',
        description: 'Clean, modern design with minimalist aesthetics',
        thumbnail: '/templates/modern-minimalist/thumbnail.jpg',
        duration: 12,
        scenes: [
          {
            id: 'clean-intro',
            duration: 3,
            background: {
              type: 'gradient',
              colors: ['#ffffff', '#f8f9fa']
            },
            textElements: [
              {
                content: 'Wedding Invitation',
                x: 960, y: 400,
                fontSize: 48,
                fontFamily: 'Helvetica Neue',
                color: '#2c3e50',
                align: 'center'
              }
            ],
            animations: ['minimal-fade']
          },
          {
            id: 'couple-names',
            duration: 4,
            background: {
              type: 'gradient',
              colors: ['#ecf0f1', '#bdc3c7']
            },
            textElements: [
              {
                content: '{bride}',
                x: 480, y: 400,
                fontSize: 64,
                fontFamily: 'Helvetica Neue Light',
                color: '#34495e',
                align: 'center'
              },
              {
                content: '&',
                x: 960, y: 400,
                fontSize: 48,
                fontFamily: 'Helvetica Neue',
                color: '#7f8c8d',
                align: 'center'
              },
              {
                content: '{groom}',
                x: 1440, y: 400,
                fontSize: 64,
                fontFamily: 'Helvetica Neue Light',
                color: '#34495e',
                align: 'center'
              }
            ],
            animations: ['geometric-reveal']
          },
          {
            id: 'details-grid',
            duration: 5,
            background: {
              type: 'gradient',
              colors: ['#ffffff', '#ecf0f1']
            },
            textElements: [
              {
                content: 'DATE',
                x: 480, y: 300,
                fontSize: 24,
                fontFamily: 'Helvetica Neue',
                color: '#7f8c8d',
                align: 'center'
              },
              {
                content: '{date}',
                x: 480, y: 350,
                fontSize: 36,
                fontFamily: 'Helvetica Neue Light',
                color: '#2c3e50',
                align: 'center'
              },
              {
                content: 'TIME',
                x: 960, y: 300,
                fontSize: 24,
                fontFamily: 'Helvetica Neue',
                color: '#7f8c8d',
                align: 'center'
              },
              {
                content: '{time}',
                x: 960, y: 350,
                fontSize: 36,
                fontFamily: 'Helvetica Neue Light',
                color: '#2c3e50',
                align: 'center'
              },
              {
                content: 'VENUE',
                x: 1440, y: 300,
                fontSize: 24,
                fontFamily: 'Helvetica Neue',
                color: '#7f8c8d',
                align: 'center'
              },
              {
                content: '{venue}',
                x: 1440, y: 350,
                fontSize: 36,
                fontFamily: 'Helvetica Neue Light',
                color: '#2c3e50',
                align: 'center'
              }
            ],
            animations: ['grid-appear']
          }
        ]
      }
    };
  }

  async getAllTemplates() {
    return Object.values(this.templates).map(template => ({
      id: template.id,
      name: template.name,
      category: template.category,
      description: template.description,
      thumbnail: template.thumbnail,
      duration: template.duration
    }));
  }

  async getTemplate(templateId) {
    const template = this.templates[templateId];
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }
    return template;
  }

  async getTemplatesByCategory(category) {
    return Object.values(this.templates)
      .filter(template => template.category === category)
      .map(template => ({
        id: template.id,
        name: template.name,
        category: template.category,
        description: template.description,
        thumbnail: template.thumbnail,
        duration: template.duration
      }));
  }

  async createCustomTemplate(templateData) {
    const templateId = `custom-${Date.now()}`;
    const template = {
      id: templateId,
      ...templateData,
      createdAt: new Date().toISOString(),
      isCustom: true
    };

    this.templates[templateId] = template;
    return template;
  }

  async updateTemplate(templateId, updates) {
    if (!this.templates[templateId]) {
      throw new Error(`Template not found: ${templateId}`);
    }

    this.templates[templateId] = {
      ...this.templates[templateId],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.templates[templateId];
  }

  async deleteTemplate(templateId) {
    if (!this.templates[templateId]) {
      throw new Error(`Template not found: ${templateId}`);
    }

    if (!this.templates[templateId].isCustom) {
      throw new Error('Cannot delete built-in templates');
    }

    delete this.templates[templateId];
    return { success: true, message: 'Template deleted successfully' };
  }

  getAnimationPresets() {
    return {
      'fadeIn': { type: 'opacity', from: 0, to: 1, duration: 1 },
      'slideUp': { type: 'transform', from: 'translateY(50px)', to: 'translateY(0)', duration: 1 },
      'slideInLeft': { type: 'transform', from: 'translateX(-100px)', to: 'translateX(0)', duration: 1 },
      'slideInRight': { type: 'transform', from: 'translateX(100px)', to: 'translateX(0)', duration: 1 },
      'zoomIn': { type: 'transform', from: 'scale(0.5)', to: 'scale(1)', duration: 1 },
      'heartBeat': { type: 'transform', keyframes: ['scale(1)', 'scale(1.1)', 'scale(1)'], duration: 1.5 },
      'sparkle': { type: 'custom', effect: 'sparkle-particles', duration: 2 },
      'typewriter': { type: 'custom', effect: 'typewriter-text', duration: 2 },
      'dramatic-zoom': { type: 'transform', from: 'scale(1.5)', to: 'scale(1)', duration: 2 },
      'golden-glow': { type: 'filter', effect: 'drop-shadow(0 0 20px gold)', duration: 1 },
      'minimal-fade': { type: 'opacity', from: 0, to: 1, duration: 0.8 },
      'geometric-reveal': { type: 'custom', effect: 'geometric-mask', duration: 1.5 }
    };
  }

  getStylePresets() {
    return {
      'ghibli': {
        colors: ['#a8e6cf', '#88d8a3', '#4ecdc4', '#ffd89b'],
        fonts: ['Dancing Script', 'Kaushan Script'],
        effects: ['floating-particles', 'wind-sway', 'magical-sparkle']
      },
      'cinematic': {
        colors: ['#000000', '#434343', '#d4af37', '#ffffff'],
        fonts: ['Bebas Neue', 'Playfair Display'],
        effects: ['lens-flare', 'film-grain', 'dramatic-lighting']
      },
      'elegant': {
        colors: ['#ffeaa7', '#fab1a0', '#e17055', '#2d3436'],
        fonts: ['Playfair Display', 'Lato'],
        effects: ['soft-glow', 'elegant-transitions']
      },
      'modern': {
        colors: ['#ffffff', '#ecf0f1', '#bdc3c7', '#2c3e50'],
        fonts: ['Helvetica Neue', 'Roboto'],
        effects: ['clean-transitions', 'geometric-shapes']
      }
    };
  }
}

module.exports = new TemplateService();
