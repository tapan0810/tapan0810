# GitHub Profile Automation Setup

## Workflow schedule (UTC)

| Workflow | Output | Schedule |
|---|---|---|
| Update Profile Stats | Existing GitHub stats SVGs | 00:00 |
| Generate GitHub Metrics | `assets/metrics.svg` | 00:20 |
| Generate LeetCode Stats | `assets/leetcode.svg` | 00:40 |
| Generate Contribution Snake | Light/dark snake SVGs | 01:00 |

Each workflow has its own concurrency group. The scheduled jobs are staggered to reduce concurrent updates to the default branch. Snake and stats uploads use a pull/rebase retry before pushing.

## LeetCode

- Public LeetCode username: `tapan-ray`.
- The profile card shows solved counts only (All / Easy / Medium / Hard) to keep it compact.
- Displayed at 340px wide in the profile.
- Output: `assets/leetcode.svg`.
- No separate LeetCode API token is required.
- Workflow: **Generate LeetCode Stats**.

## GitHub Metrics

- Output: `assets/metrics.svg`.
- Compact dashboard with profile activity, yearly contribution calendar, languages, and GitHub habits.
- Requires a repository secret named exactly `METRICS_TOKEN`.
- **Important:** the Metrics action's current GraphQL integration rejects fine-grained personal access tokens. Use a **classic personal access token** instead. Its basic setup requires no scopes; add only extra scopes if an optional feature explicitly requires them.

To replace the secret:
1. Open [GitHub Personal Access Tokens](https://github.com/settings/tokens).
2. Create a **classic** token (not fine-grained).
3. Return to this repository → Settings → Secrets and variables → Actions.
4. Edit `METRICS_TOKEN` and replace its value with the classic token.
5. Run **Generate GitHub Metrics** from Actions.

Never put the token in the README, workflow YAML, or a public file.

Metrics setup docs: https://github.com/lowlighter/metrics/blob/master/.github/readme/partials/documentation/setup/action.md

## Contribution Snake

- Always shown directly in README (not inside a collapsible section).
- Rendered at 72% width.
- Generates `assets/github-snake.svg` and `assets/github-snake-dark.svg`.
- Uses the repository's built-in `GITHUB_TOKEN`.
- Workflow: **Generate Contribution Snake**.

## WakaTime

WakaTime is intentionally not configured because no WakaTime account is currently in use. GitHub habits report GitHub contribution patterns, not editor time.

## Verify

- [ ] Run **Generate GitHub Metrics** and confirm `assets/metrics.svg` is replaced with the generated dashboard after the classic token is saved.
- [ ] Run **Generate LeetCode Stats** and confirm `assets/leetcode.svg` contains only solved counts.
- [ ] Run **Generate Contribution Snake** and confirm both snake SVGs exist under `assets/`.
- [ ] Confirm Contribution Activity is visible without expanding any dropdown.
- [ ] Review the profile in both GitHub light and dark themes.

## Privacy

Do not publish internal company ticket content, customer data, credentials, private URLs, or proprietary architecture without authorization.
