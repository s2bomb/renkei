# Satellite Capabilities

## Capability Map

- `research-codebase` -- project-local and repository-internal context
- `repository-researcher` -- repository + official documentation research
- `web-search-researcher` -- external domain research

## Trigger Rules

- Use `research-codebase` when validation depends on current project artifacts, prior decisions, or local implementation behavior.
- Use `repository-researcher` when validation depends on upstream repository semantics or official docs.
- Use `web-search-researcher` when validation depends on domain facts not established in local artifacts.

## Return Contract

Every delegated satellite return includes:
1. Evidence relevant to validation questions
2. Contradictions or uncertainty
3. Source citations
4. Confidence per major claim
5. Unresolved questions requiring shaper direction
