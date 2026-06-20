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

// Font size accessibility controls
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
