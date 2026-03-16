#!/usr/bin/env node
/**
 * MOVEMENTMonitor server
 * - Serves static files from this directory
 * - Accepts POST /submit-report
 * - Saves reports to ./reports/
 * - Triggers OpenClaw notification via webhook
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = 4242;
const REPORTS_DIR = path.join(__dirname, 'reports');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  // POST /submit-report
  if (req.method === 'POST' && req.url === '/submit-report') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
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

        // Save report
        const filename = `${REPORTS_DIR}/report-${report.id}.json`;
        fs.writeFileSync(filename, JSON.stringify(report, null, 2));
        console.log(`[REPORT] New report saved: ${filename}`);

        // Write to pending queue for PandaClaw to pick up
        const queueFile = path.join(__dirname, 'reports', 'pending-queue.json');
        let queue = [];
        if (fs.existsSync(queueFile)) {
          try { queue = JSON.parse(fs.readFileSync(queueFile)); } catch(e) {}
        }
        queue.push(report);
        fs.writeFileSync(queueFile, JSON.stringify(queue, null, 2));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, reportId: report.id }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // GET /reports-count (for dashboard display)
  if (req.method === 'GET' && req.url === '/reports-count') {
    const files = fs.readdirSync(REPORTS_DIR).filter(f => f.startsWith('report-'));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ count: files.length }));
  }

  // Static file serving
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
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
});

server.listen(PORT, () => {
  console.log(`MOVEMENTMonitor server running on http://localhost:${PORT}`);
  console.log(`Reports saved to: ${REPORTS_DIR}`);
});
