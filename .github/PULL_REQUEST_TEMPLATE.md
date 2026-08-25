## Summary

<!-- What does this PR do? Keep it to one or two sentences. -->

## Why

<!-- Link the issue, backlog item, or explain the maintenance rationale. -->

Closes #

## What changed

<!-- List the key changes. Be specific about files and behaviour. -->

-

## Validation performed

<!-- Describe how you verified the change works. Include manual testing steps if UI-related. -->

- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `npx tsc --project tsconfig.api.json --noEmit` passes
- [ ] `npm test` passes (or failure is documented, e.g. live integration test unreachable)
- [ ] Manually tested in dev server (`npm run dev`)
- [ ] Tested in all three themes (light, dark, high-contrast) if UI change

## Documentation

- [ ] README updated if product behaviour, setup, routes, or environment variables changed
- [ ] docs/MODULES.md updated if tracker labels, fields, or defaults changed
- [ ] docs/API.md updated if API contracts or auth behaviour changed
- [ ] docs/architecture.md reviewed for affected flows or infrastructure changes
- [ ] No documentation changes needed

## Risks and follow-up

<!-- Note anything reviewers should watch for, known limitations, or follow-up work. -->

## Checklist

- [ ] Changes are focused — one concern per PR
- [ ] Tests added or updated for code changes
- [ ] No hardcoded secrets or environment-specific values introduced
- [ ] No sensitive child data in tests, fixtures, or screenshots
