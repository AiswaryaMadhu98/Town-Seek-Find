// Hot and Cold: static page plus a tiny leaderboard API. No dependencies.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'public', 'index.html');
const STORE = path.join(__dirname, 'scores.json');
const CODE_RE = /^[2-9A-HJ-NP-Z]{4}$/;

// boards: { CODE: { "name lowercase": { name, ms } } }
let boards = {};
try { boards = JSON.parse(fs.readFileSync(STORE, 'utf8')); } catch (e) { boards = {}; }
let saveTimer = null;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { fs.writeFile(STORE, JSON.stringify(boards), () => {}); }, 500);
}

function send(res, status, body, type) {
  res.writeHead(status, { 'Content-Type': type || 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(Buffer.isBuffer(body) || typeof body === 'string' ? body : JSON.stringify(body));
}

function topScores(code) {
  const b = boards[code] || {};
  return Object.values(b).sort((a, c) => a.ms - c.ms).slice(0, 50);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
    return fs.readFile(INDEX, (err, data) => err ? send(res, 500, 'Missing public/index.html', 'text/plain') : send(res, 200, data, 'text/html; charset=utf-8'));
  }
  if (req.method === 'GET' && url.pathname === '/health') return send(res, 200, { ok: true });

  if (req.method === 'GET' && url.pathname === '/api/scores') {
    const code = (url.searchParams.get('code') || '').toUpperCase();
    if (!CODE_RE.test(code)) return send(res, 400, { error: 'bad code' });
    return send(res, 200, { scores: topScores(code) });
  }

  if (req.method === 'POST' && url.pathname === '/api/score') {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; if (raw.length > 2048) req.destroy(); });
    req.on('end', () => {
      let body;
      try { body = JSON.parse(raw); } catch (e) { return send(res, 400, { error: 'bad json' }); }
      const code = String(body.code || '').toUpperCase();
      const name = String(body.name || '').replace(/\s+/g, ' ').trim().slice(0, 20);
      const ms = Math.round(Number(body.ms));
      if (!CODE_RE.test(code) || !name || !Number.isFinite(ms) || ms < 1000 || ms > 6 * 3600 * 1000) return send(res, 400, { error: 'invalid score' });
      const board = boards[code] || (boards[code] = {});
      const key = name.toLowerCase();
      if (!board[key] || ms < board[key].ms) { board[key] = { name, ms }; save(); }
      return send(res, 200, { ok: true });
    });
    return;
  }

  send(res, 404, { error: 'not found' });
});

server.listen(PORT, () => console.log('Hot and Cold running on port ' + PORT));
