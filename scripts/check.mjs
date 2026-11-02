// Checks a built dist/: every local file the page names exists, nothing loads from another origin,
// the share card is in place, and the page stays within its weight budget.
// Usage: node scripts/build.mjs && node scripts/check.mjs
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(import.meta.dirname, '../dist');
const html = readFileSync(path.join(DIST, 'index.html'), 'utf8');
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

// The first view: HTML, CSS, JS, fonts, banner and the tour poster.
const KB = (f) => statSync(path.join(DIST, f)).size / 1024;
const css = /rel="stylesheet" href="([^"]+)"/.exec(html)[1];
const first = [
	'index.html',
	css,
	/<script type="module" src="([^"]+)"/.exec(html)[1],
	...[...html.matchAll(/rel="preload" href="([^"]+)"/g)].map((m) => m[1]),
	/<img class="rope" src="([^"]+)"/.exec(html)[1]
].reduce((sum, f) => sum + KB(f), 0);
if (first > 700) problems.push(`first view weighs ${first.toFixed(0)} KB, over the 700 KB budget`);

if (problems.length) {
	console.error(problems.map((p) => `✗ ${p}`).join('\n'));
	process.exit(1);
}
console.log(`✓ ${loads.size} local files present, no outside loads, share card in place, first view ${first.toFixed(0)} KB`);
