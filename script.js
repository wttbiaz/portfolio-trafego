// Ano no rodapé
document.getElementById('ano').textContent = new Date().getFullYear();

// Menu mobile
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  toggle.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
  menu.classList.toggle('is-open', !open);
});
menu.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    menu.classList.remove('is-open');
  }
});

// Espaço reservado quando a imagem não existe
document.querySelectorAll('.shot img[src]').forEach((img) => {
  const markMissing = () => img.closest('.shot').classList.add('is-missing');
  if (img.complete && img.naturalWidth === 0) markMissing();
  else img.addEventListener('error', markMissing, { once: true });
});

// Itens opcionais da galeria (imagem ou vídeo): só aparecem quando o arquivo existir
document.querySelectorAll('[data-optional]').forEach((item) => {
  const isVideo = item.dataset.optional.endsWith('.mp4');
  const probe = isVideo ? document.createElement('video') : new Image();
  const show = () => {
    const media = item.querySelector('[data-src]');
    media.src = media.dataset.src;
    item.hidden = false;
  };
  if (isVideo) {
    probe.preload = 'metadata';
    probe.addEventListener('loadedmetadata', show, { once: true });
  } else {
    probe.onload = show;
  }
  probe.src = item.dataset.optional;
});

// Vídeos: sem som e em loop; clicar mostra os controles
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('.shot video').forEach((video) => {
  video.addEventListener('click', () => { video.controls = true; }, { once: true });
  if (reduceMotion) return;
  // Só toca quando aparece na tela
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) video.play().catch(() => {});
    else video.pause();
  }, { threshold: 0.25 }).observe(video);
});

// Botão flutuante do WhatsApp: some enquanto o topo ou o contato estão na tela
const waFloat = document.querySelector('.wa-float');
const visibleZones = new Set();
const waObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => (e.isIntersecting ? visibleZones.add(e.target) : visibleZones.delete(e.target)));
  const hide = visibleZones.size > 0;
  waFloat.classList.toggle('is-hidden', hide);
  waFloat.toggleAttribute('aria-hidden', hide);
  waFloat.tabIndex = hide ? -1 : 0;
});
[document.querySelector('.hero'), document.getElementById('contato')].forEach((el) => waObserver.observe(el));

// Depoimentos: só aparecem os que têm texto; sem nenhum, a seção fica escondida
const quotes = document.querySelectorAll('.quote');
quotes.forEach((q) => {
  if (!q.querySelector('blockquote').textContent.trim()) q.remove();
});
if (document.querySelector('.quote')) document.getElementById('depoimentos').hidden = false;

// Currículo: cada link [data-cv] só aparece se o PDF dele existir no servidor
document.querySelectorAll('[data-cv]').forEach((cv) => {
  fetch(cv.getAttribute('href'), { method: 'HEAD' })
    .then((res) => { if (res.ok) cv.hidden = false; })
    .catch(() => {});
});
