import Globe from "globe.gl";

const container = document.getElementById("globe2");
const tooltip = document.getElementById("globeTooltip2");
const yearRange = document.getElementById("yearRange2");
const yearLabel = document.getElementById("yearLabel2");
const readoutName = document.getElementById("globeName2");
const readoutYear = document.getElementById("globeYear2");
const readoutValue = document.getElementById("globeValue2");

const globeObj = Globe()(container)
  .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-dark.jpg")
  .backgroundColor("#000000")
  .showAtmosphere(true)
  .atmosphereColor("#6aa2ff")
  .atmosphereAltitude(0.18);
globeObj.width(container.clientWidth).height(container.clientHeight);

const lossData = {
  "United States of America": { 2019: 120, 2020: 110, 2021: 118, 2022: 123, 2023: 121 },
  "China": { 2019: 140, 2020: 132, 2021: 145, 2022: 148, 2023: 150 },
  "India": { 2019: 90, 2020: 85, 2021: 93, 2022: 98, 2023: 100 },
  "Germany": { 2019: 40, 2020: 38, 2021: 36, 2022: 35, 2023: 34 },
  "Brazil": { 2019: 60, 2020: 58, 2021: 62, 2022: 63, 2023: 64 },
  "South Africa": { 2019: 55, 2020: 51, 2021: 53, 2022: 56, 2023: 57 },
  "Australia": { 2019: 45, 2020: 42, 2021: 44, 2022: 47, 2023: 49 },
  "United Kingdom": { 2019: 35, 2020: 33, 2021: 31, 2022: 30, 2023: 29 },
  "Japan": { 2019: 80, 2020: 76, 2021: 78, 2022: 81, 2023: 82 }
};

const colorLow = "#11c5a0";
const colorHigh = "#6aa2ff";
let currentYear = Number(yearRange.value);
let hovered = null;

async function loadCountries() {
  const res = await fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson");
  const geo = await res.json();
  const features = geo.features.filter(f => lossData[f.properties.name]);
  globeObj.enablePointerInteraction(true);
  globeObj.polygonsTransitionDuration(0);
  globeObj.polygonsData(features);
  applyStyles();
}
loadCountries();

let lastMouse = { x: 0, y: 0 };
container.addEventListener("mousemove", e => {
  const rect = container.getBoundingClientRect();
  lastMouse.x = e.clientX - rect.left;
  lastMouse.y = e.clientY - rect.top;
  if (tooltip.style.display === "block") {
    tooltip.style.left = `${lastMouse.x}px`;
    tooltip.style.top = `${lastMouse.y}px`;
  }
});

globeObj.onPolygonHover(f => {
  hovered = f;
  applyStyles();
  if (!f) { 
    tooltip.style.display = "none"; 
    if (readoutName && readoutValue) {
      readoutName.textContent = "Hover a country";
      readoutValue.textContent = "–";
    }
    return; 
  }
  tooltip.style.display = "block";
  const name = f.properties.name;
  const series = lossData[name];
  const rows = Object.keys(series).sort().map(k => `<div>${k}: ${series[k]}</div>`).join("");
  tooltip.innerHTML = `<div><strong>${name}</strong></div><div>Current year ${currentYear}: ${series[currentYear]}</div><div>${rows}</div>`;
  tooltip.style.left = `${lastMouse.x}px`;
  tooltip.style.top = `${lastMouse.y}px`;
  if (readoutName && readoutValue) {
    readoutName.textContent = name;
    readoutValue.textContent = String(series[currentYear]);
  }
});

function setYear(y) {
  yearLabel.textContent = String(y);
  currentYear = Number(y);
  if (readoutYear) readoutYear.textContent = String(y);
  applyStyles();
}
setYear(Number(yearRange.value));
yearRange.addEventListener("input", e => setYear(e.target.value));

function lerpColor(a, b, t) {
  const ca = hexToRgb(a), cb = hexToRgb(b);
  const r = Math.round(ca.r + (cb.r - ca.r) * t);
  const g = Math.round(ca.g + (cb.g - ca.g) * t);
  const b2 = Math.round(ca.b + (cb.b - ca.b) * t);
  return `rgb(${r}, ${g}, ${b2})`;
}
function hexToRgb(hex) {
  const m = hex.replace("#","").match(/.{1,2}/g).map(x => parseInt(x, 16));
  return { r: m[0], g: m[1], b: m[2] };
}

function onResize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  globeObj.width(w).height(h);
}
window.addEventListener("resize", onResize);

function applyStyles() {
  const features = globeObj.polygonsData();
  globeObj
    .polygonsData(features)
    .polygonCapColor(f => {
      const v = lossData[f.properties.name][currentYear];
      const t = Math.min(1, v / 150);
      return lerpColor(colorLow, colorHigh, t);
    })
    .polygonSideColor(f => f === hovered ? "#16203b" : "#0b0f19")
    .polygonAltitude(f => {
      const v = lossData[f.properties.name][currentYear];
      return 0.02 + Math.min(v / 600, 0.25);
    })
    .polygonStrokeColor(f => f === hovered ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.08)")
    .polygonLabel(f => `${f.properties.name} • ${currentYear} • Peak Loss: ${lossData[f.properties.name][currentYear]}`);
}
