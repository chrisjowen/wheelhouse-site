// Serves dist/ locally, with HTTP Range support so Safari plays the MP4s, as nginx does in production.
// Usage: npm run build && node scripts/serve.mjs [port=4960]   (127.0.0.1 only)
import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const PORT = +(process.argv[2] ?? 4960);
const TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.jpg': 'image/jpeg',
	'.svg': 'image/svg+xml',
	'.mp4': 'video/mp4',
	'.css': 'text/css; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.woff2': 'font/woff2',
	'.txt': 'text/plain; charset=utf-8',
	'.xml': 'application/xml'
};

createServer((req, res) => {
	const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
	const file = path.join(ROOT, url.endsWith('/') ? `${url}index.html` : url);
	let st;
	try {
		if (!file.startsWith(ROOT)) throw new Error('outside');
		st = statSync(file);
		if (!st.isFile()) throw new Error('not a file');
	} catch {
		res.writeHead(404).end('not found');
		return;
	}
	const ext = path.extname(file);
	const head = {
		'Content-Type': TYPES[ext] ?? 'application/octet-stream',
		'Accept-Ranges': 'bytes',
		'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
	};
	const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '');
	if (m) {
		const start = m[1] ? +m[1] : st.size - +m[2];
		const end = m[1] && m[2] ? Math.min(+m[2], st.size - 1) : st.size - 1;
		res.writeHead(206, { ...head, 'Content-Range': `bytes ${start}-${end}/${st.size}`, 'Content-Length': end - start + 1 });
		if (req.method === 'HEAD') return res.end();
		createReadStream(file, { start, end }).pipe(res);
		return;
	}
	res.writeHead(200, { ...head, 'Content-Length': st.size });
	if (req.method === 'HEAD') return res.end();
	createReadStream(file).pipe(res);
}).listen(PORT, '127.0.0.1', () => console.log(`wheelhouse site on http://127.0.0.1:${PORT}/`));
