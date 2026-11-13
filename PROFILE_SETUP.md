# Profile README Automation

## Active workflows

| Workflow | Files generated | Schedule |
|---|---|---|
| Update Profile Stats | github-stats.svg, top-langs.svg, streak-stats.svg, activity-graph.svg | Daily |
| Generate LeetCode Stats | leetcode.svg | Daily |
| Generate Contribution Snake | github-snake.svg, github-snake-dark.svg | Daily |

Generated files are stored in assets/ and displayed directly in the profile README. No analytics section is hidden in a dropdown.

## GitHub analytics cards

The profile uses generated GitHub stats, language, streak, and activity graph SVGs. These are refreshed by the Update Profile Stats workflow.

The workflow keeps the last known-good SVG when an external card service returns an invalid response, rather than overwriting it with an error page.

## LeetCode

- Public profile: https://leetcode.com/u/tapan-ray/
- The compact card displays solved problem totals by difficulty.
- Output: assets/leetcode.svg
- No separate LeetCode API token is required.
- Workflow: Generate LeetCode Stats.

## Contribution Snake

- Output: assets/github-snake.svg and assets/github-snake-dark.svg.
- Uses the repository's built-in GITHUB_TOKEN.
- Workflow: Generate Contribution Snake.
- The README uses the dark/light SVG variant based on the visitor's theme.

## Removed integrations

The GitHub Metrics workflow was removed because its token configuration was failing. The broken metrics placeholder and invalid trophies SVG were also removed from the profile assets.

WakaTime is not configured because no WakaTime account is in use. GitHub activity charts are not a substitute for IDE coding-time measurements.

## Run manually

Open the repository's Actions tab and run:
1. Update Profile Stats
2. Generate LeetCode Stats
3. Generate Contribution Snake

## Privacy

Do not publish internal company ticket content, customer data, credentials, private URLs, or proprietary architecture without authorization.
