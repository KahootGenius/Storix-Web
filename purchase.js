const form = document.getElementById('purchase-form');
const out = document.getElementById('total');
const breakdown = document.getElementById('breakdown');
const fmt = v => `$${v.toLocaleString()}`;
const panel = document.getElementById('panel-scroll');
function calc() {
  let total = 0;
  const lines = [];
  if (form.forecast.checked) { total += 5000; lines.push('Forecasting module: $5,000'); }
  if (form.storage.checked) { total += 7000; lines.push('Storage module: $7,000'); }
  if (form.transport.checked) { total += 4000; lines.push('Transport module: $4,000'); }
  total += Number(form.region.value);
  lines.push(`Region tier: ${fmt(Number(form.region.value))}`);
  total += Number(form.sla.value);
  lines.push(`SLA: ${fmt(Number(form.sla.value))}`);
  out.textContent = fmt(total);
  breakdown.innerHTML = lines.map(l => `<div>${l}</div>`).join('');
  updateSelectionStyles();
}
form.addEventListener('input', calc);
calc();

// Lock scroll within right panel until edges, then allow page scroll
function onWheel(e) {
  const delta = e.deltaY;
  const atTop = panel.scrollTop === 0;
  const atBottom = Math.ceil(panel.scrollTop + panel.clientHeight) >= panel.scrollHeight;
  if ((delta < 0 && !atTop) || (delta > 0 && !atBottom)) {
    e.preventDefault();
    panel.scrollTop += delta;
  }
}
let touchStartY = 0;
function onTouchStart(e) { touchStartY = e.touches[0].clientY }
function onTouchMove(e) {
  const y = e.touches[0].clientY;
  const delta = touchStartY - y;
  const atTop = panel.scrollTop === 0;
  const atBottom = Math.ceil(panel.scrollTop + panel.clientHeight) >= panel.scrollHeight;
  if ((delta < 0 && !atTop) || (delta > 0 && !atBottom)) {
    e.preventDefault();
    panel.scrollTop += delta;
  }
}
panel.addEventListener('wheel', onWheel, { passive: false });
panel.addEventListener('touchstart', onTouchStart, { passive: true });
panel.addEventListener('touchmove', onTouchMove, { passive: false });

function updateSelectionStyles() {
  document.querySelectorAll('.opt').forEach(opt => {
    const input = opt.querySelector('input');
    if (!input) return;
    if (input.checked) opt.classList.add('selected');
    else opt.classList.remove('selected');
  });
}
form.addEventListener('change', updateSelectionStyles);
updateSelectionStyles();

// Make the entire option clickable (not just the label)
document.querySelectorAll('.opt').forEach(opt => {
  const input = opt.querySelector('input');
  if (!input) return;
  opt.addEventListener('click', e => {
    e.preventDefault();
    if (input.type === 'checkbox') {
      input.checked = !input.checked;
    } else if (input.type === 'radio') {
      const group = input.name;
      const radios = form.querySelectorAll(`input[type="radio"][name="${group}"]`);
      radios.forEach(r => { r.checked = (r === input); });
    }
    calc();
  });
  // Keyboard support for accessibility
  opt.tabIndex = 0;
  opt.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (input.type === 'checkbox') {
        input.checked = !input.checked;
      } else if (input.type === 'radio') {
        const group = input.name;
        const radios = form.querySelectorAll(`input[type="radio"][name="${group}"]`);
        radios.forEach(r => { r.checked = (r === input); });
      }
      calc();
    }
  });
});
