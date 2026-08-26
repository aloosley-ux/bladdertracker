# Agent Token Efficiency Playbook

**Goal:** Get maximum work per token. Your Copilot instinct was right — mega-tasks 
with checkpoints beat micro-tasks. This playbook makes it systematic.

## The Hierarchy of Savings (biggest wins first)

### 1. Mega-tasks with checkpoint commits (60-80% savings)

**The pattern:** One session, multiple tasks, commit after each.

**Why it works:** 
- Agent loads context ONCE, applies it to MANY tasks
- Each commit is a savepoint — crash recovery costs one `git log` read
- No repeated "read the file → understand the pattern → apply" cycles

**The catch:** Context windows. 100M+ tokens and the model starts forgetting the 
beginning. Solution: checkpoint commits + context resets.

**How:**
```
SESSION 1 (foundation + page splits):
  1. Install shadcn, retire bespoke themes
  2. git commit -m "P2.0: shadcn foundation"
  3. Split SettingsPage into components
  4. git commit -m "P2.1: split SettingsPage"
  5. Split DashboardPage
  6. git commit -m "P2.2: split DashboardPage"
  7. If context getting full → STOP, start fresh session referencing last commit

SESSION 2 (remaining pages):
  "Continue from abc123 — split LogPage, ProfilesPage, EntryPage"
```

### 2. Pre-computed context embedding (40-60% savings)

**The anti-pattern:** Task says "read src/pages/SettingsPage.tsx and analyze it"
→ Worker spawns, reads file (context load), reads more files (more context), 
   thinks (more context). 5M tokens before writing a line.

**The fix:** Do the reading ONCE, embed the result in the task.

```
TASK PROMPT:
"SettingsPage.tsx is 903 lines. Here's the structure:
- Lines 1-50: imports
- Lines 51-200: state/hooks
- Lines 201-500: render logic for profile section
- Lines 501-800: render logic for settings forms
- Lines 801-903: export

The component does X, Y, Z. Split it following this pattern: [pattern].

Working tree: wt/p2-settings. Commit when done."
```

You did the reading ONCE (cheap — you already know the file), the agent doesn't 
have to re-discover it.

### 3. Prompt caching (50-90% on repeated content)

**How it works:** Models cache stable prompt prefixes. If your task bodies share 
common structure (AGENTS.md references, git diffs, project structure), cache hits 
give massive discounts.

**Action:** Put stable content FIRST in task bodies, dynamic instructions LAST.
Cache the project structure, git status, conventions. Vary only the specific task.

### 4. Turn limits & exit conditions (24% savings)

**The anti-pattern:** Agent keeps iterating — "let me check one more thing..."
50 tool calls later, 2M tokens spent, task not done.

**The fix:** Explicit turn budget in task prompts.

```
"Complete this task in under 15 tool calls. 
If you haven't finished by call 12, commit what you have and note remaining work."
```

### 5. Structured outputs over prose (30% savings on output)

**The anti-pattern:** Agent writes paragraphs explaining what it did.

**The fix:** Task says "Output: commit hash + files changed + DoD status. No prose."

### 6. Tool filtering (per-decision savings)

Fewer tools in the tool list = fewer tokens per decision. Remove tools the worker 
won't need for the specific task.

### 7. Batch operations (per-call savings)

One `execute_code` that reads 5 files = 1 context load.
Five `read_file` calls = 5 context loads.

## Our Specific Optimizations

### For the kanban board
- Replan P2.0-P2.6 as 2-3 mega-tasks (not 7 micro-tasks)
- Embed pre-computed file structures in task bodies
- Add turn limits to task prompts
- Use checkpoint commits between sub-tasks
- Strip unused tools from worker sessions

### For this chat session
- Batch reads via execute_code (one call instead of many terminal calls)
- Pre-compute git diffs once, reference by hash
- Avoid re-reading files I've already read

## The Math

**Current (micro-tasks):**
- 7 tasks × ~15M tokens each = ~105M tokens for Phase 2
- Plus retries, crashes, re-reading = ~150M

**Optimized (mega-tasks + caching + batching):**
- 3 sessions × ~20M tokens each = ~60M tokens for Phase 2
- Plus retries = ~80M

**Savings: ~45-50%**

That's the difference between burning $75 promo credits in a week vs three.
