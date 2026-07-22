---
title: "Session Contracts — dame-luthas-app CIP-family pointer"
doc_type: runbook
repo: dame-luthas-app
session_id: sess_cc_20260610_corpus
created: 2026-07-22
status: active
version: "1.0.0"
tags: [runbook, session-contract, cip-wide, governance, pointer]
---

# Session Contracts — dame-luthas-app

First `SESSION-CONTRACTS.md` for this repo. dame-luthas-app is the third member of the CIP family
(career-corpus + project-polaris + dame-luthas-app, per
`project-polaris/docs/runbooks/SESSION-CONTRACTS.md` §10's `task_cip_` scoping rule). This repo has
not yet had a session author its own repo-specific rules — this doc exists to hold the CIP-wide
pointer and any dame-luthas-app-specific lessons as they accumulate, rather than leaving the repo
without a runbook at all.

## CIP-wide rules (canonical: project-polaris)

Read [`project-polaris/docs/runbooks/SESSION-CONTRACTS.md`](../../../project-polaris/docs/runbooks/SESSION-CONTRACTS.md)
for the full CIP-wide operating contract. Immediately relevant to any session touching this repo:

- **§23 — The full Prime Gate pipeline is mandatory before any fix, no shortcuts.** Haiku
  cross-repo/git research → Opus plans/architects/reviews → the full gate stack
  (`forensic-auditing` → `forecast-scrutiny` → `plan-audit-fix` → `doc-standards` →
  `maximus-prime-doc-validation` → MALFIG → `doc-forensic-inventory`) → only then execution.
  Ad-hoc fixes must be flagged, run through `/audit-fix-ship`, and capped at 2 per cycle before a
  mandatory Opus escalation. Drift (anything not in the approved plan) gets a Problem Record
  (`problem-record-creation` skill) attached to a real GitHub issue.
- **§24 — A non-Opus agent may never merge, reconcile, or overrule two independent Opus verdicts.**
  Problem Records are repo-scoped — if dame-luthas-app and a sibling CIP repo each get their own
  Opus review, that is two separate Problem Records, not one unified record.
- **§25 — CORTEX/Prime task tracking uses a GitHub Issue only, never a PR or a committed doc.**
  Problem Records (`PRM-NNNN`) are the one exception — they keep the `problem-record-creation`
  skill's own doc-mirror-in-repo convention (`--doc=` flag, committed alongside the CORTEX row).

## dame-luthas-app-specific rules

None yet — this section exists for future accumulation, matching career-corpus's companion-doc
pattern (repo-specific rules stay here, not duplicated into the CIP-wide doc).

## Related

- `project-polaris/docs/runbooks/SESSION-CONTRACTS.md` — CIP-wide canonical runbook.
- `career-corpus/docs/runbooks/SESSION-CONTRACTS.md` — sibling repo-specific companion (same
  pattern this doc follows).
- `career-corpus/docs/problems/PRM-0033-prime-gate-checkpoint-breach.md`,
  `career-corpus/docs/problems/PRM-0034-cc-completion-path-github-sha-null.md`,
  `project-polaris/docs/problems/PRM-0039-polaris-completion-path-github-sha-null.md` — the
  incidents that produced CIP-wide §23-25.

## Change Log

| Date | Change |
|------|--------|
| 2026-07-22 | Initial runbook — pointer to project-polaris's CIP-wide §23-25, created at the user's explicit request following the PRM-0034/PRM-0039 correction and the CORTEX/Prime issue-only-tracking correction. |
