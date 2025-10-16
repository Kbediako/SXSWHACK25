# Database Practices

Document schemas, storage engines, and connectivity details as they emerge. Maintain change histories and reference relevant mini-specs.

## Zero-Downtime Workflow
- Stage migrations with backwards-compatible schema changes first.
- Deploy code that tolerates both old and new shapes.
- Run migrations during controlled windows with monitoring and rollback checkpoints.
- Finalize by removing deprecated paths once traffic validates the new schema.

## Testing Expectations
- Provide repeatable local setup instructions (containers, fixtures, seed data).
- Require unit and integration coverage for schema and data transformations.
- Capture verification steps in `/tasks` and pause if validations fail.
