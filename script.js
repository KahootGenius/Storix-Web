const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}
const toggleBtn = document.getElementById("themeToggle");
toggleBtn?.addEventListener("click", () => {
  document.documentElement.classList.toggle("light");
});
