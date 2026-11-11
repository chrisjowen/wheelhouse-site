// Renders the whole page to static HTML from src/content.mjs. The build hands in `url` (a source
// file's published, content-hashed address) and `pic` (a screenshot's optimised WebP sizes).
import { TUTORIAL } from './tutorial.mjs';
import { CLIPS, FEATURES, PLUGINS, RELEASES, SITE, SLOTS, TOUR, BANNER } from './content.mjs';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
const day = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

const ICON = {
	play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5-11-6.5Z"/></svg>',
	lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
	mast: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v18M5 8h14M7 21h10"/></svg>',
	arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12h16M12 4l8 8-8 8"/></svg>',
	prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
	next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
	close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
	moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path id="theme-icon" d="M12 3a9 9 0 1 0 9 9A7 7 0 0 1 12 3Z"/></svg>',
	github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>',
	wheel: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="21" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="32" cy="32" r="6" fill="var(--brass)"/><path d="M32 5v54M5 32h54M13 13l38 38M51 13 13 51" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>'
};

const copyCmd = (cmd, cls = 'pcmd') => `<div class="${cls}"><code>${esc(cmd)}</code><button type="button" data-copy="${esc(cmd)}">Copy</button></div>`;

/** A zoomable screenshot: a link to the full-size image, which the lightbox opens in place. */
function shotImg(pic, s, { lazy = true, sizes, gallery } = {}) {
	const p = pic(s);
	const g = gallery ? ` data-gallery="${esc(gallery)}"` : '';
	return `<a href="${p.full}" data-zoom${g}><img src="${p.src}" srcset="${p.srcset}" sizes="${sizes}" width="${p.width}" height="${p.height}" alt="${esc(s.alt)}"${lazy ? ' loading="lazy"' : ''} decoding="async"></a>`;
}

function tutorialPlayer(url, id = 'video') {
	return `<div class="player"><video id="${id}" data-tutorial controls playsinline preload="none" poster="${url(TOUR.poster)}" width="${TOUR.width}" height="${TOUR.height}" aria-label="Build a habit tracker with Wheelhouse: narrated tutorial">
		<source src="${url(TOUR.video)}" type="video/mp4">
		<track kind="captions" src="${url(TOUR.captions)}" srclang="en" label="English">
		<p><a href="${url(TOUR.video)}">Download the Wheelhouse tutorial</a>.</p>
	</video></div>`;
}

function tutorialCredits() {
	return `<p class="note tutorial-credit">Recorded with a fictional demo crew. Narrated audio and burned-in captions. Music: <a href="https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1400037">“Carefree” by Kevin MacLeod</a> (<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>), edited and mixed under narration.</p>`;
}

function tutorialPage(url) {
	return `<section class="band tutorial-intro" id="top"><div class="wrap">
		<p class="eyebrow">The Wheelhouse walkthrough · ${fmt(TOUR.duration)}</p>
		<h1>One idea. A whole crew. Something shipped.</h1>
		<p class="lede">Follow Daymark, a small habit tracker, from the first message to Firstmate through building, decisions, a live preview, the report and the merge. Then explore the rest of the bridge.</p>
	</div></section>
	${tour(url, true)}
	<section class="band" id="transcript"><div class="wrap transcript">
		<details><summary>Read the full transcript</summary>
		${TUTORIAL.map((scene) => `<article><h3>${fmt(scene.at)} · ${esc(scene.title.replace(/^\d+ \/ /, ''))}</h3><p>${esc(scene.text)}</p></article>`).join('')}
		</details>
		<p><a class="btn primary" href="/#start">Get started with Wheelhouse ${ICON.arrow}</a></p>
	</div></section>`;
}

