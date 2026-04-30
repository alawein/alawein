## Summary

- What is changing?
- Why is it needed?

## Checklist

- [ ] Branch follows naming rules (`feat/*`, `fix/*`, `docs/*`, `chore/*`, `test/*`)
- [ ] Scope is intentional and focused
- [ ] CI is green or flake is documented
- [ ] Tests added/updated (when applicable)
- [ ] Docs or governance guides updated when behavior or workflow changed
- [ ] No secrets, tokens, or .env files included

## Testing

- [ ] Not run (explain why)
- [ ] Local checks executed

## Risk

- [ ] Low (default)
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
