---
inclusion: always
---

# Memory & Context Tracking

Every project maintains a `MEMORY.md` at its root. This is the persistent context file that bridges sessions — it tells future-me (and the user) where things stand.

## Structure

```markdown
# Project Memory

## Overview
One-paragraph description of what this project is and does.

## Current State
What's working, what's in progress, what's blocked.

## Key Decisions
Decisions made and why, so we don't revisit them without reason.

| Date | Decision | Rationale |
|------|----------|-----------|
| ... | ... | ... |

## Architecture / Structure
Brief map of important files and their roles. Update as things change.

## Open Questions
Things we haven't resolved yet.

## Session Log
Brief log of what was done each session (date + summary).

| Date | Summary |
|------|---------|
| ... | ... |
```

## Rules

1. Read MEMORY.md at the start of every session to re-establish context.
2. Update MEMORY.md at the end of every session or after significant changes.
3. When a decision is made, add it to "Key Decisions" with the rationale.
4. Keep "Current State" accurate — it's the first thing to check.
5. The "Session Log" provides a breadcrumb trail. Keep entries to one or two sentences.
6. If the project doesn't have a MEMORY.md yet, create one immediately.
7. Never delete history from MEMORY.md — append, don't replace.
