// Refreshes assets/ from the source repositories: every README screenshot the page uses, from each
// repository's default branch, and the Wheelhouse README's banner. Run it, look at the diff, commit.
// The guide's stills (assets/screenshots/guide/) are recorded, not fetched, so it leaves them alone.
// Usage: node scripts/fetch-screenshots.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { BANNER, allShots } from '../src/content.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');

async function fetchTo(url, file) {
	const res = await fetch(url, { redirect: 'follow' });
	if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
	const out = path.join(ROOT, file);
	await mkdir(path.dirname(out), { recursive: true });
	await writeFile(out, Buffer.from(await res.arrayBuffer()));
	console.log(`${file}  ←  ${url}`);
}

for (const s of allShots().filter((s) => !s.local)) {
	await fetchTo(`https://raw.githubusercontent.com/chrisjowen/${s.repo}/HEAD/${s.path}`, `assets/screenshots/${s.repo}/${s.path}`);
}
await fetchTo(BANNER.url, BANNER.file);
