const scenes = document.querySelectorAll('.scene');
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

function update() {
  const vh = window.innerHeight;
  scenes.forEach(sc => {
    const r = sc.getBoundingClientRect();
    const total = r.height - vh;
    // Calculate progress: 0 when top of section hits top of viewport? 
    // Wait, apple-scroll.js logic was:
    // (vh - r.top) / total
    // When r.top == vh (section just entering), val = 0
    // When r.top == 0 (section fills screen), val = vh/total? No.
    // If scene height is 200vh (total = 100vh).
    // Start: top=vh -> 0
    // End: top=-100vh -> (vh - (-100vh))/100vh = 200/100 = 2?
    // Wait, the logic in apple-scroll.js was:
    // const scrolled = clamp((vh - r.top) / total, 0, 1);
    
    // Let's refine for "pin" behavior.
    // Usually we want 0 -> 1 as we scroll through the pinned area.
    // If height is 200vh. Pin is 100vh. Scroll distance is 100vh.
    // When top = 0, we start pinning.
    // When top = -100vh, we end pinning.
    // We want progress 0 at top=0, progress 1 at top=-total.
    
    // Using previous logic:
    // (vh - r.top) / total
    // If top = 0 -> vh/total. If total=vh, then 1. That's "fully scrolled".
    // That means it animates AS it enters.
    // But we want it to animate WHILE pinned?
    
    // Let's stick to the simple logic:
    // We want effects to happen as we scroll PAST it.
    // Actually, let's just use IntersectionObserver for standard fade-ins if simpler, 
    // but the user liked "apple-scroll".
    // The previous logic animates ENTRY.
    // Let's keep it.
    
    let scrolled = (vh - r.top) / (vh + r.height); // Normalize roughly?
    
    // Reverting to apple-scroll.js exact logic to maintain consistency
    const scrolled_apple = clamp((vh - r.top) / (r.height - vh + 1), 0, 1); 
    // +1 to avoid div by zero if height=vh
    
    sc.style.setProperty('--p', scrolled_apple);
  });
  requestAnimationFrame(update);
}
update();

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}
