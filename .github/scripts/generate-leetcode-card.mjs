import fs from "node:fs";

const sourcePath = "assets/leetcode-source.svg";
const outputPath = "assets/leetcode.svg";
const source = fs.readFileSync(sourcePath, "utf8");

// lowlighter/metrics provides the source of truth; this script only redesigns its presentation.
const blocks = [...source.matchAll(/<div class="category column">([\s\S]*?)<\/div>/g)];
const stats = blocks.map(([_, block]) => {
  const type = block.match(/class="gauge (all|easy|medium|hard)"/)?.[1];
  const values = [...block.matchAll(/<text[^>]*>\/?([\d,]+)<\/text>/g)]
    .map((match) => Number(match[1].replaceAll(",", "")));
  if (!type || values.length < 2) {
    throw new Error("Could not parse a LeetCode category from the source metrics SVG.");
  }
  return { type, solved: values[0], total: values[1] };
});

const byType = Object.fromEntries(stats.map((item) => [item.type, item]));
const required = ["all", "easy", "medium", "hard"];
if (required.some((type) => !byType[type])) {
  throw new Error("LeetCode metrics are missing one or more difficulty categories.");
}

const number = (value) => value.toLocaleString("en-US");
const totalSolved = byType.all.solved;
const overallRatio = Math.max(0, Math.min(1, totalSolved / byType.all.total));
const overallCircumference = 2 * Math.PI * 67;
const overallDash = (overallRatio * overallCircumference).toFixed(1);

const difficulty = [
  { type: "easy", label: "Easy", color: "#34D399", tint: "#0C302B", letter: "E" },
  { type: "medium", label: "Medium", color: "#FBBF24", tint: "#352B13", letter: "M" },
  { type: "hard", label: "Hard", color: "#FB7185", tint: "#351B29", letter: "H" },
];

const rows = difficulty.map((item, index) => {
  const value = byType[item.type];
  const ratio = Math.max(0, Math.min(1, value.solved / value.total));
  const percent = (ratio * 100).toFixed(1);
  const barWidth = Math.round(272 * ratio);
  const y = 112 + index * 78;
  return `
    <g transform="translate(0 ${y})">
      <rect x="330" y="0" width="642" height="68" rx="15" fill="#101D30" stroke="#243650"/>
      <rect x="346" y="15" width="38" height="38" rx="12" fill="${item.tint}" stroke="${item.color}" stroke-opacity=".32"/>
      <text x="365" y="40" text-anchor="middle" class="difficulty-letter" fill="${item.color}">${item.letter}</text>
      <text x="400" y="29" class="difficulty-name">${item.label}</text>
      <text x="400" y="47" class="difficulty-sub">${number(value.total)} available</text>
      <text x="550" y="29" class="difficulty-count">${number(value.solved)}</text>
      <text x="550" y="47" class="difficulty-sub">solved</text>
      <rect x="632" y="29" width="272" height="7" rx="3.5" fill="#26364D"/>
      <rect x="632" y="29" width="${barWidth}" height="7" rx="3.5" fill="${item.color}"/>
      <text x="944" y="35" text-anchor="end" class="difficulty-percent">${percent}%</text>
    </g>`;
}).join("");

