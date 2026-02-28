# Truth Extraction Method: Shaper

**Date**: 2026-02-25
**Status**: v1
**Purpose**: Reliable method for distilling known goods from research into truth candidates.

---

## Why This Exists

If truth extraction is ad hoc, the archetype quality depends on mood and memory. This method makes extraction repeatable.

The output is not creative writing. It is not slogans. It is grounded claims that survive testing.

---

## Input Set

Truth extraction uses these sources:

- `design/why.md`
- `design/research/shape-up-shaping.md`
- `design/research/shape-up-chapters-raw.md`
- `design/research/biblical-wisdom-shaper.md`
- `design/research/historical-modern-analogs.md`

No new claims are added without evidence from one or more sources.

---

## Output Shape

Each truth candidate in `design/truths.md` must include five parts:

1. **Truth statement** -- one plain sentence.
2. **Compelling line** -- optional one-line distilled wording ("modern proverb" style).
3. **Evidence** -- direct citations (source + section/quote).
4. **Tests** -- negation test + independence test.
5. **Derivation hook** -- which ethos convictions it is likely to ground.

The compelling line is optional and secondary. If it cannot be written without becoming vague, omit it.

---

## Extraction Steps

### Step 1: Build a Claim Pool

Collect candidate claims from each source document as plain propositions.

Example form:
- "Problem framing quality determines solution quality."
- "Constraint improves design clarity."

Do not judge yet. Just collect.

### Step 2: Cluster Equivalent Claims

Group claims that express the same underlying idea in different words.

Keep one canonical label per cluster.

### Step 3: Run the Three Gates

Each cluster must pass all three gates.

1. **Convergence Gate** -- Appears in at least two independent source families:
   - Shape Up primary source
   - Biblical/wisdom source
   - Historical/modern analog source

2. **Actionability Gate** -- Can guide a concrete shaping decision.
   - If it cannot change behavior, it is commentary, not truth.

3. **Non-tautology Gate** -- Not just a restatement of role identity.
   - "Shapers shape" fails.
   - "Premature commitment increases failure risk" can pass.

### Step 4: Run the Two Tests

For each surviving claim:

- **Negation test** -- Is the negation absurd or consistently contradicted by evidence?
  - If negation stands as a credible alternative, downgrade to design preference.

- **Independence test** -- Would this still be true if the Shaper archetype did not exist?
  - If no, it is not a known good.

### Step 5: Write a Truth Card

Write each surviving claim as a truth card in `design/truths.md` using this structure:

```
### T-XX: <short name>

Truth statement: <one plain sentence>
Compelling line (optional): <one distilled sentence>

Evidence:
- <source 1>
- <source 2>
- <source 3>

Negation test: <result>
Independence test: <result>

Likely to ground:
- <tenet/principle direction>
```

### Step 6: Select Final Truth Set

Pick 3-5 truths for `truth/` articles based on:

- Highest convergence
- Highest behavioral leverage
- Lowest overlap with other selected truths

Document why selected and why excluded in `design/synthesis.md`.

---

## Quality Bar

A truth candidate is rejected if any of these occur:

- No citation
- Single-source only
- Vague enough to apply to every role
- Sounds good but cannot guide a decision
- Fails independence test

---

## Notes on Style

- Prefer plain language over rhetoric.
- Keep truth statements declarative and testable.
- Use compelling lines sparingly.
- Never optimize for "sounding wise" over being precise.
