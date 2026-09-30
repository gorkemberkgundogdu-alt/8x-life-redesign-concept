const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu-overlay');
const menuLabel = document.querySelector('.menu-toggle-label');

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