function tour(url, standalone = false) {
	const chapters = TOUR.chapters
		.map(([n, at, d], i) => `<li${i === 0 ? ' class="on"' : ''}><button type="button" data-at="${at}"><span class="t">${fmt(at)}</span><span class="n">${esc(n)}</span><span class="d">${esc(d)}</span></button></li>`)
		.join('');
	const clips = CLIPS.map(
		(c) => `<figure class="clip">
				<div class="frame"><video class="loop" muted loop playsinline preload="none" poster="${url(c.poster)}" width="${c.width}" height="${c.height}" aria-label="${esc(c.label)}"><source src="${url(c.video)}" type="video/mp4"></video></div>
				<figcaption><b>${esc(c.title)}</b> ${esc(c.text)}</figcaption>
			</figure>`
	).join('\n\t\t\t');
	return `<section class="band alt" id="tour">
	<div class="wrap">
		${standalone ? '' : `<div class="head">
			<h2>Take the tour</h2>
			<p>From an idea to a shipped habit tracker in two and a half minutes. Chat, watch the build, answer a decision, try the preview and review the result. Pick a chapter to jump in.</p>
		</div>`}
		<div class="tour">
			${tutorialPlayer(url)}
			<ol class="chapters" id="chapters" aria-label="Chapters">${chapters}</ol>
		</div>
		${tutorialCredits()}
		<p class="tutorial-links"><a href="${standalone ? '#transcript' : '/tour/'}">${standalone ? 'Read the transcript' : 'Open the full tutorial and transcript'}</a> · <a href="${url(TOUR.video)}" download="wheelhouse-tutorial.mp4">Download video</a> · <a href="${url(TOUR.captions)}" download="wheelhouse-tutorial.vtt">Download captions</a></p>
		${standalone ? '' : `<div class="clips">${clips}</div>`}
	</div>
</section>`;
}

function features(pic) {
	const all = FEATURES.flatMap((g) => g.items);
	const index = FEATURES.map(
		(g) => `<div class="fgroup"><h3>${esc(g.group)}</h3><ul>${g.items.map((f) => `<li><button type="button" data-id="${f.id}"${f === all[0] ? ' aria-current="true"' : ''}>${esc(f.name)}</button></li>`).join('')}</ul></div>`
	).join('');
	const panels = all
		.map(
			(f, i) => `<article class="fview${i === 0 ? ' on' : ''}" id="f-${f.id}" data-id="${f.id}">
				<div class="shot">${shotImg(pic, f.img, { lazy: i > 0, sizes: '(max-width: 1020px) 100vw, 960px' })}</div>
				<div class="body"><h3>${esc(f.name)}</h3><div class="more"><span class="count">${i + 1} of ${all.length}</span><div class="pager"><button class="icon-btn" type="button" data-step="-1" aria-label="Previous feature">${ICON.prev}</button><button class="icon-btn" type="button" data-step="1" aria-label="Next feature">${ICON.next}</button></div></div><p>${esc(f.text)}</p></div>
			</article>`
		)
		.join('\n\t\t\t');
	return `<section class="band" id="features">
	<div class="wrap">
		<div class="head">
			<h2>Everything on one bridge</h2>
			<p>Each page reads what Firstmate and its crew already record, and says so when something is unknown rather than guessing. Screenshots show a demo crew working on made-up projects.</p>
		</div>
		<div class="features">
			<nav class="findex" id="findex" aria-label="Features">${index}</nav>
			<div class="fpanels" id="fpanels" aria-live="polite">
			${panels}
			</div>
		</div>
	</div>
</section>`;
}

function pluginCard(p, pic) {
	const tags = [];
	if (p.kind === 'builtin') tags.push('<span class="tag ok">Ships with Wheelhouse</span>', `<span class="tag">${esc(p.on)}</span>`);
	if (p.kind === 'install') tags.push('<span class="tag ok">Install from GitHub</span>');
	if (p.kind === 'build') tags.push('<span class="tag warn">Being built</span>');
	const gallery = p.shots.length > 1 ? `plugin-${p.id}` : '';
	const shot = p.shots.length
		? `<div class="shot">${shotImg(pic, p.shots[0], { sizes: '(max-width: 760px) 100vw, 420px', gallery })}${p.shots.length > 1 ? `<span class="more-shots">${p.shots.length} screenshots</span>` : ''}</div>`
		: '<div class="shot"><div class="none">No screenshot yet</div></div>';
	// The rest of the gallery: links the lightbox steps through; hidden, as the first image stands for them.
	const rest = p.shots
		.slice(1)
		.map((s) => `<a hidden href="${pic(s).full}" data-zoom data-gallery="${gallery}" data-alt="${esc(s.alt)}"></a>`)
		.join('');
	const repoUrl = p.repo ? `https://github.com/chrisjowen/${p.repo}` : `${SITE.repo}/tree/main/plugins/${p.id}`;
	let foot;
	if (p.kind === 'builtin') {
		foot = `<p class="note">Nothing to install${p.on === 'On by default' ? ': it is on from the start' : ': turn it on in Settings → Plugins'}.</p><div class="links"><a href="${repoUrl}">Source in the Wheelhouse repo</a></div>`;
	} else if (p.kind === 'build') {
		foot = `<p class="note">No release yet.</p><div class="links"><a href="${repoUrl}">github.com/chrisjowen/${esc(p.repo)}</a></div>`;
	} else {
		foot = `${copyCmd(`wheelhouse plugin install chrisjowen/${p.repo}`)}<div class="links"><a href="${repoUrl}">github.com/chrisjowen/${esc(p.repo)}</a></div>`;
	}
	return `<article class="pcard${p.kind === 'build' ? ' build' : ''}" data-k="${p.kind}" id="plugin-${p.id}">${shot}${rest}<div class="body"><h3>${esc(p.name)}</h3><div class="tags">${tags.join('')}</div><p class="what">${esc(p.what)}</p><p class="adds">${esc(p.adds)}</p><div class="foot">${foot}</div></div></article>`;
}

