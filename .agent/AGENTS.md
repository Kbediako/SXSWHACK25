# Agent Onboarding

## Stack Overview
- Languages: TBD — identify per service before making changes.
- Package managers: TBD; inspect workspace manifests before installing dependencies.
- Build/run targets: document dev, prod, and CI commands in task lists or specs as they emerge.
- Tests: note unit, integration, and e2e commands in `/tasks` artifacts once established.
- Deployment: describe release steps in `/tasks` or SOPs prior to shipping.

## Read This First
1. `.agent/system/architecture.md`
2. `.agent/system/database.md`
3. `.agent/system/api-surface.md`
4. `/tasks/index.json`

## Safeguards
- Maintain database backups and confirm rollback procedures before migrations.
- Use feature flags, dry runs, or shadow writes when expanding or contracting functionality.
- Capture approvals for risky changes and ensure specs cover security, data, and performance impacts.
