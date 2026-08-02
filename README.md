<div align="center">

<img src="assets/banner.png" alt="A belayer on the ground holds the rope for a climber high on a sunset rock face" width="100%">

# 🧗 belay

**You climb. Claude holds the rope.**

A [Claude Code](https://claude.com/claude-code) skill for people who build real software
but aren't software developers — dentists, lawyers, founders, researchers, analysts.
The safety layer for vibe coding.

*In climbing, the belayer is the person holding your rope.
They don't climb for you. They make sure a slip is never a fall.*

`git clone` · one folder · no config · works immediately

</div>

---

## Why

You can build real things with Claude Code now without being a developer. That part works.

What doesn't work is what happens around the code: the confident **"Done!"** on something
that was never run. The 200-line rewrite you can't review answering a 5-line request. The
deploy that can't be rolled back because nothing was committed. The stack trace dumped in
your lap. You are an expert — just in a different field. You'll catch a story that stops
making sense; you won't catch an off-by-one in a diff. **belay** makes Claude act
accordingly.

It doesn't teach you to code, and it doesn't slow Claude down with hand-holding.
It changes how Claude behaves when the person across the table can't check its work.

## The five rules

Once installed, Claude carries these through every coding session — you never invoke anything.

|   | Rule | Meaning |
|---|------|---------|
| 🪢 | **Snapshot before you change** | Before touching anything that works, create the way back — and say what it is |
| ✋ | **Confirm before anything irreversible** | Deploys, deletes, live-database writes: what happens, who it touches, how to undo — *then* wait. And nothing ships uncommitted |
| 🔬 | **Smallest change that solves it** | A diff you can read is a safety property, not a style preference |
| 👀 | **Verify — don't claim** | "Done" requires an observation behind it: the page loaded, the test passed, the output says so |
| 🗣️ | **Translate errors — never dump them** | What it means, what caused it, what to do next. Raw trace below, for the record |

And one meta-rule that outranks them: **when Claude isn't sure, it says so in that
sentence** — because in this room, it's the only reviewer.

## Before / after

| Without belay | With belay |
|---|---|
| "Done! I've fixed the issue." | Ran it — here's the output, here's what still fails |
| Rewrites half the file | Changes 15 lines, *mentions* the other problems it saw |
| Deploys because you said "looks good" | "This goes live for real patients and can't be undone. Proceed?" |
| Patches a bug it never reproduced | Reproduces first — or says plainly that it can't |
| Pastes a stack trace | Three lines: meaning → cause → next step |
| Confidently wrong | "I think X, but I haven't verified it" |

## Install

Two prerequisites: **Claude Code** and **git**. Check git with `git --version` — if that
prints a version, skip ahead. If not:

- **macOS** — running `git --version` offers to install the developer tools; say yes
- **Windows** — [git-scm.com](https://git-scm.com/download/win), accept every default
- **Linux** — `sudo apt install git` (or `dnf` on Fedora)

You don't need to *know* git — Claude runs it for you and explains as it goes.
It just has to exist, because it's what makes "undo that" possible.

Then:

```bash
git clone https://github.com/thanathe/belay ~/.claude/skills/belay
```

That's the whole install. Restart Claude Code and it's on — Claude picks it up by itself
on any coding task. To check: ask Claude *"what skills do you have?"* To call it
explicitly: `/belay`. To uninstall: delete the folder.

<sub>Want it in one project only? Clone into `<project>/.claude/skills/belay` instead.</sub>

## What's inside

```
SKILL.md                    the five rules — always on          🧗 on belay
references/debugging.md     something is broken                 🩺 reproduce → isolate → falsify
references/reviewing.md     "look this over first"              🔍 should it exist? does it do what it claims?
references/recovery.md      a change made things worse          🪂 stop, roll back, then think
references/git.md           no repo yet / git in the way        🪢 rope up, secrets stay out
```

The reference files load only when their moment comes, so the always-on part stays light.

## What it is not

**Not a lock.** It's instructions Claude follows, not enforcement. For hard blocks
(refusing `rm -rf` outright), use [hooks](https://docs.claude.com/en/docs/claude-code/hooks) —
different layer, composes fine with this one.

**Not project config.** It has no opinion on your stack or your deploy process — those
belong in your project's `CLAUDE.md`. belay is about *how* to work, not *where*.

## Credit

Debugging discipline: the classic reproduce → isolate → falsify → cross-reference loop.
Code-quality rules adapted from [Karpathy's notes on where LLMs go wrong writing
code](https://x.com/karpathy/status/2015883857489522876).

MIT. Fork it and make it yours — it's prose; editing it is the point.

---

<div align="center">

**"On belay?"** — *"Belay on."* — **"Climbing."**

</div>
