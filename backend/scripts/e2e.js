// Minimal E2E script: register, login, fetch profile
// Usage: node scripts/e2e.js [baseUrl]
// Requires backend running locally and Supabase configured.

const baseUrl = process.argv[2] || process.env.BASE_URL || 'http://localhost:5000';

function rand() {
  return Math.random().toString(36).slice(2, 8);
}

async function main() {
  const tag = Date.now() + '-' + rand();
  const email = `e2e.${tag}@example.com`;
  const username = `e2e_${tag}`;
  const password = 'Password123!';
  const dob = '1990-01-01';

  console.log('BASE URL:', baseUrl);
  console.log('Registering user:', { email, username });

  // Health
  const health = await fetch(`${baseUrl}/`);
  console.log('Health:', health.status, await health.json().catch(() => ({})));

  // Register
  const regRes = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password, date_of_birth: dob }),
  });
  const regBody = await regRes.json().catch(() => ({}));
  console.log('Register:', regRes.status, regBody);
  if (!regRes.ok) throw new Error('Registration failed');

  // Login
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const loginBody = await loginRes.json().catch(() => ({}));
  console.log('Login:', loginRes.status, loginBody);
  if (!loginRes.ok || !loginBody?.data?.accessToken) throw new Error('Login failed');
  const accessToken = loginBody.data.accessToken;

  // Profile
  const profRes = await fetch(`${baseUrl}/auth/profile`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const profBody = await profRes.json().catch(() => ({}));
  console.log('Profile:', profRes.status, profBody);
  if (!profRes.ok) throw new Error('Profile fetch failed');

  console.log('E2E SUCCESS');
}

main().catch((err) => {
  console.error('E2E FAILED:', err?.message || err);
  process.exit(1);
});
