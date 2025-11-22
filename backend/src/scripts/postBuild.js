#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

console.log('=== Post-Build Setup ===');

const MEDUSA_SERVER_PATH = path.join(process.cwd(), '.medusa', 'server');

// Validate build succeeded
if (!fs.existsSync(MEDUSA_SERVER_PATH)) {
  console.error('❌ ERROR: .medusa/server directory not found!');
  console.error('This indicates the Medusa build process failed.');
  console.error('Please check the build logs for errors.');
  process.exit(1);
}

console.log('✅ Build directory found');

// Copy yarn.lock for consistent dependency resolution
const yarnLockPath = path.join(process.cwd(), 'yarn.lock');
if (fs.existsSync(yarnLockPath)) {
  console.log('📦 Copying yarn.lock to .medusa/server...');
  fs.copyFileSync(
    yarnLockPath,
    path.join(MEDUSA_SERVER_PATH, 'yarn.lock')
  );
  console.log('✅ yarn.lock copied');
} else {
  console.log('⚠️  Warning: yarn.lock not found');
}

// Copy .env if it exists (for production deployments)
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  console.log('🔐 Copying .env to .medusa/server...');
  fs.copyFileSync(
    envPath,
    path.join(MEDUSA_SERVER_PATH, '.env')
  );
  console.log('✅ .env copied');
} else {
  console.log('ℹ️  No .env file found (using environment variables)');
}

// Install production dependencies in .medusa/server
console.log('📦 Installing production dependencies in .medusa/server...');
try {
  execSync('yarn install --production --frozen-lockfile', {
    cwd: MEDUSA_SERVER_PATH,
    stdio: 'inherit'
  });
  console.log('✅ Production dependencies installed');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

console.log('=== Post-Build Complete ===');
