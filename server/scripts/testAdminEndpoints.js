const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envTestPath = path.join(__dirname, '..', '.env.test');
if (fs.existsSync(envTestPath)) {
  dotenv.config({ path: envTestPath });
} else {
  dotenv.config();
}

const baseUrl = process.env.ADMIN_TEST_BASE_URL || 'http://localhost:5000';
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message = data?.message || response.statusText;
    throw new Error(`${response.status} ${message}`);
  }

  return data;
};

const run = async () => {
  if (!adminEmail || !adminPassword) {
    console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment.');
    process.exit(1);
  }

  console.log('Logging in as admin...');
  const login = await requestJson(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: adminEmail,
      password: adminPassword
    })
  });

  const token = login?.token;
  if (!token) {
    console.error('Login did not return a token.');
    process.exit(1);
  }

  console.log('Fetching admin students...');
  const students = await requestJson(`${baseUrl}/api/admin/students`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  console.log('Admin endpoints OK.');
  console.log(`Students count: ${students?.count ?? 0}`);
};

run().catch((error) => {
  console.error('Admin endpoint test failed:', error.message);
  process.exit(1);
});
