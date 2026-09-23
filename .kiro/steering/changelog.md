---
inclusion: always
---

# Changelog Rules

Every project maintains a `CHANGELOG.md` at its root. This file is the single source of truth for what changed and when.

## Format

Follow [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
# Changelog

## [Unreleased]

### Added
- New features or files

### Changed
- Modifications to existing functionality

### Fixed
- Bug fixes

### Removed
- Deleted features or files

## [YYYY-MM-DD] - Brief title

### Added
- ...
```

## Rules

1. Every meaningful change gets a changelog entry — no exceptions.
2. Group entries under the correct category (Added, Changed, Fixed, Removed).
3. Write entries in past tense, from the user's perspective ("Added retry logic to upload script").
4. When a batch of work is done (end of session or task completion), move "Unreleased" items under a dated heading.
5. Keep entries concise — one line per change. Link to relevant files if helpful.
6. If the project doesn't have a CHANGELOG.md yet, create one with the first change.
