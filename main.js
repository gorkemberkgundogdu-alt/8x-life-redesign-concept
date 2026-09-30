const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu-overlay');
const menuLabel = document.querySelector('.menu-toggle-label');
const html = document.documentElement;

if (html.classList.contains('intro-pending')) {
  try { sessionStorage.setItem('8x-life-intro-seen', '1'); } catch (_) {}
  setTimeout(() => {
    html.classList.remove('intro-pending');
    html.classList.add('intro-exiting');
    setTimeout(() => html.classList.remove('intro-exiting'), 600);
  }, 550);
}

function setMenu(open, restoreFocus = false) {
  menu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuLabel.textContent = open ? 'Close' : 'Menu';
  document.body.classList.toggle('menu-open', open);
  document.querySelector('main').inert = open;
  document.querySelector('.closing').inert = open;
  if (open) menu.querySelector('a').focus();
  if (!open && restoreFocus) menuButton.focus();
}

menuButton.addEventListener('click', () => setMenu(menu.hidden, true));
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !menu.hidden) setMenu(false, true);
});

const qualities = {
  taste: { number: '01', text: 'Taste is visible in the work. The brief calls it non-negotiable.' },
  speed: { number: '02', text: 'Ship many versions. Learn from what is live instead of waiting for one perfect answer.' },
  judgment: { number: '03', text: 'Know which twenty percent of a design carries the experience, and spend your effort there.' },
};
const tabs = [...document.querySelectorAll('.quality-tabs [role="tab"]')];
const detail = document.querySelector('.quality-detail');

function selectQuality(tab) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  const quality = qualities[tab.dataset.quality];
  detail.setAttribute('aria-labelledby', tab.id);
  detail.querySelector('span').textContent = `${quality.number} / FROM THE ROLE BRIEF`;
  detail.querySelector('p').textContent = quality.text;
  detail.classList.remove('detail-changing');
  void detail.offsetWidth;
  detail.classList.add('detail-changing');
}

tabs.forEach((tab, index) => {
  tab.tabIndex = index === 0 ? 0 : -1;
  tab.addEventListener('click', () => selectQuality(tab));
  tab.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    selectQuality(next);
    next.focus();
  });
});

if (html.classList.contains('motion-enabled') && 'IntersectionObserver' in window) {
  const selectors = [
    '.scale-main strong', '.people-heading', '.portrait',
    '.work .section-body h2', '.work-step',
    '.system-content', '.surface',
    '.approach .section-body h2', '.quality-switcher', '.fit-note',
    '.closing h2', '.closing-bottom', '.closing-footer',
  ];
  const revealNodes = document.querySelectorAll(selectors.join(','));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .08, rootMargin: '0px 0px -5% 0px' });
  revealNodes.forEach(node => {
    if (node.matches('.work-step, .surface, .portrait')) {
      const siblings = [...node.parentElement.children].filter(item => item.matches('.work-step, .surface, .portrait'));
      node.style.setProperty('--reveal-delay', `${siblings.indexOf(node) * 70}ms`);
    }
    node.classList.add('motion-reveal');
    observer.observe(node);
  });

  document.querySelectorAll('.menu-item').forEach((item, index) => item.style.setProperty('--menu-order', index));

  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking || innerWidth < 601) return;
    ticking = true;
    requestAnimationFrame(() => {
      const shift = Math.min(scrollY * .035, 16);
      html.style.setProperty('--portrait-shift-back', `${shift}px`);
      html.style.setProperty('--portrait-shift-front', `${-shift * .6}px`);
      ticking = false;
    });
  }, { passive: true });
}
