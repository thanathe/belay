# dev-buddy

A Claude Code skill for people who build real software but are not full-time software
developers — clinicians, founders, researchers, analysts.

It does not teach you to code. It changes how Claude behaves while coding *for* you: smaller
changes, a way back before anything risky, a confirmation before anything irreversible, and
verification that something actually works instead of a claim that it does.

## What it changes

| Without it | With it |
|---|---|
| "Done! I've fixed the issue." | Ran it, here is the output, here is what still fails. |
| A 200-line rewrite for a 5-line request | The smallest change that solves it; unrelated problems get mentioned, not fixed |
| Deploys because you said "looks good" | States what goes live, who it affects, whether it can be undone — then waits |
| Guesses at a cause and patches it | Reproduces it first, or says plainly that it cannot |
| Pastes a stack trace at you | What it means, what caused it, what to do next |
| Confident when it is unsure | Says "I think X but have not verified it" — in that sentence, not at the end |

## Install

You need two things: [Claude Code](https://claude.com/claude-code), and git.

To check whether you already have git, run `git --version` in a terminal. If it prints a
version number you are set. If it says *command not found*:

- **macOS** — run `git --version` anyway; macOS offers to install the developer tools. Say yes.
- **Windows** — install from [git-scm.com](https://git-scm.com/download/win), accepting every default.
- **Linux** — `sudo apt install git`, or `sudo dnf install git` on Fedora.

You do not need to *know* git. The skill has Claude set it up and run it for you, explaining
each step as it goes. It just has to be installed — it is what makes "undo that" possible.

Then:

```bash
git clone https://github.com/<you>/dev-buddy ~/.claude/skills/dev-buddy
```

That is the whole install. Start Claude Code (or restart it if already open) and it is
active — Claude loads the skill by itself when you are working on code.

To confirm it is there: ask Claude *"what skills do you have?"* and look for `dev-buddy`.
To invoke it deliberately at any point, type `/dev-buddy`.

To use it in one project only rather than everywhere, clone into that project instead:

```bash
git clone https://github.com/<you>/dev-buddy .claude/skills/dev-buddy
```

To remove it: `rm -rf ~/.claude/skills/dev-buddy`

## What is inside

```
SKILL.md                   the five rules — always loaded
references/debugging.md    loaded when something is broken
references/reviewing.md    loaded when reviewing a plan or a change
references/recovery.md     loaded when a change made things worse
references/git.md          loaded when there is no repo yet, or git is in the way
```

The reference files load only when relevant, so the always-on part stays small.

## What it does not do

It is a set of instructions Claude reads, not a lock on the door. Claude follows it well but
it is not enforcement — if you need a hard block (for example, refusing `rm -rf` or a force
push outright), that is a [hook](https://docs.claude.com/en/docs/claude-code/hooks) in your
`settings.json`, and it works at a different level than this.

It also has no opinion about your specific stack, host, or deploy process. Those belong in
your project's `CLAUDE.md`. This skill is about how to work, not where.

## Credit

The debugging discipline follows the standard reproduce → isolate → falsify → cross-reference
loop. The code-quality rules are adapted from [Andrej Karpathy's notes on where LLMs go wrong
when writing code](https://x.com/karpathy/status/2015883857489522876).

MIT licensed. Fork it and make it yours — it is prose, and editing it is the point.
