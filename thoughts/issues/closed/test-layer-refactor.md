# Test Layer Refactor

**Status**: Closed (2026-02-15)

## Original Issue (voice note transcript)

So this comes from a problem that we have where I think certain, so I'm specifically talking to the original pipeline that we have, which goes from architect to create project to, I think it's then create the spec writer to then choose a section and then the section will then be researched, designed, tested, etc. I really like labouring over the API design. I don't think that is too intensive, and if anything, it reduces, it's a scope preventer. It keeps things really focused. What I think adds to scope, and maybe this is the problem that I'm having, is that the test creator, the test writer, is maybe too, I don't wanna say too zealous because I want it to believe and care substantially about being truth-seeking, but there is no restraint. Like, it's almost like its whole life, it's like, well, it doesn't, it's not considerate of the, like it, it's lost the forest for the trees, that we are actually trying to deliver products, we're trying to deliver features, and so it needs to be both pushing for the most. important tests that prove that will make implementers prove that their code is doing what it should be doing, while also, and basically being like the scaffold on which these implementers actually write the in-between code, right? Like, I, would I be wrong in thinking that if we've laboured over the API design, and the whole point of the API designer is that it's labouring over the API, like the shell, the outer shell of a function, the ins and the outs, it's labouring over how they compose into other things, and maybe also how they are composed at a more abstracted level. It's considering obstructions, it's considering the libraries, it's considering those lower-level things as well, but they're all shapes, they're not implementations. Like, the point is that the implementation can be anything, and the implementation can be replaced. But then the tests are to prove that the implementation is not, for what, like, so then, yeah, I guess I think about, like, the ...

## Resolution

Split test-writer into two dedicated archetypes:

- **test-designer**: Reads API contracts, specs which tests prove them. Scope-bounded by API surface. The test equivalent of api-designer.
- **test-implementer**: Writes actual test code from the test spec. TDD red phase only. Never writes implementation code.

Pipeline changed from:
```
research -> api-design -> test-writer -> plan -> implement-plan(tests) -> implement-plan(code) -> validate
```
To:
```
research -> api-design -> test-designer -> plan -> test-implementer -> implement-plan -> validate
```

### What was done

- Created archetypes: `archetypes/development/test-designer/` and `archetypes/development/test-implementer/`
- Created clone agents: `test-designer-clone` (per-module delegation) and `test-implementer-clone` (parallel test phases)
- Archived `test-writer` skill and `test-writer-clone` agent
- Updated `architect/SKILL.md` and `architect-opencode/SKILL.md` with new pipeline
- Updated `create-plan/SKILL.md` and `implement-plan/SKILL.md` for new roles
- Added `references/` support to assembly script
- test-designer includes `references/template.md` for contract-first structured output

### References

- Spec: `thoughts/specs/2026-02-15-test-layer-refactor.md`
- Draft updates: `thoughts/skills/drafts/architect-pipeline-updates.md`
