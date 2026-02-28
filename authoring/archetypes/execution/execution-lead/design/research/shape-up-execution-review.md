# Shape Up Review: Execution Stage Lens

**Date**: 2026-02-26
**Source**: Ryan Singer, *Shape Up* (full corpus)

---

## Purpose

Extract what Shape Up implies for the role that owns execution after a shaped and technically prepared package is accepted.

## Core Signals from Shape Up

1. **Shaping and building are separate tracks.**
   - Shaping reduces uncertainty before commitment.
   - Building executes within the bet constraints.

2. **Execution autonomy is required.**
   - "Assign projects, not tasks" means teams discover real tasks while building.

3. **Unknowns vs knowns must stay visible.**
   - Uphill/downhill language exists because uncertainty state changes what is safe to commit.

4. **Fixed time requires active scope control during build.**
   - Scope hammering is not only a shaping concern; it is a live execution discipline.

5. **Completion must be evidence-backed.**
   - Claims of progress are weak without verification against actual requirements.

## Role Implications

1. Execution needs one accountable stage owner.
2. The execution owner preserves prepared boundaries and routes upstream defects instead of patching around them.
3. Test-first delivery belongs in execution: test specification is prep output; executable tests are execution artifacts.
4. Validation is mandatory stage exit logic, not optional review.

## Constraint for Renkei Split

`tech-lead` owns package readiness.

`execution-lead` owns build/verify loops:

- delegate test implementation
- delegate implementation
- delegate validation
- synthesize stage outcome
