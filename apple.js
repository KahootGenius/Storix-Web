const navButtons = document.querySelectorAll('[data-mega]');
const mega = document.getElementById('mega');
const megaContent = document.getElementById('mega-content');
navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-mega');
    document.querySelectorAll('.mega-section').forEach(s => s.style.display = 'none');
    const target = document.getElementById(id);
    if (target) target.style.display = 'block';
    mega.classList.add('open');
  });
});
document.addEventListener('click', e => {
  if (!e.target.closest('.header') && !e.target.closest('.mega')) {
    mega.classList.remove('open');
  }
});
document.querySelectorAll('.acc-header').forEach(h => {
  h.addEventListener('click', () => {
    const item = h.parentElement;
    const open = item.classList.contains('open');
    document.querySelectorAll('.acc-item').forEach(i => i.classList.remove('open'));
    if (!open) item.classList.add('open');
  });
});
