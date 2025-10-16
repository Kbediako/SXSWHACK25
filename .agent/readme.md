# Agent Workflow Overview

This repository uses the ai-dev-tasks loop: start with a Product Requirements Document (PRD), generate the task list, then process a single subtask at a time. After each subtask, capture outcomes, update status in `/tasks`, and pause for review.

The `/tasks` directory is the **source of truth** for PRDs, task lists, specs, and research. Files under `/docs` are human-friendly snapshots that must reference their canonical entries in `/tasks`.

Always review `.agent/AGENTS.md` and the materials under `.agent/system/*` before acting. Update the relevant task list entry every time work progresses, honor the pause-for-review checkpoints, and follow the mini-spec policy when applicable.
