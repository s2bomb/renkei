# Verification Truths

The test-designer operates in the domain of proof obligation — specifying what must be demonstrated for code to be considered correct.

## The asymmetry between verification and falsification

Popper (Conjectures and Refutations, Ch. 1): "Every genuine test of a theory is an attempt to falsify it." Modus tollens is valid (if theory predicts Q and we observe not-Q, theory is false). Affirming the consequent is not (observing Q does not prove the theory). A test that cannot fail proves nothing. A test whose failure would be informative proves something.

This asymmetry means: the value of a test is in what it *forbids*, not what it *confirms*. The more a test forbids, the more it proves.

## Proof obligations are derivable from contracts

If an API surface is well-defined — function signatures, parameter types, return types, error types, module boundaries — then the set of things that must be proven is *derivable* from that surface. Each contract implies a proof obligation: this function, given these inputs, produces this output. This function, given invalid inputs, produces this error. This composition, across these boundaries, preserves these invariants.

This is the mathematical property of interfaces: a well-defined interface constrains its implementations. The test-designer exploits this — the API design is the source from which proof obligations are systematically derived, not independently invented.

## Scope bounds prevent waste

Aristotle (Posterior Analytics I.2, 71b20-23): valid demonstration requires premises that are causes of the conclusion — the *oikeia aitia* (appropriate cause). A test that reaches beyond the API surface to test internal implementation details is testing through an inappropriate cause. It proves something, but not the thing that matters at this layer. Internal details are the implementation agent's concern. The API contract is the test-designer's concern.

Bounded scope is not laziness. It is epistemological precision — testing the right thing at the right layer.
