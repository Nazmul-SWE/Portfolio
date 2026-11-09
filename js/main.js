/* Portfolio interactions - vanilla JS, no dependencies */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ----- Theme toggle (light default, remembered in localStorage) ----- */
  var root = document.documentElement;
  var themeBtn = $('.theme-toggle');
  var themeMeta = $('meta[name="theme-color"]');

  function applyTheme(t, animate) {
    if (animate) {
      root.classList.add('theme-anim');
      setTimeout(function () { root.classList.remove('theme-anim'); }, 450);
    }
    root.setAttribute('data-theme', t);
    if (themeMeta) themeMeta.setAttribute('content', t === 'dark' ? '#0a0e1c' : '#f6f7fc');
    var label = t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    themeBtn.setAttribute('aria-label', label);
    themeBtn.setAttribute('title', label);
    try { localStorage.setItem('theme', t); } catch (e) { /* storage unavailable */ }
  }

  themeBtn.addEventListener('click', function () {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  });
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);

  /* ----- Navbar: scrolled state, mobile menu, scroll-spy ----- */
  var navbar = $('.navbar');
  var toggle = $('.nav-toggle');
  var menu = $('#navMenu');
  var links = $$('.nav-link');
  var sections = links.map(function (a) { return $(a.getAttribute('href')); });

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  $$('.navbar a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });

  var ticking = false;
  function onScroll() {
    navbar.classList.toggle('is-scrolled', window.scrollY > 24);
    var probe = window.scrollY + 120;
    var current = 0;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= probe) current = i; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = sections.length - 1;
    links.forEach(function (a, i) {
      a.classList.toggle('active', i === current);
      if (i === current) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ----- Scroll reveal ----- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ----- Project cards: pointer spotlight ----- */
  $$('.project-card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ----- Lightbox (native <dialog>) ----- */
  var box = $('#lightbox');
  var items = $$('.popup-image');
  var boxImg = $('img', box);
  var boxCap = $('.lb-caption', box);
  var idx = 0;
  var opener = null;

  function show(i) {
    idx = (i + items.length) % items.length;
    var a = items[idx];
    var thumb = $('img', a);
    boxImg.src = a.getAttribute('href');
    boxImg.alt = thumb.alt;
    boxCap.textContent = (idx + 1) + ' / ' + items.length + '  ·  ' + thumb.alt;
  }

  items.forEach(function (a, i) {
    a.addEventListener('click', function (e) {
      if (typeof box.showModal !== 'function') return; // fall back to opening the image
      e.preventDefault();
      opener = a;
      show(i);
      box.showModal();
    });
  });

  $('.lb-prev', box).addEventListener('click', function () { show(idx - 1); });
  $('.lb-next', box).addEventListener('click', function () { show(idx + 1); });
  $('.lb-close', box).addEventListener('click', function () { box.close(); });
  box.addEventListener('click', function (e) { if (e.target === box || e.target.classList.contains('lb-stage')) box.close(); });
  box.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
  box.addEventListener('close', function () { boxImg.removeAttribute('src'); if (opener) opener.focus(); });

  /* ----- Contact form: no backend, so hand the message to the visitor's email app ----- */
  var form = $('#contactForm');
  var note = $('#formNote');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();
    note.classList.add('is-ok');
    note.textContent = 'Opening your email app… press send there to deliver your message.';
    window.location.href = 'mailto:nazmulmridha680@gmail.com' +
      '?subject=' + encodeURIComponent('Portfolio message from ' + name) +
      '&body=' + encodeURIComponent(message + '\n\n- ' + name + ' (' + email + ')');
  });
})();
