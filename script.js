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

// FAQ accordion
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const isOpen = question.getAttribute('aria-expanded') === 'true';
    const answer = question.nextElementSibling;

    // Close all others
    faqQuestions.forEach(q => {
      q.setAttribute('aria-expanded', 'false');
      q.nextElementSibling.classList.remove('open');
    });

    // Toggle clicked one
    if (!isOpen) {
      question.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});

// ── BUZZ WORDS: search + filter ──
const bwSearch   = document.getElementById('bw-search');
const bwClear    = document.getElementById('bw-clear');
const bwCards    = document.querySelectorAll('.bw-card');
const bwEmpty    = document.getElementById('bw-empty');
const bwCount    = document.getElementById('bw-count');
const bwFilters  = document.querySelectorAll('.bw-filter');

let activeCat = 'all';

function updateBwCount(visible) {
  bwCount.textContent = visible === bwCards.length
    ? `Showing all ${visible} buzz words`
    : `Showing ${visible} of ${bwCards.length} buzz words`;
}

function filterBuzzWords() {
  const query = bwSearch.value.toLowerCase().trim();
  let visible = 0;

  bwCards.forEach(card => {
    const cat      = card.dataset.cat;
    const text     = card.textContent.toLowerCase();
    const catMatch = activeCat === 'all' || cat === activeCat;
    const txtMatch = !query || text.includes(query);

    if (catMatch && txtMatch) {
      card.classList.remove('hidden');
      visible++;
    } else {
      card.classList.add('hidden');
    }
  });

  bwEmpty.style.display = visible === 0 ? 'block' : 'none';
  bwClear.classList.toggle('visible', query.length > 0);
  updateBwCount(visible);
}

bwSearch.addEventListener('input', filterBuzzWords);

bwClear.addEventListener('click', () => {
  bwSearch.value = '';
  filterBuzzWords();
  bwSearch.focus();
});

bwFilters.forEach(btn => {
  btn.addEventListener('click', () => {
    bwFilters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCat = btn.dataset.cat;
    filterBuzzWords();
  });
});

// Initialise count on page load
updateBwCount(bwCards.length);

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
