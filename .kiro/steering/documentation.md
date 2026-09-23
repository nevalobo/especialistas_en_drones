---
inclusion: always
---

# Documentation Standards

Documentation is a first-class deliverable, not an afterthought. Every piece of automation should be understandable by someone (including future-you) without reading the source code.

## Rules

1. **Every script gets a README or header comment** explaining:
   - What it does
   - How to run it (inputs, environment, dependencies)
   - What it outputs
   - Any caveats or assumptions

2. **Inline comments** for non-obvious logic. Don't comment what the code does — comment *why*.

3. **Project-level README.md** — every project must have one. Include:
   - Purpose of the project
   - Quick start / how to use
   - File structure overview
   - Dependencies and setup

4. **Document as you build** — don't leave documentation for later. If you write a script, write its docs in the same session.

5. **Runbooks for operational tasks** — if something needs to be run periodically or has a specific procedure, create a runbook in a `docs/` folder.

6. **Use Markdown** for all documentation. Keep it readable in plain text.
