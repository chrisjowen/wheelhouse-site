// Builds the static site into dist/: screenshots to responsive WebP, fonts self-hosted, every asset
// content-hashed under /assets/ so it can be cached for good, and the page rendered to plain HTML.
// Usage: node scripts/build.mjs
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import sharp from 'sharp';
import { BANNER, SITE, allShots, CLIPS, TOUR } from '../src/content.mjs';
import { render } from '../src/page.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const require = createRequire(import.meta.url);

const hash = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 10);
const slug = (s) => s.replace(/\.[a-z0-9]+$/i, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();

/** Writes buf as /assets/<name>.<hash>.<ext> and returns its public path. */
async function emit(name, ext, buf) {
	const rel = `/assets/${name}.${hash(buf)}.${ext}`;
	await writeFile(path.join(DIST, rel), buf);
	return rel;
}

/** WebP at each width up to the source's own; returns what an <img> needs. */
async function webp(file, name, widths, quality = 80) {
	const src = sharp(path.join(ROOT, file));
	const { width, height } = await src.metadata();
	const sizes = [...new Set(widths.map((w) => Math.min(w, width)))];
	const out = [];
	for (const w of sizes) out.push({ w, url: await emit(`${name}-${w}`, 'webp', await src.clone().resize({ width: w }).webp({ quality, effort: 6 }).toBuffer()) });
	const biggest = out.at(-1);
	return {
		src: biggest.w > 1000 && out.length > 1 ? out.at(-2).url : biggest.url,
		srcset: out.map((o) => `${o.url} ${o.w}w`).join(', '),
		full: biggest.url,
		width: biggest.w,
		height: Math.round((height * biggest.w) / width)
	};
}

const FONTS = {
	inter: { family: 'Inter', file: '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', weight: '100 900' },
	newsreader: { family: 'Newsreader', file: '@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2', weight: '200 800' },
	mono: { family: 'JetBrains Mono', file: '@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2', weight: '100 800' }
};
// fontsource's latin subset
const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';

// Applies a saved theme before first paint, and marks the page as scripted.
const THEME_SCRIPT = `document.documentElement.className='js';try{var t=localStorage.getItem('wh-site-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

async function main() {
	await rm(DIST, { recursive: true, force: true });
	await mkdir(path.join(DIST, 'assets'), { recursive: true });
	const urls = new Map();

	// Fonts
	const faces = [];
	for (const [key, f] of Object.entries(FONTS)) {
		const url = await emit(`font-${key}`, 'woff2', await readFile(require.resolve(f.file)));
		urls.set(`font:${key}`, url);
		faces.push(`@font-face { font-family: '${f.family}'; font-style: normal; font-display: swap; font-weight: ${f.weight}; src: url(${url}) format('woff2-variations'); unicode-range: ${LATIN}; }`);
	}

	// Videos and their posters
	for (const v of [TOUR, ...CLIPS]) {
		urls.set(v.video, await emit(slug(path.basename(v.video)), 'mp4', await readFile(path.join(ROOT, v.video))));
		if (v.captions) urls.set(v.captions, await emit(slug(path.basename(v.captions)), 'vtt', await readFile(path.join(ROOT, v.captions))));
		urls.set(v.poster, await emit(slug(path.basename(v.poster)), 'webp', await sharp(path.join(ROOT, v.poster)).webp({ quality: 78 }).toBuffer()));
	}

	// Screenshots
	const pics = new Map();
	for (const s of allShots()) {
		const key = `${s.repo}/${s.path}`;
		pics.set(key, await webp(`assets/screenshots/${key}`, slug(`${s.repo}-${path.basename(s.path)}`), [720, 1440]));
	}
	const pic = (s) => {
		const p = pics.get(`${s.repo}/${s.path}`);
		if (!p) throw new Error(`no screenshot built for ${s.repo}/${s.path}`);
		return p;
	};
	const url = (key) => {
		const u = urls.get(key);
		if (!u) throw new Error(`no asset built for ${key}`);
		return u;
	};

	// Banner, and the share card made from it (1200×630, the banner centred on the page's ivory)
	const banner = await webp(BANNER.file, 'banner', [800, 1600], 82);
	const og = { path: '/og.jpg', width: 1200, height: 630 };
	const art = await sharp(path.join(ROOT, BANNER.file)).resize({ width: 1200, height: 600, fit: 'contain', background: '#f6f2e9' }).toBuffer();
	await sharp({ create: { width: og.width, height: og.height, channels: 3, background: '#f6f2e9' } })
		.composite([{ input: art, top: 15, left: 0 }])
		.jpeg({ quality: 86, mozjpeg: true })
		.toFile(path.join(DIST, 'og.jpg'));

	// CSS and JS
	const css = await emit('site', 'css', Buffer.from(`${faces.join('\n')}\n${await readFile(path.join(ROOT, 'src/styles.css'), 'utf8')}`));
	const js = await emit('main', 'js', await readFile(path.join(ROOT, 'src/main.js')));

	const scriptHash = createHash('sha256').update(THEME_SCRIPT).digest('base64');
	const csp = [
		"default-src 'self'",
		`script-src 'self' 'sha256-${scriptHash}'`,
		"style-src 'self'",
		"img-src 'self' data:",
		"media-src 'self'",
		"font-src 'self'",
		"connect-src 'self'",
		"object-src 'none'",
		"base-uri 'self'",
		"form-action 'none'"
	].join('; ');

	const html = render({ url, pic, banner, og, css, js, themeScript: THEME_SCRIPT, csp });
	await writeFile(path.join(DIST, 'index.html'), html);
	await mkdir(path.join(DIST, 'tour'), { recursive: true });
	await writeFile(path.join(DIST, 'tour/index.html'), render({ url, pic, banner, og, css, js, themeScript: THEME_SCRIPT, csp, tourPage: true }));

	// Small static files
	await copyFile(path.join(ROOT, 'src/favicon.svg'), path.join(DIST, 'favicon.svg'));
	await writeFile(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
	await writeFile(
		path.join(DIST, 'sitemap.xml'),
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE.url}/</loc></url>\n  <url><loc>${SITE.url}/tour/</loc></url>\n</urlset>\n`
	);

	console.log(`built dist/ (${(html.length / 1024).toFixed(0)} KB of HTML, ${pics.size} screenshots)`);
}

await main();
