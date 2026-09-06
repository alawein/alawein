# Pull request

## Summary

- What is changing?
- Why is it needed?

## Checklist

- [ ] Branch follows naming rules (`feat/*`, `fix/*`, `docs/*`, `chore/*`, `test/*`)
- [ ] Scope is intentional and focused
- [ ] Required checks pass for the current head; missing and pending results are listed
- [ ] Tests added/updated (when applicable)
- [ ] Docs or governance guides updated when behavior or workflow changed
- [ ] No secrets, tokens, or .env files included

## Testing

- [ ] Not run (explain why)
- [ ] Local checks executed

## Risk

- [ ] Unassessed (assess before acceptance)
- [ ] Low
- [ ] Medium (note what could break)
- [ ] High (requires extra validation)

## Prompt Kit Impact
<!-- Complete only if this PR touches prompt-kits/ or docs/style/VOICE.md -->
- [ ] Not applicable
- [ ] Version bumped in frontmatter (`version:` field)
- [ ] Entry added to `prompt-kits/CHANGELOG.md`
- [ ] `prompt-kits/registry.yaml` `rollout-status` updated
- [ ] Downstream repos identified: <!-- list them -->
- [ ] Canary tested: alawein → [ ] meshal-web → [ ]

## Architecture Impact
<!-- Complete only if this PR changes catalog/, .github/workflows/, or core scripts -->
- [ ] Not applicable
- [ ] `docs/architecture.md` diagram updated (or auto-gen will handle it)
- [ ] Diagram renders correctly in GitHub preview

## Notes

- If this PR changes workflow or governance, link the relevant guide under
  [`docs/governance/`](../docs/governance/).
- Anything reviewers should know (workarounds, follow-ups, known gaps)

## Change evidence

<!-- Link an existing task or batch ledger; do not invent historical attribution. -->

| Field | Recorded value |
| --- | --- |
| Work item / batch | |
| Work kind | bug / feature / docs / maintenance / research / security / question |
| Accountable maintainer | Meshal Alawein, unless the repo records another owner |
| Actual commit author | Name and email from Git; executor is recorded separately |
| Executor | Meshal / Claude Code / Cursor / ChatGPT, with session or run link |
| Independent reviewer | Different tool or person; revision, result and evidence, or not performed |
| Checks | Command or check name, revision, result, timestamp and evidence link |
| Other audits / exceptions | Separate failures, missing results and acceptance decision |
| Final approval | Meshal: revision, scope, timestamp and evidence; pending until recorded |

Follow [work-record-taxonomy.md](../docs/governance/work-record-taxonomy.md)
and [operating-model.md](../docs/governance/operating-model.md).
