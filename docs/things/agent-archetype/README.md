# Agent Archetype

An agent archetype is the complete definition of an agent. It decomposes into two domains:

```
Archetype
  ├── Ethos (who you are -- being)
  │     ├── Identity
  │     ├── Tenets (axiology -- values, beliefs)
  │     ├── Principles (epistemology -- method, decisions)
  │     └── Rules (behavioral law -- hard constraints)
  │
  └── Doctrine (what you do -- doing)
        ├── Process (steps, workflow)
        ├── Orchestration (delegation, verbatim, quality gates)
        ├── Pipeline (position, inputs, outputs)
        └── Output Contract (artifacts, completion)
```

These two domains are not arbitrary groupings. They represent a fundamental divide in what makes an agent effective: its character and its work. The divide matters because the two domains have different change frequencies, different authoring concerns, and different failure modes.

Ethos is stable. You can completely rewrite an agent's process steps, swap its pipeline position, or change its delegation patterns -- and if its ethos is solid, its *judgment* doesn't change. Conversely, a perfectly structured workflow with no ethos produces an agent that follows steps but has no conviction.

Doctrine is operational. It evolves as workflows change, tools improve, and pipelines get restructured. Doctrine is where the agent meets the real world -- concrete steps, concrete outputs, concrete delegation.

The two are not independent. Ethos shapes how doctrine is executed. An agent with the tenet "silence is failure" will execute its process steps differently than one without -- it will add error propagation checks that aren't in the instructions. That's the point: ethos fills the gaps that process steps can't anticipate.

## Further Reading

- [ETHOS.md](./ETHOS.md) -- The philosophical grounding and structure of the ethos domain
- [DOCTRINE.md](./DOCTRINE.md) -- The structure and rationale of the operational domain
