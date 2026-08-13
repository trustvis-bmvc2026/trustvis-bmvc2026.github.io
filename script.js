document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const scrim = document.querySelector('.nav-scrim');
const navLinks = nav ? [...nav.querySelectorAll('a')] : [];

function setMenu(open) {
  if (!menuButton || !nav || !scrim) return;
  nav.classList.toggle('is-open', open);
  scrim.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  if (open) navLinks[0]?.focus();
}

if (menuButton && nav && scrim) {
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  scrim.addEventListener('click', () => setMenu(false));
  navLinks.forEach(link => link.addEventListener('click', () => {
    setMenu(false);
    navLinks.forEach(item => item.removeAttribute('aria-current'));
    link.setAttribute('aria-current', 'true');
  }));

  document.addEventListener('keydown', event => {
    if (menuButton.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') {
      setMenu(false);
      menuButton.focus();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [menuButton, ...navLinks];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) setMenu(false);
  });
}

const observedSections = navLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if (observedSections.length) {
  let updateQueued = false;
  const updateActiveSection = () => {
    updateQueued = false;
    const marker = 190;
    let current = null;
    observedSections.forEach(section => {
      if (section.getBoundingClientRect().top <= marker) current = section;
    });
    navLinks.forEach(link => {
      const active = current && link.getAttribute('href') === `#${current.id}`;
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };
  const requestActiveUpdate = () => {
    if (updateQueued) return;
    updateQueued = true;
    window.requestAnimationFrame(updateActiveSection);
  };
  window.addEventListener('scroll', requestActiveUpdate, { passive: true });
  window.addEventListener('resize', requestActiveUpdate);
  updateActiveSection();
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