function plugins(pic) {
	const kinds = [['all', 'All'], ['install', 'Install from GitHub'], ['builtin', 'Built in'], ['build', 'On the way']];
	const count = (k) => (k === 'all' ? PLUGINS.length : PLUGINS.filter((p) => p.kind === k).length);
	const chips = kinds.map(([k, l]) => `<button class="chip" type="button" data-k="${k}" aria-pressed="${k === 'all'}">${l}<span class="c">${count(k)}</span></button>`).join('');
	const own = `<article class="pcard" data-k="all-only" id="plugin-write-your-own"><div class="body"><h3>Write your own</h3><p class="what">Plugins are panels and providers: a provider reads on the server through a read-only context, and its output fills one of eight fixed slots.</p><ul class="slots">${SLOTS.map(([c, d]) => `<li><code>${c}</code><span>${esc(d)}</span></li>`).join('')}</ul><div class="foot"><div class="links"><a href="${SITE.repo}/blob/main/docs/plugins.md">The plugin guide</a></div></div></div></article>`;
	return `<section class="band" id="plugins">
	<div class="wrap">
		<div class="head">
			<h2>Plugins</h2>
			<p>Install a plugin from its GitHub repository with one command, or with Install plugin under Settings → Plugins. Each one is off until you turn it on, for every project or only the ones you choose.</p>
		</div>
		<div class="filters" id="filters" role="group" aria-label="Filter plugins">${chips}</div>
		<div class="plugins" id="plist">
			${PLUGINS.map((p) => pluginCard(p, pic)).join('\n\t\t\t')}
			${own}
		</div>
	</div>
</section>`;
}

function releases() {
	return RELEASES.map(
		(r, i) => `<div class="rel${i === 0 ? ' latest' : ''}">
				<h3>${r.version} <time datetime="${r.date}">${day(r.date)}</time></h3>
				<ul>${r.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
				${r.since ? `<a href="${SITE.repo}/compare/v${r.since}...v${r.version}">What changed</a>` : `<a href="${SITE.repo}/releases/tag/v${r.version}">Release notes</a>`}
			</div>`
	).join('\n\t\t\t');
}

