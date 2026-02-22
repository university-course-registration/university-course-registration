const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

const randomHex = (len) => crypto.randomBytes(len).toString('hex');

const run = async () => {
  if (!adminEmail || !adminPassword) {
    console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment.');
    process.exit(1);
  }

  console.log('Health check...');
  await requestJson(`${baseUrl}/`);

  console.log('Signing up a student...');
  const suffix = randomHex(4);
  const studentPassword = `Stu${randomHex(4)}!`;
  const signUp = await requestJson(`${baseUrl}/api/auth/signup`, {
    method: 'POST',
    body: JSON.stringify({
      name: 'Smoke Student',
      regNo: `UG15/CS/${randomHex(3)}`,
      email: `smoke_${suffix}@example.com`,
      password: studentPassword,
      level: '100'
    })
  });

  console.log('Logging in as student...');
  const studentLogin = await requestJson(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: signUp.user.email,
      password: studentPassword
    })
  });

  console.log('Fetching courses...');
  const courses = await requestJson(`${baseUrl}/api/courses/all?level=100`);
  if (!Array.isArray(courses.data) || courses.data.length < 2) {
    throw new Error('No courses found. Seed courses before running smoke test.');
  }

  const courseIds = courses.data.slice(0, 2).map((course) => course._id);

  console.log('Registering courses...');
  await requestJson(`${baseUrl}/api/courses/register`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${studentLogin.token}`
    },
    body: JSON.stringify({
      courseIds,
      userId: studentLogin.user.id
    })
  });

  console.log('Logging in as admin...');
  const adminLogin = await requestJson(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: adminEmail,
      password: adminPassword
    })
  });

  console.log('Fetching admin students...');
  const students = await requestJson(`${baseUrl}/api/admin/students`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${adminLogin.token}`
    }
  });

  console.log('Smoke test OK.');
  console.log(`Students count: ${students?.count ?? 0}`);
};

run().catch((error) => {
  console.error('Smoke test failed:', error.message);
  process.exit(1);
});
