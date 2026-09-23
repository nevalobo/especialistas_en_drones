---
inclusion: always
---

# Project Defaults

## General Conventions

- Primary languages: HTML5, CSS3, Vanilla JavaScript (ES6+). No build step — static JAMstack site deployed to Netlify.
- Backend is serverless via Google Apps Script (lead form + file attachments to Google Drive).
- Prefer simple, readable code over clever abstractions. Keep the site dependency-light and fast.
- Content language is Spanish (Costa Rica); UI copy stays in Spanish. Code, comments, commits stay in English.
- Use consistent naming: `camelCase` for JS variables/functions, `kebab-case` for files and CSS classes.
- Every non-obvious block gets a short comment explaining WHY, not what.

## How Kiro Should Behave

- Be concise in explanations but thorough in implementation.
- When making changes, always update the changelog and memory file.
- If a decision has trade-offs, document them in MEMORY.md before proceeding.
- When starting a session, read MEMORY.md first to understand current project state.
- Default to action — implement rather than just suggest, unless the scope is unclear.
