# Format Design Truths

API design is format design. Function signatures, event payloads, file schemas, and protocol messages are formats coordinating independent producers and consumers.

## The contract is the durable asset

Implementations are expendable. Contracts are not.

Teams change. Platforms change. Dependencies change. The contract is the artifact expected to survive those changes without forcing system-wide rewrites.

When a contract is vague, downstream teams guess. Guessing becomes drift, rework, and regressions. Contract precision is not style; it is a production requirement.

## Contract complexity is paid twice

Every format is two-ended: one side produces, another side consumes. Every ambiguous clause or optional representational branch increases burden on both sides.

"Supports everything" surfaces look flexible and ship brittle. Small, explicit, implementable contracts are the only stable path to multi-team velocity.
