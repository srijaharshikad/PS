#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('🎬 Welcome to Wedding Video Creator Setup!\n');
  console.log('This setup will help you configure the application with necessary API keys and settings.\n');

  // Check if .env already exists
  const envPath = path.join(__dirname, 'server', '.env');
  const envExamplePath = path.join(__dirname, 'server', '.env.example');
  
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists in server directory.');
    const overwrite = await question('Do you want to overwrite it? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }

  console.log('📝 Please provide the following information:\n');

  // Collect configuration
  const config = {};

  // Server configuration
  console.log('🔧 Server Configuration:');
  config.PORT = await question('Server port (default: 5000): ') || '5000';
  config.NODE_ENV = await question('Environment (development/production) [development]: ') || 'development';
  console.log('');

  // OpenAI API Key
  console.log('🤖 AI Configuration:');
  console.log('OpenAI API key is required for AI-powered content generation.');
  console.log('Get your API key from: https://platform.openai.com/api-keys');
  config.OPENAI_API_KEY = await question('OpenAI API Key: ');
  
  if (!config.OPENAI_API_KEY || config.OPENAI_API_KEY.trim() === '') {
    console.log('⚠️  Warning: OpenAI API key is required for AI features to work.');
    config.OPENAI_API_KEY = 'your_openai_api_key_here';
  }
  console.log('');

  // Replicate API Token (optional)
  console.log('🎨 Video Styling Configuration:');
  console.log('Replicate API token is optional but recommended for advanced video styling.');
  console.log('Get your token from: https://replicate.com/account/api-tokens');
  config.REPLICATE_API_TOKEN = await question('Replicate API Token (optional): ') || 'your_replicate_api_token_here';
  console.log('');

  // File upload configuration
  console.log('📁 File Upload Configuration:');
  config.MAX_FILE_SIZE = await question('Maximum file size in bytes (default: 104857600 = 100MB): ') || '104857600';
  config.UPLOAD_DIR = await question('Upload directory (default: ./uploads): ') || './uploads';
  config.OUTPUT_DIR = await question('Output directory (default: ./outputs): ') || './outputs';
  console.log('');

  // CORS configuration
  console.log('🌐 CORS Configuration:');
  config.ALLOWED_ORIGINS = await question('Allowed origins (default: http://localhost:3000): ') || 'http://localhost:3000';
  console.log('');

  // Video processing configuration
  console.log('🎥 Video Processing Configuration:');
  config.VIDEO_QUALITY = await question('Video quality (low/medium/high) [high]: ') || 'high';
  config.MAX_VIDEO_DURATION = await question('Maximum video duration in seconds (default: 60): ') || '60';
  config.DEFAULT_VIDEO_FORMAT = await question('Default video format (mp4/webm/avi) [mp4]: ') || 'mp4';
  console.log('');

  // Create .env file
  console.log('💾 Creating .env file...');
  
  const envContent = Object.entries(config)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  // Add additional default configurations
  const additionalConfig = `
# Google Cloud Speech API (optional)
GOOGLE_APPLICATION_CREDENTIALS=

# Database Configuration (if using a database)
# DATABASE_URL=postgresql://username:password@localhost:5432/wedding_videos

# AI Service Configuration
AI_PROVIDER=openai
ENABLE_STYLE_TRANSFER=true
ENABLE_VIDEO_ENHANCEMENT=true

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=./logs/app.log
`;

  fs.writeFileSync(envPath, envContent + additionalConfig);

  console.log('✅ .env file created successfully!\n');

  // Create necessary directories
  console.log('📁 Creating necessary directories...');
  const serverDir = path.join(__dirname, 'server');
  const dirs = ['uploads', 'outputs', 'logs'];
  
  dirs.forEach(dir => {
    const dirPath = path.join(serverDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`   Created: ${dir}/`);
    }
  });

  console.log('');

  // Check if dependencies are installed
  console.log('📦 Checking dependencies...');
  const packageJsonExists = fs.existsSync(path.join(__dirname, 'package.json'));
  const nodeModulesExists = fs.existsSync(path.join(__dirname, 'node_modules'));
  
  if (!nodeModulesExists) {
    console.log('⚠️  Dependencies not installed. Please run:');
    console.log('   npm run install-all');
    console.log('');
  }

  // Final instructions
  console.log('🎉 Setup completed successfully!\n');
  console.log('📋 Next steps:');
  console.log('   1. Install dependencies: npm run install-all');
  console.log('   2. Start the application: npm start');
  console.log('   3. Open http://localhost:3000 in your browser');
  console.log('');
  console.log('🔑 Important notes:');
  if (config.OPENAI_API_KEY === 'your_openai_api_key_here') {
    console.log('   • Add your OpenAI API key to server/.env for AI features');
  }
  if (config.REPLICATE_API_TOKEN === 'your_replicate_api_token_here') {
    console.log('   • Add your Replicate API token for advanced video styling');
  }
  console.log('   • Check server/.env for all configuration options');
  console.log('   • Logs will be saved to server/logs/app.log');
  console.log('');
  console.log('🎬 Happy video creating!');

  rl.close();
}

// Handle errors
setup().catch(error => {
  console.error('❌ Setup failed:', error.message);
  rl.close();
  process.exit(1);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n👋 Setup cancelled by user.');
  rl.close();
  process.exit(0);
});