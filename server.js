// Atlas MRU v2 Calculator - tiny Express server with basic auth
const express = require('express');
const basicAuth = require('express-basic-auth');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Read password from environment variable
// Set ATLAS_PASSWORD in Railway environment variables.
// The username defaults to "atlas" but can be overridden with ATLAS_USERNAME.
const username = process.env.ATLAS_USERNAME || 'atlas';
const password = process.env.ATLAS_PASSWORD;

if (!password) {
  console.error('ERROR: ATLAS_PASSWORD environment variable is not set.');
  console.error('Set it in your Railway service settings before deploying.');
  process.exit(1);
}

// Public health check — no auth — used by Railway's healthcheck probe.
// MUST come BEFORE the basicAuth middleware so Railway can reach it.
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Apply basic auth to all subsequent routes
app.use(basicAuth({
  users: { [username]: password },
  challenge: true,
  realm: 'Atlas MRU v2 Calculator',
  unauthorizedResponse: 'Authentication required to access the Atlas MRU v2 Calculator.',
}));

// Serve the static calculator (auth-protected)
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Atlas MRU v2 Calculator running on port ${PORT}`);
  console.log(`Username: ${username}`);
});
