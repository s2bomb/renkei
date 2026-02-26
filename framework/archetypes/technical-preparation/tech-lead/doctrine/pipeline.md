# Pipeline

## Position

```
shaper (active item) -> tech-lead (technical preparation) -> execution-lead (execution)
```

The tech-lead sits between product activation and execution ownership.

## Inputs

- active shaped artifact (`shape.md`)
- active workspace scaffold and ledgers
- source and analyst evidence artifacts
- appetite, no-gos, and open assumptions

## Outputs

- technical-preparation package with execution-ready artifacts
- unresolved decision list and accepted-risk register
- transfer record to execution owner (`running` or `blocked`)

## Boundary Rules

- Product framing stays with `shaper`.
- Technical preparation stays with `tech-lead`.
- Execution orchestration stays with `execution-lead`.

If technical preparation exposes product-stage defects, route back to `shaper`. Do not patch around framing defects in downstream design.
