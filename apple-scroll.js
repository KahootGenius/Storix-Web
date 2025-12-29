const scenes = document.querySelectorAll('.scene');
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
function update() {
  const vh = window.innerHeight;
  scenes.forEach(sc => {
    const r = sc.getBoundingClientRect();
    const total = r.height - vh;
    const scrolled = clamp((vh - r.top) / total, 0, 1);
    sc.style.setProperty('--p', scrolled);
  });
  requestAnimationFrame(update);
}
update();
const logoName = document.querySelector('.scene--logo .logo-name');
const logoTop = document.querySelector('.scene--logo .logo-top');
const logoBottom = document.querySelector('.scene--logo .logo-bottom');
function syncLogoWidth() {
  if (!logoName || !logoTop || !logoBottom) return;
  const w = logoName.getBoundingClientRect().width;
  const px = Math.round(w);
  logoTop.style.width = px + 'px';
  logoBottom.style.width = px + 'px';
}
window.addEventListener('resize', syncLogoWidth);
syncLogoWidth();
