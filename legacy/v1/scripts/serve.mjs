import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png' };
http.createServer(async (req, res) => { try { const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); const file = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`); if (!file.startsWith(root + path.sep) || pathname.split('/').some(part => part.startsWith('.'))) { res.writeHead(403); return res.end('Forbidden'); } const stats = await stat(file); if (!stats.isFile()) throw new Error('Not a file'); res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); res.end(await readFile(file)); } catch { res.writeHead(404); res.end('Not found'); } }).listen(port, '127.0.0.1', () => console.log(`Amy site: http://127.0.0.1:${port}`));
