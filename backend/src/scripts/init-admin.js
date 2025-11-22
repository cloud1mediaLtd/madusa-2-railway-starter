#!/usr/bin/env node

const { exec } = require('child_process');
const { Client } = require('pg');

async function checkTableExists(tableName) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    const result = await client.query(
      'SELECT COUNT(*) FROM "' + tableName + '";'
    );
    return parseInt(result.rows[0].count) > 0;
  } catch (error) {
    console.log(`Table ${tableName} doesn't exist or is empty`);
    return false;
  } finally {
    await client.end();
  }
}

async function checkAdminExists() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    const result = await client.query('SELECT COUNT(*) FROM "user" WHERE email = $1;', [process.env.MEDUSA_ADMIN_EMAIL]);
    return parseInt(result.rows[0].count) > 0;
  } catch (error) {
    console.error('Error checking if admin exists:', error);
    return false;
  } finally {
    await client.end();
  }
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        reject(error);
        return;
      }
      console.log(stdout);
      if (stderr) {
        console.error(stderr);
      }
      resolve();
    });
  });
}

async function seedDatabase() {
  try {
    const regionsExist = await checkTableExists('region');

    if (regionsExist) {
      console.log('Database already seeded (regions exist), skipping seed');
      return;
    }

    console.log('Database not seeded. Running seed script...');
    console.log('This will create:');
    console.log('  - Default regions (Europe with GB, DE, DK, SE, FR, ES, IT)');
    console.log('  - Publishable API keys');
    console.log('  - Demo products and categories');
    console.log('  - Stock locations and shipping options');

    await runCommand('npm run seed');
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Failed to seed database:', error);
    console.log('You can manually seed later by running: yarn seed');
    // Don't exit - allow the server to start even if seeding fails
  }
}

async function createAdmin() {
  const adminEmail = process.env.MEDUSA_ADMIN_EMAIL;
  const adminPassword = process.env.MEDUSA_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log('MEDUSA_ADMIN_EMAIL or MEDUSA_ADMIN_PASSWORD not set, skipping admin creation');
    return;
  }

  try {
    const adminExists = await checkAdminExists();

    if (adminExists) {
      console.log(`Admin user ${adminEmail} already exists, skipping creation`);
      return;
    }

    console.log(`Creating admin user: ${adminEmail}`);
    await runCommand(`npx medusa user -e "${adminEmail}" -p "${adminPassword}"`);
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Failed to create admin user:', error);
    // Don't exit - allow the server to start even if admin creation fails
  }
}

async function initialize() {
  console.log('=== Medusa Backend Initialization ===');

  // First, seed the database if needed
  await seedDatabase();

  // Then create admin user if needed
  await createAdmin();

  console.log('=== Initialization Complete ===');
}

initialize();
