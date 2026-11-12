import { TUTORIAL } from './tutorial.mjs';

// Everything the page says, in one place. Screenshots are each repository's own README images
// (fetched by `npm run screenshots` into assets/screenshots/<repo>/<path>), with the README's alt text,
// and stills of Wheelhouse itself in dark mode, recorded on the demo crew with the guide's stills pass
// (assets/screenshots/guide/, which `npm run screenshots` leaves alone).

const shot = (repo, path, alt) => ({ repo, path, alt });
const still = (name, alt) => ({ repo: 'guide', path: `${name}.png`, alt, local: true });

export const SITE = {
	url: 'https://wheelhouse.chrisjowen.net',
	title: 'Wheelhouse: run a crew of AI coding agents without living in their terminals',
	description:
		'Wheelhouse is one calm page on your own machine to talk to Firstmate, see what your crew of AI coding agents is doing, and review real results. Video tour, every feature and every plugin.',
	repo: 'https://github.com/chrisjowen/wheelhouse',
	npm: 'https://www.npmjs.com/package/@chrisjowen/wheelhouse',
	firstmate: 'https://github.com/kunchenguid/firstmate'
};

// The banner art from the Wheelhouse README (a GitHub user-attachments upload).
export const BANNER = {
	url: 'https://github.com/user-attachments/assets/7448e391-c189-4861-ad45-3cb51ceca553',
	file: 'assets/banner.png',
	alt: 'Wheelhouse, your bridge to Firstmate and the whole crew: a retro illustration of a captain and Firstmate at a ship’s wheel beside a brass-framed screen showing the Firstmate chat, the Harbour and a task’s passage from Queued to Landed'
};

// Story-driven tutorial recorded against an isolated, seeded demo crew.
export const TOUR = {
	video: 'assets/video/tour.mp4',
	poster: 'assets/video/tour-poster.jpg',
	captions: 'assets/video/tour.vtt',
	width: 1920,
	height: 1080,
	duration: 106,
	chapters: TUTORIAL.map((s) => [s.title.replace(/^\d+ \/ /, ''), s.at, s.text])
};

export const CLIPS = [
	{
		video: 'assets/video/clip-chat.mp4',
		poster: 'assets/video/clip-chat-poster.jpg',
		width: 724,
		height: 838,
		title: 'Answer a decision in the chat.',
		text: 'Under a live preview card, write the answer to which onboarding design ships, add a note, Decide, and the card folds to your answer.',
		label: 'Answering a decision in the Firstmate chat, in dark mode: under a live preview card, the onboarding question gets a written answer and a note, then Decide, and the card folds to Answered'
	},
	{
		video: 'assets/video/clip-review.mp4',
		poster: 'assets/video/clip-review-poster.jpg',
		width: 1184,
		height: 838,
		title: 'Review a pull request in a chat.',
		text: 'Review PR on a task page opens it in the PR review plugin: the overview, then each change with its verdict and key lines, and the quality pass’s suggestion.',
		label: 'Review PR on a task page opens the pull request in the PR review plugin’s tab: the reviewer’s overview in the chat, Start the review, the first two changes with their verdicts and code, then a quality pass card with its suggestion'
	}
];

const wh = (name, alt) => shot('wheelhouse', `docs/screenshots/${name}.png`, alt);

