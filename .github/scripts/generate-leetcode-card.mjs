import fs from "node:fs";

const sourcePath = "assets/leetcode-source.svg";
const outputPath = "assets/leetcode.svg";
const source = fs.readFileSync(sourcePath, "utf8");

const blocks = [...source.matchAll(/<div class="category column">([\s\S]*?)<\/div>/g)];
const stats = blocks.map(([_, block]) => {
  const type = block.match(/class="gauge (all|easy|medium|hard)"/)?.[1];
  const values = [...block.matchAll(/<text[^>]*>\/?([\d,]+)<\/text>/g)].map((m) => Number(m[1].replaceAll(",", "")));
  if (!type || values.length < 2) throw new Error("Could not parse LeetCode category from metrics SVG.");
  return { type, solved: values[0], total: values[1] };
});

const order = ["all", "easy", "medium", "hard"];
const byType = Object.fromEntries(stats.map((item) => [item.type, item]));
if (order.some((type) => !byType[type])) throw new Error("LeetCode metrics are missing one or more categories.");

const totalSolved = byType.all.solved;
const colors = { all: "#38BDF8", easy: "#34D399", medium: "#FBBF24", hard: "#FB7185" };
const labels = { all: "TOTAL SOLVED", easy: "EASY", medium: "MEDIUM", hard: "HARD" };
const cards = order.map((type, index) => {
  const item = byType[type];
  const x = 34 + index * 238;
  const ratio = Math.max(0, Math.min(1, item.solved / item.total));
  const barWidth = Math.round(184 * ratio);
  const color = colors[type];
  return `
    <g transform="translate(${x} 150)">
      <rect width="214" height="142" rx="18" fill="#111C2D" stroke="#26364D"/>
      <rect x="18" y="18" width="7" height="24" rx="3.5" fill="${color}"/>
      <text x="38" y="35" class="label">${labels[type]}</text>
      <text x="18" y="83" class="value">${item.solved.toLocaleString("en-US")}</text>
      <text x="18" y="108" class="muted">of ${item.total.toLocaleString("en-US")} problems</text>
      <rect x="18" y="121" width="184" height="6" rx="3" fill="#26364D"/>
      <rect x="18" y="121" width="${barWidth}" height="6" rx="3" fill="${color}"/>
      <text x="198" y="35" text-anchor="end" class="percent">${(ratio * 100).toFixed(1)}%</text>
    </g>`;
}).join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="326" viewBox="0 0 1000 326" role="img" aria-labelledby="title desc">
  <title id="title">LeetCode problem-solving dashboard</title>
  <desc id="desc">${totalSolved} problems solved across easy, medium, and hard difficulty levels.</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0B1422"/><stop offset="1" stop-color="#101E32"/></linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2563EB"/><stop offset="1" stop-color="#22D3EE"/></linearGradient>
    <style>
      text{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      .eyebrow{font-size:12px;font-weight:700;letter-spacing:2px;fill:#7DD3FC}
      .heading{font-size:25px;font-weight:700;fill:#F8FAFC}
      .sub{font-size:13px;fill:#94A3B8}
      .label{font-size:11px;font-weight:700;letter-spacing:1.3px;fill:#94A3B8}
      .value{font-size:34px;font-weight:750;fill:#F8FAFC}
      .muted{font-size:12px;fill:#94A3B8}
      .percent{font-size:11px;font-weight:700;fill:#CBD5E1}
    </style>
  </defs>
  <rect x="1" y="1" width="998" height="324" rx="24" fill="url(#bg)" stroke="#26364D"/>
  <circle cx="940" cy="45" r="72" fill="#1D4ED8" opacity=".10"/>
  <circle cx="940" cy="45" r="48" fill="#22D3EE" opacity=".06"/>
  <text x="34" y="42" class="eyebrow">PROBLEM-SOLVING PROFILE</text>
  <text x="34" y="78" class="heading">LeetCode Statistics</text>
  <text x="34" y="103" class="sub">Consistent practice. Measurable progress.</text>
  <g transform="translate(790 27)">
    <rect width="176" height="62" rx="14" fill="#132A45" stroke="#1E4971"/>
    <text x="16" y="24" class="label">TOTAL SOLVED</text>
    <text x="16" y="49" font-size="23" font-weight="750" fill="#7DD3FC">${totalSolved.toLocaleString("en-US")}</text>
    <circle cx="151" cy="31" r="7" fill="url(#accent)"/>
  </g>
  ${cards}
  <rect x="34" y="307" width="932" height="3" rx="1.5" fill="url(#accent)" opacity=".8"/>
</svg>`;

fs.writeFileSync(outputPath, svg);
console.log(`Generated ${outputPath} from ${sourcePath}: ${totalSolved} solved (custom profile dashboard).`);
