# Deploy CafeCodex

Run tests, commit, and push to both main and gh-pages branches.

## Steps
1. Run `npm test` from the project root (`/Users/pduggal/Desktop/CafeCodex-main`)
2. If any tests fail, stop and report the failures. Do NOT push broken code.
3. Run `git status` and `git diff --stat` to see what changed
4. If there are no changes, report "Nothing to deploy" and stop
5. Show the user a summary of changed files
6. Ask the user for a commit message (or draft one based on the changes)
7. Stage the relevant files (never stage `.DS_Store`, `.env`, or credentials)
8. Commit with the message
9. Pull latest from origin main first: `git pull origin main --rebase`
10. If there are merge conflicts, stop and report them — do NOT force push
11. Push to both branches:
    - `git push origin main`
    - `git push origin main:gh-pages`
12. Report success with the commit hash

## Important
- ALWAYS push to BOTH main and gh-pages
- NEVER force push
- NEVER push if tests fail
- Add `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>` to commit messages