export const FEATURES = [
	{
		group: 'Talk to the crew',
		items: [
			{ id: 'chat', name: 'Chat with Firstmate', img: still('home', 'Wheelhouse in dark mode: the bridge down the left; On deck beside it, with this week’s allowance and the checks as gauges above the work under way, one line per task; and the conversation with Firstmate on the right, a decision waiting as a form'), text: 'Talk to Firstmate like a teammate. Chat, answer with buttons, mention tasks with #, run commands with /, or just dictate. Messages are tagged by project or topic, so you can read one thread at a time, and a thumbs-up answers a reply in one click. On deck, beside it, keeps each task to one line, grouped by crew.' },
			{ id: 'previews', name: 'Preview cards', img: still('chat-preview', 'The Firstmate chat: a reply that a pull request is ready, with its live preview as a card underneath, showing the app’s share dialog, and links to the pull request, Review, Full size and a new tab'), text: 'When a reply is about a task with a running app, its live preview shows as a card underneath: the page itself, the pull request, Review and a full-size view.' },
			{ id: 'decision-cards', name: 'Decisions in the chat', img: still('chat-decision', 'A decision in the Firstmate chat: the card asking which onboarding design should ship, with its evidence, a written answer and Decide, Add a note and Discuss, and Firstmate’s own question below with its options'), text: 'Every open decision shows as a form in the chat, answered in place: one tap, options to pick with the recommended one marked, or a written answer, with a note if you like. Firstmate can change the form as you talk it through.' },
			{ id: 'decisions', name: 'Decisions', img: still('inbox', 'Decisions: Needs you, with a merge call carrying Firstmate’s recommendation, Chat about this and Agree, and a call on two onboarding designs; Handled by Firstmate folded below'), text: 'Only what Firstmate escalated to you, with its recommendation. Agree in one tap, or Chat about this to talk it through; what Firstmate settled itself waits, folded, under Handled by Firstmate.' },
			{ id: 'bell', name: 'The ship’s bell', img: wh('bell', 'The ship’s bell: a question waiting and a pull request gone green, each with a one-click answer'), text: 'Rings for green pull requests, questions, stuck workers and landed merges, each with a one-click answer.' }
		]
	},
	{
		group: 'See the work',
		items: [
			{ id: 'harbour', name: 'Harbour', img: still('harbour', 'Harbour in dark mode: seven projects, two things need you; the fleet chart, a line per project from Queued to Landed with each task as a dot; then a card per project with what waits on you and what is under way'), text: 'Every project at a glance, under a calm chart of what is moving across the fleet: a card each, the one that needs you first, what waits on you, the work under way and what landed this week. Second mates’ tasks show beside your own crew’s.' },
			{ id: 'project', name: 'Project pages', img: still('project', 'A project page: lumen’s banner with what needs you, tabs for its work, issues, PR review, links and passage, and Your move with the two tasks waiting on you and their screenshots'), text: 'Each project has its own page: a banner with what needs you, and tabs for its work, issues, links, passage and any plugin that adds one.' },
			{ id: 'radar', name: 'Radar', img: still('radar', 'Fleet radar: every task as a dot in five lanes, Queued, Building, Testing, Pull request and Landed, coloured busy, idle, waiting on you, stuck, with Firstmate or landed'), text: 'Watch the whole fleet flow from Queued through Building, Testing and Pull request to Landed, live.' },
			{ id: 'task', name: 'Task pages', img: still('task', 'A task page: what needs you and the review evidence on the left, and the timeline starting with the worker’s instructions, the captain’s intent and Firstmate’s spec, with the stages to jump to on the right'), text: 'A task page starts with what the worker was asked, the captain’s intent and Firstmate’s spec, then one timeline of everything since: the conversation, updates, checks and the pull request, filtered as you like.' },
			{ id: 'changes', name: 'Changes and diffs', img: still('task-changes', 'A task’s Changes tab: every file the task changed against main, with lines added and removed, uncommitted and untracked files included'), text: 'Every file a task changed against its base, uncommitted and untracked work included, with each diff a click away. Second mates’ tasks get the same.' },
			{ id: 'preview', name: 'Live preview', img: still('preview', 'A task’s Live preview: the demo app’s share dialog running inside Wheelhouse, with Open in new tab, Full screen and the preview helper below'), text: 'Click around the real app under review. A helper that sees only that preview talks it through with you and builds a feedback list; Send to Firstmate passes it on.' },
			{ id: 'conversation', name: 'The conversation', img: wh('conversation', 'The conversation between a worker and Firstmate: an instruction the worker has read, and the automated review’s question with Firstmate’s call on it'), text: 'Every question a worker asked and how it was answered, including the automated review’s questions and Firstmate’s call on each.' }
		]
	},
	{
		group: 'Review and ship',
		items: [
			{ id: 'review', name: 'PR review', img: shot('pr-review-wheelhouse', 'docs/images/chat-card.png', 'The chat review of a real pull request (chrisjowen/docket#48) in the PR review tab: the navigator on the left with each change marked by its verdict, and in the chat a Performance risk change filed as Serious, with its code'), text: 'With the PR review plugin, Review on any pull request opens a review in a chat: an overview, then each change in reading order with its verdict, from Looks good to Possible security issue, the key lines and a suggestion. Accept, disagree or comment on each, then Finish review drafts your verdict to post, copy or send to Firstmate.' },
			{ id: 'shared-review', name: 'Shared review', img: still('shared-review-cards', 'The Reviews page in dark mode: two open reviews of the demo Lumen app as cards with live thumbnails, one a local preview and one live on the review server, each with its task, comments, reviewers, link and passcode'), text: 'With the bundled Shared review plugin, share a prototype or a live app behind a link that carries its passcode. People pin comments to the spot they mean, attach files and voice notes, and when you close it you choose which threads go to Firstmate, as they are or tidied into points.' },
			{ id: 'docket', name: 'Docket casebook', img: shot('docket', 'docs/assets/wheelhouse-docket-tab.png', 'Wheelhouse’s Docket project tab: the casebook’s Browse graph inside Wheelhouse, with a decision selected and its evidence and confidence in the inspector'), text: 'With docket’s plugin, a project’s Docket tab is its casebook inside Wheelhouse: browse the team-memory graph, table and history, ask questions, search and sync, and Firstmate can search it too.' },
			{ id: 'passage', name: 'Passage editor', img: wh('passage-editor', 'The passage editor testing a new Deployed locally step on a landed task: where the task would be, and the local deploy’s output'), text: 'Add your own steps to a task’s passage, like a local deploy after merge, and test them on a landed task before you keep them.' },
			{ id: 'vault', name: 'Vault', img: shot('wheelhouse', 'docs/screenshots/plugins/vault-page.png', 'The Vault page: each secret by name with the projects that may use it, an Add a secret button, and the recent use of the vault by task, command and result'), text: 'Give the crew secrets by name with wh-vault. Values stay in the macOS Keychain; the Vault page shows names, grants and use, never a value. Add one from the key button under the chat, including one Firstmate asks for.' }
		]
	},
	{
		group: 'Keep watch',
		items: [
			{ id: 'decided', name: 'Decided for you', img: still('decisions', 'Decided for you in the Logbook: review questions Firstmate answered on your behalf, grouped by day, each with its call, the task and whether it landed'), text: 'Every call Firstmate made on your behalf, grouped by day, with each call and its reason.' },
			{ id: 'time', name: 'Where time went', img: still('time', 'Where time went: two days across eighteen tasks, split into building, automated review and fixes, Firstmate deciding, CI checks and waiting on you, then each project’s tasks'), text: 'Spot the bottleneck: each task’s time split into building, review, CI and waiting on you.' },
			{ id: 'headroom', name: 'Headroom', img: still('headroom', 'Headroom: Claude allowance left this session, this week and this week on Opus, and each task’s share of recent use'), text: 'Never run out of allowance: Claude headroom left this session and this week, and each task’s share of recent use.' },
			{ id: 'improve', name: 'Improvements', img: wh('improvements', 'Improvements: a harness review is due, proposals waiting for your call and the size of the harness'), text: 'With the improve plugin, your harness gets better, only with your approval: reviews due, proposals waiting for your call, and the size of the harness.' },
			{ id: 'night', name: 'Day or night', img: wh('home', 'Wheelhouse in the Crew OS light look: the bridge down the left with the main sections and the second mates; On deck beside it with its gauges and the work under way; and the conversation with Firstmate on the right'), text: 'The Crew OS look: warm paper by day, near-black navy after dark, gold for what needs you. The screenshots here are dark; this one is the day look.' }
		]
	}
];

