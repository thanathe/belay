# Debugging

Four steps, in order. Do not skip forward. This is differential diagnosis: you do not treat
before you have a finding you can point at, and you do not trust a diagnosis you never tried
to rule out.

The most common way debugging goes wrong is not a hard bug. It is proposing a fix for a
problem that was never actually reproduced, "confirming" it because the symptom happened not
to show up that run, and shipping a change that fixed nothing.

---

## 1. Reproduce it reliably

Before anything else, get the failure to happen **on demand**.

- **It reproduces reliably** → capture it as something runnable: a failing test, a `curl`
  command, an exact click sequence with exact inputs. Write it down. That artifact is now the
  definition of "fixed."
- **It reproduces sometimes** → it is not debuggable yet. Raise the rate first: loop the
  trigger, run it in parallel, add load, add a delay in the suspected window. A 50% failure
  is workable. A 1% failure is not — you will misread noise as signal.
- **It does not reproduce at all** → **stop and say so.** Do not move to step 2. Ask for what
  would make it reproducible: access to the environment where it happens, the exact time it
  last occurred, a screenshot, the log file, permission to add logging and wait for it to
  recur.

Aim for a check that runs in seconds and gives a clean pass/fail. Everything downstream
depends on being able to ask "is it still broken?" cheaply.

**Say out loud which of the three cases you are in.** Skipping this step is the single
biggest source of wasted debugging.

---

## 2. Find where it actually breaks

You now need the *fail path*: where reality diverges from what the code is supposed to do.
Escalate through these — only move down when the one above cannot reach it.

1. **Read the trace and follow the code.** Start where the error surfaced and walk backward
   through what called what. Often the answer is right there and no experiment is needed.
2. **List the knobs, then turn one at a time.** Enumerate everything that could plausibly
   change the outcome: config values, environment variables, feature flags, the specific
   input, which user or account, timing, the browser, the data in the database. Change
   **one** and re-run the repro. Two at once tells you nothing.
3. **Add logging inside the code.** When outside knobs cannot move it, print the actual
   values at the suspect point — not what you assume they are. Tag every probe with a unique
   marker like `[DBG-a4f2]` so removing them later is one search.

State what you expected the value to be and what it actually was. The gap between those two
is the bug, and naming it is usually the whole job.

**Remove every probe you added before you finish.** Debug logging left in production is its
own incident.

---

## 3. Try to disprove your own theory

When a likely cause appears, attack it *before* you act on it.

- **Does it explain the symptom completely?** Walk it end to end. If it explains most of the
  behaviour but not one detail, it is wrong or incomplete — that leftover detail is the
  actual bug more often than not.
- **Write down 3 possible causes, not 1.** The first plausible idea anchors everything after
  it. Force alternatives onto the list even if they feel unlikely.
- **Ask what result would prove you wrong — and run that test first.** If the theory survives
  a genuine attempt to kill it, it is probably real. If it dies, you just saved hours.

Do not commit to a cause you only tried to confirm.

---

## 4. Every attempt is evidence — keep the list

Keep a running list of everything tried this session. One line each:

```
- Changed X to Y  → still fails  → rules out: config
- Ran with empty input  → passes  → the bad input matters
- Reverted commit abc123  → still fails  → not that commit
```

- When a new theory appears, check it against the **whole list**, not just the last thing you
  tried. If any earlier result contradicts it, the theory is wrong. This catches more bad
  theories than any other habit.
- If two theories are still standing, design the one experiment whose outcome separates them
  and run that — instead of poking at variations.
- Update the list after every run. It is your memory, and it is what you show the user when
  they ask what you have ruled out.

---

## Before calling it fixed

1. The original repro from step 1 now passes.
2. **Undo the fix and confirm it breaks again.** If it still passes without your change, you
   did not fix it — something else did, and you do not know what.
3. Re-apply, and check the fix did not break anything adjacent.
4. Say in one sentence what the actual cause was. If you cannot, you have a workaround, not a
   fix — label it as a workaround.
