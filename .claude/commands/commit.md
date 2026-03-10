# /commit

Stage and commit all changes with a conventional commit message.

## Steps

1. Run `git status` to see what's changed.
2. Run `git diff` to review unstaged changes.
3. Stage relevant files by name (avoid `git add .` to prevent accidentally committing `.env` or large binaries).
4. Write a conventional commit message:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `style:` for CSS/visual changes with no logic change
   - `chore:` for config, deps, tooling
   - `docs:` for documentation
   Keep the subject line under 72 characters.
5. Commit using a HEREDOC to preserve formatting.
6. Run `git log --oneline -3` to confirm the commit landed.
