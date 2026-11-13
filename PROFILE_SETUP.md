# GitHub Profile Automation Setup

This repository uses GitHub Actions to keep selected profile visuals current.

## Workflows

| Workflow | Purpose | Schedule |
|---|---|---|
| update-stats.yml | Refresh existing GitHub stats SVGs | Daily |
| metrics.yml | Generate the Metrics dashboard in assets/metrics.svg | Daily |
| snake.yml | Generate light/dark contribution snake SVGs | Daily |

## 1. Configure the Metrics token

The Metrics action documentation recommends a personal access token for data that the repository-scoped GITHUB_TOKEN cannot read.

1. Create a fine-grained or classic personal access token in GitHub Developer Settings.
2. Grant only the minimum read access needed for the metrics plugins you enable. For public profile metrics, begin with a token that can read public profile/repository data; add scopes only if a plugin reports that it needs them.
3. In this repository, open Settings → Secrets and variables → Actions → New repository secret.
4. Add the secret with the exact name METRICS_TOKEN.
5. Open Actions → Generate GitHub Metrics → Run workflow.

Do not put a token directly in README.md or workflow files.

## 2. Contribution Snake

The snake workflow uses Platane/snk/svg-only@v3 and the repository GITHUB_TOKEN. The workflow needs contents: write permission. Generated files are committed to assets/.

## 3. LeetCode live card

The README currently shows the verified profile achievement as text (LeetCode Knight, 500+ problems solved). A live LeetCode card is not configured because the exact public LeetCode username/slug has not yet been supplied. Once known, configure the Metrics LeetCode plugin using plugin_leetcode_user.

## 4. Coding-time statistics

The Metrics habits plugin shows GitHub activity patterns; it is not an IDE time tracker. A WakaTime dashboard requires a WakaTime account and API key. Add that only if you want to publish editor-usage statistics.

## 5. Verify

After adding METRICS_TOKEN:

- Run Generate GitHub Metrics manually and confirm assets/metrics.svg is committed.
- Run Generate Contribution Snake manually and confirm both snake SVGs are committed.
- Open the profile README and check that the images load in both GitHub light and dark themes.

## Accuracy and privacy

- Keep employer-specific implementation details limited to information approved for public disclosure.
- Do not publish internal ticket contents, customer data, credentials, private URLs, or proprietary architecture.
- GitHub activity and language charts are estimates based on GitHub-visible repository data.
