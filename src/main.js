// Progressive enhancement for the static page: everything is readable without it.
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* Theme: system, light, dark (the inline head script applies the saved choice before paint) */
(() => {
	const btn = $('#theme'), icon = $('#theme-icon');
	const paths = {
		system: 'M12 3a9 9 0 1 0 9 9A7 7 0 0 1 12 3Z',
		light: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
		dark: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z'
	};
	const labels = { system: 'Theme: follows your system', light: 'Theme: light', dark: 'Theme: dark' };
	let mode = document.documentElement.dataset.theme || 'system';
	const apply = () => {
		if (mode === 'system') document.documentElement.removeAttribute('data-theme');
		else document.documentElement.dataset.theme = mode;
		icon.setAttribute('d', paths[mode]);
		btn.setAttribute('aria-label', labels[mode]);
		btn.title = labels[mode];
	};
	apply();
	btn.addEventListener('click', () => {
		mode = { system: 'light', light: 'dark', dark: 'system' }[mode];
		try {
			localStorage.setItem('wh-site-theme', mode);
		} catch {}
		apply();
	});
})();

/* Copy buttons */
const toast = (msg) => {
	const t = $('#toast');
	t.textContent = msg;
	t.classList.add('on');
	clearTimeout(toast.t);
	toast.t = setTimeout(() => t.classList.remove('on'), 1600);
};
document.addEventListener('click', async (e) => {
	const b = e.target.closest('[data-copy]');
	if (!b) return;
	try {
		await navigator.clipboard.writeText(b.dataset.copy);
	} catch {
		const ta = Object.assign(document.createElement('textarea'), { value: b.dataset.copy });
		document.body.append(ta);
		ta.select();
		document.execCommand('copy');
		ta.remove();
	}
	b.textContent = 'Copied';
	setTimeout(() => (b.textContent = 'Copy'), 1400);
	toast('Copied to the clipboard');
});

/* Lightbox: a screenshot link opens in place; a plugin's screenshots step as one gallery */
(() => {
	const lb = $('#lb'), img = $('#lb-img'), cap = $('#lb-cap'), count = $('#lb-count');
	let items = [], at = 0;
	const alt = (a) => a.dataset.alt ?? a.querySelector('img')?.alt ?? '';
	const show = () => {
		const a = items[at];
		img.src = a.href;
		img.alt = alt(a);
		cap.textContent = alt(a);
		count.textContent = items.length > 1 ? `${at + 1} / ${items.length}` : '';
		lb.toggleAttribute('data-single', items.length < 2);
	};
	const step = (d) => {
		at = (at + d + items.length) % items.length;
		show();
	};
	document.addEventListener('click', (e) => {
		const a = e.target.closest('a[data-zoom]');
		if (a) {
			e.preventDefault();
			items = a.dataset.gallery ? $$(`a[data-zoom][data-gallery="${a.dataset.gallery}"]`) : [a];
			at = items.indexOf(a);
			show();
			lb.showModal();
			return;
		}
		const s = e.target.closest('[data-lb-step]');
		if (s) return step(+s.dataset.lbStep);
		if (e.target === lb || e.target.closest('[data-close]')) lb.close();
	});
	lb.addEventListener('keydown', (e) => {
		const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
		if (d && items.length > 1) {
			e.preventDefault();
			step(d);
		}
	});
})();

/* Tour chapters: seek and play; highlight the chapter playing */
(() => {
	const v = $('#video'), list = $('#chapters');
	if (!v || !list) return;
	const lis = [...list.children];
	const ats = lis.map((li) => +li.querySelector('button').dataset.at);
	const mark = () => {
		let cur = 0;
		ats.forEach((at, i) => {
			if (v.currentTime + 0.05 >= at) cur = i;
		});
		lis.forEach((li, i) => li.classList.toggle('on', i === cur));
	};
	list.addEventListener('click', (e) => {
		const b = e.target.closest('button');
		if (!b) return;
		v.currentTime = +b.dataset.at;
		v.play().catch(() => {});
		mark();
	});
	v.addEventListener('timeupdate', mark);
})();

/* Feature index: one panel at a time */
(() => {
	const idx = $('#findex'), panels = $$('#fpanels .fview');
	if (!idx) return;
	const ids = panels.map((p) => p.dataset.id);
	let cur = 0;
	const show = (i, focus = false) => {
		cur = (i + ids.length) % ids.length;
		panels.forEach((p, j) => p.classList.toggle('on', j === cur));
		$$('[data-id]', idx).forEach((b) => {
			const on = b.dataset.id === ids[cur];
			if (on) b.setAttribute('aria-current', 'true');
			else b.removeAttribute('aria-current');
			if (on && focus) b.focus();
			if (on && idx.scrollWidth > idx.clientWidth) idx.scrollTo({ left: b.offsetLeft - (idx.clientWidth - b.offsetWidth) / 2, behavior: 'smooth' });
		});
	};
	idx.addEventListener('click', (e) => {
		const b = e.target.closest('[data-id]');
		if (b) show(ids.indexOf(b.dataset.id));
	});
	idx.addEventListener('keydown', (e) => {
		if (!e.target.closest('[data-id]')) return;
		const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
		if (!d) return;
		e.preventDefault();
		show(cur + d, true);
	});
	$('#fpanels').addEventListener('click', (e) => {
		const b = e.target.closest('[data-step]');
		if (b) show(cur + +b.dataset.step);
	});
	// Warm the next few screenshots so stepping through feels instant.
	panels.slice(1, 4).forEach((p) => {
		const i = p.querySelector('img');
		if (i) i.loading = 'eager';
	});
})();

/* Plugin filters */
(() => {
	const filters = $('#filters'), list = $('#plist');
	if (!filters || !list) return;
	filters.addEventListener('click', (e) => {
		const b = e.target.closest('.chip');
		if (!b) return;
		$$('.chip', filters).forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
		const k = b.dataset.k;
		$$('.pcard', list).forEach((c) => (c.hidden = !(k === 'all' || c.dataset.k === k)));
	});
})();

/* README clips: load and loop only while on screen; with reduced motion, wait for a click */
(() => {
	const vids = $$('video.loop');
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
		vids.forEach((v) => (v.controls = true));
		return;
	}
	const io = new IntersectionObserver(
		(es) =>
			es.forEach((en) => {
				if (en.isIntersecting) en.target.play().catch(() => {});
				else en.target.pause();
			}),
		{ threshold: 0.35 }
	);
	vids.forEach((v) => io.observe(v));
})();

/* Current section in the nav */
(() => {
	const links = $$('.nav a');
	const io = new IntersectionObserver(
		(es) =>
			es.forEach((en) => {
				if (en.isIntersecting) links.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === `#${en.target.id}`)));
			}),
		{ rootMargin: '-45% 0px -50% 0px' }
	);
	$$('main section[id]').forEach((s) => io.observe(s));
})();

/* Only one narrated player should speak at a time. */
$$('video[data-tutorial]').forEach((video) => {
	video.addEventListener('play', () => {
		$$('video[data-tutorial]').forEach((other) => { if (other !== video) other.pause(); });
	});
});
