#!/usr/bin/env node
/**
 * MOVEMENTMonitor server
 * - Serves static files from this directory
 * - Accepts POST /submit-report
 * - Saves reports to ./reports/
 * - Research request queue API (/api/requests)
 * - Admin dashboard (/admin)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = 4242;
const REPORTS_DIR = path.join(__dirname, 'reports');
const REQUESTS_FILE = path.join(__dirname, 'requests.json');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon'
};

// ===== AUTH =====
const ADMIN_PASSWORD = 'thearcade';
const adminTokens = new Map(); // token -> { createdAt }
const TOKEN_TTL = 24 * 60 * 60 * 1000; // 24 hours

function generateToken() {
  const token = crypto.randomBytes(32).toString('hex');
  adminTokens.set(token, { createdAt: Date.now() });
  return token;
}

function validateToken(req) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) return false;
  const token = auth.slice(7);
  const entry = adminTokens.get(token);
  if (!entry) return false;
  if (Date.now() - entry.createdAt > TOKEN_TTL) {
    adminTokens.delete(token);
    return false;
  }
  return true;
}

// ===== RATE LIMITING =====
const rateLimits = new Map(); // ip -> { count, resetAt }
const RATE_LIMIT = 10;
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip) {
  const now = Date.now();
  let entry = rateLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + RATE_WINDOW };
    rateLimits.set(ip, entry);
  }
  entry.count++;
  return entry.count <= RATE_LIMIT;
}

// Clean up rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimits) {
    if (now > entry.resetAt) rateLimits.delete(ip);
  }
}, 5 * 60 * 1000);

// ===== REQUESTS DATA =====
function loadRequests() {
  try {
    if (fs.existsSync(REQUESTS_FILE)) {
      return JSON.parse(fs.readFileSync(REQUESTS_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('[REQUESTS] Error loading requests.json:', e.message);
  }
  return [];
}

function saveRequests(requests) {
  fs.writeFileSync(REQUESTS_FILE, JSON.stringify(requests, null, 2));
}

// ===== HELPERS =====
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) { req.destroy(); reject(new Error('Body too large')); }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function jsonResponse(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function parseUrl(url) {
  const [pathname, queryString] = url.split('?');
  const params = {};
  if (queryString) {
    queryString.split('&').forEach(pair => {
      const [k, v] = pair.split('=');
      params[decodeURIComponent(k)] = decodeURIComponent(v || '');
    });
  }
  return { pathname, params };
}

// ===== SERVER =====
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  const { pathname, params } = parseUrl(req.url);
  const ip = getClientIP(req);

  try {
    // ===== POST /submit-report (existing) =====
    if (req.method === 'POST' && pathname === '/submit-report') {
      const body = await readBody(req);
      const data = JSON.parse(body);
      const report = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        caseId: data.caseId || null,
        caseName: data.caseName || null,
        reportType: data.reportType || 'general',
        message: data.message || '',
        url: data.url || null,
        submitter: data.submitter || 'anonymous',
        status: 'pending'
      };

      const filename = `${REPORTS_DIR}/report-${report.id}.json`;
      fs.writeFileSync(filename, JSON.stringify(report, null, 2));
      console.log(`[REPORT] New report saved: ${filename}`);

      const queueFile = path.join(REPORTS_DIR, 'pending-queue.json');
      let queue = [];
      if (fs.existsSync(queueFile)) {
        try { queue = JSON.parse(fs.readFileSync(queueFile)); } catch(e) {}
      }
      queue.push(report);
      fs.writeFileSync(queueFile, JSON.stringify(queue, null, 2));

      return jsonResponse(res, 200, { success: true, reportId: report.id });
    }

    // ===== GET /reports-count (existing) =====
    if (req.method === 'GET' && pathname === '/reports-count') {
      const files = fs.readdirSync(REPORTS_DIR).filter(f => f.startsWith('report-'));
      return jsonResponse(res, 200, { count: files.length });
    }

    // ===== POST /api/admin/login =====
    if (req.method === 'POST' && pathname === '/api/admin/login') {
      const body = await readBody(req);
      const data = JSON.parse(body);
      if (data.password === ADMIN_PASSWORD) {
        const token = generateToken();
        return jsonResponse(res, 200, { success: true, token });
      }
      return jsonResponse(res, 401, { success: false, error: 'Invalid password' });
    }

    // ===== POST /api/requests (public, rate-limited) =====
    if (req.method === 'POST' && pathname === '/api/requests') {
      if (!checkRateLimit(ip)) {
        return jsonResponse(res, 429, { success: false, error: 'Rate limit exceeded. Max 10 requests per minute.' });
      }
      const body = await readBody(req);
      const data = JSON.parse(body);

      if (!data.caseId || !data.caseName || !data.type || !data.description) {
        return jsonResponse(res, 400, { success: false, error: 'Missing required fields: caseId, caseName, type, description' });
      }

      const requests = loadRequests();
      const newRequest = {
        id: crypto.randomUUID(),
        caseId: data.caseId,
        caseName: data.caseName,
        type: data.type,
        description: data.description,
        priority: data.priority || 'normal',
        status: 'pending',
        createdAt: new Date().toISOString(),
        approvedAt: null,
        completedAt: null,
        rejectedAt: null,
        adminNotes: null,
        researchSummary: null
      };

      requests.push(newRequest);
      saveRequests(requests);
      console.log(`[REQUEST] New research request: ${newRequest.id} — ${newRequest.caseName} (${newRequest.type})`);

      return jsonResponse(res, 201, { success: true, requestId: newRequest.id });
    }

    // ===== GET /api/requests (admin, auth required) =====
    if (req.method === 'GET' && pathname === '/api/requests') {
      if (!validateToken(req)) {
        return jsonResponse(res, 401, { success: false, error: 'Unauthorized' });
      }
      let requests = loadRequests();
      if (params.status) {
        requests = requests.filter(r => r.status === params.status);
      }
      // Sort by createdAt descending
      requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return jsonResponse(res, 200, { success: true, requests });
    }

    // ===== POST /api/requests/:id/approve =====
    if (req.method === 'POST' && pathname.match(/^\/api\/requests\/[^/]+\/approve$/)) {
      if (!validateToken(req)) {
        return jsonResponse(res, 401, { success: false, error: 'Unauthorized' });
      }
      const id = pathname.split('/')[3];
      const requests = loadRequests();
      const request = requests.find(r => r.id === id);
      if (!request) return jsonResponse(res, 404, { success: false, error: 'Request not found' });

      const body = await readBody(req);
      let data = {};
      try { data = JSON.parse(body); } catch(e) {}

      request.status = 'approved';
      request.approvedAt = new Date().toISOString();
      if (data.adminNotes) request.adminNotes = data.adminNotes;
      saveRequests(requests);
      console.log(`[REQUEST] Approved: ${id}`);
      return jsonResponse(res, 200, { success: true, request });
    }

    // ===== POST /api/requests/:id/reject =====
    if (req.method === 'POST' && pathname.match(/^\/api\/requests\/[^/]+\/reject$/)) {
      if (!validateToken(req)) {
        return jsonResponse(res, 401, { success: false, error: 'Unauthorized' });
      }
      const id = pathname.split('/')[3];
      const requests = loadRequests();
      const request = requests.find(r => r.id === id);
      if (!request) return jsonResponse(res, 404, { success: false, error: 'Request not found' });

      const body = await readBody(req);
      let data = {};
      try { data = JSON.parse(body); } catch(e) {}

      request.status = 'rejected';
      request.rejectedAt = new Date().toISOString();
      if (data.adminNotes) request.adminNotes = data.adminNotes;
      saveRequests(requests);
      console.log(`[REQUEST] Rejected: ${id}`);
      return jsonResponse(res, 200, { success: true, request });
    }

    // ===== POST /api/requests/:id/complete =====
    if (req.method === 'POST' && pathname.match(/^\/api\/requests\/[^/]+\/complete$/)) {
      if (!validateToken(req)) {
        return jsonResponse(res, 401, { success: false, error: 'Unauthorized' });
      }
      const id = pathname.split('/')[3];
      const requests = loadRequests();
      const request = requests.find(r => r.id === id);
      if (!request) return jsonResponse(res, 404, { success: false, error: 'Request not found' });

      const body = await readBody(req);
      const data = JSON.parse(body);

      request.status = 'completed';
      request.completedAt = new Date().toISOString();
      if (data.summary) request.researchSummary = data.summary;
      if (data.updatedFields) request.updatedFields = data.updatedFields;
      if (data.adminNotes) request.adminNotes = data.adminNotes;
      saveRequests(requests);
      console.log(`[REQUEST] Completed: ${id}`);
      return jsonResponse(res, 200, { success: true, request });
    }

    // ===== POST /api/requests/:id/notes =====
    if (req.method === 'POST' && pathname.match(/^\/api\/requests\/[^/]+\/notes$/)) {
      if (!validateToken(req)) {
        return jsonResponse(res, 401, { success: false, error: 'Unauthorized' });
      }
      const id = pathname.split('/')[3];
      const requests = loadRequests();
      const request = requests.find(r => r.id === id);
      if (!request) return jsonResponse(res, 404, { success: false, error: 'Request not found' });

      const body = await readBody(req);
      const data = JSON.parse(body);

      request.adminNotes = data.adminNotes || request.adminNotes;
      saveRequests(requests);
      return jsonResponse(res, 200, { success: true, request });
    }

    // ===== Serve /admin → admin.html =====
    if (req.method === 'GET' && (pathname === '/admin' || pathname === '/admin/')) {
      const adminPath = path.join(__dirname, 'admin.html');
      if (fs.existsSync(adminPath)) {
        const data = fs.readFileSync(adminPath);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(data);
      }
      res.writeHead(404);
      return res.end('Admin page not found');
    }

    // ===== Static file serving =====
    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
    // Prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
      res.writeHead(403); return res.end('Forbidden');
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404); return res.end('Not found');
      }
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(data);
    });

  } catch (e) {
    console.error(`[ERROR] ${req.method} ${pathname}:`, e.message);
    if (!res.headersSent) {
      jsonResponse(res, 400, { success: false, error: 'Invalid request' });
    }
  }
});

server.listen(PORT, () => {
  console.log(`MOVEMENTMonitor server running on http://localhost:${PORT}`);
  console.log(`Admin dashboard: http://localhost:${PORT}/admin`);
  console.log(`Reports saved to: ${REPORTS_DIR}`);
});
