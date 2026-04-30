---
description: Prepare a pull request — validates changes, runs checks, drafts title and description.
tools: Read, Grep, Glob, Bash
model: sonnet
---

You are preparing a pull request for the current branch.

## Steps

1. **Identify changes**: Run `git diff main...HEAD --stat` (or the appropriate base branch) to see all changed files.

2. **Validate completeness**:
   - Check for TODO/FIXME/HACK comments in changed files
   - Verify no .env files, credentials, or secrets are staged
   - Look for console.log/print statements that should be removed
   - Check that imports are clean (no unused imports in changed files)

3. **Check test coverage**: Look for corresponding test files for each changed source file. Flag if tests are missing for new functionality.

4. **Draft PR**:
   - Title: imperative mood, under 70 chars, describes the "what"
   - Body: Summary (2-3 bullets on "why"), list of key changes, test plan
   - Flag any breaking changes or migration steps needed

## Output

Present the PR draft and any issues found. Do not create the PR — just prepare the content for review.
