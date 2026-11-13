import fs from "node:fs";

const owner = "tapan0810";
const token = process.env.GITHUB_TOKEN;

if (!token) {
  throw new Error("GITHUB_TOKEN is required.");
}

async function githubJson(path) {
  const response = await fetch("https://api.github.com" + path, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: "Bearer " + token,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "tapan-profile-analytics"
    }
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error("GitHub API " + response.status + " for " + path + ": " + details.slice(0, 500));
  }

  return response.json();
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function number(value) {
  return Number(value || 0).toLocaleString("en-US");
}

const profile = await githubJson("/users/" + owner);
const allRepositories = [];

for (let page = 1; page <= 10; page += 1) {
  const batch = await githubJson(
    "/users/" + owner + "/repos?type=owner&per_page=100&sort=updated&page=" + page
  );
  allRepositories.push(...batch);
  if (batch.length < 100) break;
}

const repositories = allRepositories.filter(repo => !repo.fork);
const totalStars = repositories.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
const totalForks = repositories.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);

const languageCounts = new Map();
for (const repo of repositories) {
  if (repo.language) {
    languageCounts.set(repo.language, (languageCounts.get(repo.language) || 0) + 1);
  }
}

const languages = [...languageCounts.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 6);

const updated = new Date().toISOString().slice(0, 10);
const metrics = [
  { label: "PUBLIC REPOSITORIES", value: repositories.length, color: "#60A5FA" },
  { label: "TOTAL STARS", value: totalStars, color: "#FBBF24" },
  { label: "TOTAL FORKS", value: totalForks, color: "#34D399" },
  { label: "FOLLOWERS", value: profile.followers, color: "#C4B5FD" }
];

const svg = [];
svg.push('<?xml version="1.0" encoding="UTF-8"?>');
svg.push('<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="390" viewBox="0 0 1000 390" role="img" aria-labelledby="title desc">');
svg.push('<title id="title">Tapan Ray GitHub public repository analytics</title>');
svg.push('<desc id="desc">Public non-fork repository count, total stars, total forks, followers, and primary programming languages by repository count. Updated ' + updated + ' UTC.</desc>');
svg.push('<defs>');
svg.push('<linearGradient id="background" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0B1F36"/><stop offset="100%" stop-color="#172D4D"/></linearGradient>');
svg.push('<linearGradient id="bar" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#2563EB"/><stop offset="100%" stop-color="#60A5FA"/></linearGradient>');
svg.push('</defs>');
svg.push('<rect width="1000" height="390" rx="18" fill="url(#background)"/>');
svg.push('<rect x="1" y="1" width="998" height="388" rx="17" fill="none" stroke="#29496C"/>');
svg.push('<text x="36" y="42" fill="#F8FAFC" font-family="Segoe UI,Arial,sans-serif" font-size="22" font-weight="700">GITHUB PUBLIC REPOSITORY SNAPSHOT</text>');
svg.push('<text x="964" y="41" fill="#9FB6D2" font-family="Segoe UI,Arial,sans-serif" font-size="12" text-anchor="end">UPDATED ' + updated + ' UTC</text>');

const cardWidth = 220;
const cardGap = 20;
for (let i = 0; i < metrics.length; i += 1) {
  const item = metrics[i];
  const x = 36 + i * (cardWidth + cardGap);
  svg.push('<rect x="' + x + '" y="62" width="' + cardWidth + '" height="88" rx="12" fill="#102A49" stroke="#29496C"/>');
  svg.push('<rect x="' + x + '" y="62" width="4" height="88" rx="2" fill="' + item.color + '"/>');
  svg.push('<text x="' + (x + 18) + '" y="91" fill="#AFC3DB" font-family="Segoe UI,Arial,sans-serif" font-size="11" font-weight="600" letter-spacing="0.8">' + escapeXml(item.label) + '</text>');
  svg.push('<text x="' + (x + 18) + '" y="127" fill="#FFFFFF" font-family="Segoe UI,Arial,sans-serif" font-size="30" font-weight="700">' + number(item.value) + '</text>');
}

svg.push('<text x="36" y="190" fill="#F8FAFC" font-family="Segoe UI,Arial,sans-serif" font-size="16" font-weight="700">LANGUAGES ACROSS PUBLIC REPOSITORIES</text>');
svg.push('<text x="964" y="190" fill="#8FA9C5" font-family="Segoe UI,Arial,sans-serif" font-size="11" text-anchor="end">BY REPOSITORY COUNT</text>');

const palette = ["#60A5FA", "#34D399", "#FBBF24", "#C4B5FD", "#F472B6", "#2DD4BF"];
const maxCount = Math.max(1, ...languages.map(([, count]) => count));
if (languages.length === 0) {
  svg.push('<text x="38" y="238" fill="#CBD5E1" font-family="Segoe UI,Arial,sans-serif" font-size="14">No primary-language metadata found in public repositories.</text>');
} else {
  languages.forEach(([language, count], index) => {
    const y = 211 + index * 27;
    const barWidth = Math.max(8, Math.round((count / maxCount) * 610));
    svg.push('<text x="40" y="' + (y + 15) + '" fill="#DCE8F6" font-family="Segoe UI,Arial,sans-serif" font-size="13">' + escapeXml(language) + '</text>');
    svg.push('<rect x="220" y="' + y + '" width="620" height="16" rx="8" fill="#263D59"/>');
    svg.push('<rect x="220" y="' + y + '" width="' + barWidth + '" height="16" rx="8" fill="url(#bar)"/>');
    svg.push('<text x="860" y="' + (y + 14) + '" fill="#DCE8F6" font-family="Segoe UI,Arial,sans-serif" font-size="12">' + count + ' repos</text>');
  });
}

svg.push('<line x1="36" y1="375" x2="964" y2="375" stroke="#29496C"/>');
svg.push('<text x="36" y="366" fill="#91A9C4" font-family="Segoe UI,Arial,sans-serif" font-size="10">Source: GitHub public REST API · Original public repositories only · Languages counted by repository metadata</text>');
svg.push('</svg>');

fs.mkdirSync("assets", { recursive: true });
fs.writeFileSync("assets/profile-analytics.svg", svg.join("\n"), "utf8");
console.log("Generated assets/profile-analytics.svg");
console.log(JSON.stringify({
  publicRepositories: repositories.length,
  stars: totalStars,
  forks: totalForks,
  followers: profile.followers,
  languages: languages.map(([language, count]) => ({ language, repositories: count })),
  updated
}, null, 2));
