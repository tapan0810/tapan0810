# GitHub Profile Automation Setup

## Workflow schedule (UTC)

| Workflow | Output | Schedule |
|---|---|---|
| Update Profile Stats | Existing GitHub stats SVGs | 00:00 |
| Generate GitHub Metrics | `assets/metrics.svg` | 00:20 |
| Generate LeetCode Stats | `assets/leetcode.svg` | 00:40 |
| Generate Contribution Snake | Light/dark snake SVGs | 01:00 |

All profile-asset workflows use the same concurrency group to avoid concurrent pushes to `main`.

## LeetCode

- Public LeetCode username: `tapan-ray`
- Card shows solved problems by difficulty only, for a shorter display.
- Output: `assets/leetcode.svg`
- No LeetCode API token is required.
- Workflow: **Generate LeetCode Stats**.

## GitHub Metrics

- Output: `assets/metrics.svg`
- Compact responsive columns layout; includes profile activity, yearly contribution calendar, top languages, and GitHub activity habits.
- Requires a repository secret named exactly `METRICS_TOKEN`.

To create/update it:
1. Open this repository → Settings → Secrets and variables → Actions.
2. Add or update the repository secret named `METRICS_TOKEN`.
3. Use a valid GitHub personal access token. Start with the least privilege needed; Metrics documents that no scopes are required for its basic profile rendering, while selected plugins can require extra scopes.
4. Never put the token in the README or workflow YAML.
5. Run **Generate GitHub Metrics** from Actions.

Metrics documentation: https://github.com/lowlighter/metrics/blob/master/.github/readme/partials/documentation/setup/action.md

## Contribution Snake

- Generates `assets/github-snake.svg` and `assets/github-snake-dark.svg`.
- Uses the repository's built-in `GITHUB_TOKEN`.
- Commits generated SVGs with a rebase-and-retry push to avoid collisions with other asset workflows.
- Workflow: **Generate Contribution Snake**.

## WakaTime

WakaTime is intentionally not configured because no WakaTime account is currently in use. GitHub contribution habits show GitHub activity, not editor time.

## Verification checklist

- [ ] Run **Generate GitHub Metrics** and confirm `assets/metrics.svg` is replaced with a generated dashboard.
- [ ] Run **Generate LeetCode Stats** and confirm `assets/leetcode.svg` is a compact solved-only card.
- [ ] Run **Generate Contribution Snake** and confirm both snake SVGs exist in `assets/`.
- [ ] Open the profile README in light and dark mode.

## Privacy

Do not publish internal company ticket content, customer data, credentials, private URLs, or proprietary architecture without authorization.
