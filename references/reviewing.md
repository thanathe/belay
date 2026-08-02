# Reviewing a plan or a change

Read it cold, as an outsider. Forget who wrote it — including you, ten minutes ago. Forget
why they were sure it was right.

Two questions, in this order:

1. **Should this exist at all?**
2. **Does it actually do what it claims?**

Most reviews skip straight to #2 and grade the spelling of a thing that should not have been
built. #1 is where the value is.

---

## 1. Intent — and the simpler alternative

State the goal in one sentence, in your own words. If you cannot, it is underspecified —
say so and stop; there is nothing to review yet.

Then spend real effort on this: **is there a smaller or simpler way to get the same result?**

- **Do nothing.** Is the problem real and currently hurting someone, or anticipated?
- **Use what already exists** in the codebase instead of adding new surface.
- **Solve 90% of it with 10% of the change.** Which 10% is that?
- **Solve it at a different layer** — a setting instead of code, a query instead of a job,
  fixing the data instead of coding around bad data.

If a better option exists, **lead with it.** This is the single most valuable thing a review
produces, and it is worthless if it arrives after twelve style comments.

This pass is mandatory even on small changes. Skip it only if explicitly told not to question
scope.

---

## 2. Trace — follow the real code, not the diff

The changed lines are where you start, not where you stop.

- For each behaviour the change claims, follow it end to end: what calls it → which branch is
  actually taken → what state gets changed → what is returned or written.
- **Read the unchanged code on both sides of the change.** Bugs live at the seam between new
  code and the old code that was not expecting it.
- For a plan rather than a diff: walk the proposed flow against the system as it exists
  today. What does it assume that is not true?
- Note anything that surprises you — a branch you did not expect, state you did not know
  existed. Surprise is the reliable signal that your model of the code is wrong.

---

## 3. Verify each claim

For every claim, be explicit about the difference between *stated* and *checked*:

> It claims X. Path: A → B → C. At C, `flag` is still false, so X does not happen when the
> user is logged out.

Then push on it:

- **What inputs break it?** Empty, missing, zero, very large, non-English text, two people
  doing it at once, a retry after a half-finished attempt.
- **What does it change silently?** Speed, what other code depends on, the shape of stored
  data, what shows up in logs, behaviour for existing users.
- **Do the tests actually cover the path you traced,** or do they pass while going around it?
  A test that mocks the broken part passes forever.

---

## 4. Report

Order by severity. For each finding:

- **What** — one specific sentence. Cite `file:line`.
- **Why it matters** — the *consequence in the real world*, not the principle. Not "this
  violates separation of concerns." Rather: "if two staff save the same patient at once, the
  second save wipes the first."
- **Evidence** — the exact path or input that exposes it.
- **Fix** — concrete and minimal.

The "why it matters" line is what makes this review usable by someone who cannot read the
diff. Write it in terms of what a person would experience. A finding they cannot evaluate is
a finding they have to take on faith.

Close with a one-line verdict — **ship / fix first / rework / drop it** — and the single
biggest reason.

---

## Rules

- **No rubber stamps.** "Looks good" is not a review. If you truly found nothing, say what
  you traced and what you checked, so they can judge whether you covered what they cared about.
- **Cite or it did not happen.** No vague "this could be slow" without the path that makes it slow.
- **Keep claim and verification separate.** "The change says X" and "I traced X and confirmed
  it" are different sentences. Never merge them.
- **Lead with the structural problem.** If step 1 or 2 found something real, style nits get
  deferred or dropped entirely — do not bury the important finding in a list.
- **No flattery, no hedging.** "Great work, but..." adds nothing. State the finding.
