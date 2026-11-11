// Checks a built dist/: every local file the page names exists, nothing loads from another origin,
// the share card is in place, and the page stays within its weight budget.
// Usage: node scripts/build.mjs && node scripts/check.mjs
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(import.meta.dirname, '../dist');
const home = readFileSync(path.join(DIST, 'index.html'), 'utf8');
const pages = ['index.html', 'tour/index.html'].map((file) => ({ file, html: readFileSync(path.join(DIST, file), 'utf8') }));
const html = pages.map((p) => p.html).join('\n');
const problems = [];

// Everything the browser loads by itself: src, srcset, poster, stylesheet/preload/icon hrefs, lightbox links.
const loads = new Set();
for (const m of html.matchAll(/\s(?:src|poster)="([^"]+)"/g)) loads.add(m[1]);
for (const m of html.matchAll(/\ssrcset="([^"]+)"/g)) for (const part of m[1].split(',')) loads.add(part.trim().split(/\s+/)[0]);
for (const m of html.matchAll(/<link[^>]+rel="(?:stylesheet|preload|icon)"[^>]*>/g)) loads.add(/href="([^"]+)"/.exec(m[0])[1]);
for (const m of html.matchAll(/<a[^>]+data-zoom[^>]*>/g)) loads.add(/href="([^"]+)"/.exec(m[0])[1]);

for (const u of loads) {
	if (!u.startsWith('/')) {
		problems.push(`loads from outside the site: ${u}`);
		continue;
	}
	if (!existsSync(path.join(DIST, u))) problems.push(`missing file: ${u}`);
}

for (const f of ['og:title', 'og:description', 'og:image', 'og:url', 'twitter:card']) {
	if (!html.includes(`"${f}"`)) problems.push(`missing <meta> ${f}`);
}
const og = /property="og:image" content="https:\/\/wheelhouse\.chrisjowen\.net(\/[^"]+)"/.exec(html);
if (!og || !existsSync(path.join(DIST, og[1]))) problems.push('og:image does not point at a built file');
if (/fonts\.(googleapis|gstatic)\.com/.test(html)) problems.push('page still names Google Fonts');

// The first view: HTML, CSS, JS, fonts and the tutorial poster.
const KB = (f) => statSync(path.join(DIST, f)).size / 1024;
const css = /rel="stylesheet" href="([^"]+)"/.exec(html)[1];
const first = [
	'index.html',
	css,
	/<script type="module" src="([^"]+)"/.exec(html)[1],
	...[...home.matchAll(/rel="preload" href="([^"]+)"/g)].map((m) => m[1]),
	/<video[^>]+id="hero-video"[^>]+poster="([^"]+)"/.exec(home)[1]
].reduce((sum, f) => sum + KB(f), 0);
if (first > 700) problems.push(`first view weighs ${first.toFixed(0)} KB, over the 700 KB budget`);

// Every page has a local caption track and a correctly addressed canonical URL.
for (const page of pages) {
	const canonical = page.file === 'index.html' ? '/' : '/tour/';
	if (!page.html.includes(`rel="canonical" href="https://wheelhouse.chrisjowen.net${canonical}"`)) problems.push(`wrong canonical: ${page.file}`);
	if (!/<track kind="captions"[^>]+srclang="en"/.test(page.html)) problems.push(`missing English captions: ${page.file}`);
}
for (const src of loads) {
	if (!existsSync(path.join(DIST, src))) continue;
	if (src.endsWith('.mp4') && statSync(path.join(DIST, src)).size > 25_000_000) problems.push(`video exceeds 25 MB: ${src}`);
	if (src.endsWith('.vtt') && !readFileSync(path.join(DIST, src), 'utf8').startsWith('WEBVTT\n')) problems.push(`invalid WebVTT header: ${src}`);
}

if (problems.length) {
	console.error(problems.map((p) => `✗ ${p}`).join('\n'));
	process.exit(1);
}
console.log(`✓ ${loads.size} local files present, no outside loads, share card in place, first view ${first.toFixed(0)} KB`);
