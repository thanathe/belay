# Getting back to safety

A change made things worse. The instinct is to fix forward fast. That instinct is what turns
one broken thing into four.

**Stop making changes.** Get back to a known-good state first. Then debug with the pressure off.

---

## First: stop and take stock

Answer these before touching anything. Say the answers out loud to the user.

1. **What is broken, exactly?** One sentence. "The site is down" and "the save button shows an
   error for one form" need completely different responses.
2. **When did it last work?** Before which specific change?
3. **What changed since then?** `git log --oneline -10`, plus anything done outside git —
   uploaded files, settings changed in an admin panel, a database edit.
4. **Is data at risk, or only code?** This is the fork in the road:
   - **Code** is recoverable. Almost always. Relax slightly.
   - **Data** — deleted records, an overwritten column, a bad bulk update — may not be.
     If data is involved, **stop and confirm before every single further action.** Get a
     database backup made *now*, before anything else, even if it seems slow.

---

## Then: undo, at the right level

Pick the smallest rollback that reaches the problem. Say which one you are about to run, and
what it will destroy, before running it.

### Changes not yet committed

```bash
git status                    # see exactly what changed — always look first
git diff                      # see the actual edits
git checkout -- <file>        # undo one file back to the last commit
git restore <file>            # same thing, newer git
```

⚠️ `git checkout .` and `git reset --hard` throw away **all** uncommitted work permanently —
including anything good that was mixed in. Read `git status` first, every time.

### Changes committed but not pushed

```bash
git log --oneline -5          # find the last good commit
git revert <bad-commit>       # make a NEW commit that undoes it — safest
git reset --hard <good-commit># rewind to that point, discarding everything after
```

Prefer `revert`. It leaves the history intact and is itself undoable. Use `reset --hard` only
when nobody else could possibly have that commit.

### Changes already pushed to a shared repo

Use `git revert`. Never `push --force` to a shared branch — it deletes other people's work
without warning them, and there is often no way to get it back.

### Changes already live / deployed

Redeploy the last known-good version. Do not try to hotfix a live system under pressure —
put the old version back first, *then* find the bug on a copy.

If the project has a documented deploy or rollback procedure, follow it exactly. Do not
improvise a faster path around it. The procedure exists because someone already made the
mistake you are about to make.

---

## Then: confirm you are actually back

Do not assume the rollback worked.

- Check the thing that was broken. Is it working now?
- Check that the rollback did not undo something unrelated that was wanted.
- Say plainly what state you are in now: *"Back to the version from 14:20. The save bug is
  gone. The label fix from this morning is also gone — it was in the same commit and needs
  redoing."*

---

## Stop and ask for a human when

- Data may have been lost, changed, or deleted, and there is no confirmed backup.
- The rollback did not fix it — meaning the cause is not what anyone thought, and more
  guessing makes it worse.
- Credentials, keys, or passwords may have leaked. That is not a rollback problem; the
  secrets need rotating and someone has to decide who is told.
- You have tried three things and each one changed the symptom without explaining it. Three
  failed attempts is the signal to widen the circle, not to try a fourth.

Saying "I do not know what happened and I am not going to guess with your live system" is a
correct and professional answer. It is much better than a confident fourth attempt.

---

## Afterwards

Write down, in three lines: what broke, what actually caused it, what would have caught it
earlier. That last line is the only one that prevents the next occurrence — a missing check,
an untested path, a step that should have been confirmed before running.