const easyShare = totalSolved ? (byType.easy.solved / totalSolved * 100).toFixed(0) : "0";
const mediumShare = totalSolved ? (byType.medium.solved / totalSolved * 100).toFixed(0) : "0";
const hardShare = totalSolved ? (byType.hard.solved / totalSolved * 100).toFixed(0) : "0";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="370" viewBox="0 0 1000 370" role="img" aria-labelledby="title desc">
  <title id="title">Tapan Ray's LeetCode dashboard</title>
  <desc id="desc">${number(totalSolved)} problems solved: ${number(byType.easy.solved)} easy, ${number(byType.medium.solved)} medium, and ${number(byType.hard.solved)} hard.</desc>
  <defs>
    <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0B1424"/>
      <stop offset=".55" stop-color="#101E32"/>
      <stop offset="1" stop-color="#0B192B"/>
    </linearGradient>
    <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#60A5FA"/>
      <stop offset="1" stop-color="#22D3EE"/>
    </linearGradient>
    <radialGradient id="glow">
      <stop offset="0" stop-color="#2563EB" stop-opacity=".24"/>
      <stop offset="1" stop-color="#2563EB" stop-opacity="0"/>
    </radialGradient>
    <style>
      text{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      .eyebrow{font-size:10px;font-weight:750;letter-spacing:2.1px;fill:#7DD3FC}
      .title{font-size:23px;font-weight:750;letter-spacing:-.5px;fill:#F8FAFC}
      .subtitle{font-size:12px;fill:#8FA3BB}
      .tiny{font-size:9px;font-weight:700;letter-spacing:1.1px;fill:#91A6C0}
      .total{font-size:38px;font-weight:800;letter-spacing:-1.5px;fill:#F8FAFC}
      .total-label{font-size:11px;font-weight:650;fill:#A9BCD2}
      .ring-track{fill:none;stroke:#24364F;stroke-width:9}
      .ring-value{fill:none;stroke:url(#blue);stroke-width:9;stroke-linecap:round;transform:rotate(-90deg);transform-origin:145px 225px}
      .difficulty-letter{font-size:15px;font-weight:800}
      .difficulty-name{font-size:13px;font-weight:700;fill:#E6EEF8}
      .difficulty-sub{font-size:10px;fill:#8297B1}
      .difficulty-count{font-size:17px;font-weight:750;fill:#F8FAFC}
      .difficulty-percent{font-size:11px;font-weight:750;fill:#D5E2F0}
      .footer{font-size:10px;fill:#8297B1}
    </style>
  </defs>

  <rect x="1" y="1" width="998" height="368" rx="23" fill="url(#panel)" stroke="#263B56"/>
  <circle cx="930" cy="20" r="190" fill="url(#glow)"/>
  <path d="M24 89H976" stroke="#22344D"/>
  <rect x="27" y="25" width="4" height="39" rx="2" fill="url(#blue)"/>
  <text x="43" y="37" class="eyebrow">LEETCODE / PERFORMANCE</text>
  <text x="43" y="65" class="title">Problem Solving</text>
  <text x="973" y="39" text-anchor="end" class="tiny">AUTO-UPDATED DAILY</text>
  <g transform="translate(938 59)">
    <circle r="3" fill="#34D399"/>
    <circle r="7" fill="none" stroke="#34D399" stroke-opacity=".35"/>
  </g>
  <text x="973" y="66" text-anchor="end" class="subtitle">tapan-ray</text>

  <rect x="28" y="104" width="280" height="244" rx="18" fill="#101E32" stroke="#2A405D"/>
  <rect x="28" y="104" width="280" height="3" rx="1.5" fill="url(#blue)"/>
  <text x="49" y="133" class="tiny">TOTAL QUESTIONS SOLVED</text>
  <circle cx="145" cy="225" r="67" class="ring-track"/>
  <circle cx="145" cy="225" r="67" class="ring-value" stroke-dasharray="${overallDash} ${overallCircumference.toFixed(1)}"/>
  <circle cx="145" cy="225" r="53" fill="#0C192A" stroke="#1D3048"/>
  <text x="145" y="222" text-anchor="middle" class="total">${number(totalSolved)}</text>
  <text x="145" y="244" text-anchor="middle" class="total-label">PROBLEMS</text>
  <text x="145" y="319" text-anchor="middle" class="subtitle">${(overallRatio * 100).toFixed(1)}% of ${number(byType.all.total)} total</text>

  <text x="330" y="96" class="tiny">DIFFICULTY BREAKDOWN</text>
  ${rows}

  <path d="M28 359H972" stroke="#22344D"/>
  <text x="30" y="365" class="footer">SOLVED MIX</text>
  <text x="108" y="365" class="footer"><tspan fill="#34D399">EASY ${easyShare}%</tspan><tspan fill="#52657D">  /  </tspan><tspan fill="#FBBF24">MEDIUM ${mediumShare}%</tspan><tspan fill="#52657D">  /  </tspan><tspan fill="#FB7185">HARD ${hardShare}%</tspan></text>
  <text x="970" y="365" text-anchor="end" class="footer">KEEP BUILDING. KEEP SOLVING.</text>
</svg>`;

fs.writeFileSync(outputPath, svg);
console.log(`Generated ${outputPath}: ${totalSolved} solved.`);
