# AI Agent Workflow

# RightToBeForgotten Development Workflow

This workflow defines how Claude Code should operate throughout the project lifecycle.

The workflow must be followed at all times.

---

# Phase 1

Documentation Review

Objective:

Validate project documentation before implementation.

Agent Tasks:

1. Read all project documentation.
2. Identify inconsistencies.
3. Identify missing requirements.
4. Identify security concerns.
5. Identify architecture concerns.
6. Identify missing tasks.

Required Documents:

- CLAUDE.md
- docs/Scope.md
- docs/Security.md
- docs/Architecture.md
- docs/Task.md
- docs/PRD.md
- docs/Workflow.md

Deliverable:

Review Report

Restrictions:

- No code generation
- No file modifications
- No commits

Exit Criteria:

User approves findings.

---

# Phase 2

Planning

Objective:

Create detailed execution plan.

Agent Tasks:

1. Break tasks into smaller tasks.
2. Identify dependencies.
3. Identify risks.
4. Estimate implementation order.

Deliverable:

Implementation Plan

Restrictions:

- No coding
- No commits

Exit Criteria:

User approval obtained.

---

# Phase 3

Implementation

Objective:

Implement approved tasks.

Process:

1. Select task.
2. Verify requirements.
3. Verify architecture.
4. Verify security requirements.
5. Implement.
6. Test.
7. Update documentation.
8. Commit.

Restrictions:

Must follow:

- CLAUDE.md
- Security.md
- Architecture.md

Exit Criteria:

Task completed.

---

# Phase 4

Security Review

Objective:

Validate security assumptions.

Required For:

- Smart Contracts
- ZKP Circuits
- Authentication
- Wallet Integrations

Review Format:

Assets:
[description]

Threats:
[description]

Attack Vectors:
[description]

Mitigations:
[description]

Restrictions:

Implementation pauses until review is complete.

---

# Phase 5

Testing

Objective:

Verify correctness.

Required Tests:

- Unit Tests
- Integration Tests
- Contract Tests
- Circuit Tests
- End-to-End Tests

Exit Criteria:

All tests pass.

---

# Phase 6

Documentation Update

Objective:

Keep documentation synchronized.

Agent Tasks:

Update affected:

- tasks.md
- architecture.md
- security.md
- README.md

Restrictions:

Documentation must be updated before task completion.

---

# Phase 7

Commit

Objective:

Create traceable history.

Rules:

- Commit after feature completion.
- Commit before major refactor.
- Commit before risky changes.
- Maximum 3 modified files without commit.

Commit Format:

feat:
fix:
refactor:
docs:
security:
test:
erase:

Example:

feat: implement consent registration

Added consent registration workflow and validation logic.

---

# Phase 8

Proposal Workflow

Objective:

Handle architecture-impacting changes.

Trigger Conditions:

- Cryptography changes
- Smart contract redesign
- Security model changes
- Architecture changes
- Blockchain strategy changes

Required Format:

## Improvement Proposal

Current State:
[description]

Suggested Change:
[description]

Reason:
[description]

Benefits:
[list]

Risks:
[list]

Affected Components:
[list]

Requires User Approval:
YES

Status:
WAITING FOR USER CONFIRMATION

Restrictions:

No implementation allowed.

Exit Criteria:

User explicitly approves.

---

# Phase 9

Project Completion

Objective:

Prepare final deliverables.

Required Deliverables:

- Smart Contracts
- ZKP Circuits
- Frontend Applications
- Documentation
- Demo Video
- Deployment Guide

Completion Checklist:

- Consent registration works
- Proof generation works
- Proof verification works
- Consent revocation works
- Revocation is irreversible
- Security review completed
- Documentation completed
- Tests completed
- User approval obtained

Project Status:

COMPLETE