// kind: install (its own repository), builtin (ships with Wheelhouse), build (being built).
export const PLUGINS = [
	{
		id: 'pr-review', name: 'PR review', repo: 'pr-review-wheelhouse', kind: 'install',
		what: 'A reviewer reads the whole pull request, then walks you through it in a chat, one change at a time: the key changes stop by stop, a quality pass with every concern as a checklist, then the skim pile. Each change has its verdict, its key lines and a suggestion where it needs one.',
		adds: 'A PR review tab on each project, with a navigator of every change and file. Claude through your own Claude Code sign-in by default, or a local model through Ollama. Nothing is posted or sent until you click.',
		shots: [
			shot('pr-review-wheelhouse', 'docs/images/chat-card.png', 'The chat review of a real pull request (chrisjowen/docket#48) in the PR review tab: the navigator on the left with each change marked by its verdict, and in the chat a Performance risk change filed as Serious, with its code'),
			shot('pr-review-wheelhouse', 'docs/images/chat-file.png', 'A whole file open in the drawer beside the chat, at the lines the change is about'),
			shot('pr-review-wheelhouse', 'docs/images/chat-finish.png', 'Finishing the review: the decisions, the suggested verdict Request changes, the editable draft and the buttons to post, copy or send it'),
			shot('pr-review-wheelhouse', 'docs/images/prompts.png', 'The review prompts panel: the overall review prompt and the walkthrough, quality pass, key change stops and skim pile prompts, each editable')
		]
	},
	{
		id: 'localhost-proxy', name: 'Localhost proxy', repo: 'localhost-proxy-wheelhouse', kind: 'install',
		what: 'Opens the crew’s localhost previews and links through Wheelhouse’s own port, so they work when Wheelhouse runs in Docker, a cloud workspace or on another computer.',
		adds: 'A host route and an address rewrite: http://localhost:5173/app opens as http://5173.localhost:4310/app. Only Wheelhouse’s port needs forwarding.',
		shots: [
			shot('localhost-proxy-wheelhouse', 'docs/images/localhost-proxy-live-preview.png', 'A task’s Live preview tab in Wheelhouse showing a demo field-notes app. The worker reported http://localhost:5188/surveys; the frame loads it through the proxy, and Open in new tab opens http://5188.localhost:47933/surveys'),
			shot('localhost-proxy-wheelhouse', 'docs/images/localhost-proxy-not-shared.png', 'The page the proxy shows for port 4000, which nothing has reported: Not shared through Wheelhouse, with how to allow it under Settings → Plugins and a direct link for Wheelhouse’s own computer'),
			shot('localhost-proxy-wheelhouse', 'docs/images/localhost-proxy-settings.png', 'The Localhost proxy’s page under Settings → Plugins: on for every project, with More ports to allow set to 3000, 8080')
		]
	},
	{
		id: 'docket', name: 'Docket', repo: 'docket', kind: 'install',
		what: 'A project’s team-memory casebook inside Wheelhouse: Browse (graph, table, history), Ask, Adapters, the inspector, chat, quick search and sync.',
		adds: 'A Docket tab, on for every project whose clone has .docket.yaml, plus docket’s MCP app in the chat.',
		shots: [
			shot('docket', 'docs/assets/wheelhouse-docket-tab.png', 'Wheelhouse’s Docket project tab: the casebook’s Browse graph inside Wheelhouse, with a decision selected and its evidence and confidence in the inspector'),
			shot('docket', 'docs/assets/docket-browse-graph.png', 'docket open on docket’s own casebook: the Browse graph of its libraries, systems, decisions and constraints, each type with its own icon and colour, beside the index of exhibit types and relationships')
		]
	},
	{
		id: 'improve', name: 'Improve', repo: 'improve', kind: 'install',
		what: 'Governed, evidence-driven improvement of your Claude Code harness. Each suggestion arrives as a decision for you, like any other.',
		adds: 'An Improvements page, a Harness tab on the home rail, a header pill when a review is due, and the proposal on each decision.',
		shots: [
			wh('improvements', 'Improvements: a harness review is due, proposals waiting for your call and the size of the harness'),
			shot('improve', 'docs/screenshots/overview.webp', 'The improve overview: proposals waiting for you, and why a review is due'),
			shot('improve', 'docs/screenshots/proposal.webp', 'A proposal: what changes, why, the files it touches, the evidence and how it will be measured'),
			shot('improve', 'docs/screenshots/skill-draft.webp', 'A drafted skill shown as a diff before anything is written'),
			shot('improve', 'docs/screenshots/approved.webp', 'An approved proposal waiting to be applied, with the decision and reason recorded'),
			shot('improve', 'docs/screenshots/objectives.webp', 'Objectives with their latest score and trend')
		]
	},
	{
		id: 'git-insights', name: 'Git insights', repo: 'git-insights-wheelhouse', kind: 'install',
		what: 'Who is working on a project, its latest commits, the files that change most, open pull requests and a few figures, from git and GitHub, read again every hour.',
		adds: 'An Insights tab on each project, with a 7, 30 or 90 day view.',
		shots: [
			shot('git-insights-wheelhouse', 'docs/images/git-insights-overview.png', 'The Insights tab for a demo project: a summary sentence, a 7 / 30 / 90 days switch, figures for commits, pull requests, time to merge and issues, and the open pull requests with their review and checks state'),
			shot('git-insights-wheelhouse', 'docs/images/git-insights-pull-requests.png', 'An open pull request opened in place, showing its author, age, size, review and checks state, the reviewers asked and a link to GitHub'),
			shot('git-insights-wheelhouse', 'docs/images/git-insights-people.png', 'The People list with one person opened, showing their lines changed, the parts of the repository they worked in and their recent commits'),
			shot('git-insights-wheelhouse', 'docs/images/git-insights-commits.png', 'The Latest commits list on the default branch with one commit opened to show its files'),
			shot('git-insights-wheelhouse', 'docs/images/git-insights-hotspots.png', 'Hotspots with one file opened to show how often it changed, who changes it and the commits that touched it, followed by the Also cards for the latest release, open issues, the last commit and new people')
		]
	},
	{
		id: 'ship-weather', name: 'Ship’s weather', repo: 'ship-weather-wheelhouse', kind: 'install',
		what: 'The fleet’s health as weather, from Clear to Storm. Click it for a brass barometer, the forecast, why, what’s wrong and the ship’s log.',
		adds: 'A pill in the header on every page.',
		shots: [
			shot('ship-weather-wheelhouse', 'docs/images/drill-in.png', 'Wheelhouse with the Ship’s weather drill-in open under the header pill reading “Squalls · 5”: a barometer and forecast, the reasons, what’s wrong with links to each task and pull request, and the ship’s log'),
			shot('ship-weather-wheelhouse', 'docs/images/weather-states.png', 'The header pill in each weather: Clear, Fair · 1, Clouding over · 2, Squalls · 5 and Storm · 6'),
			shot('ship-weather-wheelhouse', 'docs/images/settings.png', 'The Ship’s weather page in Settings → Plugins: where it is on, per project, and a form for each setting with its default')
		]
	},
	{
		id: 'captains-log', name: 'Captain’s log', repo: 'captains-log-wheelhouse', kind: 'install',
		what: 'A short digest in three plain lines: what landed since you were last here, what waits on you, and what is under way and next.',
		adds: 'A Log tab on the home rail and a Captain’s log page with the last seven days.',
		shots: [
			shot('captains-log-wheelhouse', 'docs/images/home-log-tab.png', 'Wheelhouse’s home page with the Log tab open on the rail: three lines saying what landed since the morning, what waits on you and what is under way'),
			shot('captains-log-wheelhouse', 'docs/images/log-tab-open.png', 'The Log tab with all three lines open: the three changes that landed today with merge times, a decision and a pull request waiting on you, and two tasks under way followed by the next two in the backlog'),
			shot('captains-log-wheelhouse', 'docs/images/log-page.png', 'The Captain’s log page: the three lines closed, then the last seven days, from today’s three merged changes back to a quiet Monday'),
			shot('captains-log-wheelhouse', 'docs/images/settings.png', 'The Captain’s log page in Settings → Plugins: on for every project, with atlas, lumen and tidepool following the plugin, and the three settings below')
		]
	},
	{
		id: 'giffy', name: 'Giffy', repo: 'giffy-wheelhouse', kind: 'install',
		what: 'A pre-checked catalogue of 492 GIFs in 16 occasions. Firstmate puts one in good news like a merge or a release, and never in bad news.',
		adds: 'A GIFs page in the menu and an MCP server for Firstmate. No API key, no live search.',
		shots: [
			shot('giffy-wheelhouse', 'docs/images/chat.png', 'Firstmate’s chat in Wheelhouse: a message reporting a merged pull request ends with a “Nailed It” GIF from Giffy'),
			shot('giffy-wheelhouse', 'docs/images/gifs.png', 'The GIFs page: 492 GIFs for 16 occasions, with a card per occasion showing a still, when it fits and how many GIFs it has'),
			shot('giffy-wheelhouse', 'docs/images/occasion.png', 'The Merged occasion opened: a grid of its GIFs, each with its description'),
			shot('giffy-wheelhouse', 'docs/images/gif.png', 'One GIF opened on its own: Mission Accomplished, checked to load on 30 October 2026, with Open on GIPHY and Close'),
			shot('giffy-wheelhouse', 'docs/images/settings.png', 'Giffy’s page in Settings → Plugins: the Every project switch turned on, a per-project override, and what the plugin adds')
		]
	},
	{
		id: 'shared-review', name: 'Shared review', kind: 'builtin', on: 'Off until you turn it on',
		what: 'Put a prototype or a worker’s live app behind sign-in for several people to comment on the spot they mean, with pinned and whole-review comments, attachments and voice notes. Share links carry the passcode.',
		adds: 'A Reviews page and a Shared review section on each task. Closing a review takes the link down and sends the threads you pick to Firstmate, as they are or tidied into points you edit first. Reviews go live on a review server you deploy.',
		shots: [
			still('shared-review-cards', 'The Reviews page in dark mode: two open reviews of the demo Lumen app as cards with live thumbnails, one a local preview and one live on the review server, each with its task, comments, reviewers, link and passcode'),
			still('shared-review-task', 'A task’s Shared review tab: the live review of the share dialog with its thumbnail, link and passcode, and Ana’s and Ben’s comments pinned to spots on the page'),
			shot('wheelhouse', 'docs/screenshots/plugins/shared-review-reviewer.png', 'A reviewer’s view: the prototype with numbered pins where people commented, and the comments beside it'),
			shot('wheelhouse', 'docs/screenshots/plugins/shared-review-comment.png', 'Commenting on a live app under review: in comment mode a click on the app opens a comment on that spot instead of reaching it'),
			shot('wheelhouse', 'docs/screenshots/plugins/shared-review-firstmate.png', 'The Firstmate chat: the closed review’s comments as one Shared review feedback card about the task, sent to Firstmate')
		]
	},
	{
		id: 'share-previews', name: 'Share previews', repo: 'share-previews-wheelhouse', kind: 'build',
		what: 'Share a live preview as a password-protected HTTPS link through your own k3s cluster.',
		adds: 'Being built now. The repository holds only its README so far.',
		shots: []
	},
	{
		id: 'github-issues', name: 'GitHub issues', kind: 'builtin', on: 'Off until you turn it on',
		what: 'Lists each project’s open issues that match your watch rule, labelled ready-for-pr or assigned to you by default, and hands any of them to Firstmate.',
		adds: 'An Issues tab on the home rail and on each project. Can ring the bell for new issues, or hand them over itself.',
		shots: [
			shot('wheelhouse', 'docs/screenshots/plugins/github-issues-home.png', 'The Issues tab on the home page’s On deck rail: watched issues across projects, each with its title, project and either Hand to Firstmate or the task that already has it in hand'),
			shot('wheelhouse', 'docs/screenshots/plugins/github-issues-project.png', 'A project’s Issues tab: its repository, the watch rule, and the open issues that match it, one already in hand with Firstmate')
		]
	},
	{
		id: 'project-links', name: 'Project links', kind: 'builtin', on: 'Off until you turn it on',
		what: 'Links to a project’s repository, README and pull requests, and each task’s pull request, preview and branch.',
		adds: 'A Links tab on projects and tasks, a Harbour card and evidence under the Pull request step.',
		shots: [
			shot('wheelhouse', 'docs/screenshots/plugins/project-links-task.png', 'A task’s Links tab: the pull request’s state, with links to the pull request, the reported preview, the branch and the repository'),
			shot('wheelhouse', 'docs/screenshots/plugins/project-links-project.png', 'A project’s Links tab: links to the repository, its README and pull requests, the clone, and each task’s pull request and state')
		]
	},
	{
		id: 'vault', name: 'Vault', kind: 'builtin', on: 'On by default',
		what: 'What wh-vault holds, by name only: every secret, the projects it is granted to, when it was set and last used.',
		adds: 'A Vault page to add, grant and revoke, a Secrets tab on projects and a Secrets used tab on tasks.',
		shots: [
			shot('wheelhouse', 'docs/screenshots/plugins/vault-page.png', 'The Vault page: each secret by name with the projects that may use it, an Add a secret button, and the recent use of the vault by task, command and result'),
			shot('wheelhouse', 'docs/screenshots/plugins/vault-project.png', 'A project’s Secrets tab: the secrets its commands may receive with when each value was set and last used, and the tasks that used them, including one refused')
		]
	}
];

