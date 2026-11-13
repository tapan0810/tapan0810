# GitHub Profile Automation Setup

This repository uses separate GitHub Actions workflows for the LeetCode card, GitHub Metrics dashboard, and contribution snake.

## Workflows

| Workflow | Output | Credential | Schedule |
|---|---|---|---|
| Generate LeetCode Stats | assets/leetcode.svg | No LeetCode token; plugin documents token as NOT_NEEDED | Daily |
| Generate GitHub Metrics | assets/metrics.svg | GitHub personal access token in METRICS_TOKEN | Daily |
| Generate Contribution Snake | assets/github-snake.svg and assets/github-snake-dark.svg | Repository GITHUB_TOKEN | Daily |
| Update Profile Stats | Existing assets/*.svg | Existing workflow configuration | Daily |

## 1. LeetCode live card

The dedicated LeetCode workflow is configured with:

- Public LeetCode login: `tapan-ray`
- Sections: solved problems, skills, and recent submissions
- Skills display limit: 8
- Recent submissions display limit: 5
- Output: `assets/leetcode.svg`

The Metrics LeetCode plugin documentation explicitly states that no token is required and shows `token: NOT_NEEDED` in its example workflow. See the [LeetCode plugin documentation](https://github.com/lowlighter/metrics/blob/master/source/plugins/leetcode/README.md).

Run **Generate LeetCode Stats** from the Actions tab to generate the first card. The scheduled run will refresh it daily.

## 2. GitHub Metrics token

The general GitHub Metrics dashboard uses GitHub API information that cannot all be accessed with the repository-scoped `GITHUB_TOKEN`. A personal access token is required by the Metrics project's setup documentation.

1. Open GitHub → Settings → Developer settings → Personal access tokens.
2. Create a personal access token. For public profile metrics, start with the minimum permissions required; the Metrics setup guide says no scopes are required for its basic workflow, while certain optional plugins may require additional scopes.
3. In this repository, open Settings → Secrets and variables → Actions → New repository secret.
4. Set the secret name to exactly `METRICS_TOKEN`.
5. Paste the token as the secret value and save it.
6. Open Actions → **Generate GitHub Metrics** → Run workflow.

Do not paste the token into this repository, README, workflow YAML, or a chat.

The Metrics setup documentation: https://github.com/lowlighter/metrics/blob/master/.github/readme/partials/documentation/setup/action.md

## 3. Contribution Snake

The snake workflow uses `Platane/snk/svg-only@v3` and the repository `GITHUB_TOKEN`. It requires `contents: write` permission and commits generated SVGs into `assets/`.

Run **Generate Contribution Snake** from Actions to generate the first light and dark SVGs.

## 4. Coding-time statistics

WakaTime is not enabled because no WakaTime account is currently in use. GitHub Metrics habits shows GitHub contribution patterns and commit activity; it does **not** measure time spent in VS Code, Visual Studio, or other editors. A WakaTime panel can be added later if an account is created.

## 5. Verify the profile

- Run **Generate LeetCode Stats** and confirm `assets/leetcode.svg` is updated.
- Add `METRICS_TOKEN`, run **Generate GitHub Metrics**, and confirm `assets/metrics.svg` is updated.
- Run **Generate Contribution Snake** and confirm both snake SVGs are committed.
- Open the profile README in GitHub light and dark themes.

## Accuracy and privacy

- Keep employer-specific implementation details limited to information approved for public disclosure.
- Do not publish internal ticket contents, customer data, credentials, private URLs, or proprietary architecture.
- LeetCode information shown is based on the public LeetCode profile. GitHub activity and language charts reflect GitHub-visible repository data.
