// ── Language switching ──
const langBtns = document.querySelectorAll('.lang-btn');
let currentLang = localStorage.getItem('lang') || 'en';

const EN_CACHE = {};

function cacheEnglish() {
  ['what','everyday','how','safe','fundamentals','processflow','buzzwords','faq'].forEach(id => {
    EN_CACHE[id] = document.getElementById('tab-' + id).innerHTML;
  });
  EN_CACHE.tagline  = document.getElementById('hdr-tagline').textContent;
  EN_CACHE.ftrMain  = document.getElementById('ftr-main').textContent;
  EN_CACHE.ftrNote  = document.getElementById('ftr-note').textContent;
  document.querySelectorAll('.nav-btn').forEach(b => {
    EN_CACHE['nav_' + b.dataset.tab] = b.textContent;
  });
}

function reInitFaq() {
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const isOpen = question.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-question').forEach(q => {
        q.setAttribute('aria-expanded', 'false');
        q.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) {
        question.setAttribute('aria-expanded', 'true');
        question.nextElementSibling.classList.add('open');
      }
    });
  });
}

function reInitBuzzWords() {
  const search  = document.getElementById('bw-search');
  const clear   = document.getElementById('bw-clear');
  const cards   = document.querySelectorAll('.bw-card');
  const empty   = document.getElementById('bw-empty');
  const count   = document.getElementById('bw-count');
  const filters = document.querySelectorAll('.bw-filter');
  let activeCat = 'all';

  function updateCount(v) {
    count.textContent = v === cards.length
      ? (currentLang === 'af' ? `Alle ${v} modewoorde word getoon` : `Showing all ${v} buzz words`)
      : (currentLang === 'af' ? `${v} van ${cards.length} modewoorde` : `Showing ${v} of ${cards.length} buzz words`);
  }

  function filterBW() {
    const q = search.value.toLowerCase().trim();
    let visible = 0;
    cards.forEach(card => {
      const catMatch = activeCat === 'all' || card.dataset.cat === activeCat;
      const txtMatch = !q || card.textContent.toLowerCase().includes(q);
      if (catMatch && txtMatch) { card.classList.remove('hidden'); visible++; }
      else card.classList.add('hidden');
    });
    empty.style.display = visible === 0 ? 'block' : 'none';
    clear.classList.toggle('visible', search.value.length > 0);
    updateCount(visible);
  }

  search.addEventListener('input', filterBW);
  clear.addEventListener('click', () => { search.value = ''; filterBW(); search.focus(); });
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCat = btn.dataset.cat;
      filterBW();
    });
  });
  updateCount(cards.length);
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);

  langBtns.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));

  if (lang === 'af' && typeof TRANS_AF !== 'undefined') {
    document.getElementById('hdr-tagline').textContent = TRANS_AF.ui.tagline;
    document.getElementById('ftr-main').textContent    = TRANS_AF.ui.footer.main;
    document.getElementById('ftr-note').textContent    = TRANS_AF.ui.footer.note;
    document.querySelectorAll('.nav-btn').forEach(b => {
      if (TRANS_AF.ui.nav[b.dataset.tab]) b.textContent = TRANS_AF.ui.nav[b.dataset.tab];
    });
    Object.keys(TRANS_AF.sections).forEach(id => {
      document.getElementById('tab-' + id).innerHTML = TRANS_AF.sections[id];
    });
  } else {
    document.getElementById('hdr-tagline').textContent = EN_CACHE.tagline;
    document.getElementById('ftr-main').textContent    = EN_CACHE.ftrMain;
    document.getElementById('ftr-note').textContent    = EN_CACHE.ftrNote;
    document.querySelectorAll('.nav-btn').forEach(b => {
      if (EN_CACHE['nav_' + b.dataset.tab]) b.textContent = EN_CACHE['nav_' + b.dataset.tab];
    });
    ['what','everyday','how','safe','fundamentals','processflow','buzzwords','faq'].forEach(id => {
      document.getElementById('tab-' + id).innerHTML = EN_CACHE[id];
    });
  }
  reInitFaq();
  reInitBuzzWords();
}

cacheEnglish();

langBtns.forEach(btn => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

if (currentLang === 'af') setLanguage('af');

// Tab navigation
const navBtns = document.querySelectorAll('.nav-btn');
const tabSections = document.querySelectorAll('.tab-section');

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.dataset.tab;

    navBtns.forEach(b => b.classList.remove('active'));
    tabSections.forEach(s => s.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById('tab-' + targetTab).classList.add('active');

    // Scroll to top of content on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

reInitFaq();
reInitBuzzWords();

// ── Font size accessibility controls
const fontControls = document.createElement('div');
fontControls.className = 'font-controls';
fontControls.setAttribute('aria-label', 'Text size controls');
fontControls.innerHTML = `
  <button class="font-btn" id="font-increase" title="Make text larger" aria-label="Make text larger">A+</button>
  <div class="font-label">Text<br>size</div>
  <button class="font-btn" id="font-decrease" title="Make text smaller" aria-label="Make text smaller">A−</button>
`;
document.body.appendChild(fontControls);

let baseFontSize = 20;

document.getElementById('font-increase').addEventListener('click', () => {
  baseFontSize = Math.min(baseFontSize + 2, 28);
  document.documentElement.style.fontSize = baseFontSize + 'px';
});

document.getElementById('font-decrease').addEventListener('click', () => {
  baseFontSize = Math.max(baseFontSize - 2, 16);
  document.documentElement.style.fontSize = baseFontSize + 'px';
});