export function render({ url, pic, banner, og, css, js, themeScript, csp, tourPage = false }) {
	const title = tourPage ? 'Build a habit tracker with Wheelhouse — video tutorial' : SITE.title;
	const description = tourPage ? 'A narrated Wheelhouse walkthrough: from an idea to a shipped habit tracker, then plugins, Vault, Remotes, phone mode, setup and updates. Includes chapters and transcript.' : SITE.description;
	const pageUrl = `${SITE.url}${tourPage ? '/tour/' : '/'}`;
	const latest = RELEASES[0].version;
	return `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${csp}">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${pageUrl}">
<meta name="theme-color" content="#f6f2e9" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#16191f" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Wheelhouse">
<meta property="og:url" content="${pageUrl}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${SITE.url}${og.path}">
<meta property="og:image:width" content="${og.width}">
<meta property="og:image:height" content="${og.height}">
<meta property="og:image:alt" content="${esc(BANNER.alt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${SITE.url}${og.path}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="${url('font:inter')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${url('font:newsreader')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${css}">
<script>${themeScript}</script>
<script type="module" src="${js}"></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>

<header class="top">
	<div class="wrap">
		<a class="brand" href="/" aria-label="Wheelhouse home">${ICON.wheel}<span>Wheelhouse</span></a>
		<nav class="nav" aria-label="Sections">
			<a href="${tourPage ? '/' : ''}#tour">Tour</a>
			<a href="${tourPage ? '/' : ''}#features">Features</a>
			<a href="${tourPage ? '/' : ''}#how">With Firstmate</a>
			<a href="${tourPage ? '/' : ''}#plugins">Plugins</a>
			<a href="${tourPage ? '/' : ''}#start">Get started</a>
			<a href="${tourPage ? '/' : ''}#releases">Releases</a>
		</nav>
		<div class="top-actions">
			<button class="icon-btn" id="theme" type="button" aria-label="Theme: follows your system" title="Theme: follows your system">${ICON.moon}</button>
			<a class="icon-btn" href="${SITE.repo}" aria-label="Wheelhouse on GitHub">${ICON.github}</a>
		</div>
	</div>
</header>

<main id="main">
${tourPage ? tutorialPage(url) : `<section class="hero" id="top">
	<div class="wrap">
		<div>
			<h1>Run a crew of AI coding agents without living in their terminals.</h1>
			<p class="lede">Wheelhouse is one calm page on your own machine to talk to <a href="${SITE.firstmate}">Firstmate</a>, see what your crew is doing, and review real results.</p>
			${copyCmd('npm i -g @chrisjowen/wheelhouse', 'cmd')}
			<div class="cta">
				<a class="btn primary" href="#tour">${ICON.play}Watch the tour</a>
				<a class="btn" href="#plugins">Browse the plugins</a>
			</div>
			<ul class="facts">
				<li>${ICON.lock}Serves only your own computer</li>
				<li>${ICON.mast}Firstmate stays in charge</li>
				<li>${ICON.arrow}v${latest}, MIT licensed</li>
			</ul>
		</div>
		<figure class="hero-tutorial">
			${tutorialPlayer(url, 'hero-video')}
			<figcaption>From “build me a habit tracker” to landed. ${fmt(TOUR.duration)}, with narration and captions. <a href="/tour/">Chapters and transcript ${ICON.arrow}</a></figcaption>
		</figure>
	</div>
</section>

${tour(url)}

${features(pic)}

<section class="band alt" id="how">
	<div class="wrap">
		<div class="head">
			<h2>How it works with Firstmate</h2>
			<p>Firstmate runs the crew: one Claude Code session that takes your requests and hands tasks to workers. Wheelhouse sits beside it as your window and your voice. Close Wheelhouse and the crew keeps working.</p>
		</div>
		<div class="flow">
			<div class="station"><div class="node">
				<h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>You</h3>
				<p>Chat, answer decisions, review previews and pull requests. From the browser, or from your phone over Discord.</p>
			</div></div>
			<div class="station"><div class="node">
				<h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2"/><path d="M12 2v6M12 16v6M2 12h6M16 12h6"/></svg>Wheelhouse</h3>
				<p>A local web app and CLI. It starts Firstmate’s session, or finds the one already running, and shows the whole fleet.</p>
				<div class="where">wheelhouse open<br>http://127.0.0.1:4310</div>
			</div></div>
			<div class="station"><div class="node">
				<h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3v15M7 8h10M5 14c0 4 3 6 7 6s7-2 7-6"/></svg>Firstmate</h3>
				<p>The supervisor session in tmux. Your messages arrive in its inbox like any other note; it decides, dispatches and reports back.</p>
				<div class="where">fm-inbox.sh note<br>fm-fleet-snapshot.sh</div>
			</div></div>
			<div class="station"><div class="node">
				<h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="7" cy="8" r="3"/><circle cx="17" cy="8" r="3"/><path d="M2 20a5 5 0 0 1 10 0M12 20a5 5 0 0 1 10 0"/></svg>The crew</h3>
				<p>Workers in their own git worktrees build, check and open pull requests, with live previews of the running app. Second mates Firstmate runs, here or on another host, show their work beside your own crew’s.</p>
				<div class="where">worktrees, checks, PRs on GitHub</div>
			</div></div>
		</div>
		<div class="wires">
			<div class="wire">
				<h3>It reads, it never steers</h3>
				<p>Wheelhouse reads the fleet snapshot, the ledger, transcripts, reports, diffs and check logs. The one thing it writes is your message, through Firstmate’s own inbox. It never stops, reconfigures or bypasses Firstmate.</p>
			</div>
			<div class="wire">
				<h3>Yours, and only yours</h3>
				<ul>
					<li>Listens on <code>127.0.0.1</code> and refuses requests from anywhere else.</li>
					<li>Secrets reach the crew by name with <code>wh-vault</code>; values stay in the macOS Keychain.</li>
					<li>The Discord gateway only connects out and hears only the account you pair.</li>
				</ul>
			</div>
			<div class="wire">
				<h3>Plugins add, never control</h3>
				<p>Plugins fill fixed slots (tabs, cards, pages, a header pill) through a read-only context, with timeouts and error boundaries, so one failing plugin never takes a page down. <a href="${SITE.repo}/blob/main/docs/architecture.md">How Wheelhouse reads Firstmate</a></p>
			</div>
		</div>
	</div>
</section>

${plugins(pic)}

<section class="band alt" id="start">
	<div class="wrap">
		<div class="head">
			<h2>Get started</h2>
			<p>Three commands from nothing to your first conversation with the crew.</p>
		</div>
		<div class="start">
			<ol class="steps">
				<li>
					<h3>Clone Firstmate</h3>
					<p>Wheelhouse is a window onto a Firstmate home, so you need one first.</p>
					${copyCmd('git clone https://github.com/kunchenguid/firstmate.git')}
				</li>
				<li>
					<h3>Install Wheelhouse</h3>
					<p>From npm. Run the same command again to update.</p>
					${copyCmd('npm install -g @chrisjowen/wheelhouse')}
				</li>
				<li>
					<h3>Open it from your Firstmate folder</h3>
					<p>Wheelhouse opens in your browser at the local address it prints.</p>
					${copyCmd('cd firstmate && wheelhouse open')}
				</li>
			</ol>
			<div class="aside">
				<div>
					<h3>You need</h3>
					<ul>
						<li>Node.js 22 or newer</li>
						<li>A Firstmate home</li>
						<li><code>tmux</code> and Claude Code on your <code>PATH</code></li>
					</ul>
				</div>
				<div>
					<h3>Options</h3>
					<p><code>wheelhouse open --help</code> lists them, such as a different Firstmate home or port.</p>
				</div>
				<div>
					<h3>Learn more</h3>
					<ul>
						<li><a href="${SITE.repo}/blob/main/docs/guide.md">The guide</a>: every page, the Firstmate session, Discord</li>
						<li><a href="${SITE.repo}/blob/main/docs/passages.md">Passage files</a>: your own steps, like a local deploy</li>
						<li><a href="${SITE.repo}/blob/main/docs/vault.md">The vault</a>: secrets by name for the crew</li>
						<li><a href="${SITE.repo}/blob/main/docs/plugins.md">Plugins</a>: write and install your own</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="band" id="releases">
	<div class="wrap">
		<div class="head">
			<h2>Releases</h2>
			<p>Published to npm as <a href="${SITE.npm}">@chrisjowen/wheelhouse</a>. A clone shows an arrow in its header when GitHub has a newer version, and upgrades on a click.</p>
		</div>
		<div class="releases">
			${releases()}
		</div>
	</div>
</section>`}
</main>

<footer>
	<div class="wrap">
		<div>
			<p>Wheelhouse is MIT licensed, made by <a href="https://github.com/chrisjowen">Chris Owen</a> for <a href="${SITE.firstmate}">Firstmate</a>.</p>
			<p>This site’s source: <a href="https://github.com/chrisjowen/wheelhouse-site">chrisjowen/wheelhouse-site</a>.</p>
		</div>
		<nav aria-label="Elsewhere">
			<a href="${SITE.repo}">GitHub</a>
			<a href="${SITE.npm}">npm</a>
			<a href="${SITE.repo}/blob/main/docs/guide.md">Guide</a>
			<a href="${SITE.repo}/issues">Issues</a>
		</nav>
	</div>
</footer>

<dialog class="lb" id="lb" aria-label="Screenshot">
	<button class="icon-btn" type="button" aria-label="Close" data-close>${ICON.close}</button>
	<button class="icon-btn lb-nav lb-prev" type="button" aria-label="Previous screenshot" data-lb-step="-1">${ICON.prev}</button>
	<button class="icon-btn lb-nav lb-next" type="button" aria-label="Next screenshot" data-lb-step="1">${ICON.next}</button>
	<img alt="" id="lb-img">
	<p><span class="lb-count" id="lb-count"></span><span id="lb-cap"></span></p>
</dialog>
<div class="toast" id="toast" role="status"></div>
</body>
</html>
`;
}
