# Git — setting it up, and explaining it

Git is the undo button for a whole project. Without it, "put it back how it was" has no
answer. Rules 1 and 2 in `SKILL.md` both depend on it existing.

**Do not teach a git course.** Run the commands for them and explain each one in a line as it
goes by. They will pick it up from watching, the same way anyone did.

---

## The model to hand them, once

Three sentences. Say it the first time, then stop repeating it:

> Git takes a snapshot of every file whenever you tell it to. Every snapshot can be returned
> to exactly, forever. Nothing is lost unless it was never snapshotted.

The corollary is the only rule they need to internalise: **work that was never committed is
the only work that can be destroyed.** That is why the commit comes before the risky thing,
not after.

---

## Is it set up?

```bash
git --version     # is git installed at all?
git status        # is this folder a repo?
```

- `command not found: git` → not installed, see below.
- `not a git repository` → installed, but this folder is not tracked yet. Set it up.
- A list of files → already a repo. Nothing to do.

### Installing git

- **macOS** — `git --version` triggers a system prompt to install the developer tools. Accept
  it. Or `brew install git` if they have Homebrew.
- **Windows** — download from [git-scm.com](https://git-scm.com/download/win). Accept every
  default; the defaults are correct.
- **Linux** — `sudo apt install git` (Debian/Ubuntu) or `sudo dnf install git` (Fedora).

Then, once per machine:

```bash
git config --global user.name "Their Name"
git config --global user.email "their@email.com"
```

This only labels the snapshots with who made them. Ask for the values, do not invent them.

---

## Setting up a repo in an existing project

⚠️ **Order matters. Do the .gitignore before the first commit.** Once a secret is committed
it stays in the history even after you delete the file — cleaning it out afterwards is a
genuinely unpleasant job.

**Step 1 — look for things that must never be committed.**

```bash
ls -a
grep -rilE 'password|secret|api[_-]?key|token' --include='*' -l . 2>/dev/null | head -30
```

Look for: `.env`, anything named `config`/`secret`/`credentials`, `*.pem`, `*.key`,
database connection files, service-account JSON, `node_modules/`, `vendor/`, `*.sql` dumps,
patient or customer data files.

**Ask them about each candidate before deciding.** You cannot always tell a real credential
from a placeholder by reading it, and guessing wrong in either direction is bad.

**Step 2 — write `.gitignore` first.**

```
.env
.env.*
*.key
*.pem
config.local.*
node_modules/
vendor/
*.log
.DS_Store
```

Add whatever step 1 turned up. Then explain in one line: *"Anything listed here git ignores
completely — it stays on your computer and never leaves it."*

**Step 3 — initialise and check before committing.**

```bash
git init
git add -A
git status          # READ THIS. Every file listed is about to be permanently recorded.
```

Read that list yourself. If a secret is in it, stop, add it to `.gitignore`, run
`git rm --cached <file>`, and check again.

**Step 4 — commit.**

```bash
git commit -m "Initial commit"
```

---

## The daily loop

```bash
git status                          # what changed?
git diff                            # what exactly changed, line by line?
git add -A                          # select everything for the next snapshot
git commit -m "Fix the save button" # take the snapshot
```

Commit messages: plain sentence, present tense, says what changed and why if it is not
obvious. `"Fix the save button clearing the phone field"` — not `"update"`, not `"fixes"`.
They will read these later at the worst possible moment; write for that reader.

**Commit at every point worth returning to** — before starting risky work, after each piece
that works, and always before shipping. Many small commits are strictly better than one large
one, because a small commit can be reverted alone.

---

## GitHub and other remotes

Local git is already a full safety net. GitHub adds two things: a copy that survives the
laptop dying, and other people being able to see it.

That second one deserves a direct question before any first push:

> **"Should this be public or private?"**

Ask it explicitly. Do not assume. If the project touches customer records, patient data,
internal business logic, or anything under a professional confidentiality obligation, the
answer is private — and it is worth saying so out loud rather than quietly selecting it.

```bash
git remote -v                        # is a remote already set?
git push -u origin main              # first push
git push                             # after that
```

Before the very first push to any remote, run the secret check from step 1 again. A public
repo is scraped for credentials within minutes, and a leaked key must be rotated even if the
repo is deleted a minute later — deletion does not un-copy it.

---

## Things to warn about, in the moment

- `git push --force` on a shared branch overwrites other people's work with no warning and
  often no recovery. Do not run it. Use `git revert` instead.
- `git reset --hard` permanently discards uncommitted changes. Run `git status` and read it
  first, every single time.
- `git clean -fd` deletes untracked files off the disk — including any file they created but
  never committed. Add `-n` first to preview what it would remove.

For undoing things that already went wrong, see `references/recovery.md`.
