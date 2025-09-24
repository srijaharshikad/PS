#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function checkSetup() {
  const envPath = path.join(__dirname, 'server', '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ Environment not configured!');
    console.log('Please run: npm run setup');
    process.exit(1);
  }
  
  // Check if OpenAI API key is configured
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (!envContent.includes('OPENAI_API_KEY=sk-') && !envContent.includes('OPENAI_API_KEY=your-')) {
    console.log('⚠️  OpenAI API key might not be configured properly');
    console.log('Please check your .env file in the server directory');
  }
}

function startApp() {
  console.log('🎬 Starting Wedding Video Creator...\n');
  
  checkSetup();
  
  console.log('📡 Starting servers...');
  console.log('   Frontend: http://localhost:3000');
  console.log('   Backend:  http://localhost:5000');
  console.log('\n💡 Features available:');
  console.log('   • AI-Powered Video Generation');
  console.log('   • Multiple Animation Styles (Ghibli, Cinematic, Romantic, etc.)');
  console.log('   • Custom Media Upload (Images, Videos, Audio)');
  console.log('   • Professional Templates');
  console.log('   • Real-time Preview');
  console.log('\n🌐 Use Chrome or Edge for best experience\n');
  
  // Start the development servers
  const child = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });
  
  child.on('error', (error) => {
    console.error('❌ Error starting application:', error.message);
    process.exit(1);
  });
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n👋 Shutting down servers...');
    child.kill('SIGINT');
    process.exit(0);
  });
}

startApp();