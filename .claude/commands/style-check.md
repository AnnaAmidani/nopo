# /style-check

Review current styling and propose focused improvements — one change at a time.

## Steps

1. Read `src/styles/global.css` and note all CSS custom properties (colors, fonts, spacing).
2. Read the component files that were recently edited (check `git diff --name-only`).
3. Identify the single most impactful styling issue or improvement opportunity.
4. Present **3 options** for that specific thing (e.g. three heading color choices as hex values).
5. **Do not apply anything yet** — wait for the user to pick an option.
6. Once the user picks, apply only that one change, then stop and ask if they want to continue.
