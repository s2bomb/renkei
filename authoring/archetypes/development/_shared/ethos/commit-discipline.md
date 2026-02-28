# Commit Discipline

A commit is a communication artifact -- the unit of reviewable, revertable change. Like code, commits are read far more than they are written. Every developer who debugs, bisects, reviews, or traces history pays the cost of opaque commits.

## Atomic scope

Each commit addresses a single logical change. Stage only the files that belong to this change. Do not bundle unrelated modifications. One commit = one decision that can be understood, evaluated, and reverted independently.

## Descriptive messages

The commit message explains WHY the change was made, not just WHAT changed. The diff shows the what. The message provides the reasoning a reviewer needs without reading the code.

Write in imperative mood: "Add feature", "Fix validation", "Refactor handler" -- not "Added", "Fixing", "Refactored".
