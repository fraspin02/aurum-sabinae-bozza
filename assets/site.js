/* Aurum Sabinae – bozza */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* entrance, once per element, staggered inside each section */
  const targets = document.querySelectorAll('[data-reveal]');
  document.querySelectorAll('section').forEach((s) => {
    s.querySelectorAll('[data-reveal]').forEach((el, i) => { el.style.transitionDelay = (i * 80) + 'ms'; });
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    targets.forEach((el) => io.observe(el));
    addEventListener('load', () => setTimeout(() => targets.forEach((el) => {
      const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in');
    }), 2500));
  } else targets.forEach((el) => el.classList.add('is-in'));

  /* the fixed photograph changes with the section being read */
  const imgs = [...document.querySelectorAll('.photos img')];
  const show = (n) => imgs.forEach((im, i) => im.classList.toggle('is-on', i === n));
  if ('IntersectionObserver' in window && imgs.length) {
    const po = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) show(+e.target.dataset.photo); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    document.querySelectorAll('[data-photo]').forEach((el) => po.observe(el));
  }

  /* oils: tabs */
  const oils = document.querySelector('.oils');
  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  const img = document.getElementById('oil-img');
  const ask = document.getElementById('oil-ask');
  if (oils && tabs.length) {
    oils.classList.add('is-tabbed');
    document.querySelector('.tabs').hidden = false;
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).classList.toggle('is-on', on);
      });
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      const name = panel.querySelector('h3').textContent;
      ask.href = 'https://wa.me/393286268470?text=' + encodeURIComponent('Buongiorno, vorrei ordinare: ' + name);
      if (img.getAttribute('src') !== panel.dataset.img) {
        img.classList.add('is-out');
        setTimeout(() => { img.src = panel.dataset.img; img.alt = panel.dataset.alt; img.classList.remove('is-out'); }, reduce ? 0 : 220);
      }
      if (focus) tab.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true); }
        if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });
    select(tabs[0]);
  }

  /* the year: what happens in the fields this month */
  const months = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
  const now = {
    4: 'cominciano le ciliegie', 5: 'ultime ciliegie della stagione',
    9: 'si raccolgono le olive del Primo Raccolto e del Frantoio', 10: 'si raccoglie la Carboncella e tornano le erbe di campo',
    11: 'erbe amare di campo, olio nuovo in cantina', 0: 'erbe amare di campo', 1: 'erbe amare di campo'
  };
  const bar = document.querySelector('.slip-end');
  const groups = [...document.querySelectorAll('.slip-group')];
  const btns = [...document.querySelectorAll('.months button')];
  if (bar && btns.length) {
    document.querySelector('.months').hidden = false;
    const today = new Date().getMonth();
    btns[today].classList.add('is-now');
    const pick = (m) => {
      btns.forEach((b) => b.setAttribute('aria-pressed', +b.dataset.m === m));
      groups.forEach((g) => g.classList.toggle('is-now', g.dataset.months.split(',').map(Number).includes(m)));
      const label = (m === today ? 'Adesso, ' : 'A ') + months[m];
      const what = now[m] || 'lavori in campagna: chiedi a Leonardo cosa c’è di pronto';
      bar.innerHTML = '';
      const a = document.createElement('span'); a.textContent = label;
      const b = document.createElement('b'); b.textContent = what;
      bar.append(a, b);
    };
    btns.forEach((b) => b.addEventListener('click', () => pick(+b.dataset.m)));
    pick(today);
  }
})();
