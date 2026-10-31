// Local preview of dist/ that behaves like Vercel with cleanUrls + trailingSlash: false
// (see vercel.json): /blog and /blog/ -> blog.html, /blog.html -> redirect to /blog, unknown paths -> 404.html.
// Usage: npm run build && npm run preview  (PORT env var optional, default 5173)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.env.PORT) || 5173;

const TYPES = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
    '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
    '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.woff2': 'font/woff2'
};

const isFile = (p) => fs.existsSync(p) && fs.statSync(p).isFile();

http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let pathname = decodeURIComponent(url.pathname);

    // /blog/ is served as /blog. (Vercel redirects it instead; serving it directly avoids a redirect
    // loop with the permanent /blog -> /blog/ redirect that simple static servers leave in the browser cache.)
    if (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1);
    // cleanUrls -> /index and *.html redirect to the clean path
    if (pathname === '/index' || pathname.endsWith('.html')) {
        const clean = pathname === '/index' || pathname === '/index.html' ? '/' : pathname.slice(0, -5);
        res.writeHead(308, { Location: clean + url.search });
        return res.end();
    }

    const target = path.join(DIST, pathname);
    if (!target.startsWith(DIST)) {
        res.writeHead(403);
        return res.end();
    }
    const candidates = pathname === '/' ? [path.join(DIST, 'index.html')] : [target, `${target}.html`];
    const file = candidates.find(isFile);
    const status = file ? 200 : 404;
    const body = file || path.join(DIST, '404.html');

    res.writeHead(status, {
        'Content-Type': TYPES[path.extname(body).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-cache'
    });
    fs.createReadStream(body).pipe(res);
}).listen(PORT, () => console.log(`Preview: http://localhost:${PORT}`));
