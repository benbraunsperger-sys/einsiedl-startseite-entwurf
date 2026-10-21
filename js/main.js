/* Café-Konditorei Einsiedl – Startseite */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Kopf: weiß, sobald man unter das Titelbild scrollt ---------- */
  var header = $('#header');
  var hero = $('.hero');
  function kopf() { header.classList.toggle('solid', window.scrollY > hero.offsetHeight - header.offsetHeight - 10); }
  kopf();
  window.addEventListener('scroll', kopf, { passive: true });
  window.addEventListener('resize', kopf);

  /* ---------- Menü am Handy ---------- */
  var menuBtn = $('.menu-btn');
  var menu = $('#menu');
  function menue(offen) {
    menu.classList.toggle('open', offen);
    header.classList.toggle('menu-open', offen);
    menuBtn.setAttribute('aria-expanded', String(offen));
    menuBtn.textContent = offen ? 'Schließen' : 'Menü';
  }
  menuBtn.addEventListener('click', function () { menue(!menu.classList.contains('open')); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) menue(false); });

  /* ---------- Wechselnde Bilder im Titelbild ---------- */
  var slides = $$('#slides .slide');
  var dots = $$('#dots button');
  var aktiv = 0;
  var timer = null;
  var ruhig = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function zeigeSlide(i) {
    aktiv = (i + slides.length) % slides.length;
    slides.forEach(function (s, n) { s.classList.toggle('is-active', n === aktiv); });
    dots.forEach(function (d, n) { if (n === aktiv) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
  }
  function starte() { if (!ruhig) { clearInterval(timer); timer = setInterval(function () { zeigeSlide(aktiv + 1); }, 6000); } }
  dots.forEach(function (d, n) { d.addEventListener('click', function () { zeigeSlide(n); starte(); }); });
  starte();

  /* ---------- Heutiger Tag in den Öffnungszeiten ---------- */
  var zeile = $('.hours tr[data-tage~="' + new Date().getDay() + '"]');
  if (zeile) zeile.classList.add('today');

  /* ---------- Alle Ausflugsziele ---------- */
  var alleBtn = $('#alle-ausfluege');
  var trips = $('#trips');
  alleBtn.addEventListener('click', function () {
    var alle = trips.classList.toggle('alle');
    alleBtn.setAttribute('aria-expanded', String(alle));
    alleBtn.textContent = alle ? 'Weniger anzeigen' : 'Alle 20 Ausflugsziele anzeigen';
    if (!alle) trips.scrollIntoView({ block: 'start' });
  });

  /* ---------- Bild in groß ---------- */
  var lb = $('#lightbox');
  if (!lb || typeof lb.showModal !== 'function') return;
  var lbImg = $('img', lb);
  var lbCap = $('figcaption', lb);
  var gruppe = [];
  var pos = 0;
  function zeige(i) {
    pos = (i + gruppe.length) % gruppe.length;
    var a = gruppe[pos];
    var img = $('img', a);
    lbImg.src = a.getAttribute('href');
    lbImg.alt = img ? img.alt : '';
    lbCap.textContent = a.dataset.titel || (img ? img.alt : '');
    $('.lb-prev', lb).hidden = $('.lb-next', lb).hidden = gruppe.length < 2;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a.zoom');
    if (!a) return;
    e.preventDefault();
    gruppe = $$('a.zoom[data-gruppe="' + a.dataset.gruppe + '"]').filter(function (x) { return x.offsetParent !== null; });
    if (gruppe.indexOf(a) < 0) gruppe = [a];
    zeige(gruppe.indexOf(a));
    lb.showModal();
  });
  $('.lb-prev', lb).addEventListener('click', function () { zeige(pos - 1); });
  $('.lb-next', lb).addEventListener('click', function () { zeige(pos + 1); });
  $('.lb-close', lb).addEventListener('click', function () { lb.close(); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') zeige(pos - 1);
    if (e.key === 'ArrowRight') zeige(pos + 1);
  });
})();
