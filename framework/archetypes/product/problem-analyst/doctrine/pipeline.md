# Pipeline

## Position

```
create-project (container) -> shaper -> problem-analyst -> shaper synthesis -> human decision gate -> technical preparation
```

Problem-analyst is a specialist lens inside the product stage, not a commitment authority.

## Inputs

- Source input files from project `sources/`
- Shaper validation prompts/questions
- Optional constraints from decision owner

## Outputs

- Analyst brief per analysis pass
- Scope decomposition candidates
- Assumption and risk register
- Open questions for shaper resolution

## Feedback Loop

If shaper detects weak evidence or unresolved ambiguity in the analyst brief, route back for another analysis pass with targeted questions.