export const SLOTS = [
	['project.tab', 'a tab on each project'],
	['harbour.card', 'a card on a project’s work'],
	['task.section', 'a section on a task page'],
	['step.evidence', 'evidence under a passage step'],
	['bridge.card', 'a card under a chat reply'],
	['home.card', 'a tab on the home rail'],
	['header.indicator', 'a pill in the header'],
	['nav.page', 'a page in the menu']
];

// From the GitHub releases (gh release list / view -R chrisjowen/wheelhouse), and for releases with
// a tag but no release notes, the pull requests merged since the one before. Newest first.
export const RELEASES = [
	{ version: '0.4.0', date: '2026-11-10', since: '0.3.0', notes: ['The Crew OS look, in light and dark', 'Chat about this keeps its decision in view'] },
	{ version: '0.3.0', date: '2026-11-10', since: '0.2.1', notes: ['The bundled Shared review plugin: live and static review links, pinned comments, attachments, voice notes and a tidied summary for Firstmate', 'A task page that starts with the worker’s brief, then one timeline; On deck as one line per task, grouped by crew', 'Second mates beside local work, decision forms and threads in the chat, a thumbs-up for Firstmate, the vault popup and the fleet chart'] },
	{ version: '0.2.1', date: '2026-11-01', notes: ['Review on a pull request opens it in a plugin’s review tab', 'The built-in PR review gives way to the PR review plugin'] },
	{ version: '0.2.0', date: '2026-11-01', notes: ['Live previews and decisions as cards in the chat', 'Harbour with a page per project', 'Discord gateway, the vault, plugins installed from GitHub, MCP apps'] },
	{ version: '0.1.1', date: '2026-10-27', notes: ['A README led by getting started and a scannable feature list'] },
	{ version: '0.1.0', date: '2026-10-27', notes: ['First release on npm: the Harbour, the Firstmate chat, task pages with live consoles and previews', 'Passages, Decided for you, Where time went and Headroom'] }
];

/** Every screenshot the page uses, once each. */
export function allShots() {
	const seen = new Map();
	for (const f of FEATURES.flatMap((g) => g.items)) seen.set(`${f.img.repo}/${f.img.path}`, f.img);
	for (const p of PLUGINS) for (const s of p.shots) seen.set(`${s.repo}/${s.path}`, s);
	return [...seen.values()];
}
