# Pipeline

## Position

```
shaper -> tech-lead -> execution-lead -> decision owner
```

Execution-lead owns work after technical-preparation handoff and before decision-owner closure.

## Inputs

- intake package from `tech-lead`
- plan path
- test specification path(s)
- unresolved decisions and accepted risks
- execution worktree path

## Outputs

- execution evidence bundle (tests, implementation, validation)
- stage outcome status (`complete` | `blocked` | `escalated`)
- explicit unresolved issues and escalation routes

## Boundary Rules

- Product framing stays with `shaper`.
- Technical package synthesis stays with `tech-lead`.
- Execution delivery and validation closure stays with `execution-lead`.

If execution discovers preparation defects, route to `tech-lead`. Do not silently repair upstream boundaries inside execution.
